import React from 'react'
import { Toast } from 'antd-mobile'
import wxconfig from '@src/common/utils/wxconfig'
import { API, point, fun, ua } from '@src/common/app'
import { Page, Modal } from '@src/components'
import { trackPointYmlxView,
  trackPointYmlxGoto,
  trackPointYmlxNewOrderGoto,
  trackPointYmlxHYAccessView,
  trackPointYmlxCouponlistGoto,
  trackPointYmlxLandingpageShareGoto} from './buried-point'
import images from '@src/common/utils/images'
import styles from '../mkt'

import yunchan_img1 from '@static/yunchan/yunchan_img1.png'
import yunchan_img2 from '@static/yunchan/yunchan_img2.png'
import yunchan_img3 from '@static/yunchan/yunchan_img3.png'
import yunchan_img4 from '@static/yunchan/yunchan_img4.png'
import tochart from '@static/yunchan/tochart.png'
import toshareIcon from '@static/yunchan/toshareIcon.png'

const { bindOnly } = images
const { getParams } = fun
const DedailsPage = window.location.origin + '/order-details?orderId='

class Yunchan extends React.Component {
  state = {
    share: false,
    showRule: false,
    couponNum: 0,
    orderId: 0, 
    productId: 0,
    isFirst: true,
    shareUrl: '',
    loadingBtn: true,
  }

  componentDidMount () {
    const { sharedACPAToken = '' } = getParams()
    if(sharedACPAToken){
      const pointPara = {DeviceID: navigator.userAgent}
      trackPointYmlxHYAccessView(pointPara)
    }else{
      const pointPara ={view_type: getParams().viewType || '', client_type: 'app'}
      trackPointYmlxView(pointPara)
    }

    const infoPara = {noloading: 1}
    ua.isAndall() && Object.assign(infoPara, {clientType: 'app'})
    API.myInfo(infoPara).then(res => {
      const { code, data } = res
      if (!code) {
        this.setState({nickName: data.nickName})

        const { sharedACPAToken = '' } = getParams()
        API.getACPAActivInfo({sharedACPAToken}).then(rs => {
          const { code, data } = rs
          if(!code) {
            this.setState({
              ...data,
              loadingBtn: false
            })

            const {orderId, productId} = data
            if(!this.state.isFirst){
              orderId && this.props.history.push(`/succeed?hadGot=1&orderId=${orderId}`);
              orderId || this.props.history.push(`/editOrder?productId=${productId}&orderId=${orderId}`);
              return;
            }
          }
        });
      }
    })

    this.getShareUrl();
  }

  getShareUrl = () => {
    API.createShareUrl().then(res => {
      const { code, data } = res
      code && Toast.fail('信息获取失败', 3)
      if(!code) {
        this.setState({shareUrl: data})
        this.wxShare(data)
      }
    })
  }

  // 微信分享
  wxShare = (link) => {
    wxconfig({
      showMenu: true,
      params:{
        link,
        title: '领取这份贴心的礼物，给你的孕期添点运气',
        desc: `特别的你需要特别的呵护，让安我陪伴准妈咪度过一个无忧的孕哺旅程。好友 ${this.state.nickName || ''} 向你推荐 >>`,
        imgUrl: `${bindOnly}shareYunchan.png`,
      }
    })
  }

  toShare = () => {
    trackPointYmlxLandingpageShareGoto()

    const {shareUrl} = this.state
    if (ua.isAndall()) {
      setTimeout(() => {
        andall.invoke('share', {
          url: shareUrl,
          type: 'link',
          title: `领取这份贴心的礼物，给你的孕期添点运气`,
          text: `特别的你需要特别的呵护，让安我陪伴准妈咪度过一个无忧的孕哺旅程。好友 ${this.state.nickName || ''} 向你推荐 >>`,
          thumbImage:`${bindOnly}shareYunchan.png`,
          image:`${bindOnly}shareYunchan.png`,
        })
      }, 100)
    } else {
      this.setState({share: true});
    }
  }

  closeMask = () => {
    this.setState({
      share: false,
      adPop: false,
    })
  }
  
