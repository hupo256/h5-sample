import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './invite.scss'
import { ua, fun, reg } from '@src/common/app'
import { Toast } from 'antd-mobile'
import images from '../images'
import user from '@src/common/api/UserApi'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
import { invitationPageView, invitationPageoto } from '../buried-point'
const { fixScroll } = fun
const { isIos } = ua
const { getParams } = fun
class Verification extends React.Component {
  state = {
    userName:'',
    form: {
      mobileNo:'',
      code: ''
    },
    time: 60,
    btnVisible:false,
    hasMobile:'', // 一键登录
  }

  componentDidMount () {
    invitationPageView()
    this.getPreAcceptInvite()
  }
  getPreAcceptInvite=() => {
    healthRecordsApi.getPreAcceptInvite({ jwt:getParams().jwt }).then(res => {
      if (res) {
        console.log(res.data)
        this.setState({
          hasMobile:res.data.mobile || '',
          userName:res.data.userName
        })
      }
    })
  }
  onChange = (value, name) => {
    const { form } = this.state
    if (name === 'code') {
      this.setState({ btnVisible:+value.length > 4 })
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

  verificationBtn = () => {
    const { form, btnVisible } = this.state
    let { mobileNo, code } = form
    if (!btnVisible) {
      return
    }
    if (+code.length < 5) {
      Toast.info('请输入正确的验证码')
      return
    }
    mobileNo = mobileNo.replace(/\s+/g, '')
    if (!reg.phone.test(mobileNo)) {
      Toast.info('手机号码格式不正确')
    }
    this.checkAcceptInvite(mobileNo, code)
  }

// 一键登录
oneClickLogin=() => {
  this.checkAcceptInvite('', '')
}
checkAcceptInvite=(mobileNo, code) => {
  healthRecordsApi.checkAcceptInvite({
    mobile:mobileNo,
    code,
    jwt:getParams().jwt
  }).then(res => {
    if (!res.code) {
      invitationPageoto({ viewtype:'indentity' })
      console.log(res.data)
      localStorage.setItem('sex', res.data.sex ? res.data.sex : '')
      localStorage.setItem('birthday', res.data.birthday ? res.data.birthday : '')
      localStorage.setItem('relationshipId', res.data.friendRelationId ? res.data.friendRelationId : '')
      this.props.history.push(`/healthRecords/invite/info?acceptToken=${res.data.acceptToken}&jwt=${getParams().jwt}`)
    }
  })
}
otherLogin=() => {
  this.setState({ hasMobile:false })
}
render () {
  const { userName, form, time, btnVisible, hasMobile } = this.state
  return (
    <Page title='安我生活亲友邀请'>
      {
        hasMobile
          ? <div className={styles.verification} id='top'>
            <h5>{userName}邀请你加入他的亲友圈</h5>
            <img src={images.invite} />
            <p className={styles.hasMobile}>{hasMobile}</p>
            <div className={`${styles.submitBtn}`} onClick={this.oneClickLogin}>
              <p className={styles.oneClick}>一键登录</p>
            </div>
            <div className={styles.otherPhone} onClick={this.otherLogin}>
              <span />其他手机号登录<span />
            </div>
          </div>
          : <div className={styles.verification} id='top'>
            <div>
              <h5>{userName}邀请你加入他的亲友圈</h5>
              <img src={images.invite} />
              <div className={styles.input}>
                <input
                  placeholder='请输入手机号码接受邀请'
                  type='tel' value={form['mobileNo'] || ''}
                  onChange={e => { this.onChange(e.target.value, 'mobileNo') }}
                  onBlur={() => { isIos() && window.scrollBy(0, fixScroll().top) }}
                />
              </div>
              <div className={styles.input}>
                <input
                  placeholder='验证码'
                  type='tel'
                  onBlur={() => { isIos() && window.scrollBy(0, fixScroll().top) }}
                  onChange={e => { this.onChange(e.target.value, 'code') }}
                />
                <span onClick={(e) => { this.handleCode(e) }}>
                  {time === 60 ? '获取验证码' : `重新发送 (${time})`}
                </span>
              </div>
            </div>
            <div className={`${styles.submitBtn} ${btnVisible ? '' : styles.submitBtn2}`} onClick={this.verificationBtn}>
              <p>核验身份</p>
            </div>
          </div>
      }

    </Page>
  )
}
}
Verification.propTypes = {
  history: propTypes.object,
}
export default Verification
