import React from 'react'
import PropTypes from 'prop-types'
import styles from './questionnaire.scss'

class QuestionHeader extends React.PureComponent {
  render () {
    const { onPreQuestion, title, currentNum, totalNum, preQuestionId } = this.props
    let showPre = preQuestionId !== -1
    return (
      <div className={styles.questionHeader}>
        { showPre
          ? <div className={styles.preQuestionTitle} onClick={() => { onPreQuestion() }} >
            <i /><span>上一题</span>
          </div>
          : <div className={styles.preQuestionTitle} />
        }
        <div className={`${styles.questionTitle} ${showPre ? '' : ''}`}>
          {title}
        </div>
        <div className={styles.questionTotalTitle}>
          <span className={styles.currentNum}>{currentNum}</span>/
          <span className={styles.totalNum}>{totalNum}</span>
        </div>
      </div>
    )
  }
}
QuestionHeader.propTypes = {
  onPreQuestion:PropTypes.func,
  title:PropTypes.string,
  currentNum:PropTypes.number,
  totalNum:PropTypes.number,
  preQuestionId:PropTypes.number
}
export default QuestionHeader
