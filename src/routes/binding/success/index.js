import React from 'react'
import Page from '@src/components/page'
import { fun, ua, API } from '@src/common/app'
import styles from '../binding'
import { observer, inject } from 'mobx-react'
import andall from '@src/common/utils/andall-sdk'
import BannerRun from '../../sampling/status/bannerRun'
import {
  trackPointBindCompletePopWinView, trackPointBindCompletePageBannerGoto, trackPointFinishBindView,
  trackPointFinishBindGoto, trackPointFinishBindJspopView, trackPointFinishBindJspopGoto, trackPointBindCompletePopWinGoto
} from '../buried-point'
import back from '@static/back_right.png'
import images from '../image'
import BannerItem from '../components/bannerItem'
import { Toast } from 'antd-mobile'
import Points from '@src/components/points'
const { getSetssion, getParams } = fun

export default class Success extends React.Component {
  state = {
    inviteFlag: true,
    inviteModal: {},
    isAndall: ua.isAndall(),
    adPop: true,
    getData: {},
    setTitle: '',
    getIds: [],
    answerVisible: false
  }
  componentDidMount() {
    let inviteModal = getSetssion('inviteModal')
    if (inviteModal) {
      this.setState({ inviteModal })
    }
    this.handleSuccessBindSuccess()
    //

    // 返回触发回到首页
    andall.invoke('closeWebViewFlag', {})
    trackPointFinishBindView({})
    localStorage.removeItem('barcode')
    localStorage.removeItem('kitType')
    localStorage.removeItem('sampling')
  }

  handleSuccessBindSuccess = () => {
    const { location: { state } } = this.props

    const getLinkBar = getSetssion('bindSuccess')
    const { linkManId, barcode } = getLinkBar
    // const linkManId = "2928755213812736"
    // const barcode = "AA190309LY0988"
    // 通知app刷新新增绑定用户
    andall.invoke('bindComplete', { linkManId })
    if (this.state.adPop && state && state.alertBannerResp) {
      trackPointBindCompletePopWinView({ url: window.location.href, sample_linkmanid: linkManId })
    }
    API.getBindSuccessBanner({ linkManId, barCode: barcode }).then(({ data }) => {
      let setTitle
      if (data.headImgType === 1 || data.headImgType === 2) {
        setTitle = `${data.userName}的健康成长还需关注以下问题：`
      } else {
        setTitle = `${data.userName}的美好生活还需关注以下问题:`
      }
      this.setState({
        setTitle,
        getData: data,
        productListVisible: data.productList.length > 0
      })
    })
  }

  handFinishBindGoto = (params) => {
    trackPointFinishBindGoto(params)
  }

  goBack = () => {
    andall.invoke('back')
  }

  toOther = () => {
    const { isAndall } = this.state
    trackPointFinishBindGoto({ viewtype: 'bind_new_barcode_goto' })
    isAndall && andall.invoke('openNewWindow', { url: '/mkt/binding' })
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
      console.log(22)
      trackPointFinishBindGoto({ viewtype: 'send_barcode_goto' })
      // isAndall && andall.invoke('openNewWindow', { url: nextUrl })
      // isAndall || this.props.history.push(nextUrl)
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
      nextUrl += isAndall ? `/andall-report` + pUrl : pUrl
      isAndall && andall.invoke('openNewWindow', { url: nextUrl })
    }
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

  compareVersion = (version1, version2) => {
    const arr1 = version1.split('.')
    const arr2 = version2.split('.')
    const length1 = arr1.length
    const length2 = arr2.length
    const minlength = Math.min(length1, length2)
    let i = 0
    for (i; i < minlength; i++) {
      let a = parseInt(arr1[i])
      let b = parseInt(arr2[i])
      if (a > b) {
        return 1
      } else if (a < b) {
        return -1
      }
    }
    if (length1 > length2) {
      for (let j = i; j < length1; j++) {
        if (parseInt(arr1[j]) != 0) {
          return 1
        }
      }
      return 0
    } else if (length1 < length2) {
      for (let j = i; j < length2; j++) {
        if (parseInt(arr2[j]) != 0) {
          return -1
        }
      }
      return 0
    }
    return 0
  }

