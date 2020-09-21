import React from 'react'
import propTypes from 'prop-types'
import { API, point, fun, ua } from '@src/common/app'
import { Page } from '@src/components'
import { trackPointSkinToolPoster, trackPointSkinToolPageGoto } from './buried-point'
import wxconfig from '@src/common/utils/wxconfig'
import html2canvas from 'html2canvas'
import andall from '@src/common/utils/andall-sdk'
import Match from '../compoment/match.js'
import shareCircle from '@static/skinBeauty/shareCircle.png'
import logo from '@static/skinBeauty/logo.png'
import jiantou from '@static/skinBeauty/jiantou.png'
import jiantou2 from '@static/skinBeauty/jiantou2.png'
import shareGood from '@static/skinBeauty/shareGood.png'
import wxshare from '@static/skinBeauty/wxshare.png'
import element from '@static/skinBeauty/element.png'
import code3 from '@static/skinBeauty/code3.png'
import shareNoMatch from '@static/skinBeauty/shareNoMatch.png'
import noData2 from '@static/skinBeauty/noData2.png'
import manicon1 from '@static/skinBeauty/manicon1.png'
import manicon2 from '@static/skinBeauty/manicon2.png'
import manicon3 from '@static/skinBeauty/manicon3.png'
import manicon4 from '@static/skinBeauty/manicon4.png'
import manicon5 from '@static/skinBeauty/manicon5.png'
import manicon6 from '@static/skinBeauty/manicon6.png'
import fangtu from '@static/skinBeauty/fangtu.png'

import styles from './share.scss'
const { getParams } = fun
class Share extends React.Component {
    state = {
      thisMatch:getParams().thisMatch,
      shareUrl:`${window.location.origin}/mkt/skinSearch/homePage?viewType=link`,
      share:false,
      shareText:'',
      type:+localStorage.shareType,
      isAndall: ua.isAndall(),
      isIos: ua.isIos(),
      base64:''
    }
    componentDidMount () {
      trackPointSkinToolPoster({
        os_version: navigator.userAgent,
        user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1
      })
      const { thisMatch } = this.state
      let _shareText = ''
      thisMatch > 79 || thisMatch === 'null'
        ? _shareText = '选对护肤品，谁还去打啥上万的玻尿酸？'
        : thisMatch > 59 && thisMatch < 80
          ? _shareText = '护肤品千千万，哪款才是你的爱？'
          : thisMatch > 39 && thisMatch < 60
            ? _shareText = '护肤是挑战，焕颜新生or敏感烂脸？'
            : thisMatch < 40
              ? _shareText = '护肤别跟风，种草需谨慎!'
              : ''
      this.setState({ shareText:_shareText }, () => {
        ua.isAndall() || this.wxShare()
      })
      if (window.innerHeight - 498 - 48 > 0) {
        this.refs.myPoster.style.marginTop = (window.innerHeight - 498 - 48 - 58) / 2 + 'px'
      } else {
        this.refs.myPoster.style.marginTop = '0'
      }
    }

  handleHtml2Canvas = () => {
    let myPoster = this.refs.myPoster
    let canvas = document.createElement('canvas')
    canvas.width = myPoster.offsetWidth * 3
    canvas.height = myPoster.offsetHeight * 3
    let opts = {
      scale: 3,
      canvas: canvas,
      width: myPoster.offsetWidth,
      height: myPoster.offsetHeight,
      useCORS: true
    }

    html2canvas(myPoster, opts).then(canvas => {
      this.setState({ base64: canvas.toDataURL('image/jpeg') })
      setTimeout(() => {
        andall.invoke('share', {
          type: 'image',
          title: '', // 微信标题
          text: '', // 微博标题
          image: canvas.toDataURL('image/jpeg'),
          bgColor: 'ffffff',
          opacity: '0'
        })
      }, 500)
    })
  }

   // 微信分享
   wxShare = (param) => {
     const { shareText, shareUrl } = this.state
     setTimeout(() => {
       wxconfig({
         showMenu: true,
         params:{
           title: '我的专属护肤品匹配神器',
           desc: shareText,
           link: shareUrl,
           imgUrl:`${fangtu}`,
         }
       })
     }, 400)
   }

