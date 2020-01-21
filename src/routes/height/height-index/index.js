import React from 'react'
import propTypes from 'prop-types'
import { fun, ua, API } from '@src/common/app'
import wxconfig from '@src/common/utils/wxconfig'
import andall from '@src/common/utils/andall-sdk'
import { Page } from '@src/components'
import styles from './index.scss'
import Index from './components/index'
import Curve from './components/curve'
import Find from './components/find'
import More from './components/more'
import NavList from '../components/navList'
import {
  trackPointToolHeightHomeTab,
  trackPointToolHeightAssessmentTab,
  trackPointToolHeightContentTab,
  trackPointToolHeightMoreTab
} from './../buried-point'
const { setSession, getSession } = fun
class HeightIndex extends React.Component {
  state = {
    activedNav: 0,
    activedTab: 0,
    isAndall: ua.isAndall()
  }
  componentDidMount() {
    this.handleQueryShare()
    this.handleQueryHeightDetail()
    this.setState({
      activedNav: getSession('activedNav') || 0,
      activedTab: getSession('activedTab') || 0
    })
  }
  // 获取商品信息
  handleQueryHeightDetail = () => {
    API.getHeightProductInfo({ toolsCode: 'HEIGHT' }).then(({ data }) => {
      setSession('productDetail1', data)
      this.setState({
        productDetail1: data
      })
    })
  }
  // 获取分享信息
  handleQueryShare=() => {
    const { isAndall } = this.state
    API.getActivShareInfo({ shareCode: 'height' }).then(({ data }) => {
      this.setState({
        shareInfo: data
      }, () => {
        if (!isAndall) {
          this.wxShare(data)
        }
      })
      if (!isAndall) {
        setSession('shareInfo', data)
      }
    })
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
  // 底部nav切换
  handleChangeNav = (index) => {
    const { activedNav } = this.state
    const currentLinkManInfo = getSession('currentLinkManInfo')
    if (index === 0) {
      trackPointToolHeightHomeTab({
        sample_linkmanid: currentLinkManInfo.linkManId
      })
    } else if (index === 1) {
      trackPointToolHeightAssessmentTab({
        sample_linkmanid: currentLinkManInfo.linkManId
      })
    } else if (index === 2) {
      trackPointToolHeightContentTab({
        sample_linkmanid: currentLinkManInfo.linkManId
      })
    } else if (index === 3) {
      trackPointToolHeightMoreTab({
        sample_linkmanid: currentLinkManInfo.linkManId
      })
    }
    if (activedNav === index) return
    setSession('activedNav', index)
    setSession('activedTab', 0)
    this.setState({
      activedNav: index
    })
  }
  // 底部nav切换 内容切换
  handleSetContent = (index) => {
    const { activedTab, productDetail1 } = this.state
    switch (index) {
    case 0:
      return <Index
        history={this.props.history}
        moreFun={this.handleMore}
        goToCurve={this.handleGoToCurve}
        buyFun={this.handleLock}
      />
    case 1:
      return <Curve
        history={this.props.history}
        activedTab={activedTab}
        buyFun={this.handleLock}
        productDetail1={productDetail1}
      />
    case 2:
      return <Find
        history={this.props.history}
        activedTab={activedTab} />
    case 3:
      return <More
        productDetail1={productDetail1}
        history={this.props.history}
        buyFun={this.handleLock}
      />
    }
  }
  // 查看更多 （文章和商品）
  handleMore = (index) => {
    this.setState({
      activedNav: 2,
      activedTab: index
    })
  }
  // 跳转到测评tab页
  handleGoToCurve = (flag, type) => {
    if (flag) {
      this.handleStartQues()
    } else {
      let activedTab = 0
      switch (type) {
      case 'Nutrition':
        activedTab = 1
        break
      case 'Sport':
        activedTab = 2
        break
      case 'Sleep':
        activedTab = 3
        break
      case 'height':
        activedTab = 0
      }
      this.setState({
        activedTab,
        activedNav: 1
      })
    }
  }
  // 去购买
  handleLock = () => {
    const { productDetail1, isAndall } = this.state
    const { id, productType } = productDetail1
    if (isAndall) {
      andall.invoke('goProductList', { productId:id, productType })
    } else {
      window.location.href = `${window.location.origin}/commodity?id=${id}`
    }
  }
  render () {
    const { activedNav } = this.state
    return (
      <Page title='宝宝长高高'>
        <div className={styles.indexDetail}>
          {
            this.handleSetContent(activedNav)
          }
          <NavList actived={activedNav} changeActived={this.handleChangeNav} />
        </div>
      </Page>
    )
  }
}
HeightIndex.propTypes = {
  history: propTypes.object,
}
export default HeightIndex
