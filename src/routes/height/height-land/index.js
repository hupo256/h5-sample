import React from 'react'
import propTypes from 'prop-types'
import { fun, ua } from '@src/common/app'
import wxconfig from '@src/common/utils/wxconfig'
import { Page } from '@src/components'
import styles from './index.scss'
import land1 from '@static/height/height_land_1.jpg'
import land2 from '@static/height/height_land_2.jpg'
import land3 from '@static/height/height_land_3.jpg'
import land4 from '@static/height/height_land_4.jpg'
import land5 from '@static/height/height_land_5.jpg'
import land6 from '@static/height/height_land_6.jpg'
import land7 from '@static/height/height_land_7.jpg'
import land8 from '@static/height/height_land_8.jpg'
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
    this.props.history.push('/height/userInfo')
  }
  render () {
    const imagesList = [land1, land2, land3, land4, land5, land6, land7, land8]
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
