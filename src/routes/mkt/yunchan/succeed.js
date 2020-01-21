import React from 'react'
import wxconfig from '@src/common/utils/wxconfig'
import { API, point, fun, ua } from '@src/common/app'
import { Page } from '@src/components'
import { trackPointYmlxSuccessView, trackPointYmlxSuccessShareGoto, trackPointYmlxOrderDetailGoto} from './buried-point'
import images from '@src/common/utils/images'
import styles from '../mkt'
import suceed from '@static/yunchan/suceed.png'

const { bindOnly } = images
const { getSetssion, getParams } = fun
const { allPointTrack } = point

class Yunchan extends React.Component {
  state = {
    share: false,
    shareUrl: '',
    hadGot: false,
  }
  componentDidMount () {
    const pointPara ={order_id: getParams().orderId}
    trackPointYmlxSuccessView(pointPara)

    const {hadGot} = getParams()
    this.setState({hadGot})
    const infoPara = {noloading: 1}
    ua.isAndall() && Object.assign(infoPara, {clientType: 'app'})
    API.myInfo(infoPara).then(res => {
      const { code, data } = res
      if (!code) this.setState({nickName: data.nickName})
    })

    this.getShareUrl();
  }

  getShareUrl = () => {
    API.createShareUrl().then(res => {
      console.log(res)
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
    trackPointYmlxSuccessShareGoto()

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
    })
  }

  gotoDetails = () => {
    trackPointYmlxOrderDetailGoto()
    window.location.href = window.location.origin + '/order-details?orderId=' + getParams().orderId;
  }

  render () {
    const {hadGot, share} = this.state;
    return (
      <Page title='领取成功'>
        <div className={styles.sucBox}>
          <img src={suceed} alt='suceed'/>
          <h2>{hadGot ? '您已领取过该产品' : '领取成功'}</h2>
          <div className={styles.btnbox}>
            <button onClick={this.toShare}>分享赢好礼</button>
          </div>
          <p className={styles.fccc}>邀请好友分享“好孕”，即可得50元优惠券1张</p>

          <div className={styles.btnbox}>
            <button className={styles.whiteBtn} onClick={this.gotoDetails}>查看订单进度</button>
          </div>

          {share && <div className={styles.sharebox} onClick={this.closeMask}>
            <img src={`${bindOnly}nfriend_share.png`} alt="nfriend_share"/>
          </div>}
        </div>
      </Page>
    )
  }
}

export default Yunchan
