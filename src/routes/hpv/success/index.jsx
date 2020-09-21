import React from 'react'
import Page from '@src/components/page'
import Points from '@src/components/points/index'
import VideoShow from './VideoShow'
import fun from '@src/common/utils/index'
import ua from '@src/common/utils/ua'
import { trackPointFinishBindGoto, trackPointFinishBindJspopGoto, trackPointBindCompletePopWinGoto } from './BuriedPoint'
import images from './images'
import styles from './success'

const { isTheAppVersion, getSetssion, getParams } = fun

class Success extends React.Component {
  state = {
    isAndall: ua.isAndall(),
    adPop: true,
  }

  componentDidMount() {
    console.log(this.props)
    const getLinkBar = getSetssion('bindSuccess')
    const { linkManId } = getLinkBar

    andall.invoke('closeWebViewFlag', {})
    andall.invoke('bindComplete', {linkManId})
  }

  toOther = () => {
    trackPointFinishBindGoto({ viewtype: 'bind_new_barcode_goto' })
    if (isTheAppVersion('1.7.1')) {
      window.location.href = 'andall://andall.com/bind_view'
      return
    }
    this.props.history.push('/binding')
  }

  closeMask = () => {
    trackPointFinishBindJspopGoto({})
    this.setState({
      adPop: false,
    })
  }

  gotoDdPage = (url) => {
    const getLinkBar = getSetssion('bindSuccess')
    const { linkManId } = getLinkBar
    trackPointBindCompletePopWinGoto({ url: window.location.href, sample_linkmanid: linkManId })
    setTimeout(() => {
      window.location.href = url
    }, 200)
  }

  gotoThePage = () => {
    const { isAndall } = this.state
    const { location: { state } } = this.props
    const pUrl = state ? state.redirectUrl : ''
    const status = state && state.status ? state.status : 0
    let nextUrl = ''
    if (status === 1) { // 采样器列表
      trackPointFinishBindGoto({ viewtype: 'send_barcode_goto' })
      location.href = `${location.origin}/mkt/sampling`
    } else if (status === 2) { // 报告列表
      trackPointFinishBindGoto({ viewtype: 'reportlist_goto' })
      const { linkManId, userName } = getParams(pUrl)
      const setionData = getSetssion('linkMan')
      const locName = setionData && setionData.userName
      const theName = userName || locName || ''
      isAndall && andall.invoke('goReportTab', { linkManId: linkManId + '', userName: theName })
    } else { // 报告详情
      trackPointFinishBindGoto({ viewtype: 'report_goto' })
      nextUrl += isAndall ? `/mkt/report4_2` + pUrl : pUrl
      window.location.href = window.location.origin + nextUrl
    }
  }

  render() {
    const { location: { state } } = this.props
    const integral = state ? state.point : null
    const unlock = state ? state.unlock : false
    return (
      <Page title='绑定成功'>
        <div className={styles.guidebox}>
          {unlock ?
            <div className={styles.onlyBind}>
              <img src={images.bindingSuc} alt="" />
              <span>绑定成功</span>

              <div className={styles.btnbox}>
                <button onClick={this.toOther}>绑定其他样本</button>
                <button onClick={this.gotoThePage}>
                  {state && state.btnText ? state.btnText : '查看列表'}
                </button>
              </div>
            </div> :
            <React.Fragment>
              <h2>
                <img src={images.bindone} alt="" />
                <span>绑定成功</span>

                {integral && <div className={styles.points}>
                  <Points value={+integral} />
                </div>
                }
              </h2>
              <VideoShow from={1} />
            </React.Fragment>
          }

          {this.state.adPop && state && state.alertBannerResp &&
            <div className={styles.adbox} onClick={this.closeMask}>
              <div className={styles.adcon}>
                <span />
                <img
                  onClick={() => this.gotoDdPage(state.alertBannerResp.bannerJumpUrl)}
                  src={state.alertBannerResp.bannerPicUrl}
                  alt='nfriend_bg1'
                />
              </div>
            </div>}
        </div>
      </Page>
    )
  }
}

export default Success
