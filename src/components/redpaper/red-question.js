import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './redpaper.scss'
import { API, point } from '@src/common/app'
import { Toast } from 'antd-mobile'
import female from '@static/register/female.png'
import male from '@static/register/male.png'
import leftUnselect from '@static/register/leftUnselect.png'
import rightUnselect from '@static/register/rightUnselect.png'
import leftSelect from '@static/register/leftSelect.png'
import rightSelect from '@static/register/rightSelect.png'
import agreeCheck from '@static/register/agreeCheck.png'
import disagreeCheck from '@static/register/disagreeCheck.png'
const { allPointTrack } = point

export default class RedQuestion extends Component {
  state = {
    genderArr: [female, male],
    marryArr: ['已婚', '未婚'],
    babyArr: ['已有宝宝', '暂无宝宝'],
    genderActive: '',
    marryActive: '',
    babyActive: '',
    genderState: '',
    marryState: '',
    babyState: '',
    phoneNumber: JSON.parse(localStorage.getItem('phoneNumber')),
    checkAgree: true
  }

// 完成注册标签页填写的埋点
trackPointSignupTagInputComplete = () => {
  const { marryState, babyState, genderState } = this.state
  allPointTrack({
    eventName: 'signup_tag_input_complete',
    sex:genderState,
    marry:marryState,
    baby: babyState
  })
}

  // 埋点记录完成注册
trackPointSignComplete = () => {
  const { phoneNumber } = this.state

  allPointTrack({
    eventName: 'signup_complete',
    pointParams: phoneNumber
  })
}
  // 点击关闭弹窗
  handleCloseModal = () => {
    this.props.onCancel()
  }
  // 点击性别样式
  handleGender = (index) => {
    let genderState = ''
    index === 0 ? genderState = 2 : genderState = 1
    this.setState({
      genderState,
      genderActive: index
    })
  }
  // 点击婚姻按钮样式
  handleMarry = (item, index) => {
    let marryState = ''
    item === '未婚' ? marryState = 0 : marryState = 1
    this.setState({
      marryState,
      marryActive: index,
    })
  }
  // 点击宝宝情况样式
  handleBaby = (item, index) => {
    let babyState = ''
    item === '暂无宝宝' ? babyState = 0 : babyState = 1
    this.setState({
      babyState,
      babyActive: index,
    })
  }
  handleSubmit = () => {
    const { checkAgree, marryState, babyState, genderState, phoneNumber } = this.state
    const info = {
      gender: genderState,
      marry: marryState,
      baby: babyState,
      mobile: phoneNumber
    }
    if (typeof (genderState) === 'string') {
      Toast.info('信息输入不完整')
      return
    }
    if (typeof (marryState) === 'string') {
      Toast.info('信息输入不完整')
      return
    }
    if (typeof (babyState) === 'string') {
      Toast.info('信息输入不完整')
      return
    }
    if (!checkAgree) {
      Toast.info('请勾选隐私协议')
      return
    }
    this.trackPointSignupTagInputComplete()// 完成标签页信息填写埋点
    this.trackPointSignComplete()// 完成注册埋点

    API.updateBaseInfo(info).then(res => {
      const { data } = res
      if (data) {
        Toast.success('领取成功', 1.5)
        setTimeout(() => {
          this.props.onConfirm()
        }, 1500)
      }
    })
  }
  // 是否勾选用户隐私协议
  handleAgreement = () => {
    const { checkAgree } = this.state
    this.setState({
      checkAgree: !checkAgree
    })
  }
  render () {
    const { genderArr, marryArr, babyArr, marryActive, babyActive, genderActive, checkAgree } = this.state
    return (
      <div>
        <div className={styles.mask} />
        <div className={styles.redQuestion}>
          <div className={`${styles.closeModal}`} onClick={() => { this.handleCloseModal() }} />
          <div className={styles.questionTit}>完善个人信息 领取新人红包</div>
          <div className={styles.questionCont}>
            <div className={styles.gender}>
              <div className={styles.genderImg}>
                {
                  genderArr.map((item, index) => {
                    return (
                      <div className={styles.outGender} key={index}>
                        <p className={genderActive === index ? styles.genderActive : ''}
                          onClick={(e) => this.handleGender(index)}>
                          <img src={item} />
                        </p>
                        <div className={styles.genderCont}>
                          {
                            index === 0 ? <span className={genderActive === index ? styles.activeGender : ''}>女</span> : <span className={genderActive === index ? styles.activeGender : ''}>男</span>
                          }
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
            <div className={styles.common}>
              <div className={styles.commonBg}>
                <p onClick={this.handleLeft}>
                  <img src={marryActive === 0 ? leftSelect : leftUnselect} />
                </p>
                <p>
                  <img src={marryActive === 1 ? rightSelect : rightUnselect} />
                </p>
              </div>
              <div className={styles.commonCont}>
                {
                  marryArr.map((item, index) => {
                    return (
                      <span key={item}
                        className={marryActive === index ? styles.activeCont : ''}
                        onClick={(e) => this.handleMarry(item, index)}>{item}</span>
                    )
                  })
                }
              </div>
            </div>
            <div className={`${styles.common} ${styles.mt36}`}>
              <div className={styles.commonBg}>
                <p>
                  <img src={babyActive === 0 ? leftSelect : leftUnselect} />
                </p>
                <p>
                  <img src={babyActive === 1 ? rightSelect : rightUnselect} />
                </p>
              </div>
              <div className={styles.commonCont}>
                {
                  babyArr.map((item, index) => {
                    return (
                      <span key={item}
                        className={babyActive === index ? styles.activeCont : ''}
                        onClick={(e) => this.handleBaby(item, index)}>{item}</span>
                    )
                  })
                }
              </div>
            </div>
            <div className={`${styles.submitBtn}
              ${typeof (marryActive) === 'number' &&
              typeof (genderActive) === 'number' &&
              typeof (babyActive) === 'number' &&
              checkAgree ? styles.active : ''}`} onClick={this.handleSubmit}>立即领取</div>
          </div>
          <div className={styles.agreeClause}>
            <img src={checkAgree ? agreeCheck : disagreeCheck} onClick={this.handleAgreement} />
            <i>同意</i><span onClick={this.props.onShowPrivacy}>《个人隐私条款》</span>
          </div>
        </div>
      </div>
    )
  }
}

RedQuestion.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onShowPrivacy: PropTypes.func
}
