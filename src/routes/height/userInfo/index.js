import React from 'react'
import propTypes from 'prop-types'
import { fun, ua } from '@src/common/app'
import { DatePicker, Toast } from 'antd-mobile'
import wxconfig from '@src/common/utils/wxconfig'
import { Page } from '@src/components'
import styles from './info.scss'
import infoMale from '@static/height/info_male.png'
import infoFemale from '@static/height/info_female.png'
import down from '@static/height/icon_down.png'
import {
  trackPointToolHeightLinkmanInfoPageView
} from '../buried-point'

const { getSession, fmtDate } = fun
class UserInfo extends React.Component {
  state = {
    currentLinkManInfo: {},
    begin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 18 - 1000 * 60 * 60 * 24 * 4),
    dateFlag: false,
  }
  componentDidMount() {
    const currentLinkManInfo = getSession('currentLinkManInfo')
    const { birthday, linkManId } = currentLinkManInfo
    trackPointToolHeightLinkmanInfoPageView({
      sample_linkmanid: linkManId
    })
    if ((new Date() - new Date(birthday)) < 1000 * 60 * 60 * 24 * 366 * 18) {
      currentLinkManInfo.birth = fmtDate(new Date(birthday), '/')
    } else {
      currentLinkManInfo.birth = ''
      currentLinkManInfo.birthday = ''
    }
    currentLinkManInfo.sex = currentLinkManInfo.sex || 'male'
    this.setState({
      currentLinkManInfo
    })
    if (!ua.isAndall()) {
      this.wxShare(getSession('shareInfo'))
    }
  }
  /**
   * 微信分享
   */
  wxShare = (shareInfo) => {
    const { title, jumpUrl, subTitle, headImg } = shareInfo
    wxconfig({
      showMenu: true,
      params:{
        title,
        link: jumpUrl,
        desc: subTitle,
        imgUrl: headImg,
      }
    })
  }
  changeUserInfo = (type, value) => {
    const { currentLinkManInfo } = this.state
    currentLinkManInfo[type] = value
    this.setState({
      currentLinkManInfo: {
        ...currentLinkManInfo,
      }
    })
  }
  handleChangeValue = (value) => {
    const { currentLinkManInfo } = this.state
    this.setState({
      currentLinkManInfo:{
        ...currentLinkManInfo,
        birthday: value,
        birth: fmtDate(new Date(value), '/')
      },
      dateFlag: false
    })
  }
  handleEditDate = () => {
    this.setState({
      dateFlag: true
    })
  }
  handleChangeName = (e) => {
    const { currentLinkManInfo } = this.state
    this.setState({
      currentLinkManInfo: {
        ...currentLinkManInfo,
        linkManName: e.target.value
      }
    })
  }
  handleNext = () => {
    const { currentLinkManInfo } = this.state
    const { birth, sex, linkManName, linkManId } = currentLinkManInfo
    if (!sex) return Toast.info('请选择宝宝性别！')
    if (!linkManName) return Toast.info('请输入宝宝姓名！')
    if (!birth) return Toast.info('请选择宝宝生日！')
    this.props.history.push(`/height/add-record?linkManId=${linkManId}&birthday=${birth}&sex=${sex}&linkManName=${encodeURIComponent(linkManName)}`)
  }
  handleBlur = () => {
    window.scrollTo(0, 0) // 页面向上滚动
  }
  render () {
    const { begin, dateFlag, currentLinkManInfo } = this.state
    const { linkManName, sex, birthday } = currentLinkManInfo || {}
    return (
      <Page title='确认宝宝信息'>
        <div className={styles.infoCont}
          id='box1'>
          <div className={styles.photo}>
            <img src={sex === 'male' ? infoMale : infoFemale} alt='' />
          </div>
          <div className={styles.sexCont}>
            <span
              className={sex === 'male' ? styles.actived : ''}
              onClick={() => this.changeUserInfo('sex', 'male')}
            >男宝宝</span>
            <span
              className={sex === 'female' ? styles.actived : ''}
              onClick={() => this.changeUserInfo('sex', 'female')}
            >女宝宝</span>
          </div>
          <div className={styles.nameCont} >
            <input type='text' onChange={(e) => this.handleChangeName(e)} value={linkManName} placeholder='宝宝名字'
              onBlur={this.handleBlur}
            />
          </div>
          <div className={styles.birthCont} onClick={this.handleEditDate}>
            {
              birthday
                ? fmtDate(new Date(birthday), '/')
                : '宝宝生日'
            }
            <img className={styles.down} src={down} alt='' />
          </div>
          <span className={styles.btn} onClick={this.handleNext}>下一步</span>
          <DatePicker
            mode='date'
            title='选择日期'
            minDate={begin}
            maxDate={new Date()}
            value={new Date(birthday || Date.now())}
            visible={dateFlag}
            onOk={(e) => this.handleChangeValue(e)}
            onDismiss={() => this.setState({ dateFlag: false })}
          />
        </div>
      </Page>
    )
  }
}
UserInfo.propTypes = {
  history: propTypes.object,
}
export default UserInfo
