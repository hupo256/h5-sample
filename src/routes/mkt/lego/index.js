import React from 'react'
import { API, fun, ua } from '@src/common/app'
import Page from '@src/components/page/index'
import wxconfig from '@src/common/utils/wxconfig'
import { observer, inject } from 'mobx-react'

import CountDown from './CountDown';
import BootBtn from './BootBtn';
import RulePop from './RulePop';
import AnimateBox from './AnimateBox';
import CouponPop from './CouponPop';
import { MyLoader } from './MyLoader';
import { ZlLandingpageView } from './BuriedPoint';

import images from '@src/common/utils/images'
import styles from './yunchan.scss'

const { lego } = images
const { getParams } = fun

@inject('legoStore')
@observer
class LegoBox extends React.Component {
  state = {
    showRule: false,
    sharePop: false,
    showQrCode: false,
    showCoupon: false,
    mobileNo: '',
    isAndall: ua.isAndall(),
  }

  componentDidMount () {
    console.log(this.props)
    const { legoStore } = this.props
    const { data } = legoStore
    const { activCode='yunchan', attendRecordId } = getParams()
    const params = {};
    activCode && Object.assign(params, {activCode})
    attendRecordId && Object.assign(params, {attendRecordId})
    legoStore.getActivInfoByActivId(params)
    .then(res =>{
      const { activeData, shareData } = data
      const { status, showCouponFlag, productId } = activeData
      if(status === 4 || status === 3){
        window.history.replaceState({activCode}, '', `/mkt/yunchan-succeed?activCode=${activCode}`);
        window.location.reload();
        return
      }
      if(status === 8) {
        window.history.replaceState({activCode}, '', `/mkt/yunchan-timeout?activCode=${activCode}`);
        window.location.reload();
        return
      }
      showCouponFlag && this.setState({ showCoupon: true })
      if(!this.state.isAndall && status < 5) this.wxShare(shareData)
      if(status === 2) this.getUserInfor()
      
      // 埋点
      const pointPara = {
        client_type: this.state.isAndall ? 'app' : 'h5',
        view_type: getParams().viewType,
        product_id: productId,
        user_state: status,
        activity_code: activCode
      }
      ZlLandingpageView(pointPara)

      // 优化加载
      // this.rearchPageCon(activeData.pageHeadImgUrl ? activeData.pageHeadImgUrl : '')
    })
  }

  // 显示页面内容
  rearchPageCon = (url) => {
    const img = document.createElement('img')
    img.src = url
    img.onload = (e) => {
      console.log(e)
    }
  }

  // 微信分享
  wxShare = (param) => {
    // console.log(param)
    setTimeout(() => {
      wxconfig({
        showMenu: true,
        params:{
          link: param.shareUrl,
          title: param.title,
          desc: param.subTitle,
          imgUrl: param.headImg,
        }
      })
    }, 200)
  }

  toShare = () => {
    const { isAndall } = this.state
    const { legoStore: {data: {shareData}} } = this.props
    if (isAndall) {
      setTimeout(() => {
        andall.invoke('share', {
          type: 'link',
          url: shareData.shareUrl,
          title: shareData.title,
          text: shareData.subTitle,
          thumbImage: shareData.headImg,
          image: shareData.headImg,
        })
      }, 200)
    } else {
      this.setState({sharePop: true});
    }
  }

  getUserInfor = () => {
    const infoPara = {noloading: 1}
    ua.isAndall() && Object.assign(infoPara, {clientType: 'app'})
    API.myInfo(infoPara).then(res => {
      // console.log(res)
      const {code, data} = res
      if(!code) this.setState({mobileNo: data.mobileNo})
    })
  }

  closeMask = (bool) => {
    const { legoStore: {data: {activeData}} } = this.props
    const { status } = activeData || {}
    this.setState({
      sharePop: false,
      showQrCode: false,
      showCoupon: false,
    })
    if(status === 5) window.location.reload()   //请求完成后重新加载
    if(bool) this.toShowQrCode()
  }

  toShowQrCode = (bool) => {
    if(bool) {
      this.setState({showQrCode: true})
      return
    }

    // 是否弹出二维码
    if(!this.state.isAndall) {
      API.getSubscribe().then(res => {
        this.setState({ showQrCode: !(res && res.data) })
      })
    }
  }

  modalToggle = (name) => {
    const bool = this.state[name]
    this.setState({
      [name]: !bool
    })
  }

  touchTimeTit = (status) => {
    switch(status){
      case 0:
        return '助力待开始'
      case 2:
        return '助力成功'
      case 7:
        return '助力已完成'
      default:
        return '距助力结束还有';
    }
  }

