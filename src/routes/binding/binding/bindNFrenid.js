import React from 'react'
import { Page, Modal } from '@src/components'
import wxconfig from '@src/common/utils/wxconfig'
import images from '@src/common/utils/images'
import { API, fun, reg, point, ua } from '@src/common/app'
import andall from '@src/common/utils/andall-sdk'
import {
  trackPointBindNewUserGuideView,
  trackPointBindNewUserGuideShareGoto
} from '../buried-point'
import styles from './foronly'

const { bindOnly } = images
const { getParams } = fun
class BindNFrenid extends React.Component {
  state = {
    share: false,
    nickName: '',
    canShare: false
  }
  /**
   * 判断是否带有渠道信息
   * 有就请求授权接口，有授权信息就展示授权进度
   */
  componentDidMount() {
    trackPointBindNewUserGuideView()
    API.myInfo({ noloading: 1, clientType: 'app' }).then(res => {
      const { code, data } = res
      if (!code) {
        this.setState({ nickName: data.nickName })
      }
    })

    this.setState({
      canShare: getParams().canShare
    })

    ua.isAndall() || this.wxShare()
  }

  // 微信分享
  wxShare = () => {
    wxconfig({
      showMenu: true,
      params:{
        title: '简单三步，完成基因检测',
        desc: `好友${this.state.nickName}分享给你，立即查看>>`,
        link: `${window.location.origin}/bindNFrenid?canShare=no`,
        imgUrl: `${bindOnly}shareimg.png`,
      }
    })
  }

  toShare = () => {
    trackPointBindNewUserGuideShareGoto()
    if (ua.isAndall()) {
      setTimeout(() => {
        andall.invoke('share', {
          type: 'link',
          title: `简单三步，完成基因检测`,
          text: `好友${this.state.nickName}分享给你，立即查看>>`,
          url: `${window.location.origin}/bindNFrenid?canShare=no`,
          thumbImage:`${bindOnly}shareimg.png`,
          image:`${bindOnly}shareimg.png`,
        })
      }, 100)
    } else {
      this.setState({ share: true })
    }
  }

  closeMask = () => {
    this.setState({ share: false })
  }

  render() {
    return (
      <Page title='绑定采样器'>
        <div className={styles.nfriend}>
          <img src={`${bindOnly}nfriend_bg1.png`} alt='nfriend_bg1' />
          <img src={`${bindOnly}nfriend_bg2.png`} alt='nfriend_bg2' />
          <img src={`${bindOnly}nfriend_bg3.png`} alt='nfriend_bg3' />

          {!this.state.canShare && <button onClick={this.toShare}>分享给TA</button>}

          {this.state.share && <div className={styles.sharebox} onClick={this.closeMask}>
            <img src={`${bindOnly}nfriend_share.png`} alt='nfriend_share' />
          </div>}
        </div>
      </Page>
    )
  }
}
// BindNFrenid.propTypes = {
//   history: propTypes.object.isRequired
// }
export default BindNFrenid
