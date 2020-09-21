import React from 'react'
import styles from '../mould'
import { fun, point, reg } from '@src/common/app'
import { Toast } from 'antd-mobile'
import UA from '@src/common/utils/ua'
import landing from '@src/common/api/landingApi'
const { isWechat } = UA

class LoginCover extends React.Component {
  state = {
    form: {
      mobile: '',
      code: ''
    },
    time: 60,
    checkAgree: true,
    setVisible: false
  }

  componentWillReceiveProps(nextProps) {

  }

  onChange = (val, name) => {
    const { form } = this.state
    form[name] = val
    this.setState({ form })
  }
  handleCode = (e) => {
    e.stopPropagation()
    const { form, time } = this.state
    const { mobileNo } = form
    if (!reg.phone.test(mobileNo)) {
      Toast.info('手机号码格式不正确', 2)
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
      this.setState({ time: 60 })
    }
    if (time === 60) {
      countdown()
      landing.sendMessageCodeNoShop({ mobileNo }).then(res => {
        const { code } = res

        if (!code) {
          Toast.success('发送成功', 1.5)
        } else {
          this.setState({ time: 0 })
        }
      })
    }
  }

  login = () => {
    const { form } = this.state
    const { mobileNo, code } = form
    const { setVisible, changeMobile, setLoginFlag } = this.props;
    if (!reg.phone.test(mobileNo)) {
      Toast.info('手机号码格式不正确', 2)
      return
    }
    if (+code.length < 5) {
      Toast.info("请输入正确的验证码", 2)
      return
    }
    let type = "H5"
    if (isWechat()) {
      type = "WeChat"
    }

    landing.h5Login({ mobileNo, code, type: type }).then(res => {
      if (!res.code) {
        window.localStorage.setItem('token', res.data.token)
        setVisible("loginVisible")
        changeMobile(mobileNo)
        setLoginFlag(false)
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

  setVisible = () => {
    const { setVisible } = this.props;
    setVisible("loginVisible");
  }

  render() {
    const { time, form = {}, checkAgree, } = this.state
    const { visible, showClose = true } = this.props;
    return (
      <div>
        {visible ?
          (<div className={styles.cover}>
            <div className={styles.loginWrap} >
              {
                showClose && <span onClick={() => this.setVisible(false)}></span>
              }
              <div className={styles.registerTit}>
                登录
                    </div>
              <div className={styles.row}>
                <div className={styles.inputBlock}>
                  <input className={styles.mobileInput}
                    placeholder='请填写手机号'
                    type='tel'
                    onChange={e => { this.onChange(e.target.value, 'mobileNo') }}
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
                        ? <p className={`iconfont ${styles.inputClear}`}
                          onClick={(e) => { this.handleClearInput(e) }}
                        >
                          &#xe603;
                                  </p> : null
                    }
                  </div>
                  <div className={styles.codeBtn}
                    onClick={(e) => { this.handleCode(e) }}
                    style={{ opacity: time === 60 ? 1 : 0.3 }}
                  >
                    {time === 60 ? '获取验证码' : `重新发送 (${time})`}
                  </div>
                </div>
              </div>
              <div className={styles.confirm} onClick={() => { this.login() }}>确认</div>
              <div className={styles.tips}>* 确认即同意用此手机号登录/注册</div>
            </div>
          </div>) : ""
        }
      </div>
    )
  }
}
export default LoginCover