  toShare = () => {
    // 产品/成分分享埋点
    trackPointSkinToolPageGoto({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      Btn_name:'poster_share',
      cream_product_id:+localStorage.shareType === 1 ? getParams().shareId : '',
      element_id:+localStorage.shareType === 2 ? getParams().shareId : '',
    })
    const { isAndall, isIos, shareText, shareUrl } = this.state
    if (isAndall) {
      setTimeout(() => {
        andall.invoke('share', {
          type: 'link',
          url: shareUrl,
          title: '我的专属护肤品匹配神器',
          text: shareText,
          thumbImage: `${fangtu}`,
          image: `${fangtu}`,
        })
      }, 200)
    } else {
      this.setState({ share: true })
    }
  }

    closeMask = () => {
      this.setState({ share: false })
    }
    render () {
      const { thisMatch, share, type } = this.state
      return (
        <Page title='肌秘美肤小工具'>
          <div className={styles.share} >
            <div ref='myPoster' className={styles.shareBg2}>
              <div className={styles.text}>
                <p className={styles.person}>
                  {
                    `${localStorage.linkManName === 'null' ? localStorage.userName : localStorage.linkManName}忍不住和你分享`
                  }
                </p>
                {
                  thisMatch === 'null'
                    ? <img src={shareNoMatch} className={styles.shareNoMatch} />
                    : <div>
                      <img src={shareCircle} className={styles.shareCircle} />
                      <img src={jiantou} className={styles.jiantou1} />
                      <img src={jiantou2} className={styles.jiantou2} />
                      <div className={styles.match}>
                        <span className={styles.matchValue}>{thisMatch}</span>
                        <span className={styles.matchB}>%</span>
                        <span className={styles.matchResults}>
                          {
                            thisMatch > 79 ? '匹配度较高'
                              : thisMatch > 59 && thisMatch < 80 ? '匹配度中等'
                                : thisMatch > 39 && thisMatch < 60 ? '匹配度较低'
                                  : thisMatch < 40 ? '匹配度极低' : ''
                          }
                        </span>
                        { <Match matchValue={thisMatch} type={2} /> }
                      </div>
                      <img src={`manicon${localStorage.headImgType}`} className={styles.left} />
                      {
                        +type === 1
                          // ? <img className={styles.right} src={localStorage.shareImg} />
                          ? <img className={styles.right} src={localStorage.shareImg === '' || localStorage.shareImg === 'null' ? noData2 : localStorage.shareImg} />
                          : <img className={styles.right} src={element} />
                      }
                      <img src={shareGood} className={styles.shareGood} />
                      <p className={styles.goods}>{localStorage.shareName}</p>
                    </div>
                }
                {
                  thisMatch === 'null'
                    ? <div className={styles.tips} refs='tips'>
                      <p><span>选对护肤品，谁还去打</span><span>啥上万的玻尿酸？</span></p>
                    </div>
                    : <div className={styles.tips} refs='tips'>
                      {
                        thisMatch > 79
                          ? <p><span>选对护肤品，谁还去打</span><span>啥上万的玻尿酸？</span></p>
                          : thisMatch > 59 && thisMatch < 80
                            ? <p><span>护肤品千千万，</span><span>哪款才是你的爱？</span></p>
                            : thisMatch > 39 && thisMatch < 60
                              ? <p><span>护肤是挑战，焕颜</span><span>新生or敏感烂脸？</span></p>
                              : thisMatch < 40
                                ? <p><span>护肤别跟风，</span><span>种草需谨慎!</span></p> : ''
                      }
                    </div>
                }
                <img src={logo} className={styles.logo} />
                <p className={styles.des}>扫码检测护肤品匹配度</p>
                <img src={code3} className={styles.code} />
              </div>
            </div>

          </div>
          {
            share && <div className={styles.sharebox} onClick={this.closeMask}>
              <img src={wxshare} />
            </div>
          }
          <p className={styles.shareBtn} onClick={this.toShare}>分享给好友</p>
        </Page>
      )
    }
}
Share.propTypes = {
  history: propTypes.object,
}
export default Share
