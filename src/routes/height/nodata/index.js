import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { fun, ua } from '@/common/app'
import wxconfig from '@/common/utils/wxconfig'
import { mapDispatchToProps, mapStateToProps } from '@/store/actions/user'
import { Page } from '@/components'
import {
  trackPointToolHeightBuyguidePageView,
  trackPointToolHeightPageBtnClick
} from '../buried-point'
import topBg from '@/assets/images/height/nodata_topBg.png'
import styles from './nodata.scss'

const { getSetssion } = fun
const { isAndall, isIos } = ua
class Nodata extends React.Component {
  state = {
    heightInfo: {}
  }
  componentDidMount () {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightBuyguidePageView({ os_version: version })
    this.setState({
      heightInfo: getSetssion('heightInfo')
    })
    this.wxShare(getSetssion('shareInfo'))
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
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({ Btn_name: 'buyguide_to_productdetail', os_version: version })
    const { heightInfo } = this.state
    window.location.href = `${heightInfo.buyUrl}&isHeight=true`
  }
  render () {
    const { heightInfo } = this.state
    return (
      <Page title='儿童身高潜力测评'>
        <div className={styles.nodataCont}>
          <img className={styles.nodata_topBg} src={topBg} />
          <p className={styles.nodataTitle}>您目前尚无基因检测数据</p>
          <p className={styles.nodataDesc}>根据数据统计，该年龄段的儿童身高应
            <br />
          为<span className={styles.span}>{heightInfo.normalHeightRange}</span>厘米</p>
          <div className={styles.nodataBox}>
            <div className={`${styles.desc} ${styles.mb18}`}>身高发育是由先天基因和后天环境共同影响决定的。通过基因检测，可以解读宝宝在睡眠、运动、饮食、体质和营养元素吸收能力方面的先天特质，从而有针对性的进行科学的改善和调整，帮助您找到最适合宝宝的长高方法。</div>
            <span onClick={this.handleNext} className={styles.nodataBtn}>购买身高发育基因检测</span>
          </div>
        </div>
      </Page>
    )
  }
}
Nodata.propTypes = {
  history: propTypes.object,
}
export default connect(mapStateToProps, mapDispatchToProps)(Nodata)