  creatAssisList = (list) => {
    const len = list.length
    const defaultAss = {nickName: '等待助力', url: `${lego}addIcon.png`}
    const num = 3 - len
    const arr = list.concat()
    for (let i=0; i<num; i += 1) {
      arr.push(defaultAss)
    }
    return arr
  }

  timeOver = () => {
    window.location.reload()
  }

  render () {
    const { showRule, sharePop, showQrCode,  showCoupon } = this.state
    const { legoStore: { data:{loading, activeData, shareData, qrCodeData} }} = this.props
    let { status, pageHeadImgUrl, pageDetailImgUrl = [], headUrl, nickName, activName,
      countDown, activUserAssistRecordRespList = [], remark, shareRecordRespList } = activeData
    const AssistLen = activUserAssistRecordRespList ? activUserAssistRecordRespList.length : 0
    nickName || (nickName = '--')
    const shareList = shareRecordRespList ? shareRecordRespList.slice() : []
    return (
      <Page title={activName ? activName : '请稍等...'}>
        {loading ? <MyLoader /> : 
        <div className={ `${(showRule || sharePop || showQrCode) ? styles.noscroll : ''} ${styles.lego}`}>
          <div className={styles.banbox}>
            <img src={pageHeadImgUrl} alt="banbg" />

            <div>
              <div className={styles.tipsbox}>
                {/* 跑马灯动画 */}
                {activeData && shareList.length> 0 && <AnimateBox list={shareList} />}

                <div className={styles.ruleTit}>
                  <img src={`${lego}tips.png`} />
                  <span onClick={() => this.modalToggle('showRule')}>助力功略</span>
                </div>
              </div>

              <div className={`${styles.ownerBox} ${status === 0 ? styles.opcity0 : ''}`}>
                <img src={headUrl ? headUrl : `${lego}defaultImg.png`} />
                <span>{`${(status === 5 || status === 6) ? nickName + ' 邀请你参加' : nickName}`}</span>
              </div>

              {/* 倒计时 */}
              <div className={styles.timebox}>
                {(status === 0 || status === 2 || status === 7) ? 
                  <h3 className={styles.outTime}>{this.touchTimeTit(status)}</h3> : 
                  <React.Fragment>
                    <h3>{this.touchTimeTit(status)}</h3>
                    {countDown && <CountDown timeLen={countDown} timeOver={()=>this.timeOver()}/>}
                  </React.Fragment>
                }
              </div>
              
              {/* 已助力们 */}
              <div className={styles.assisBox}>
                <h3>{`${AssistLen === 3 ? '好友已助力成功' : AssistLen+' 位好友已助力'}`}</h3>
                <ul>
                  {this.creatAssisList(activUserAssistRecordRespList || []).map((ass, index) =>{
                    const {nickName, url} = ass
                    const tex = nickName.length > 5 ? `${nickName.slice(0, 4)}...` : nickName
                    return <li key={index}>
                      <span><img src={url} /></span>
                      <span>{tex}</span>
                    </li>
                  })}
                </ul>
              </div>
             </div>
          </div>

          {pageDetailImgUrl && pageDetailImgUrl.length > 0 && 
            pageDetailImgUrl.map((img,ind) => <img key={ind} src={img} />)
          }
          
          {/* 底部按钮 */}
          {(status || status === 0) && 
            <BootBtn {...this.state} {...this.props} toShare={this.toShare} toShowQrCode={this.toShowQrCode} />
          }

          {/* 引导分享 */}
          {sharePop && <div className={styles.sharebox} onClick={() => this.closeMask(true)}>
            <img className={styles.gotoShare} src={`${lego}nfriend_share.png`} alt="nfriend_share"/>
          </div>}

          {/* 二维码 */}
          {showQrCode  && <div className={styles.sharebox}  onClick={() => this.closeMask()}>
            <div className={styles.closebox}>
              <img src={status === 5 ? (qrCodeData && qrCodeData.imgUrl) : (shareData && shareData.imgUrl)} alt="qrcode"/>
              <img src={`${lego}close.png`} alt="close"/>
            </div>
          </div>}

          {/* 优惠券 */}
          {/* {!!showCoupon && 
            <CouponPop {...activeData} closeMask={this.closeMask} />
          } */}

          {/* 活动规则 */}
          {showRule && remark && 
            <RulePop remark={remark} showRule modalToggle={this.modalToggle}/>
          }

        </div>}
      </Page>
    )
  }
}
export default LegoBox
