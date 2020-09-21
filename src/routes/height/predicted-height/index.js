import React from 'react'
import propTypes from 'prop-types'
import axios from 'axios'
import wxconfig from '@src/common/utils/wxconfig'
import { API, fun, ua } from '@src/common/app'
import { Page } from '@src/components'
import ChooceLinkMan from '../components/chooceLinkMan'
import boy from '@static/height/icon_boy.png'
import girl from '@static/height/icon_girl.png'
import changeIcon from '@static/height/icon_trh1.png'
import indexBg from '@static/height/index_bg1.png'
import user from '@static/height/index_user.png'
import tip from '@static/height/icon_tips.png'
import {
  trackPointToolHeightGenemaxPageView,
  trackPointToolHeightPageBtnClick
} from '../buried-point'

import styles from './height.scss'

const { setSession, getSession } = fun
const { isAndall, isIos } = ua
class PredictedHeight extends React.Component {
  state = {
    bomb: {
      choiceLinkmanBomb: false
    },
    name: '',
    selected: {},
    linkmans: [],
    infos: {},
    hasReport: true,
    isShow: false
  }
  componentDidMount () {
    this.handleQueryInfos()
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
  // 获取首页信息接口
  handleQueryInfos = () => {
    axios.all([
      API.checkHasChildHeightReport(),
      API.getActivShareInfo({ shareCode: 'height' })
    ]).then(res => {
      const hasReport = res[0].data
      const shareInfo = res[1].data
      this.wxShare(shareInfo)
      setSession('shareInfo', shareInfo)
      if (hasReport) {
        const linkManId = getSession('currentLinkManInfo') && getSession('currentLinkManInfo').linkManId
        API.getHeightHomeInfo({ linkManId, hasReport: true }).then(res => {
          const { data } = res
          const { linkManListInfos, currentLinkManInfo } = data || {}
          const { linkManName, linkManId } = currentLinkManInfo || {}
          setSession('currentLinkManInfo', currentLinkManInfo)
          this.setState({
            isShow: true,
            linkmans: linkManListInfos || [],
            name: linkManName || '',
            selected: currentLinkManInfo,
            infos: currentLinkManInfo || {},
            shareInfo
          })
          let version = 'wechat_h5'
          if (isAndall()) {
            if (isIos()) {
              version = 'app_ios'
            } else {
              version = 'app_android'
            }
          }
          trackPointToolHeightGenemaxPageView({
            sample_linkmanid: linkManId,
            os_version: version
          })
        })
      } else {
        const newUrl = window.location.href.replace(/predicted-height/g, 'userInfo')
        window.history.replaceState({}, '', newUrl)
        window.location.reload()
      }
    })
  }
  // 显示弹框
  handleChoiceLinkmanBomb = () => {
    this.setState({
      bomb: {
        choiceLinkmanBomb: true
      }
    })
  }
  handleCancel = () => {
    this.setState({
      bomb: {
        choiceLinkmanBomb: false
      }
    })
  }
  // 切换检测人
  handleChoiceLinkman = (item) => {
    this.setState({
      selected: item,
      hasReport: item.hasReport,
      bomb: {
        choiceLinkmanBomb: false
      }
    }, () => {
      const { selected, hasReport } = this.state
      const { linkManId, linkManName, status } = selected || {}
      if (status === 1) {
        this.props.history.push(`/height/height-index?linkManId=${linkManId}`)
        return
      }
      if (!hasReport) return this.props.history.push(`/height/userInfo`)
      this.setState({
        name: linkManName,
        bomb: {
          choiceLinkmanBomb: false
        }
      })
      API.getHeightHomeInfo({ linkManId, hasReport: true }).then(res => {
        const { data } = res
        const { currentLinkManInfo } = data || {}
        this.setState({
          infos: currentLinkManInfo || {},
        })
      })
    })
  }
  // 点击自测小工具
  handleNext = () => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({ Btn_name: 'genemax_to_measure', os_version: version })
    const { history } = this.props
    const { selected } = this.state
    setSession('currentLinkManInfo', selected)
    history.push(`/height/userInfo`)
  }
  render () {
    const { bomb, linkmans, selected, name, infos, isShow } = this.state
    return (
      <Page title='儿童身高潜力'>
        <div>
          {
            isShow
              ? <div className={styles.heightCont}>
                <div className={styles.choiceLinkman}>
                  <div className={styles.linkmansCont} onClick={this.handleChoiceLinkmanBomb}>
                    <img className={styles.sexImg} src={infos.sex === 'male' ? boy : girl} alt='' />
                    <span className={styles.name}>{name}</span>
                    {
                      linkmans.length > 1
                        ? <span className={styles.changeLinkMan}>
                          <img src={changeIcon} alt='' />
                        </span>
                        : ''
                    }
                  </div>
                </div>
                <div className={styles.heightDetail}
                  style={{ background:`url(${indexBg}) no-repeat`, backgroundSize: '100%' }}
                >
                  <p className={styles.heightTitleDesc}>根据基因检测的结果</p>
                  <p className={styles.heightTitle}>
                    {name} 成年后的最高身高
                    <br />
                    预计为
                  </p>
                  <p className={styles.line} />
                  <p className={styles.num}>{infos.dnaHeight}<span>cm</span></p>
                </div>
                <div className={styles.footerCont}>
                  <div className={styles.detail}>
                    <div className={styles.intro}>
                      <img className={styles.user} src={user} alt='' />
                      <div className={styles.introDetail}>
                        <p className={styles.introTitle}>安我儿童成长研究院</p>
                        <p className={styles.introDesc}>根据研究表明，遗传因素对身高的影响大约在60％〜80％；通过科学的身高管理，对环境因素进行干预，可以将遗传身高发挥到极致，挖掘的生长潜能。
                        </p>
                      </div>
                    </div>
                    <span className={styles.btn} onClick={this.handleNext}>开启儿童身高测评</span>
                    <p className={styles.tip}>
                      <img className={styles.img} src={tip} />
                      建议每隔6个月重新自测一次，以持续了解身高发育进展。
                    </p>
                  </div>
                </div>
                {
                  bomb.choiceLinkmanBomb
                    ? <ChooceLinkMan
                      linkmans={linkmans}
                      selected={selected}
                      choiceLinkman={this.handleChoiceLinkman}
                      cancel={this.handleCancel}
                    />
                    : ''
                }
              </div>
              : ''
          }
        </div>
      </Page>
    )
  }
}
PredictedHeight.propTypes = {
  history: propTypes.object,
}
export default PredictedHeight
