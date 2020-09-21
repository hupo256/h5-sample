import React from 'react'
import PropTypes from 'prop-types'
import { Picker } from 'antd-mobile'
import styles from './questionnaire.scss'
import addressData from '@src/assets/json/city.json'
let addersList = []
class QuestionGroup extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      visible:false
    }
  }
  componentDidMount () {
    this.formatData()
  }
  // 省市区三级联动数据包装
  formatData = () => {
    const adders = []
    for (let province in addressData) {
      const label = addressData[province].name
      const city = addressData[province].city
      const children = []
      for (let n = 0, len = city.length; n < len; n++) {
        const cityList = {
          label:city[n].name,
          value:`${city[n].name}`,
          children:[]
        }
        if (city[n].area && city[n].area.length) {
          for (let i = 0, lens = city[n].area.length; i < lens; i++) {
            cityList.children.push({
              label: city[n].area[i],
              value:`${city[n].area[i]}`,
            })
          }
        }
        children.push(cityList)
      }
      const data = {
        label,
        value:label,
        children
      }
      adders.push(data)
    }
    addersList = adders
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
    this.props.onCityOk(value, answerObj.quesId, answerObj.answerResps)
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
            {/* {answerObj.answerResps[0].answerDesc} */}
            请选择
          </p>
        </div>
        <Picker
          visible={visible}
          data={addersList}
          cols={2}
          value={['北京市', '北京市']}
          onOk={this.onOk}
          onDismiss={this.onDateCancel}
        />
      </div>
    )
  }
}
QuestionGroup.propTypes = {
  answerObj:PropTypes.object,
  onCityOk:PropTypes.func,
}
export default QuestionGroup
