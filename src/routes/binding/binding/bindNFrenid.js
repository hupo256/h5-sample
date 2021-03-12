import React from 'react'
import Page from '@src/components/page'
import wxconfig from '@src/common/utils/wxconfig'
import { API, fun, reg, point, ua } from '@src/common/app'
import andall from '@src/common/utils/andall-sdk'
import {
  trackPointBindNewUserGuideView,
  trackPointBindNewUserGuideShareGoto
} from '../buried-point'
import styles from './foronly'

import shareimg from '@static/bindOnly/shareimg.png'
import nfriend_bg1 from '@static/bindOnly/nfriend_bg1.png'
import nfriend_bg2 from '@static/bindOnly/nfriend_bg2.png'
import nfriend_bg3 from '@static/bindOnly/nfriend_bg3.png'
import nfriend_share from '@static/bindOnly/nfriend_share.png'

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
      params: {
        title: '简单三步，完成基因检测',
        desc: `好友${this.state.nickName}分享给你，立即查看>>`,
        link: `${window.location.origin}/binding/bindNFrenid?canShare=no`,
        imgUrl: shareimg,
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
          url: `${window.location.origin}/binding/bindNFrenid?canShare=no`,
          thumbImage: shareimg,
          image: shareimg,
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
          <img src={nfriend_bg1} alt='nfriend_bg1' />
          <img src={nfriend_bg2} alt='nfriend_bg2' />
          <img src={nfriend_bg3} alt='nfriend_bg3' />

          {!this.state.canShare && <button onClick={this.toShare}>分享给TA</button>}

          {this.state.share && <div className={styles.sharebox} onClick={this.closeMask}>
            <img src={nfriend_share} alt='nfriend_share' />
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
