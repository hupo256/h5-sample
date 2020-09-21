import React from 'react'
import { Toast } from 'antd-mobile'
import styles from '../login'
import { reg, fun } from '@src/common/app'
import user from '@src/common/api/UserApi'
import UA from '@src/common/utils/ua'
import { newLoginView, newLoginGoto} from '../BuriedPoint'


const {getParams} = fun
const { isWechat} = UA
class MobileForm extends React.Component {
  state = {
    form: {
      mobile: '',
      code: ''
    },
    time: 60,
    hasCheck:false,
    btnVisible:false
  }
  componentDidMount() {
    const getUrl = location.href.toLocaleLowerCase()
    const { channelid = '' } = getParams(getUrl)
    newLoginView({ channel_id:channelid })
  }
  onChange = (value, name) => {
    const { form } = this.state
    if (name === 'code') {
      if (+value.length > 4) {
        this.setState({
          btnVisible:true
        })
      } else {
        this.setState({
          btnVisible:false
        })
      }
    } else {
      if (value.length > 11) return
    }
    form[name] = value
    this.setState({ form })
  }

  handleCode = (e) => {
    e.stopPropagation()
    const { form, time } = this.state
    let { mobileNo } = form
    mobileNo = mobileNo.replace(/\s+/g, '')
    if (!reg.phone.test(mobileNo)) {
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
      user.sendMessageCodeNoShop({ mobileNo }).then(res => {
        const { code } = res
        if (!code) {
          Toast.success('发送成功', 1.5)
        } else {
          this.setState({ time:0 })
        }
      })
    }
  }

  changeCheck = () => {
    this.setState({
      hasCheck:!this.state.hasCheck
    })
  }

  login = () => {

    const { form, hasCheck } = this.state
    let { mobileNo, code } = form
    if (+code.length < 5) {
      Toast.info('请输入正确的验证码')
      return
    }
    mobileNo = mobileNo.replace(/\s+/g, '')
    if (!reg.phone.test(mobileNo)) {
      Toast.info('手机号码格式不正确')
      return
    }
    if (!hasCheck) {
      Toast.info('请先同意以下协议及条款')
      return
    }
    const getUrl = location.href.toLocaleLowerCase()
    const { channelid = '' } = getParams(getUrl)
    newLoginGoto({view_type:'login', channel_id:channelid })
    user.h5Login({ mobileNo, code, type:isWechat() ? 'WeChat' : 'H5', channelId:channelid }).then(res => {
      if (!res.code) {
        console.log(window.location.href)
        let link = window.location.href.split('url=')[1]
        window.localStorage.setItem('token', res.data.token)
        setTimeout(() => {
          link && (window.location.replace(link))
        },1500)
      }
    })
  }

  goRule = (type) => {
    if (type === 'person') {
      window.location.href = origin + '/mkt/protocol/protocol-privacy.html'
    } else {
      window.location.href = origin + '/mkt/protocol/protocol-buy.html'
    }
  }

  render() {
    const { time, hasCheck, btnVisible, form } = this.state
    return (
      <div className={styles.formWrap}>
        <div className={styles.inputRow}>
          <div>手机号</div>
          <div><input type='tel' value={form['mobileNo'] || ''} onChange={e => { this.onChange(e.target.value, 'mobileNo') }} /></div>
        </div>
        <div className={styles.inputRow}>
          <div>验证码</div>
          <div><input type='tel' onChange={e => { this.onChange(e.target.value, 'code') }} /></div>
          <div onClick={(e) => { this.handleCode(e) }}>
            {time === 60 ? '获取验证码' : `重新发送 (${time})`}
          </div>
        </div>
        {!btnVisible &&
        <div className={styles.btn}>
          登录
        </div>
        }
        {btnVisible &&
        <div className={styles.btn2} onClick={() => { this.login() }}>
          登录
        </div>
        }
        <div className={hasCheck?styles.rulePick:styles.ruleUnPick}>我已阅读并同意<span className={styles.ruleStyle} onClick={()=>this.goRule("person")}>《个人隐私条款》</span><span className={styles.ruleStyle} onClick={()=>this.goRule("user")}>《用户购买协议》</span>
          <div className={styles.clickWrap} onClick={() => this.changeCheck()}></div>
        </div>
      </div>
    )
  }
}

export default MobileForm
