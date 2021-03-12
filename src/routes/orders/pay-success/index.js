import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Page, FxzEntry, InviteOrder } from '@src/components'
import { API, fun, images, config } from '@src/common/app'
import BannerRun from './bannerRun'
import SuspensionWindow from './suspensionWindow'
import img from '@static/wx.png'
import styles from '../order'
import {
  trackPointToolOrderSuccessPageView,
  trackPointOrderCompletePageView,
  trackPointOrderCompletePopWinView,
  trackPointOrderCompletePageButtonGoto
} from '../buried-point'
const { getParams, getSetssion, setSetssion } = fun
const { xinguan } = images

const descText = {
  'orderSubmit': '我们将会尽快邮寄采样器',
  'unlockSubmit': '查看订单详情'
}
const { hostName } = config
console.log(hostName)

class PaySuccess extends React.Component {
  state = {
    list: [],
    noData: false,
    type: '',
    orderId: '',
    inviteFlag: true,
    inviteModal: {},
    frameList: [],
    setViewType:'buy',
    windowsList:[],
    isUnlockLand: false
  }

  // buyType = 1,标品，2解锁标品，3解锁卡片，4新户系列购买
  componentDidMount() {
    const { orderId, type, docterid, buyType, pageSource, activeCode, getType = '', flag } = getParams()
    if (flag === 'unlockLand') {
      this.setState({
        isUnlockLand: true
      })
    }
    const buyFlag = (+buyType !== 2 && +buyType !== 3) ? 1 : 2
    getSetssion('medical') && this.setState({ medical: true })
    let inviteModal = getSetssion('inviteModal')
    if (inviteModal) {
      this.setState({ inviteModal })
    }
    this.setState({ orderId, type, docterid, buyType })

    API.orderPaySuccess({ orderId, buyFlag }).then(res => {
      const { code, data } = res
      if (!code) {
        const { frameList, advertRecommendList, windowsList } = data
        trackPointOrderCompletePopWinView({
          business_type: getType ? ((+getType === 1 || +getType === 3) ? 'test' : 'unlock') : pageSource === 'orderSubmit' ? 'test' : 'unlock',
          order_id: orderId,
          url: frameList && frameList.length && frameList[0].jumpUrl,
          active_code:activeCode || ''
        })
        this.setState({
          advertRecommendList, frameList, windowsList
        })
      }
    })

    if (buyType === 1 || buyType === 4) {
      this.setState({
        setViewType:'unlocak'
      })
    }
    const { setViewType } = this.state
    trackPointToolOrderSuccessPageView({ viewtype:setViewType })
    let params = {
      business_type: pageSource === 'orderSubmit' ? 'test' : 'unlock',
      order_id: orderId,
      active_code:activeCode || ''
    }
    trackPointOrderCompletePageView(params)
  }

