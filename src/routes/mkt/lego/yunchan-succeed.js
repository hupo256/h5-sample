import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import wxconfig from '@src/common/utils/wxconfig'
import Page from '@src/components/page'
import { API, fun, ua } from '@src/common/app'
import RulePop from './RulePop';
import { ZlSuccessView,
  ZlSuccessBannerGoto,
  ZlSuccessCheckGoto,
  ZlSuccessShareGoto} from './BuriedPoint';
import images from '@src/common/utils/images'
import styles from '../mkt'
const { lego } = images
const { getParams } = fun

@inject('legoStore')
@observer
class Succeed extends Component {
  state = {
    sharePop: false,
    showRule: false,
    isAndall: ua.isAndall(),
  }

  componentDidMount () {
    console.log(this.props)
    const { legoStore } = this.props
    const { data } = legoStore
    let { activCode } = getParams()
    activCode = activCode || 'yunchan'
    legoStore.getActivInfoByActivId({activCode})
    .then( () => {
      const { activeData } = data
      if(!this.state.isAndall && activeData.status < 5) this.wxShare(data.shareData)

      // 埋点
      const pointPara = {
        product_id: active.data.productId,
        user_state: active.data.status
      }
      ZlSuccessView(pointPara)
    })
  }

  updateUrl = (url, key='attendRecordId') => {
    return url.split(key)[0].slice(0, -1)
  }

  // 微信分享
  wxShare = (param) => {
    setTimeout(() => {
      wxconfig({
        showMenu: true,
        params:{
          link: this.updateUrl(param.shareUrl),
          title: param.title,
          desc: param.subTitle,
          imgUrl: param.headImg,
        }
      })
    }, 600)
  }

  toShare = () => {
    const { legoStore: {data: {shareData, activeData}} } = this.props
    const { isAndall } = this.state
    //  埋点
     const pointPara = {
      client_type: isAndall ? 'app' : 'h5',
      product_id: activeData.productId,
      user_state: activeData.status,
    }
    ZlSuccessShareGoto(pointPara)

    if (isAndall) {
      setTimeout(() => {
        andall.invoke('share', {
          type: 'link',
          url: this.updateUrl(shareData.shareUrl),
          title: shareData.title,
          text: shareData.subTitle,
          thumbImage: shareData.headImg,
          image: shareData.headImg,
        })
      }, 100)
    } else {
      this.setState({sharePop: true});
    }
  }

  closeMask = (bool) => {
    this.setState({
      sharePop: false,
    })
  }

  createBtnText = (status) => {
    let tex = status === 3 ? '跟踪订单详情' : '查看报告'
    tex = !this.state.isAndall ? '下载APP，' + tex : tex
    return tex
  }

  gotoNextPage = (status) => {
    const { isAndall } = this.state
    const { legoStore: {data: {activeData}} } = this.props
    // 埋点
    const pointPara = {
      client_type: isAndall ? 'app' : 'h5',
      product_id: activeData.productId,
      user_state: activeData.status,
      button_type: status === 3 ? 'orderlist' : 'report'
    }
    ZlSuccessCheckGoto(pointPara)

    const {origin} = location
    if(isAndall) {
      if(status === 3){  //订单详情
        const {orderId} = this.props.location.state
        window.location.href = window.location.origin + `/order-details?orderId=${orderId}`
      } else {  // 报告列表
        andall.invoke('getLinkMan', {}, res => {
          const {linkManId, userName} = res.result
          andall.invoke('goReportTab', {linkManId, userName})
        })
      }
    } else {
      window.location.href = `${origin}/download-app`
    }
  }

  PointTrack = () => {
    const { legoStore: {data: {activeData}} } = this.props
    const nextUrl = activeData.nextActivConfig ? activeData.nextActivConfig.activUrl : ''
    const productId = activeData.nextActivConfig ? activeData.nextActivConfig.productId : ''
    // 埋点
    const pointPara = {
      product_id: productId,
      URL: nextUrl
    }
    ZlSuccessBannerGoto(pointPara)

    setTimeout(() => {
      window.location.href = nextUrl
    }, 200)
  }

  modalToggle = (name) => {
    const bool = this.state[name]
    this.setState({
      [name]: !bool
    })
  }

  render () {
    const { showRule, sharePop } = this.state
    const { legoStore: {data:{activeData}}} = this.props
    const { status, nextActivConfig, remark } = activeData
    return (
      <Page title='领取成功'>
        <div className={styles.sucBox}>
          <div className={styles.sucImg}>
            <img src={activeData && activeData.pageHeadImgUrl} styles={styles.sucbg} alt='sucImg' />
            <div className={styles.sucinner}>
              <img onClick={this.toShare} src={`${lego}toshareEnd.png`} />

              <div className={styles.ruleTit}>
                <img src={`${lego}tips.png`} />
                <span onClick={() => this.modalToggle('showRule')}>助力功略</span>
              </div>
            </div>
          </div>

          {
            nextActivConfig && 
            <div className={styles.babybg} onClick={() => this.PointTrack()}>
              <img src={nextActivConfig.activPicUrl} className={styles.babyback} alt='babyImg' />
            </div>
          }

          <div className='foot'>
            <button 
              className={styles.sucbottom}
              onClick={() => status && this.gotoNextPage(status)}
            >{status && this.createBtnText(status)}</button>
          </div>

          {sharePop && <div className={styles.sharebox} onClick={() => this.closeMask(true)}>
            <img className={styles.gotoShare} src={`${lego}nfriend_share.png`} alt="nfriend_share"/>
          </div>}

          {/* 活动规则 */}
          {showRule && remark && 
            <RulePop remark={remark} showRule modalToggle={this.modalToggle}/>
          }
        </div>
      </Page>
    )
  }
}
export default Succeed
