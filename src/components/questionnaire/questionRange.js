import React from 'react'
import PropTypes from 'prop-types'
import { Picker } from 'antd-mobile'
import styles from './questionnaire.scss'

class QuestionGroup extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      visible:false,
      selectList: []
    }
  }

  componentDidMount() {
    this.formatData()
  }

  formatData = () => {
    const { answerObj: {quesType} } = this.props
    const [, range, step] = quesType.split(',')
    const [min, max] = range.split('-')
    console.log(min, max, step)
    const selectList = []
    for(let i=+min; i<=+max; i+=+step){
      selectList.push({
        label: i,
        value: i
      })
    }
    this.setState({ selectList })
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
  onOk = (value) => {
    const { answerObj } = this.props
    this.props.onGroupOk(value, answerObj.quesId, answerObj.answerResps)
    this.onDateCancel()
  }
  render () {
    const { visible, selectList } = this.state
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
          data={selectList}
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
  answerObj:PropTypes.object,
  onGroupOk:PropTypes.func,
}
export default QuestionGroup
