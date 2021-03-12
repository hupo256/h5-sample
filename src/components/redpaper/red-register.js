import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import { API, fun, point, reg } from '@src/common/app'
import agreeCheck from '@static/register/agreeCheck.png'
import disagreeCheck from '@static/register/disagreeCheck.png'
import styles from './redpaper.scss'

const { allPointTrack } = point

const trackPointSignupTagInputView = () => {
  allPointTrack({
    eventName: 'signup_tag_input_view'
  })
}

export default class RedRegister extends Component {
  constructor (props) {
    super(props)
    this.state = {
      form: {
        mobile: '',
        code: ''
      },
      time: 60,
      checkAgree: true
    }
  }

  componentDidMount = () => {

  }

  // 获取表单值
  onChange = (val, name) => {
    const { form } = this.state
    form[name] = val
    this.setState({ form })
  }

  // 获取验证码
  handleCode = (e) => {
    e.stopPropagation()
    const { form, time } = this.state
    const { mobile } = form
    if (!reg.phone.test(mobile)) {
      Toast.info('手机号码格式不正确')
      return
    }
    const countdown = () => {
      let { time } = this.state
      time--
      if (time > 0) {
        this.setState({ time })
        setTimeout(countdown, 1000)
        return
      }
      this.setState({ time:60 })
    }
    if (time === 60) {
      countdown()
      API.sendMessageCode({ mobile, noloading:1 }).then(res => {
        const { code } = res

        if (!code) {
          Toast.success('发送成功', 1.5)
        } else {
          this.setState({ time:0 })
        }
      })
    }
  }

  // 是否勾选用户隐私协议
  handleAgreement = () => {
    const { checkAgree } = this.state
    this.setState({
      checkAgree: !checkAgree
    })
  }

  // 验证用户
  handelSubmit = () => {
    const { form, checkAgree } = this.state
    const { code, mobile } = this.state.form
    if (form.mobile.length !== 11 || form.code.length === 0) {
      return
    }
    if (!reg.phone.test(mobile)) {
      Toast.info('手机号码格式不正确')
      return
    }
    if (!reg.code.test(code)) {
      Toast.info('验证码不正确')
      return
    }
    if (!checkAgree) {
      Toast.info('请勾选隐私协议')
      return
    }
    API.login(form).then(res => {
      const { code } = res
      if (!code) {
        trackPointSignupTagInputView()
        Toast.success('验证成功', 1.5)
        setTimeout(() => {
          this.props.onConfirm()
        }, 1500)
        localStorage.setItem('phoneNumber', JSON.stringify(mobile))
        this.props.onConfirm()
      }
    })
  }

  // 点击清除input框
  handleClearInput = (e) => {
    document.getElementById('codeInput').value = ''
    const { form } = this.state
    this.setState({
      form: {
        ...form,
        code: ''
      }
    })
  }

  // 点击注册领取
  handleRegister = (e) => {
    e.stopPropagation()
    this.handelSubmit()
  }

  // 点击关闭弹窗
  handleCloseModal = () => {
    this.props.onCancel()
  }

  render () {
    const { time, form = {}, checkAgree } = this.state
    return (
      <div>
        <div className={styles.mask} />
        <div className={styles.redRegister}>
          <div style={{ position: 'relative' }}>
            <div className={`${styles.closeModal}`} onClick={() => { this.handleCloseModal() }} />
            <div className={styles.registerCon}>
              <div className={styles.registerTit}>
              完善个人信息 领取新人礼包
              </div>
              <div className={styles.row}>
                <div className={styles.inputBlock}>
                  <input className={styles.mobileInput}
                    placeholder='请填写手机号'
                    type='tel'
                    onChange={e => { this.onChange(e.target.value, 'mobile') }}
                  />
                </div>
              </div>
              <div className={`${styles.row} ${styles.mb56}`}>
                <div className={styles.inputBlock}>
                  <div className={styles.inputWrap}>
                    <input className={styles.codeInput}
                      id='codeInput'
                      type='tel'
                      placeholder='请填写验证码'
                      onChange={e => { this.onChange(e.target.value, 'code') }}
                    />
                    {
                      form.code && form.code !== ''
                        ? <span className={`iconfont ${styles.inputClear}`}
                          onClick={(e) => { this.handleClearInput(e) }}
                        >
                        &#xe603;
                        </span> : null
                    }

                  </div>
                  <div className={styles.codeBtn}
                    onClick={(e) => { this.handleCode(e) }}
                    style={{ opacity:time === 60 ? 1 : 0.3 }}
                  >
                    <span className={styles.borderLine}>|</span>
                    {time === 60 ? '获取验证码' : `重新发送 (${time})`}
                  </div>
                </div>
              </div>
              <div className={`${styles.blockBtn}
                ${styles.receiveBtn} ${form.mobile.length === 11 &&
                  form.code.length > 0 && checkAgree ? styles.active : ''}`} onClick={(e) => { this.handleRegister(e) }}>下一步
              </div>
              <div className={styles.agreeClause}>
                <img src={checkAgree ? agreeCheck : disagreeCheck} onClick={this.handleAgreement} />
                <i>同意</i><span onClick={this.props.onShowPrivacy}>《个人隐私条款》</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

RedRegister.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  onShowPrivacy: PropTypes.func
}
