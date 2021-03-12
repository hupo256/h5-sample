import React, { Component } from 'react'
import propTypes from 'prop-types'
import { Page, LinkManList } from '@src/components'
import wxconfig from '@src/common/utils/wxconfig'
import { fun, API, images, ua } from '@src/common/app'
import andall from '@src/common/utils/andall-sdk'
import styles from './land.scss'

import {
  trackPointLandingpageView,
  trackPointLandingpageGoto
} from './buried-point'
import { Toast, Icon } from 'antd-mobile'

const { setSetssion, getParams } = fun
class MemberLand extends Component {
  static propTypes = {
    history: propTypes.object,
  }
  state = {
    isAndall: ua.isAndall(),
    detail: {},
    productIdList: [],
    orderDetailRequestList: [],
    newPrice: {},
    linkMansList: [],
    linkManBomb: false,
    selectedLinkMan: {},
    linkmanFlag: false,
    isOldUser: 0, // 1是老用户2是新用户
    landImgList : [],
    newUserProductId: '', // 新购时的productId
  }
  componentDidMount () {
    const { isAndall } = this.state
    const { viewType, activeCode } = getParams()
    trackPointLandingpageView({
      viewtype: viewType,
      client_type: isAndall ? 'APP' : 'h5',
      active_code: activeCode
    })
    this.handleIsNewUser()
    this.handleQueryActiveInfo()
  }
  handleQueryActiveInfo = () => {
    API.getPackageActiveByCode({ activeCode: getParams().activeCode }).then(res => {
      if (res) {
        const { activTemplateList, } = res.data || {}
        const { templateRuleList } = (activTemplateList && activTemplateList.length && activTemplateList[0]) || {}
        const { productId } = templateRuleList && templateRuleList.length && templateRuleList[0]
        this.setState({
          activeInfo: res.data || {},
          newUserProductId: productId
        }, () => {
          // 获取检测人的列表
          this.handleQueryLinkmans()
          // 配置微信分享四要素
          this.wxShare()
        })
      }
    })
  }
  handleQueryList = (linkManId, flag) => {
    let fun = ''
    if (linkManId) {
      fun = API.categoryListUnLockChild({ linkManId })
    } else {
      fun = API.categoryListUnLock({})
    }
    fun.then(res => {
      const { data } = res
      const { productCategoryList } = data || {}
      let productIdList = []
      let productLists = []
      let orderDetailRequestList = []
      productCategoryList && productCategoryList.length && productCategoryList.forEach((item, index) => {
        const { productList } = item || {}
        productList && productList.length && productList.forEach((el) => {
          if (linkManId) {
            if (+el.reportStatus === 0) {
              productIdList.push(el.productId)
              orderDetailRequestList.push({
                productId: el.productId
              })
              productLists.push({
                productId: el.productId,
                productNum: 1
              })
            }
          } else {
            productIdList.push(el.productId)
            orderDetailRequestList.push({
              productId: el.productId
            })
          }
        })
      })
      this.setState({
        detail: data,
        productIdList,
        productLists,
        orderDetailRequestList
      }, () => {
        API.calculatePrice({
          linkManId: linkManId || -1000,
          productIdList
        }).then(res => {
          this.setState({
            newPrice: (res && res.data) || {}
          }, () => {
            if (linkManId) {
              this.handleGoToSubmit()
            }
          })
        })
      })
    })
  }
  handleQueryLinkmans = () => {
    const { activeInfo } = this.state
    const { activTemplateList, activBuyImageList, activUnlockImageList } = activeInfo || {}
    const { templateRole, templateSex } = (activTemplateList && activTemplateList.length && activTemplateList[0]) || {}
    API.getAvailableLinkMan({
      linkManType: templateRole,
      sex: templateSex,
      unlockProduct: '1'
    }).then(res => {
      const { data } = res
      if (data.length) {
        // 走解锁
        const oldUserArr = data.filter(item => item.usableStatus === 1)
        this.setState({
          landImgList: activUnlockImageList,
          linkmanFlag: true,
          linkMansList: data,
          selectedLinkMan: data[0],
          isOldUser: data.length > 0 ? 1 : 2
        }, () => {
          this.handleQueryList()
        })
      } else {
        // 走新购
        this.setState({
          linkmanFlag: true,
          isOldUser: 2,
          landImgList: activBuyImageList
        })
        this.handleQueryProductDetail()
      }
    })
  }
  handleLock = () => {
    // 立即解锁，1.先判断是否是新用户，如果是新用户，则跳登录页面，
    // 2.如果有检测人，则先弹选择检测人的弹框
    const { linkMansList, linkmanFlag, isNewUser } = this.state
    if (!linkmanFlag) return Toast.info('数据加载中，请稍后')
    if (isNewUser) {
      const { origin, pathname, search } = location
      window.location.href = `${origin}/mkt/login/mobileLogin?url=${pathname}${search}`
      return
    }
    if (linkMansList && linkMansList.length) {
      this.setState({
        linkManBomb: true
      })
      return
    }
    this.handleGoToSubmit()
  }
  handleGoToSubmit = () => {
    const { activeCode } = getParams()
    const { productIdList, orderDetailRequestList, newPrice, selectedLinkMan, isAndall, isOldUser, indexPicUrl, productOriginPrice, productPrice, productLists,
      activeInfo, newUserProductId } = this.state
    const { activDesc, activName, activTemplateList } = activeInfo || {}
    const { templateRuleList } = (activTemplateList && activTemplateList.length && activTemplateList[0]) || {}
    const { productBuyDesc, productName } = templateRuleList && templateRuleList.length && templateRuleList[0]
    const { actualPrice, totalPrice } = newPrice || {}
    let seriesOrders = {
      productPrice: productPrice || actualPrice, // 价格
      originPrice: productOriginPrice || totalPrice, // 原价
      productName: isOldUser === 2 ? productName : activName,
      fromCartFlag: 1,
      productIdList,
      orderDetailRequestList,
      seriesDesc: productBuyDesc,
      cartProdPath: indexPicUrl,
      activeCode
    }
    trackPointLandingpageGoto()
    setSetssion('unlockList', [seriesOrders])
    setSetssion('selectedLinkMan', selectedLinkMan)
    if (isAndall) {
      if (isOldUser === 1) { // 老用户
        if (ua.getOsVersion() >= '1.6.6') {
          andall.invoke('confirmOrder', {
            linkManId: selectedLinkMan && selectedLinkMan.linkManId,
            productList: productLists,
            activeCode,
            actualType: 2
          })
        } else {
          andall.invoke('unlockProductList', {
            linkManId: selectedLinkMan && selectedLinkMan.linkManId,
            productIdList,
            activeCode,
          })
        }
      } else if (isOldUser === 2) { // 新用户
        andall.invoke('goPayOrder', {
          seriesId: '',
          linkManId: '',
          productId: newUserProductId,
          activeCode,
        })
      }
    } else {
      if (isOldUser === 1) { // 老用户
        window.location.href = `${window.location.origin}/andall-report/unlock-submit?buyType=5&flag=unlockLand&activeCode=${activeCode}`
      } else if (isOldUser === 2) { // 新用户
        seriesOrders.prodId = newUserProductId
        setSetssion('shopList', [seriesOrders])
        window.location.href = `${window.location.origin}/andall-report/order-submit?activeCode=${activeCode}`
      }
    }
  }
  handleIsNewUser = () => {
    let isNewUser = false
    API.myInfo({ noloading:1 }).then(res => {
      const { data } = res
      if (data.checkMobileFlag === 2) {
        isNewUser = false
      } else {
        isNewUser = true
      }
      this.setState({
        mobileNo: data && data.mobileNo,
        isNewUser
      })
    })
  }
  /**
   * 微信分享
   */
  wxShare = () => {
    const { activeInfo } = this.state
    const { shareTitle, shareDesc, shareUrl, shareImage } = activeInfo || {}
    wxconfig({
      showMenu:true,
      params:{
        title: shareTitle,
        link: shareUrl,
        imgUrl: shareImage,
        desc: shareDesc,
      }
    })
  }
  handleChooseLinkMan = (id, status, index) => {
    if (status === 0) {
      return Toast.info('此联系人不可解锁！')
    }
    const { linkMansList } = this.state
    let _linkMansList = []
    linkMansList && linkMansList.length && linkMansList.map((item, ind) => {
      item.selected = false
      if (index === ind) {
        item.selected = true
      }
      _linkMansList.push(item)
    })
    this.setState({
      linkMansList: _linkMansList,
      selectedLinkMan: _linkMansList[index]
    }, () => {
      this.handleQueryList(_linkMansList[index].linkManId, 'aaa')
    })
  }
  handleColse = () => {
    this.setState({
      linkManBomb: false
    })
  }
  handleQueryProductDetail = () => {
    const { newUserProductId } = this.state
    const params = { id: newUserProductId }
    API.productDetail(params).then(res => {
      if (res.data) {
        const { tradeProduct } = res.data || {}
        const { productDetail, productName, productPrice, productOriginPrice } = tradeProduct || {}
        let { indexPicUrl } = productDetail || {}
        indexPicUrl && (indexPicUrl = indexPicUrl.split(','))
        this.setState({
          indexPicUrl,
          productName,
          productPrice,
          productOriginPrice
        })
      }
    })
  }

