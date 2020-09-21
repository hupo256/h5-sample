import React from 'react'
import PropTypes from 'prop-types'
import Page from '@src/components/page'
import fun from '@src/common/utils'
import ua from '@src/common/utils/ua'
import questionnaireApi from '@src/common/api/questionnaireApi'
import {getPointTip, queryQuestionInfo} from '../componets/tools'
import styles from '../questionnaire'
import {
  QuestionHeader,
  QuestionAge,
  QuestionSingle,
  QuestionMultiple,
  QuestionUpload,
  QuestionInput,
  QuestionSingleInput,
  QuestionGroup,
  QuestionCity,
  QuestionRange
} from '@src/components/questionnaire'
import andall from '@src/common/utils/andall-sdk'

const { getParams, getSetssion, setSetssion } = fun
class BaseQuestion extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      questionnaireId: 1,
      qList:[],
      preQuesId:-1,
      currentQuesId:1,
      currentQuesObj:[],
    }
  }

  componentDidMount () {
    getPointTip()
    this.touchData()
  }

  touchData = () => {
    const { qnaireCode, reportId, linkManId } = getParams()
    questionnaireApi.getUserLastCommitRecord({ reportId, qnaireCode, linkManId })
      .then(res => {
        const { code, data } = res
        if (!code) {
          if (data.finishStatus === 1) {
            // 跳到原生
            andall.invoke('back')
          } else {
            this.setState({
              preQuesId:data.preQuesId,
              currentQuesId:data.locationQuesId
            })
          }
        }
      })
    questionnaireApi.getQuestionList({ qnaireCode }).then(res => {
      const { questionnaireId, qnaireQuesAnswerResps, type, questionnaireCode, questionnaireName } = res.data
      this.setState({
        questionnaireName,
        qList:qnaireQuesAnswerResps,
        questionnaireId:questionnaireId
      })
      setSetssion('toolsType', type)
      setSetssion('questionnaireCode', questionnaireCode)
      setSetssion('qnaireId', questionnaireId)
      setSetssion('writeChannel', getParams().writeChannel)
      setSetssion('rewrite', getParams().rewrite)
    })
  }

  // 年龄选择事件
  onDateOk= (dateAge, quesId, answerSelectObj) => {
    let answerId = answerSelectObj[0].answerId
    const pad = n => n < 10 ? `0${n}` : n
    const dateStr = `${dateAge.getFullYear()}-${pad(dateAge.getMonth() + 1)}-${pad(dateAge.getDate())}`
    let addParams = {
      quesId:quesId,
      userAnswerValue:answerId,
      userAnswerValueExtra:dateStr
    }
    this.onSaveQuestionAnswer(answerSelectObj, addParams)
  }
  // 单选事件
  onSingleCheck=(quesId, answerSelectObj) => {
    // 保存单选 跳转到下一题
    let answerId = answerSelectObj[0].answerId
    let addParams = {
      quesId:quesId,
      userAnswerValue:answerId
    }
    this.onSaveQuestionAnswer(answerSelectObj, addParams)
  }
  // 单选带输入事件
  onSingleInputCheck=(quesId, otherValue, answerSelectObj) => {
    // 保存单选 跳转到下一题
    let answerId = answerSelectObj[0].answerId
    let addParams = {
      quesId:quesId,
      userAnswerValue:answerId,
      userAnswerValueExtra:otherValue
    }
    this.onSaveQuestionAnswer(answerSelectObj, addParams)
  }
  // 多选事件
  onMultipleCheck=(quesId, otherValue, answerSelectObj) => {
    let answerIds = answerSelectObj.map(m => m.answerId).join(',')
    let addParams = {
      quesId:quesId,
      userAnswerValue: answerIds,
      userAnswerValueExtra : otherValue,
    }
    this.onSaveQuestionAnswer(answerSelectObj, addParams)
  }
  // 文本输入
  onInputEnter=(quesId, inputValue, answerSelectObj) => {
    // 保存单选 跳转到下一题
    let answerId = answerSelectObj[0].answerId
    let addParams = {
      quesId:quesId,
      userAnswerValue:answerId,
      userAnswerValueExtra:inputValue,
    }
    this.onSaveQuestionAnswer(answerSelectObj, addParams)
  }
  // 图片上传
  onPicUpload=(quesId, imgNameArray, inputValue, answerSelectObj) => {
    // 跳转到下一题
    let answerId = answerSelectObj[0].answerId
    let addParams = {
      quesId:quesId,
      userAnswerValue:answerId,
      userAnswerValueExtra:inputValue,
      userAnswerValuePicExtra:imgNameArray.join(','),
    }
    this.onSaveQuestionAnswer(answerSelectObj, addParams)
  }
  // 保存答案
  onSaveQuestionAnswer (answerSelectObj, addParams) {
    console.log(answerSelectObj)
    const { reportId, linkManId, writeChannel } = getParams()
    let nextQuesId = answerSelectObj[0].nextQuestId
    let postData = {
      reportId: +reportId,
      qnaireId:this.state.questionnaireId,
      // lastQuesId:nextQuesId,
      preQuesId:this.state.preQuesId,
      finishStatus:nextQuesId === -1 ? 1 : 0,
      userAnswerValue: answerSelectObj[0].answerId
    }
    // console.log(11)
    let params = {}
    if (getSetssion('toolsType') === '20') {
      Object.assign(params, { linkManId: +linkManId || '' })
    }
    if (writeChannel) {
      Object.assign(params, { writeChannel })
    }
    questionnaireApi.saveQuestionAnswer({ ...postData, ...addParams, ...params })
      .then(res => {
        if (!res.code) {
          if (res.data.pointValue) {
            setSetssion('pointValue', res.data.pointValue)
          }
          this.gotoNextQuestion(addParams.quesId, nextQuesId, res.data.urlJump)
        }
      })
  }
  // 上一题
  onPreQuestion=() => {
    const { qnaireCode, reportId, linkManId } = getParams()
    const { currentQuesId } = this.state
    let params = {}
    if (ua.isAndall()) {
      params = {
        linkManId: +linkManId || null,
        curQuestionId:currentQuesId,
        qnaireCode,
        reportId
      }
    } else {
      params = {
        linkManId: +linkManId || null,
        curQuestionId:currentQuesId,
        reportId,
        qnaireCode
      }
    }

    questionnaireApi.getPreQuestionId(params)
      .then(res => {
        const { code, data } = res
        if (!code) {
          this.setState({ currentQuesId:data })
        }
      })
  }
  gotoNextQuestion (preQuesId, nextQuesId, nextUrl) {
    const {writeChannel} = getParams()
    // 跳转到下一题
    if (nextQuesId === -1) {
      const toolsType = getSetssion('toolsType')

      if (getParams().brcaReport) {
        if (ua.isAndall()) {
          let url = `${origin}/mkt/brcaReport/brcaDetail?barCode=${getParams().barCode}&linkManId=${getParams().linkManId}&questionFinished=1&reportType=0`
          andall.invoke('refreshReportDetail', { url: url })
          setTimeout(() => {
            andall.invoke('back')
          }, 10)
        } else {
          window.location.href = `${origin }/mkt/brcaReport/brcaDetail?linkManId=${getParams().linkManId}&barCode=${getParams().barCode}&questionFinished=1&reportType=0`
        }
        return
      }
      if (getParams().hpvReport) {
        if (ua.isAndall()) {
          let url = `${origin}/mkt/hpvReport/hpvDetail?barCode=${getParams().barCode}&qnaireCode=${getParams().qnaireCode}&questionFinished=1&reportType=0`
          andall.invoke('refreshReportDetail', { url: url })
          setTimeout(() => {
            andall.invoke('back')
          }, 10)
        } else {
          window.location.href = `${origin }/mkt/hpvReport/hpvDetail?qnaireCode=${getParams().qnaireCode}&barCode=${getParams().barCode}&questionFinished=1&reportType=0`
        }
        return
      }
      
      if(writeChannel === '3' && !nextUrl) {
        window.location.href = `${origin}/mkt/report_suggest${location.search}`
        return
      }
      window.location.href = nextUrl
      // ua.isAndall() && andall.invoke('back')
    } else {
      this.setState({
        preQuesId:preQuesId,
        currentQuesId:nextQuesId,
      })
    }
  }

  // 选择民族之后的回调
  onGroupOk = (value, quesId, answerSelectObj) => {
    let addParams = {
      quesId:quesId,
      userAnswerValueExtra: value[0]
    }
    this.onSaveQuestionAnswer(answerSelectObj, addParams)
  }
  // 选择城市之后的回调
  onCityOk = (value, quesId, answerSelectObj) => {
    let addParams = {
      quesId:quesId,
      userAnswerValueExtra: value.join('-')
    }
    this.onSaveQuestionAnswer(answerSelectObj, addParams)
  }
  // 渲染header
  renderHeader=() => {
    const { qList, currentQuesId } = this.state
    let oneQa = qList.filter(f => { return f.quesId === currentQuesId })[0]
    let qHeaderProps = {
      onPreQuestion:this.onPreQuestion,
      title:oneQa ? oneQa.questionCategoryDesc : '',
      currentNum:oneQa ? oneQa.questionOrder : 0,
      totalNum:qList.length,
      preQuestionId:oneQa ? oneQa.preRelationQuestionId : -1
    }
    return <QuestionHeader {...qHeaderProps} />
  }
  // 渲染问题
  renderQa=() => {
    const { qList, currentQuesId } = this.state
    let oneQa = qList.filter(f => { return f.quesId === currentQuesId })[0]
    let elementDom = null
    if (oneQa) {
      let {quesType} = oneQa
      if(quesType.includes(',')) quesType = quesType.split(',')[0]
      switch (quesType) {
      case 'time_plugin':
        elementDom = <QuestionAge answerObj={oneQa} onDateOk={this.onDateOk} />
        break
      case 'single':
        let singleProps = {
          answerObj:oneQa,
          onSingleCheck:this.onSingleCheck
        }
        elementDom = <QuestionSingle {...singleProps} />
        break
      case 'single_input':
        let singleInputProps = {
          answerObj:oneQa,
          onSingleInputCheck:this.onSingleInputCheck
        }
        elementDom = <QuestionSingleInput {...singleInputProps} />
        break
      case 'multiple':
        let multipleProps = {
          answerObj:oneQa,
          onMultipleCheck:this.onMultipleCheck
        }
        elementDom = <QuestionMultiple {...multipleProps} />
        break
      case 'ex_word_pic':
        let picUploadProps = {
          answerObj:oneQa,
          onPicUpload:this.onPicUpload
        }
        elementDom = <QuestionUpload {...picUploadProps} />
        break
      case 'ex_word':
        let inputProps = {
          answerObj:oneQa,
          onInputEnter:this.onInputEnter
        }
        elementDom = <QuestionInput {...inputProps} />
        break
      case 'group_plugin':
        elementDom = <QuestionGroup answerObj={oneQa} onGroupOk={this.onGroupOk} />
        break
      case 'city_plugin':
        elementDom = <QuestionCity answerObj={oneQa} onCityOk={this.onCityOk} />
        break
      case 'number_section':
        elementDom = <QuestionRange answerObj={oneQa} onGroupOk={this.onGroupOk} />
        break
      }
    }
    return elementDom
  }
  render () {
    const { questionnaireName } = this.state
    return (
      <Page title={questionnaireName || ' '}>
        <div className={styles.questionsBody}>
          {this.renderHeader()}
          {this.renderQa()}
        </div>
      </Page>
    )
  }
}
BaseQuestion.propTypes = {
  history:PropTypes.object
}
export default BaseQuestion
