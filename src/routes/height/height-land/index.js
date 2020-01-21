import React from 'react'
import propTypes from 'prop-types'
import { fun, images, ua } from '@src/common/app'
import wxconfig from '@src/common/utils/wxconfig'
import { Page } from '@src/components'
import styles from './index.scss'
import {
  trackPointToolHeightIndexPageView
} from '../buried-point'
const { getSetssion } = fun
class UserInfo extends React.Component {
  state = {
  }
  componentDidMount() {
    trackPointToolHeightIndexPageView({
      sample_linkmanid: ''
    })
    if (!ua.isAndall()) {
      this.wxShare(getSetssion('shareInfo'))
    }
  }
  /**
   * 微信分享
   */
  wxShare = (shareInfo) => {
    const { title, jumpUrl, subTitle, headImg } = shareInfo
    wxconfig({
      showMenu: true,
      params:{
        title,
        link: jumpUrl,
        desc: subTitle,
        imgUrl: headImg,
      }
    })
  }

  handleNext = () => {
    this.props.history.push('/userInfo')
  }
  render () {
    const imagesList = [images.land1, images.land2, images.land3, images.land4, images.land5, images.land6, images.land7, images.land8]
    return (
      <Page title='测测孩子身高潜力'>
        <div className={styles.indexCont}>
          {
            imagesList.map((item, index) => {
              return <img key={index} src={item} />
            })
          }
          <span className={styles.btn} onClick={this.handleNext}>开启身高管理</span>
        </div>
      </Page>
    )
  }
}
UserInfo.propTypes = {
  history: propTypes.object,
}
export default UserInfo