  unlockMore = () => {
    const { getIds } = this.state
    if (getIds.length < 1) {
      Toast.info('请选择解锁项目')
      return false
    }
    let compareCurrentVersion = -2
    if (ua.isAndall()) {
      compareCurrentVersion = this.compareVersion(andall.info.version, '1.6.6')
    }
    let productList = []
    for (let i = 0; i < getIds.length; i++) {
      productList.push({ productId: getIds[i], productNum: 1 })
    }
    if (compareCurrentVersion > -1) {
      trackPointFinishBindGoto({ viewtype: 'BuyRecentProduct_goto' })
      const getLinkBar = getSetssion('bindSuccess')
      const { linkManId } = getLinkBar
      const params = {
        linkManId,
        productList,
        actualType: 2
      }
      andall.invoke('confirmOrder', params)
    } else {
      Toast.info('请先升级软件版本!')
      return false
    }
  }

  goToBuyAll = () => {
    trackPointFinishBindGoto({ viewtype: 'Buy299_goto' })
    window.location.href = 'andall://andall.com/unlock_tab'
  }

  showTip = () => {
    this.setState({
      answerVisible: true
    })
    trackPointFinishBindJspopView({})
    trackPointFinishBindGoto({ viewtype: 'jsbottom_goto' })
  }

  render() {
    const { location: { state } } = this.props
    const { getData: { productList }, setTitle, answerVisible, getIds, productListVisible } = this.state
    return (
      <Page title='绑定成功'>
        <div className={styles.success}>
          <div className={styles.msg}>
            <img className={styles.successIcon} src={images.success} />
            <h2>绑定成功</h2>
            {
              state.point
                ? <div className={styles.points}>
                  <Points value={state.point} />
                </div>
                : ''
            }
            <div className={`${styles.link}`}>
              <div className={`${styles.justBtn}`} onClick={this.toOther}>
                绑定其他样本
              </div>

              <div className={`${styles.justBtn}`} onClick={this.gotoThePage}>
                {state && state.btnText ? state.btnText : '查看列表'}
              </div>
            </div>
          </div>

          {/* banner内容 */}

          {
            productListVisible &&
            <div className={styles.bannerWrap}>
              <h2>{setTitle}<span /></h2>
              <BannerItem itemList={productList || []} prop={this} />
            </div>
          }

          {/* <div className={styles.bigBanner}>
              <img src={`${bindSuccess}banner1@2x.png`} />
            </div> */}
          {
            productListVisible &&
            <div className='foot' style={{ height: '100px' }}>
              <div className={styles.levitateWrap}>
                <div className={styles.qaWrap}>
                  <p className={styles.qa} onClick={() => { this.showTip() }}>什么是解锁</p>
                </div>
                <div className={styles.btnWrap}>
                  <div className={styles.unlockBtn} onClick={() => { this.goToBuyAll() }}>一键解锁更多报告</div>
                  <div className={styles.unlockBtn} onClick={() => { this.unlockMore() }}>先解锁这些试试</div>
                  {/* <div className={`${styles.noChooseBtn}`}>先解锁这些试试</div> */}
                </div>
              </div>
            </div>

          }

          {/* <div className={`item ${styles.justBtn} ${styles.goBack}`} onClick={this.goBack}>
            <span>回到首页</span> <img src={back} className={styles.back} />
          </div> */}

          {this.state.adPop && state && state.alertBannerResp && <div className={styles.adbox} onClick={this.closeMask}>
            <div className={styles.adcon}>
              <span />
              <img
                onClick={() => this.gotoDdPage(state.alertBannerResp.bannerJumpUrl)}
                src={state.alertBannerResp.bannerPicUrl}
                alt='nfriend_bg1'
              />
            </div>
          </div>}

          {state && state.bannerResp && state.bannerResp.length > 0 &&
            <div className={`${styles.adout} ${!productListVisible ? styles.marginTop : styles.marginNTop}`}>
              <BannerRun banArr={state.bannerResp} viewType='bind_complete_page_banner_goto' />
            </div>
          }

          {answerVisible && (
            <div className={styles.answerWrap} onClick={() => this.setState({ answerVisible: false })}>
              <div className={styles.answer}>
                <h3>什么是解锁</h3>
                <p>如果您已收到第一份基因检测报告，解锁即代表您授权安我基因对您的原始生物数据进行再次解读（无需再次采集唾液），生成对应产品的检测报告。如果您是新用户，解锁即为下单购买该项基因检测服务。</p>
                <span />
              </div>
            </div>
          )}
        </div>
      </Page>
    )
  }
}
