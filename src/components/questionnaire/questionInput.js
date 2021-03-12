import React from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import styles from './questionnaire.scss'
import { fun, ua } from '@src/common/app'
const { fixScroll } = fun
const { isIos } = ua
class QuestionInput extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      inputValue:''
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      inputValue:''
    })
  }
  onChange =(e) => {
    let target = e.target
    if (!target.value) {
      target.style.height = '28px'
    }
    target.style.height = target.scrollTop + target.scrollHeight + 'px'
    this.setState({
      inputValue: e.target.value
    })
  }
  onSure () {
    if (this.state.inputValue === '') {
      Toast.info('请输入内容', 1)
      return
    }
    const { answerObj, onInputEnter } = this.props
    onInputEnter(answerObj.quesId, this.state.inputValue, answerObj.answerResps)
  }
  render () {
    let top = 0
    const { answerObj } = this.props
    return (
      <div className={styles.questionContent}>
        <div className={styles.qLogoDiv}>
          <img className={styles.qLogo} src={answerObj.quesPicUrl} />
        </div>
        <div className={styles.qTitle}>
          {answerObj.questionOrder}.{answerObj.quesName}
        </div>
        <div className={styles.qAnswerOtherInput}>
          <textarea maxLength='100' placeholder={answerObj.answerResps[0].answerDesc}
            value={this.state.inputValue}
            onFocus={() => {
              if (isIos()) { top = fixScroll().top }
            }}
            onBlur={() => {
              isIos() && window.scrollBy(0, top)
            }}
            onChange={this.onChange} />
        </div>
        <div>
          <p className={`${styles.qSureBtn}`} onClick={() => { this.onSure() }} >确定</p>
        </div>
      </div>
    )
  }
}
QuestionInput.propTypes = {
  answerObj:PropTypes.object,
  onInputEnter:PropTypes.func
}
export default QuestionInput
