import React from 'react'
import propTypes from 'prop-types'
import { Icon } from 'antd-mobile'
import andall from '@src/common/utils/andall-sdk'
import { fun, images, ua, API } from '@src/common/app'
import styles from '../index.scss'
import {
  trackPointToolHeightMorePageView,
  trackPointToolHeightPageBtnClick
} from './../../buried-point'
const { setSession, getSession } = fun
const { isAndall, isIos } = ua

class Find extends React.Component {
  state = {
    linkManListInfos: [],
    bomb: {
      shareBomb: false
    }
  }
  componentDidMount() {
    this.handleQueryLinkmansList()
    this.handleQueryShare()
    const currentLinkManInfo = getSession('currentLinkManInfo')
    trackPointToolHeightMorePageView({
      sample_linkmanid: currentLinkManInfo.linkManId
    })
  }
  // 获取检测人信息
  handleQueryLinkmansList = () => {
    API.getHeightHomeInfo({ hasReport: false }).then(res => {
      const { data: { linkManListInfos } } = res
      this.setState({
        linkManListInfos
      })
    })
  }
  // 获取分享信息
  handleQueryShare=() => {
    API.getActivShareInfo({ shareCode: 'height' }).then(({ data }) => {
      this.setState({
        shareInfo: data
      }, () => {
        if (!isAndall()) {
          // this.wxShare(data)
          setSession('shareInfo', data)
        }
      })
    })
  }
  // 查看报告
  handleLookReport = (item) => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: 'more_to_report',
      os_version: version
    })
    const { linkManId, barcode } = item
    const { productDetail1 } = this.props
    const { id, productCode, productName } = productDetail1 || {}
    if (isAndall()) {
      andall.invoke('openReport', {
        linkManId,
        barCode: barcode,
        id,
        code: productCode,
        name: productName,
        reportType: 21,
      })
    } else {
      window.location.href = 'https://wechatshop.dnatime.com/download-app'
    }
  }
  // 分享海报
  handleSharePoster = (item) => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: 'more_to_geneheight',
      os_version: version
    })
    let { linkManName, dnaHeight } = item
    linkManName = encodeURIComponent(linkManName)
    this.props.history.push(`/height-poster?linkManName=${linkManName}&dnaHeight=${dnaHeight}`)
  }
  // 分享 - 邀请好友
  handleShare = () => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: 'more_to_invite',
      os_version: version
    })
    const { shareInfo } = this.state
    const { title, subTitle, jumpUrl, headImg } = shareInfo || {}
    if (isAndall()) {
      andall.invoke('share',
        {
          type: 'link',
          title,
          text: subTitle,
          url: jumpUrl,
          image: headImg,
          thumbImage: headImg
        })
    } else {
      this.setState({
        bomb: {
          shareBomb: true
        }
      })
    }
  }
  handleCloseBomb = () => {
    this.setState({
      bomb: {
        shareBomb: false
      }
    })
  }
  handleBuyFun = () => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: 'more_to_buy',
      os_version: version
    })
    const { buyFun } = this.props
    buyFun()
  }
  handleGotoBianBian = () => {
    this.props.history.push('/land-page?from=chttool')
  }
  render () {
    const { linkManListInfos, bomb } = this.state

    return (
      <div className={styles.moreCont}>
        {
          linkManListInfos && linkManListInfos.length
            ? linkManListInfos.map((item, index) => {
              return <div key={index} className={styles.linkManItem}>
                <div className={styles.userCont}>
                  <div className={styles.userDetail}>
                    <img src={item.sex === 'male' ? images.boy : images.girl} alt='' />
                    <div>
                      <p className={styles.name}>{item.linkManName}</p>
                      <p className={styles.birth}>{item.age}</p>
                    </div>
                  </div>
                </div>
                {
                  item.hasReport
                    ? <div className={styles.list}>
                      <p className={styles.listItem} onClick={() => this.handleLookReport(item)}>
                        查看基因检测报告
                        <Icon className={styles.right} type='right' />
                      </p>
                      <p className={styles.listItem} onClick={() => this.handleSharePoster(item)}>
                        成年后的最高身高
                        <span className={styles.num}>
                          {item.dnaHeight}cm
                          <Icon className={styles.right} type='right' />
                        </span>
                      </p>
                    </div>
                    : <div className={styles.list}>
                      <p className={styles.listItem} onClick={this.handleBuyFun}>
                        解锁身高基因测试
                        <span className={styles.num}>
                          <img className={styles.lock} src={images.iconLock} alt='' />
                          <Icon className={styles.right} type='right' />
                        </span>
                      </p>
                    </div>
                }
              </div>
            })
            : ''
        }
        <div className={styles.shareCont}>
          <div className={styles.item} onClick={this.handleShare}>
            <p className={styles.text}>
              <img src={images.share2} alt='' />
              邀请好友
            </p>
            <Icon className={styles.right} type='right' />
          </div>
        </div>
        <div className={styles.shareCont}>
          <div className={styles.item} onClick={this.handleGotoBianBian}>
            <p className={styles.text}>
              <img src={images.gift} alt='' />
              宝宝便便里的秘密
            </p>
            <Icon className={styles.right} type='right' />
          </div>
        </div>
        {
          bomb.shareBomb
            ? <div className={`${styles.bombCont} ${styles.bombCont1}`} onClick={this.handleCloseBomb}>
              <img className={styles.heightShare} src={images.heightShare} alt='' />
            </div>
            : ''
        }
      </div>
    )
  }
}
Find.propTypes = {
  history: propTypes.object,
  buyFun: propTypes.func,
  productDetail1: propTypes.object
}
export default Find
