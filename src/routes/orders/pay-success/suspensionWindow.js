import React from 'react'
import { point } from '@src/common/app'
import styles from '../order'
import { trackPointToolFinishPayBannerClickPageView } from '../buried-point'
import UA from '@src/common/utils/ua'
const { isWechat } = UA
class SuspensionWindow extends React.Component {
    gotoDdPage = (url) => {
      const { viewtype } = this.props
      // 判断是否为微信，对url进行处理
      const inWechat = isWechat()
      trackPointToolFinishPayBannerClickPageView({ viewtype:viewtype, location:'Suspension window' })
      if (inWechat) {
        url = url.split('?url=')[1]
      }

      setTimeout(() => {
        window.location.href = url
      }, 200)
    }

    render () {
      const { popData, changeInvite, viewtype } = this.props
      const { imgUrl, jumpUrl } = popData
      return (
        <div className={styles.suspensionWrap}>
          <img src={imgUrl}
            onClick={() => this.gotoDdPage(jumpUrl)}
          />
        </div>
      )
    }
}

export default SuspensionWindow
