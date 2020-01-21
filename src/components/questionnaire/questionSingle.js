import React from 'react'
import PropTypes from 'prop-types'
import styles from './questionnaire.scss'
class QuestionSingle extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      answerResps:props.answerObj.answerResps.map(item => {
        item.selected = false
        return item
      }),
    }
  }
  componentWillReceiveProps (nextProps) {
    const { answerObj } = nextProps
    this.setState({
      answerResps:answerObj.answerResps.map(item => {
        item.selected = false
        return item
      }) })
  }

  onSelect (item) {
    const { answerResps } = this.state
    const { answerObj, onSingleCheck } = this.props
    this.setState({
      answerResps:answerResps
        .map(data => {
          if (data.answerId === item.answerId) { item.selected = true }
          return data
        })
    })
    onSingleCheck(answerObj.quesId, [item])
  }
  render () {
    const { answerResps } = this.state
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
          {
            answerResps.map((item, index) => (
              <p key={index}
                className={`${styles.qAnswerBtn} ${item.selected ? styles.qAnswerBtnActive : ''}`}
                onClick={() => { this.onSelect(item) }} >
                {item.answerDesc}
              </p>
            ))
          }
        </div>
      </div>
    )
  }
}
QuestionSingle.propTypes = {
  answerObj:PropTypes.object,
  onSingleCheck:PropTypes.func
}
export default QuestionSingle