  /* 根据下单路由来源 渲染按钮
   * 如果是开通vip 只显示查看我的会员按钮
  */
  handleGoToLink = (value, url) => {
    const { orderId, pageSource, activeCode, getType } = getParams()
    trackPointOrderCompletePageButtonGoto({
      business_type: getType ? ((+getType === 1 || +getType === 3) ? 'test' : 'unlock') : pageSource === 'orderSubmit' ? 'test' : 'unlock',
      order_id: orderId,
      Btn_name: value,
      url,
      active_code:activeCode || ''
    })

    window.history.replaceState({}, '', `${origin}/download-app`)
    window.location.reload()
  }
  renderLinkBtn = (str) => {
    const { orderId, buyType, medical, advertRecommendList, setViewType, isUnlockLand } = this.state
    const { channelCode, barCode, pageSource, activeCode } = getParams()
    let _el = ''

    if (str === 'orderSubmit') {
      _el = (
        <div>
          <div className={`flex ${styles.payBox}`}>
            <a onClick={() => this.handleGoToLink('to_order_list', `${hostName}/andall-report/order-details?orderId=${orderId}`)} className='item'>
              <span className={`flex ${styles.btn} mb14`}>查看详情</span>
            </a>
            <span />
            {
              channelCode && barCode ? (
                <Link to={`/binding?channelCode=${channelCode}&barCode=${barCode}`} className='item'>
                  <span className={`flex ${styles.btn} ${styles.fillBtn}`}>去绑定</span>
                </Link>
              ) : (
                <a onClick={() => this.handleGoToLink('to_buy_list', `${hostName}/download-app`)} className='item'>
                  <span className={`flex ${styles.btn} ${styles.fillBtn}`}>前往商城</span>
                </a>
              )
            }
          </div>

          <div className={styles.audit}>
            {/* <a href={`${origin}/andall-sample/xinguan?viewType=SuccessPay&activeCode=NCOV20200208`}>
              <img src={`${xinguan}xgban.png`} />
            </a> */}

            {advertRecommendList && advertRecommendList.length > 0 &&
            <BannerRun banArr={advertRecommendList} viewtype={setViewType} pageSource={pageSource} orderId={orderId} activeCode={activeCode} />
            }
          </div>

        </div>
      )
    }

    if (str === 'unlockSubmit') {
      +buyType === 5 ? _el = (
        <div>
          <span onClick={() => this.handleGoToLink('to_report', `${hostName}/andall-report/?opened=success`)} >
            <span className={`flex ${styles.btn} ${styles.fillBtn}`}>查看我的解锁</span>
          </span>
          {
            medical
              ? ''
              : (isUnlockLand ? '' : <FxzEntry viewtype={4} />)
          }
        </div>
      ) : _el = (
        <div>
          <div className={`flex ${styles.payBox}`}>
            <span to={`/report?viewtype=1`} className='item' onClick={() => this.handleGoToLink('to_report', `${hostName}/andall-report/report?viewtype=1`)}>
              <span className={`flex ${styles.btn} mb14`}>查看已购报告</span>
            </span>
            <span to={`/?viewtype=1`} className='item' onClick={() => this.handleGoToLink('to_unlock_list', `${hostName}/andall-report/?viewtype=1`)}
            >
              <span className={`flex ${styles.btn} ${styles.fillBtn}`}>继续解锁</span>
            </span>
          </div>
          <FxzEntry viewtype={4} />
        </div>
      )
    }

    return _el
  }

  changeInvite = () => {
    this.setState({
      inviteFlag: false
    })
    let inviteModal = this.state.inviteModal
    inviteModal.paySuccess = true
    // true表示不再弹出支付邀请好友的页面
    setSetssion('inviteModal', inviteModal)
    this.setState({
      inviteFlag: false,
      inviteModal
    })
  }
  showTips = () => {
    const str = getParams().pageSource || 'orderSubmit'
    const { channelCode, barCode } = getParams()
    const { orderId, type } = this.state
    if (channelCode && barCode) {
      return <span className={`${styles.linkDetail}`} />
    } else {
      if (str === 'orderSubmit') {
        return (
          <span className={`${styles.linkDetail}`}>{descText[str]}</span>
        )
      } else {
        return (
          <Link to={`/orders/${+type ? 'unlock-details' : 'order-details'}?orderId=${orderId}&jumpType=1`}>
            <span className={`${styles.linkDetail}`}>{descText[str]}</span>
          </Link>
        )
      }
    }
  }
  render() {
    const { docterid, inviteFlag, inviteModal, medical, frameList, setViewType, windowsList, isUnlockLand } = this.state
    const str = getParams().pageSource || 'orderSubmit'
    const orderId = getParams().orderId || ''
    const activeCode = getParams().activeCode || ''
    return (
      <Page title='支付成功'>
        <div className={styles.paySuccess}>
          <div className={styles.successImg} />
          <p className={styles.successTxt}>支付成功</p>
          {
            this.showTips()
          }
          {
            docterid ? (
              <div className={styles.wechate}>
                <p>扫描下方二维码</p>
                <p>关注公众号，查看订单</p>
                <img src={img} />
                <p>安我AndALL</p>
              </div>
            ) : (
              <div>{this.renderLinkBtn(str)}</div>
            )
          }
          <a className={styles.contact} href={`tel:4006822288`}>联系客服</a>

          {/*{ inviteFlag && frameList && frameList.length > 0 &&*/}
          {/*<InviteOrder popData={frameList[0]} changeInvite={this.changeInvite} viewtype={setViewType} pageSource={str} orderId={orderId} activeCode={activeCode} />*/}
          {/*}*/}
          { windowsList && windowsList.length > 0 &&
          <SuspensionWindow viewtype={setViewType} popData={windowsList[0]} />
          }
        </div>
      </Page>
    )
  }
}
PaySuccess.propTypes = {
  history: PropTypes.object.isRequired,
}
export default PaySuccess
