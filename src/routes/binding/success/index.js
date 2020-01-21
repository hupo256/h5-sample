import React from 'react'
import { Page } from '@src/components'
import { fun, ua } from '@src/common/app'
import styles from '../binding'
import andall from '@src/common/utils/andall-sdk'
import BannerRun from '../../sampling/status/bannerRun'
import {BindSuccessPageCouponPopupGoto} from '../../mkt/shareRedPacker/BuriedPoint'
import back from '@static/back_right.png'
const { getSetssion, getParams } = fun
export default class Success extends React.Component {
  state = {
    inviteFlag: true,
    inviteModal: {},
    isAndall: ua.isAndall(),
    adPop: true,
  }
  componentDidMount() {
    console.log(this.props)
    let inviteModal = getSetssion('inviteModal')
    if (inviteModal) {
      this.setState({ inviteModal })
    }
  }
  goBack = () => {
    andall.invoke('back')
  }

  toOther = () => {
    const { isAndall } = this.state
    isAndall && andall.invoke('openNewWindow', { url: '/andall-sample/binding' })
    isAndall || this.props.history.push('/binding')
  }

  gotoThePage = () => {
    const { isAndall } = this.state
    const { location: { state } } = this.props
    const pUrl = state ? state.redirectUrl : ''
    const status = state && state.status ? state.status : 0
    let nextUrl = ''
    const { linkManId, userName } = getParams(pUrl)
    const setionData = getSetssion('linkMan')
    const locName = setionData && setionData.userName
    const theName = userName || locName || ''
    if (status === 1) { // 采样器列表
      nextUrl += isAndall ? '/andall-sample/' : '/sampling'
      isAndall && andall.invoke('openNewWindow', { url: nextUrl })
      isAndall || this.props.history.push(nextUrl)
    } else if (status === 2){  // 报告列表
      const {linkManId, userName} = getParams(pUrl)
      const setionData = getSetssion('linkMan')
      const locName = setionData && setionData.userName
      const theName = userName || locName || ''
      isAndall && andall.invoke('goReportTab', { linkManId : linkManId + '', userName: theName })
    } else {  // 报告详情  
      nextUrl += isAndall ? `/andall-report` + pUrl : pUrl
      isAndall && andall.invoke('openNewWindow', {url: nextUrl})
    }
  }

  closeMask = () => {
    this.setState({
      adPop: false,
    })
  }
  
  gotoDdPage = (url) => {
    BindSuccessPageCouponPopupGoto(url)
    setTimeout(() => {
      window.location.href = url
    }, 200)
  }

  render() {
    const { location: { state } } = this.props
    return (
      <Page title='绑定成功'>
        <div className={styles.success}>
          <div className={styles.msg}>
            <h2>绑定成功</h2>
          </div>

          <div className={`${styles.link}`}>
            <button className={`btn item ${styles.justBtn}`} onClick={this.toOther}>
              绑定其他样本
            </button>

            <button className={`btn item ${styles.justBtn}`} onClick={this.gotoThePage}>
              {state ? state.btnText : '查看列表'}
            </button>
          </div>

          <div className={`item ${styles.justBtn} ${styles.goBack}`} onClick={this.goBack}>
            <span>回到首页</span> <img src={back} className={styles.back} />
          </div>

          {this.state.adPop && state && state.alertBannerResp && <div className={styles.adbox} onClick={this.closeMask}>
            <div className={styles.adcon}>
              <span></span>
              <img 
                onClick={() => this.gotoDdPage(state.alertBannerResp.bannerJumpUrl)} 
                src={state.alertBannerResp.bannerPicUrl} 
                alt="nfriend_bg1"
              />
            </div>
          </div>}

          {state && state.bannerResp && state.bannerResp.length > 0 &&
            <div className={styles.adout}>
              <BannerRun banArr={state.bannerResp} viewType="bind_success_bottom" />
            </div>
          }
        </div>
      </Page>
    )
  }
}