  render () {
    const { newPrice, linkManBomb, linkMansList, isOldUser, productOriginPrice, productPrice, landImgList, activeInfo } = this.state
    const { actualPrice, totalPrice } = newPrice || {}
    const { activName, activTemplateList } = activeInfo || {}
    const { buttonColor, buttonTextColor } = (activTemplateList && activTemplateList.length && activTemplateList[0]) || {}
    const buttonTextColorList = (buttonTextColor && buttonTextColor.split('|')) || []
    return (
      <div>
        {
          isOldUser ? <Page title={activName} config={false}>
            <div className={styles.landCont}>
              {
                landImgList && landImgList.length ? landImgList.map((item, index) => {
                  return <img src={item} key={index} alt='' />
                })
                  : ''
              }
              <div className={styles.bottomCont}>
                <div onClick={this.handleLock}
                  className={`${styles.flixed}`} style={{background: buttonColor}}>
                  <div className={styles.leftCont}>
                    <span className={styles.newPrice}>¥<b>{isOldUser === 1 ? actualPrice : productPrice }</b></span>
                    <div className={styles.right}>
                      <p className={styles.bargainPrice} style={{color: buttonTextColorList[0]}}>
                        限时特价
                      </p>
                      <p className={styles.oldPrice}>¥{isOldUser === 1 ? totalPrice : productOriginPrice}</p>
                    </div>
                  </div>
                  <span className={styles.rightCont} 
                  style={{color: buttonTextColorList[0], boxShadow:`inset 0px 0px 10px 0px ${buttonTextColorList[1] || buttonTextColorList[0] || '#ff6c5a'}`}}>
                    {
                      isOldUser === 1 ? '立即解锁' : '立即购买'
                    }
                    <Icon type='right' size={'sm'} style={{margin: '0 -10px 0 -5px'}} />
                  </span>
                </div>
              </div>
              {
                linkManBomb
                  ? <LinkManList
                    manList={linkMansList}
                    toggleMask={this.handleColse}
                    showList
                    curLinkManId={''}
                    switchTheMan={this.handleChooseLinkMan}
                  />
                  : ''
              }
            </div>
          </Page>
            : ''
        }

      </div>
    )
  }
}
export default MemberLand
