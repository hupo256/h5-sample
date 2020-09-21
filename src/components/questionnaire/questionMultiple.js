import React from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import { fun, ua } from '@src/common/app'
import styles from './questionnaire.scss'
const { fixScroll } = fun
const { isIos } = ua
class QuestionMultiple extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      answerSelected: [],
      answerResps: props.answerObj.answerResps
        .map(item => {
          item.selected = false
          return item
        }),
      otherValue: '',
      isShowInput: false,
      answerDesc: ''
    }
  }
  componentDidMount() {
    const { answerObj } = this.props
    this.setContent(answerObj.answerResps)
    this.onIsOrEnableInput(answerObj.answerResps)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      answerSelected: [],
      answerResps: nextProps.answerObj.answerResps
        .map(item => {
          item.selected = false
          return item
        }),
      otherValue: '',
      isShowInput: true
    })
  }

  onSelect(aId) {
    const { answerObj } = this.props
    const { answerSelected, answerResps } = this.state
    let selectedItem = answerSelected.filter(f => { return f.answerId === aId })
    if (selectedItem.length) {
      let mutexAnswerIds = selectedItem[0].mutexAnswerIds || ''
      this.setState({
        answerSelected: answerSelected.filter(f => {
          return mutexAnswerIds.indexOf(f.answerId) < 0 && f.answerId !== aId
        }),
        answerResps: answerResps
          .map(item => {
            if (mutexAnswerIds.indexOf(item.answerId) >= 0 || item.answerId === aId) {
              item.selected = false
            }
            return item
          })
      })
    } else {
      // 处理显示
      this.setState({
        answerResps: answerResps
          .map(item => {
            if (item.answerId === aId) { item.selected = true }
            return item
          })
      })

      // 追加选中项
      selectedItem = answerObj.answerResps.filter(f => { return f.answerId === aId })[0]
      answerSelected.push(selectedItem)
      let mutexAnswerIds = selectedItem.mutexAnswerIds
      if(!mutexAnswerIds) return
      this.setState({
        answerSelected: answerSelected.filter(f => {
          return mutexAnswerIds.indexOf(f.answerId) < 0
        }),
        answerResps: answerResps
          .map(item => {
            if (mutexAnswerIds.indexOf(item.answerId) >= 0) { item.selected = false }
            return item
          })
      })
    }
  }
  // 默认第一个是“没有出现过问题”，如是，禁用文本框，如否，启用文本框
  onIsOrEnableInput = (list) => {
    if (list.length) {
      if (list[0].shouldInputShow === 0) {
        this.setState({ isShowInput: false, otherValue: '' })
      } else {
        this.setState({ isShowInput: true })
      }
    }
  }
  onChange = (e) => {
    let target = e.target
    if (!target.value) {
      target.style.height = '28px'
    }
    target.style.height = target.scrollTop + target.scrollHeight + 'px'
    this.setState({
      otherValue: target.value
    })
  }
  onSure() {
    let { otherValue, answerSelected } = this.state
    const { answerObj, onMultipleCheck } = this.props
    if (otherValue) {
      const wxArr = answerObj.answerResps.filter(an => an.answerType === 'ex_word')
      if (wxArr.length > 0) answerSelected.push(wxArr[0])
    }
    // 必填校验
    if (!answerSelected.length) {
      Toast.info('请选择内容', 1)
      return false
    }
    console.log(answerSelected)
    onMultipleCheck(answerObj.quesId, otherValue, answerSelected)
  }
  // 显示问题内容
  setContent = (list) => {
    list.map((item, index) => {
      if (item.answerType === 'ex_word') {
        this.setState({
          answerDesc: item.answerDesc
        })
        return false
      }
    })
  }

  // 重排
  reflowArr = (arr) => {
    const ind = arr.findIndex(item => item.answerType === 'ex_word')
    if(ind < 0) return arr
    const exWord = arr[ind]
    arr.splice(ind, 1)
    arr.push(exWord)
    return arr
  }

  render() {
    let top = 0
    const { answerObj } = this.props
    const { answerResps, isShowInput, answerDesc } = this.state
    const newanswerResps = this.reflowArr(answerResps)
    return (
      <div className={styles.questionContent}>
        <div className={styles.qLogoDiv}>
          <img className={styles.qLogo} src={answerObj.quesPicUrl} />
        </div>
        <div className={styles.qTitle}>
          {answerObj.questionOrder}.{answerObj.quesName}
        </div>
        <div className={styles.qAnwserMultipleContent}>
          {newanswerResps.map((item, index) => {
            const { answerId, answerDesc, answerType } = item
            return answerType === 'multiple' ?
              <div
                key={index}
                className={`${styles.qAnswerItem} ${item.selected ? styles.qAnswerItemActive : ''}`}
                onClick={() => { this.onSelect(answerId) }}>
                {answerDesc}
              </div> :
              <div key={index} className={styles.qAnswerOtherInput}>
                <textarea maxLength='100' placeholder={answerDesc}
                  value={this.state.otherValue}
                  onFocus={() => {
                    if (isIos()) { top = fixScroll().top }
                  }}
                  onBlur={() => {
                    isIos() && window.scrollBy(0, top)
                  }}
                  onChange={this.onChange} />
              </div>
          })}
        </div>
        {/* {isShowInput
          ? <div className={styles.qAnswerOtherInput}>
            <textarea maxLength='100' placeholder={answerDesc}
              value={this.state.otherValue}
              onFocus={() => {
                if (isIos()) { top = fixScroll().top }
              }}
              onBlur={() => {
                isIos() && window.scrollBy(0, top)
              }}
              onChange={this.onChange} />
          </div> : ''
        } */}
        <div>
          <p className={`${styles.qSureBtn}`} onClick={() => { this.onSure() }} >确定</p>
        </div>
      </div>
    )
  }
}
QuestionMultiple.propTypes = {
  answerObj: PropTypes.object,
  onMultipleCheck: PropTypes.func
}
export default QuestionMultiple
