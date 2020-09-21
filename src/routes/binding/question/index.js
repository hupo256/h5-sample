
import React from 'react'
import propTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import { observer, inject } from 'mobx-react'
import { fun, API } from '@src/common/app'
import Page from '@src/components/page'
import styles from './question'
const { getParams, setSetssion } = fun

@inject('user')
@observer
class Question extends React.Component {
  state = {
    questionDetail: {},
    questions: [],
    isAllAnswer: false
  }
  componentDidMount() {
    this.handleQueryinfobycode()
  }
  handleQueryinfobycode = () => {
    API.queryinfobycode({ qnaireCode: 'AXRQ' }).then(res => {
      const { data } = res
      this.setState({
        questions: data.qnaireQuesAnswerResps,
        questionDetail: data
      })
    })
  }
  handleSetClassname = (type) => {
    if (type === '1') {
      return styles.input
    } else if (type === '2') {
      return styles.single
    } else if (type === '3') {
      return styles.multiple
    }
  }
  handleSetAnswerCont = (item, index) => {
    const { questionType, unit } = item || {}
    if (questionType === '1') {
      return <div className={styles.answerCont}>
        <input
          className={styles.inputItem}
          onChange={(e) => this.handleChangeInput(e, index)}
          value={item.userAnswerValue}
        />
        <span className={styles.unit}>{unit}</span>
      </div>
    } else if (questionType === '2') {
      return <div className={styles.answerCont}>
        {
          item.answerResps && item.answerResps.length
            ? item.answerResps.map((el, ind) => {
              return <label key={ind} onClick={() => this.handleChangeSelect(index, ind, 'single')} className={el.selected ? styles.selected : ''}>
                <span className={styles.inputJ} />
                <input type='radio' value='1' name='type' />
                {el.answerDesc}
              </label>
            })
            : ''
        }
      </div>
    } else if (questionType === '3') {
      return <div className={styles.answerCont}>
        {
          item.answerResps && item.answerResps.length
            ? item.answerResps.map((el, ind) => {
              return <label key={ind}
                onClick={() => this.handleChangeSelect(index, ind, 'multiple')} className={el.selected ? styles.selected : ''}>
                <span className={styles.inputJ} />
                <input type='checkbox' value={ind} name='type' />
                {el.answerDesc}
              </label>
            })
            : ''
        }
      </div>
    }
  }
  handleChangeInput = (e, index) => {
    const { questions } = this.state
    questions[index].userAnswerValue = e.target.value
    this.setState({
      questions
    }, () => {
      this.handleIsAllAnswerFun()
    })
  }
  handleChangeSelect = (index, ind, type) => {
    const { questions } = this.state
    const _questions = questions
    if (type === 'single') {
      _questions[index].answerResps.map((el, i) => {
        el.selected = false
      })
      _questions[index].answerResps[ind].selected = true
    } else {
      event.preventDefault()
      if (ind === _questions[index].answerResps.length - 1) {
        _questions[index].answerResps[ind].selected = !(_questions[index].answerResps[ind].selected || false)
        _questions[index].answerResps.map((elem, i) => {
          if (i !== ind) {
            elem.selected = false
          }
        })
      } else {
        _questions[index].answerResps[_questions[index].answerResps.length - 1].selected = false
        _questions[index].answerResps[ind].selected = !(_questions[index].answerResps[ind].selected || false)
      }
    }

    this.setState({
      questions: _questions
    }, () => {
      this.handleIsAllAnswerFun()
    })
  }
  handleIsAllAnswerFun = () => {
    const { questions } = this.state
    this.setState({
      isAllAnswer: false
    })
    let flag = false
    for (let i = 0; i < questions.length; i++) {
      if (+questions[i].questionType === 1) {
        if (!questions[i].userAnswerValue || !questions[i].userAnswerValue.length) return
      } else if (+questions[i].questionType === 2 || +questions[i].questionType === 3) {
        let flag1 = 0
        for (let j = 0; j < questions[i].answerResps.length; j++) {
          if (questions[i].answerResps[j].selected) {
            flag1++
          }
        }
        if (!flag1) return
      }
      flag = true
    }
    this.setState({
      isAllAnswer: flag
    })
  }
  handleSubmit = () => {
    const { questions, questionDetail, isAllAnswer } = this.state
    if (!isAllAnswer) return
    const { linkManId, barCode, type } = getParams()
    let microQnaireAnswerReqList = []
    for (let i = 0; i < questions.length; i++) {
      if (+questions[i].questionType === 1) {
        let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/
        if (!reg.test(questions[i].userAnswerValue)) return Toast.info('输入格式有误')
        let obj = {
          userAnswerValue: questions[i].userAnswerValue,
          questionId: questions[i].id
        }
        microQnaireAnswerReqList.push(obj)
      } else if (+questions[i].questionType === 2 || +questions[i].questionType === 3) {
        let arr = []
        questions[i].answerResps.map((el, ind) => {
          if (el.selected) {
            arr.push(el.id)
          }
        })
        let obj = {
          answerIdList: arr,
          questionId: questions[i].id
        }
        microQnaireAnswerReqList.push(obj)
      }
    }
    const params = {
      linkManId: +linkManId,
      microQnaireAnswerReqList,
      qnaireId: questionDetail.questionnaireId,
      uniqueCode: questionDetail.questionnaireCode,
      barCode
    }
    API.submitAnswer(params).then(res => {
      const { code } = res
      if (code === 0) {
        API.bindCollectorUserKit({ barcode: barCode, linkManId, type }).then(res => {
          if (res.code === 0) {
            setSetssion('bindSuccess', { barcode: barCode, linkManId })
            this.props.history.push({
              pathname: '/binding/binding-success',
              state: { ...res.data }
            })
          }
        })
      }
    })
  }
  render() {
    const { questions, isAllAnswer } = this.state
    return (
      <Page title='表型问卷'>
        <div className={styles.quesCont} >
          <div className={styles.quesHeader}>
            为了给您提供更加准确的报告，我们希望能收集到检测人的以下信息，通过样本和表型的综合分析，来给出有针对性的建议，谢谢！
          </div>
          <p className={styles.quesTime}>问卷预计耗时：2分钟</p>
          <div className={styles.questionsCont}>
            {
              questions && questions.length
                ? questions.map((item, index) => {
                  return (<div className={this.handleSetClassname(item.questionType)} key={index}>
                    <p className={styles.questionTitle}>
                      <span>{(index + 1) >= 10 ? (index + 1) : `0${index + 1}`}.</span>
                      {item.questionName}
                    </p>
                    {this.handleSetAnswerCont(item, index)}
                  </div>)
                })
                : ''
            }
            <span
              onClick={this.handleSubmit}
              className={`${styles.submitBtn} ${!isAllAnswer ? styles.noClick : ''}`}
            >提交</span>
          </div>
        </div>
      </Page>
    )
  }
}
Question.propTypes = {
  history: propTypes.object,
}
export default Question
