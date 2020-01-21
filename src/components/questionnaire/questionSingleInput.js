import React from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import styles from './questionnaire.scss'
import { fun, ua } from '@src/common/app'
const { fixScroll } = fun
const { isIos } = ua
class QuestionSingleInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      otherValue:'',
      answerSelected:[],
      answerResps:props.answerObj.answerResps.filter(f => {
        return f.answerType !== 'ex_word'
      }).map(item => {
        item.selected = false
        return item
      })
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      otherValue:'',
      answerSelected:[],
      answerResps:nextProps.answerObj.answerResps.filter(f => {
        return f.answerType !== 'ex_word'
      }).map(item => {
        item.selected = false
        return item
      })
    })
  }
  onChange =(e) => {
    let value = e.target.value
    const { answerResps } = this.state
    const { answerObj } = this.props
    this.setState({ otherValue: value })
    if (value) {
      this.setState({
        answerSelected:answerObj.answerResps.filter(f => { return f.answerType === 'ex_word' }),
        answerResps:answerResps
          .map(data => {
            data.selected = false
            return data
          })
      })
    } else {
      this.setState({
        answerSelected:[]
      })
    }
  }
  onSelect (item) {
    const { answerResps } = this.state
    this.setState({
      answerSelected:[item],
      answerResps:answerResps
        .map(data => {
          if (data.answerId === item.answerId) {
            data.selected = true
          } else {
            data.selected = false
          }
          return data
        }),
      otherValue: ''
    })
  }
  onSure () {
    const { answerSelected, otherValue } = this.state
    const { answerObj, onSingleInputCheck } = this.props
    if (!answerSelected.length && otherValue === '') {
      Toast.info('请选择或输入内容')
      return
    }
    onSingleInputCheck(answerObj.quesId, otherValue, answerSelected)
  }
  render () {
    let top = 0
    const { answerObj } = this.props
    const { answerResps } = this.state
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
                className={`${styles.qAnswerBtnWithInput} ${item.selected ? styles.qAnswerBtnActive : ''}`}
                onClick={() => { this.onSelect(item) }} >
                {item.answerDesc}
              </p>
            ))
          }
        </div>
        <div className={styles.qAnswerOtherInput}>
          <input type='tel' placeholder='点击这里输入其他年龄'
            value={this.state.otherValue}
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
QuestionSingleInput.propTypes = {
  answerObj:PropTypes.object,
  onSingleInputCheck:PropTypes.func
}
export default QuestionSingleInput