  modalToggle = (name) => {
    const bool = this.state[name]
    this.setState({
      [name]: !bool
    })
  }

  gotoConponList = () => {
    trackPointYmlxCouponlistGoto()

    if(ua.isAndall()) {
      andall.invoke('goCoupon')
      return
    }
    window.location.href = window.location.origin + '/coupon';
  }

  toOrder = () => {
    const pointPara = {DeviceID: navigator.userAgent}
    trackPointYmlxGoto(pointPara)

    const {orderId, productId, nickName} = this.state
    if(!nickName && ua.isAndall()){
      window.localStorage.setItem('token', '')
      andall.invoke('login', {}, (res) => {
        this.setState({isFirst: false}, () => {
          window.localStorage.setItem('token', res.result.token)
          window.location.reload()
        })
      })
    }else{
      this.props.history.push(`/editOrder?productId=${productId}&orderId=${orderId}`);
    }
  }

  toProgress = () => {
    trackPointYmlxNewOrderGoto()

    const {orderId} = this.state
    window.location.href = DedailsPage + orderId;
  }

  render () {
    const { showRule, share, couponNum, nickName, loadingBtn, status } = this.state;
    return (
      <Page title='安我助你平稳度过孕期'>
        <div className={`${styles.yunchan} ${showRule && styles.noscroll}`}>
          <div className={styles.topbox}>
            {nickName && +couponNum > 0 && <div className={styles.toLook} onClick={this.gotoConponList}>
              <img src={tochart} alt='tochart'/>
              <span>您已获得{couponNum}张优惠券</span>
              <span>去查看 ></span>
            </div>}

            <div className={styles.toHaveShare} onClick={this.toShare}>
              <img src={toshareIcon} alt='toshareIcon'/>
              <span>分享赢好礼</span>
            </div>
          </div>

          <div className={styles.bannerbox}>
            <img src={yunchan_img1} alt='yunchan_img1'/>
            <span onClick={() => this.modalToggle('showRule')}></span>
          </div>
          <img src={yunchan_img2} alt='yunchan_img2'/>
          <img src={yunchan_img3} alt='yunchan_img3'/>
          <img src={yunchan_img4} alt='yunchan_img4'/>

          <div className='foot' >
            {loadingBtn ? (<button className={`pinkBtn ${styles.foot}`}>加载中,请稍等...</button>) :
              nickName && status === 0 ?
              (<button disabled className={`pinkBtn ${styles.foot}`}>活动结束</button> ):
              (status === 1 ? 
              <button onClick={this.toOrder} className={`pinkBtn ${styles.foot}`}>立即领取</button> :
              <button onClick={this.toProgress} className={`pinkBtn ${styles.foot}`}>查看订单进度</button>)
            }
          </div>

          {share && <div className={styles.sharebox} onClick={this.closeMask}>
            <img src={`${bindOnly}nfriend_share.png`} alt="nfriend_share"/>
          </div>}

          {showRule &&
            <Modal
              handleToggle={() => { this.modalToggle('showRule') }}
              type
              visible={showRule}>
              <div className={styles.scanModal}>
                <h3>活动规则说明</h3>
                <p>1.每位孕妈仅可免费领取1份孕妈健康基因检测；</p>
                <p>2.可邀请好友参加该活动；</p>
                <p>3.已成功领取本次活动产品的孕妈，在活动期间，成功邀请好友点击链接，即可获得50元优惠券一张；</p>
                <p>4.孕妈活动所得的优惠券，可至“「安我生活」APP-我的-优惠券”进行查看；</p>
                <p>5.通过技术或非正常手段（包括但不限于恶意注册、利用程序漏洞等）获得奖励的用户，安我基因有权利取消该用户参与资格并回收其所有奖励，情节严重者将追究其法律责任；</p>
                <p>6.活动有效期至：{this.state.endTime}</p>
                <p>7.本次活动产品数量共计{this.state.limitNum}个，先到先得；</p>
                <p>8.本次活动最终解释权归安我基因所有；</p>
                <p>9.如有疑问可拨打客服电话：<br />400-682-2288</p>
              </div>
            </Modal>
          }
        </div>
      </Page>
    )
  }
}

export default Yunchan
