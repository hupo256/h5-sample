import React from 'react'
import PropTypes from 'prop-types'
import { Picker } from 'antd-mobile'
import { filter } from '@src/common/app'
import styles from './questionnaire.scss'
const { nationMap } = filter
class QuestionGroup extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }
  onDateShow = () => {
    this.setState({
      visible: true
    })
  }
  onDateCancel = () => {
    this.setState({
      visible: false
    })
  }
  onOk = (value) => {
    const { answerObj } = this.props
    this.props.onGroupOk(value, answerObj.quesId, answerObj.answerResps)
    this.onDateCancel()
  }
  render() {
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
        <Picker
          visible={visible}
          data={nationMap}
          cols={1}
          value={['汉族']}
          onOk={this.onOk}
          onDismiss={this.onDateCancel}
        />
      </div>
    )
  }
}
QuestionGroup.propTypes = {
  answerObj: PropTypes.object,
  onGroupOk: PropTypes.func,
}
export default QuestionGroup
