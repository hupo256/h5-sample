import React from 'react'
import propTypes from 'prop-types'
import { API } from '@src/common/app'
import { Toast } from 'antd-mobile'
import styles from './Institute.scss'

class Institute extends React.Component {
  state = {
    isGray: true,
    babyHeight: '',
    fatherHeight: '',
    motherHeight: ''
  }
  componentDidMount() {
  }
  componentWillReceiveProps = (nextProps) => {
    const {isChangeLinkMan} = nextProps
    if (isChangeLinkMan) {
      this.setState({
        babyHeight: '',
        fatherHeight: '',
        motherHeight: ''
      })
    }
  }
  
  handleChangeInputValue = (e, type) => {
    if (type === 'babyHeight') {
      this.setState({
        babyHeight: e.target.value
      }, () => {
        this.handleChangeBtnColor()
      })
    } else if (type === 'fatherHeight') {
      this.setState({
        fatherHeight: e.target.value
      }, () => {
        this.handleChangeBtnColor()
      })
    } else if (type === 'motherHeight') {
      this.setState({
        motherHeight: e.target.value
      }, () => {
        this.handleChangeBtnColor()
      })
    }
  }
  handleChangeBtnColor = () => {
    const { babyHeight, fatherHeight, motherHeight } = this.state
    if (!babyHeight || !fatherHeight || !motherHeight) return
    this.setState({
      isGray: false
    })
  }
  // 提交咨询内容
  handleSubmit = (flag) => {
    const { isGray, babyHeight, motherHeight, fatherHeight } = this.state
    if (isGray) return
    let reg = /^[0-9]+(.[0-9]{1})?$/
    if (!reg.test(babyHeight)) return Toast.info('宝宝身高输入有误！')
    if (!reg.test(fatherHeight)) return Toast.info('父亲身高输入有误！')
    if (!reg.test(motherHeight)) return Toast.info('母亲身高输入有误！')
    const params = {
      babyHeight,
      motherHeight,
      fatherHeight,
      linkmanId: this.props.linkManId,
    }
    API.insertFamilyHeightRecord(params).then(res => {
      if (res) {
        Toast.info('提交成功，感谢您的参与！')
        this.props.onLoadData()
      }
    })
  }
  render() {
    const { babyHeight, fatherHeight, motherHeight, isGray } = this.state
    return (
      <div className={styles.instituteCont}>
        <p className={styles.title}>研究院</p>
        <div className={styles.instituteDetail}>
          <p className={styles.instituteDesc}>我们将根据你提供的数据<br />研究并提供更准确的各年龄段孩子身高</p>
          <div className={styles.inputBox}>
            <p className={styles.inputTitle}>宝宝出生时的身高</p>
            <input
              className={styles.input}
              onChange={(e) => this.handleChangeInputValue(e, 'babyHeight')}
              placeholder='cm'
              value={babyHeight}
            />
          </div>
          <div className={styles.inputsBox}>
            <div className={styles.inputBox}>
              <p className={styles.inputTitle}>父亲的身高</p>
              <input
                className={styles.input}
                onChange={(e) => this.handleChangeInputValue(e, 'fatherHeight')}
                placeholder='cm'
                value={fatherHeight}
              />
            </div>
            <div className={styles.inputBox}>
              <p className={styles.inputTitle}>母亲的身高</p>
              <input
                className={styles.input}
                onChange={(e) => this.handleChangeInputValue(e, 'motherHeight')}
                placeholder='cm'
                value={motherHeight}
              />
            </div>
          </div>
        </div>
        <span className={`${styles.submitBtn} ${isGray ? styles.isGray : ''}`} onClick={this.handleSubmit}>提交</span>
      </div>

    )
  }
}
Institute.propTypes = {
  linkManId: propTypes.number,
  onLoadData: propTypes.func,
  isChangeLinkMan: propTypes.bool
}
export default Institute
