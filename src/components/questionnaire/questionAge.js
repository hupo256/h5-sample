import React from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd-mobile'
import styles from './questionnaire.scss'
const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)
class QuestionAge extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      visible:false
    }
  }
  onDateShow = () => {
    this.setState({
      visible:true
    })
  }
  onDateCancel = () => {
    this.setState({
      visible:false
    })
  }
  onOk = (time) => {
    const { answerObj } = this.props
    this.props.onDateOk(time, answerObj.quesId, answerObj.answerResps)
    this.onDateCancel()
  }
  render () {
    const { visible } = this.state
    const { answerObj } = this.props
    return (
      <div className={styles.questionContent}>
        <div className={styles.qLogoDiv}>
          <img className={styles.qLogo} src={answerObj.quesPicUrl} />
        </div>
        <div className={styles.qTitle}>
          {answerObj.questionOrder}.{answerObj.quesName}
        </div>
        <div>
          <p className={`${styles.qAnswerBtn} ${styles.qAnswerBtnActive}`} onClick={this.onDateShow} >
            {answerObj.answerResps[0].answerDesc}
          </p>
        </div>
        <DatePicker
          visible={visible}
          mode='date'
          title='选择日期'
          minDate={new Date(1900, 0, 1)}
          maxDate={new Date()}
          value={now}
          onOk={this.onOk}
          onDismiss={this.onDateCancel}
        />
      </div>
    )
  }
}
QuestionAge.propTypes = {
  answerObj:PropTypes.object,
  onDateOk:PropTypes.func,
}
export default QuestionAge
