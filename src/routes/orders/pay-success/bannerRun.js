import React from 'react'
import { point } from '@src/common/app'
import styles from '../order'
import UA from '../../../common/utils/ua'
import {
  trackPointToolFinishPayBannerClickPageView, trackPointOrderCompletePageBannerGoto
} from '../buried-point'
const { isWechat, getDevice } = UA

class BannerRun extends React.Component {
  state = {
    indexAd: 0,
  }

  componentDidMount() {
    this.runADBox()
  }

  runADBox = () => {
    let { indexAd } = this.state
    const { banArr } = this.props
    let lenAd = banArr.length
    setInterval(() => {
      indexAd++
      if (indexAd === lenAd) indexAd = 0
      this.setState({ indexAd })
    }, 4000)
  }

  gotoDdPage = (url, setLocation) => {
    const { viewtype, pageSource, orderId,activeCode } = this.props
    // 判断是否为微信，对url进行处理
    const inWechat = isWechat()
    trackPointToolFinishPayBannerClickPageView({ viewtype:viewtype, location:setLocation })
    trackPointOrderCompletePageBannerGoto({
      business_type: pageSource === 'orderSubmit' ? 'test' : 'unlock',
      order_id: orderId,
      url: url,
      active_code:activeCode||''
    })
    if (inWechat) {
      url = url.split('?url=')[1]
    }

    setTimeout(() => {
      window.location.href = url
    }, 200)
  }

  render () {
    const { banArr } = this.props
    const { indexAd } = this.state
    const banLen = banArr.length
    const getLocation = ['top', 'bottom']
    return (
      <div className={styles.adShowbox}>
        <div className={styles.anibox}>
          {banArr.map((ban, index) => {
            const { imgUrl, jumpUrl } = ban
            let ele = jumpUrl !== '' ? <img
              key={index}
              src={imgUrl}
              onClick={() => this.gotoDdPage(jumpUrl, getLocation[index])}
            /> : ''
            return ele
          })}
        </div>
      </div>
    )
  }
}
export default BannerRun
