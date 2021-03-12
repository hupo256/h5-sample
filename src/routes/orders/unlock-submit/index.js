import React from 'react'
import { Toast } from 'antd-mobile'
import propTypes from 'prop-types'
import wx from 'weixin-js-sdk'
import { Page, Check, Coupon, Modal, Form } from '@src/components'
import { API, fun, ua, point, reg } from '@src/common/app'
import List from './list'

import MemberList from '../component/memberList'
import Banner from '../component/memberBanner'
import LinkMan from '../component/linkMan'
import AgreeModal from '../component/agreeModal'
import LoversAgreeModal from '@src/components/lovers-agree'
import { Case } from '@src/components/case/Case'

import heada from '@static/head1.png'
import headb from '@static/head2.png'
import headc from '@static/head3.png'
import headd from '@static/head4.png'

import scanIcon from '@src/assets/images/icon_scan.png'

import styles from '../order'
import {
  trackPointOrdersubmitView,
  trackPointOrdersubmitGoto,
  trackPointOrderSubmitPageView,
  trackPointOrderSubmitPageGoto
} from '../buried-point'
const { isIos } = ua
const { getSetssion, setSetssion, fixScroll, getParams } = fun
const head = ['', heada, headb, headc, headd]

class SubmitOrder extends React.Component {
  static propTypes = {
    linkMan: propTypes.object,
    userInfo: propTypes.object,
    upLindManId: propTypes.func,
    history: propTypes.object
  }
  state = {
    formData: {},
    list: [],
    code: '',
    max: {},
    CodeMoney: 0,
    couponType: 1,
    currencyProd: {},
    visible: false,
    couponList: [],
    selectedLinkMan: {}, // 选择的检测者信息
    canSwitch: false, // 默认可切换
    isAgree: true, // 默认同意用户协议
    agreeModal: false, // 会员用户协议弹层
    userModal: false, // 检测者弹层
    isNewUser: false,
    isLover: false, // 购买蜜侣匹配资格
    isUnlockLand: false, // 是否是299落地页的订单
    scanBarCode: '', // 扫描后的barcode
    newPrices: {}, // 计算之后的价格,
    selectedLinkMan299: {}, // 299折页的落地页选择的检测人||疾病
    isDisease:false, // 是否是疾病落地页
    imgtype:'disease_child', // 疾病产品图片类型
  }

  componentDidMount () {
    const { buyType, flag, isLovers, imgtype,activeCode } = getParams();
    let params={
      business_type: 'unlock',
      active_code:activeCode||''
    }
    trackPointOrderSubmitPageView(params)

    this.setState({ imgtype })
    getSetssion('medical') && this.setState({ type:true })
    this.getOderMOney()

    if (buyType && +buyType === 5) {
      this.setCurSelectedLinkManAsync()
      this.getCommomProduct()
    } else {
      this.queryUserCoupon()
    }
    if (isLovers) {
      this.setState({
        isLover: true,
        isAgree: false
      })
    }
    if (flag === 'unlockLand') {
      trackPointOrdersubmitView()
      this.setState({
        isUnlockLand: true,
        selectedLinkMan299: getSetssion('selectedLinkMan') || {}
      })
    }

    if (flag === 'disease') {
      this.setState({
        isDisease: true,
        selectedLinkMan299: getSetssion('selectedLinkMan') || {}
      })
    }
  }

  // 获取检测者列表
  listBindUserByUserId = () => {
    return API.listBindUserByUserId({ noloading:1 }).then(res => {
      const { data, code } = res

      if (!code && data.length) {
        setSetssion('linkManList', data)
        return true
      }
    })
  }

  // 查询新用户解锁系列通用商品
  getCommomProduct = () => {
    API.getCommomProduct({}).then(res => {
      const { code, data } = res
      if (!code) {
        this.setState({
          currencyProd: data || {}
        }, () => { this.queryUserCoupon() })
      }
    })
  }

  // 查询优惠券
  queryUserCoupon = () => {
    API.queryUserCoupon(this.queryUserCouponParmas()).then(res => {
      const { data } = res
      if (data) {
        const couponList = data
        this.setState({ couponList: couponList || [] }, () => {
          this.getMaxCoupan(couponList)
        })
      }
    })
  }

  setCurSelectedLinkManAsync = async () => {
    let resSuccess = await this.listBindUserByUserId()

    if (resSuccess) {
      this.setCurSelectedLinkMan()
    }
  }

  setCurSelectedLinkMan = () => {
    let _avator = ''
    let _userName = ''
    let _linkMan = getSetssion('unlockList')[0]
    let _switch = true
    const linkManList = getSetssion('linkManList') || []

    linkManList.length > 0 ? _switch = true : _switch = false

    let _cur = linkManList.find(item => {
      return +item.id === +_linkMan.linkManId
    })

    if (_cur !== undefined) {
      _avator = head[_cur.headImgType]
      _userName = _cur.userName
    } else {
      _avator = head[0]
    }

    this.setState({
      canSwitch: _switch,
      selectedLinkMan: {
        linkManId: _linkMan.linkManId,
        userName: _linkMan.linkManUserName || _userName,
        avator: _avator
      }
    }, () => this.getIsNewOrOldUser())
  }

  // 获取该检测者是否是新老用户
  getIsNewOrOldUser = () => {
    const { selectedLinkMan } = this.state
    const { linkManId } = selectedLinkMan

    API.getIsNewOrOldUser({ linkManId: linkManId, noloading:1 }).then(res => {
      const { data, code } = res
      code || this.setState({ isNewUser: data })
    })
  }

  // 组装 查询优惠券参数
  queryUserCouponParmas = () => {
    let unlockList = getSetssion('unlockList')
    const { buyType,flag } = getParams()
    const { currencyProd = {}, isUnlockLand } = this.state;
    let str = ''
    let arr = []

    unlockList && unlockList.length && unlockList.map((item, index) => {
      str = str + item.prodId + ','

      if (item.lockCards && item.lockCards.length) {
        item.lockCards.map(card => {
          let obj = {
            productId: +buyType === 5 ? currencyProd.id : card.prodId,
            productNum: card.productNum || 1
          }
          arr.push(obj)
        })
      }
    })

    let json = {
      orderType: +buyType === 5 ? 'HYD' : 'JSD',
      orderDetailRequestList: arr,
      productId: str.slice(0, str.length - 1),
    }

    /* 如果是解锁系列
     * 则需要传入订单金额
    */
    // console.log(unlockList)
    if (buyType && (+buyType === 4 || +buyType === 5)) {
      json['originAmount'] = unlockList && unlockList[0].productPrice
    }
    if (isUnlockLand) {
      json = {
        linkManId: -1000,
        operateType: 2,
        orderDetailRequestList: unlockList[0].orderDetailRequestList
      }
    }
    if (flag === 'disease') {
      json['originAmount'] = unlockList && unlockList[0].totalPrice||0;
    }

    return json
  }

  // 计算订单总金额
  getOderMOney = () => {
    const { isUnlockLand, isDisease } = this.state
    if (isUnlockLand || isDisease) {
      return
    }
    const list = getSetssion('unlockList') || []
    let money = 0
    let totalNum = 0
    list.map(item => {
      const { productPrice, productNum = 1 } = item
      money += +productPrice * +productNum
      totalNum += productNum
    })
    money = money.toFixed(2)
    this.setState({
      money,
      list
    }, () => {
    })
  }
  // 获取最大优惠券金额
  getMaxCoupan = copun => {
    let max = copun && copun.length ? { ...copun[0] } : {}
    if (copun && copun.length) {
      for (let n = 1, len = copun.length; n < len; n++) {
        const { discountValue } = copun[n]
        discountValue > max.discountValue && (max = copun[n])
      }
    }
    this.setState({
      max
    }, () => {
      this.handleCalculatePrice('coupan', max && max.id)
    })
  }
  // 选择优惠券
  handleSelectCoupn = (max) => {
    this.setState({
      max,
      visible:false
    }, () => {
      this.handleCalculatePrice('coupan', max && max.id)
    })
  }
  // 计算优惠
  computrCoupan = () => {
    const { max = {} } = this.state
    const { discountValue = 0 } = max || {}
    return discountValue || 0.00
  }

  // 获取表单
  onChange = (val, name) => {
    const { formData } = this.state
    formData[name] = val
    this.setState({ formData })
  }
  handleCalculatePrice = (flag, value) => {
    const { productIdList } = getSetssion('unlockList')[0]
    const { selectedLinkMan299 } = this.state
    let params = {
      linkManId: selectedLinkMan299.linkManId || -1000,
      productIdList
    }
    if (flag === 'code') {
      params.inviteCodeNumber = value
    } else {
      params.couponId = value
    }

    API.calculatePrice(params).then(res => {
      const { data } = res
      this.setState({
        CodeMoney: data.couponDiscountPrice,
        newPrices: data
      })
    })
  }
  // 优惠码
  onHandleChange = () => {
    const { couponType, code, money } = this.state
    const list = getSetssion('unlockList') || []
    if (+couponType || !/^[A-Za-z0-9]+$/.test(code)) return
    const getInviteCodeByCode = () => {
      API.getInviteCodeByCode({ inviteCode:code, noloading:1 }).then(res => {
        const { data } = res
        if (data) {
          const { isUnlockLand, isDisease } = this.state
          if (isUnlockLand || isDisease) {
            this.setState({
              inviteCodeId: data.id
            })
            this.handleCalculatePrice('code', code)
            return
          }
          const { limitProduct, discountValue, limitAmount } = data
          const id = list.find(item => +item.prodId === limitProduct)
          if (limitAmount <= +money && (id || !limitProduct)) {
            this.setState({
              CodeMoney:discountValue,
            })
          } else {
            this.setState({ CodeMoney:0 }, () => {
              this.handleCalculatePrice('code', '')
            })
          }
        }
      })
    }
    getInviteCodeByCode()
  }

  // 提交订单按钮
  handleSubmit = () => {
    const { formData, list, couponType, max, code, type, isAgree, isNewUser, isLover, isUnlockLand, scanBarCode, inviteCodeId, selectedLinkMan299, isDisease } = this.state
    const { buyType, vipId = '', buyerNote,activeCode } = getParams()
    if (buyType && +buyType === 5 && isNewUser) {
      let { name, adders = [], mobile, addressDetail } = formData

      name && (name = name.replace(/(^\s*)|(\s*$)/g, ''))
      addressDetail && (addressDetail = addressDetail.replace(/(^\s*)|(\s*$)/g, ''))

      if (!name) {
        Toast.info('请填写收件人')
        return
      }
      if (!reg.phone.test(mobile)) {
        Toast.info('请填写正确手机号')
        return
      }
      if (!adders.length) {
        Toast.info('请选择地区')
        return
      }
      if (!addressDetail) {
        Toast.info('请填写详细地址')
        return
      }
    }

    // 判断优惠码格式
    if (!+couponType && !/^[A-Za-z0-9]+$/.test(code)) {
      Toast.info('优惠码格式不正确')
      return
    }

    if (!isAgree) {
      if (isLover) {
        Toast.info('请先了解一下基因检测知情同意书')
      } else {
        Toast.info('请先了解一下安我服务协议')
      }
      return
    }
    if (isUnlockLand && !selectedLinkMan299.linkManId) {
      if (scanBarCode.length === 0) {
        return Toast.info('请扫描需解锁的采样器条形码')
      }
    }

    Toast.loading('提交订单中...', 20)
    if (isUnlockLand) {
      const unlockList = getSetssion('unlockList')
      let obj = {
        channelCode: 'TS3LZM',
        limitOrderType: 'JSD',
        linkManId: -1000,
        medium: 'guanfang',
        noloading: 1,
        orderDetailProductList: unlockList[0].productIdList,
        source: 'APP',
        activeCode: 'SGZYJS299',
        originalBarCode: scanBarCode,
      }
      if (+couponType === 1) {
        obj.userCouponId = max && max.id
      } else if (+couponType === 0) {
        obj.inviteCodeId = inviteCodeId
      }
      this.handleSimpleSubmitOrder(obj)
      return
    }
    if (isDisease) {
      const unlockList = getSetssion('unlockList')
      let obj = {
        activeCode: activeCode||"",
        source: 'wechat',
        linkManId: -1000,
        noloading: 1,
        channelCode: 'YATGTI',
        limitOrderType: 'JSD',
        medium: 'guanfang',
        orderDetailProductList: unlockList[0].productIdList,

      }
      if (+couponType === 1) {
        obj.userCouponId = max && max.id
      } else if (+couponType === 0) {
        obj.inviteCodeId = inviteCodeId
      }
      this.handleSimpleSubmitOrder(obj, true)
      return
    }
    const source = localStorage.getItem('source') || ''
    const medium = localStorage.getItem('medium') || ''
    let channelCode = 'YATGTI'
    let coupon = { userCouponId:couponType ? max.id ? max.id + '' : '' : '' }
    !+couponType && (coupon = { inviteCode:code })
    const yqyInfo = getSetssion('yqyInfo') || {}
    let yqy = {}
    if (yqyInfo.docterid) {
      yqy = {
        channelCode:yqyInfo.channelcode,
        source:'yunqy',
        medium:'yunqy',
        referenceId:yqyInfo.docterid
      }
    }

    const obj = {
      ...coupon,
      fromCartFlag:list[0].fromCartFlag ? '' : '1',
      source,
      medium,
      channelCode,
      noloading:1,
      limitOrderType: 'JSD',
      orderDetailRequestList:[],
      ...yqy,
      buyType: buyType,
      seriesId: list[0].seriesId, // seriesId 解锁卡片系列必选
      linkManId: list[0].linkManId
    }

    if (buyType && +buyType === 5) {
      const { selectedLinkMan } = this.state
      obj.limitOrderType = 'HYD'
      obj['vipId'] = vipId
      obj['linkManId'] = selectedLinkMan.linkManId
    }

    if (buyType && +buyType === 5 && isNewUser) {
      let { name, adders = [], addressDetail } = formData

      name && (name = name.replace(/(^\s*)|(\s*$)/g, ''))
      addressDetail && (addressDetail = addressDetail.replace(/(^\s*)|(\s*$)/g, ''))

      const [provinces, city, area] = adders

      obj.orderAddressRequest = {
        ...formData,
        name,
        addressDetail,
        adders:'',
        provinces: provinces,
        city: city.split('-')[1],
        area: area.split('-')[1]
      }
    }
    const { linkMan } = this.props
    list.map(item => {
      const shopObj = {
        productId:'' + item.prodId,
        productNum: item.productNum ? '' + item.productNum : '1',
        linkManId: linkMan.linkManId || ''
      }
      obj.orderDetailRequestList.push(shopObj)
    })
    buyerNote && (obj.buyerNote = buyerNote)
    type && (obj.userCouponId = '')
    this.submitOrder(obj)
  }

  // 提交订单
  submitOrder = (obj) => {
    const _this = this
    const yqyInfo = getSetssion('yqyInfo') || {}
    const { buyType } = getParams()
    API.submitOrder(obj).then(res => {
      Toast.loading('加载中...')
      if (!res.code) {
        const { orderId } = res.data
        trackPointOrderSubmitPageGoto({ business_type: 'unlock' })
        // 判断是否是在wx小程序环境if(res.miniprogram)
        wx.miniProgram.getEnv(function (res) {
          let postData = { orderId, noloading:1 }
          if (res.miniprogram) {
            postData.payType = 'miniPayHei'
          }
          API.prepayOrder(postData).then(response => {
            if (!response.code) {
              const { prepayId, packageStr, ...obj } = response.data
              Toast.hide()
              if (res.miniprogram) {
                // 点击微信支付后，调取统一下单接口生成微信小程序支付需要的支付参数
                let params = '?appId=' + obj.appId + '&timestamp=' + obj.timestamp +
                '&nonceStr=' + obj.nonceStr + '&' + packageStr + '&prepayId=' + prepayId +
                '&signType=' + obj.signType + '&paySign=' + obj.paySign +
                '&orderId=' + orderId + '&type=1'
                // 定义path 与小程序的支付页面的路径相对应
                let path = '/pages/wxpay/wxpay' + params
                // 通过JSSDK的api使小程序跳转到指定的小程序页面
                wx.miniProgram.navigateTo({ url: path })
              } else {
                wx.chooseWXPay({
                  ...obj,
                  package:packageStr,
                  success: function (res) {
                    yqyInfo.docterid && setSetssion('yqyInfo', {})
                    // 完成支付埋点
                    const { isHeight } = getParams()
                    if (isHeight) {
                      _this.props.history.push('/buy-success')
                    } else {
                      _this.props.history.push(
                        `/orders/pay-success?orderId=${orderId}&type=1&buyType=${buyType}&pageSource=unlockSubmit`
                      )
                    }
                  }
                })
              }
            }
          })
        })
      } else {
        Toast.info(res.msg)
      }
    })
  }

  // 299提交订单|| 疾病提交订单
  handleSimpleSubmitOrder = (obj, isDisease) => {
    const { selectedLinkMan299 } = this.state
    let fun = ''
    if (selectedLinkMan299.linkManId || isDisease) {
      obj.linkManId = selectedLinkMan299.linkManId
      fun = API.simpleSubmitOrderChild(obj)
    } else {
      fun = API.simpleSubmitOrder(obj)
    }
    const _this = this
    const { buyType,activeCode } = getParams()
    fun.then(res => {
      Toast.loading('加载中...')
      if (!res.code) {
        const { orderId } = res.data
        trackPointOrdersubmitGoto()
        let params={
          business_type: 'unlock',
          active_code:activeCode||''
        }
        trackPointOrderSubmitPageGoto(params)
        // 判断是否是在wx小程序环境if(res.miniprogram)
        wx.miniProgram.getEnv(function (res) {
          let postData = { orderId, noloading:1 }
          if (res.miniprogram) {
            postData.payType = 'miniPayHei'
          }
          API.prepayOrder(postData).then(response => {
            if (!response.code) {
              const { prepayId, packageStr, ...obj } = response.data
              Toast.hide()
              if (res.miniprogram) {
                // 点击微信支付后，调取统一下单接口生成微信小程序支付需要的支付参数
                let params = '?appId=' + obj.appId + '&timestamp=' + obj.timestamp +
                '&nonceStr=' + obj.nonceStr + '&' + packageStr + '&prepayId=' + prepayId +
                '&signType=' + obj.signType + '&paySign=' + obj.paySign +
                '&orderId=' + orderId + '&type=1'
                // 定义path 与小程序的支付页面的路径相对应
                let path = '/pages/wxpay/wxpay' + params
                // 通过JSSDK的api使小程序跳转到指定的小程序页面
                wx.miniProgram.navigateTo({ url: path })
              } else {
                wx.chooseWXPay({
                  ...obj,
                  package:packageStr,
                  success: function (res) {
                    const { isHeight } = getParams()
                    if (isHeight) {
                      _this.props.history.push('/buy-success')
                    } else {
                      _this.props.history.push(
                        `/orders/pay-success?orderId=${orderId}&type=1&buyType=${buyType}&flag=unlockLand&pageSource=unlockSubmit&activeCode=${activeCode}`
                      )
                    }
                  }
                })
              }
            }
          })
        })
      } else {
        Toast.info(res.msg)
      }
    })
  }

  // 点击切换检测者
  handleSwitchLinkMan = () => {
    const { isUnlockLand } = this.state
    if (isUnlockLand) return
    let _linkManList = getSetssion('linkManList') || []

    if (_linkManList.length > 0) {
      this.setState({
        userModal: true
      })
    }
  }

  // 选择检测者
  selectedLinkMan = (item) => {
    const { linkManId = '' } = this.props.linkMan || {}
    this.setState({
      selectedLinkMan: { linkManId: item.id, userName: item.userName, avator: head[item.headImgType || 0] },
      userModal: false
    }, () => {
      this.getIsNewOrOldUser()
      linkManId !== item.id && this.saveLastUserLindManId({ linkManId: item.id, userName: item.userName })
    })
  }

  /**
   * 保留最后一次切换用户
   */
  saveLastUserLindManId = (params = {}) => {
    const { linkManId, userName } = params
    return API.saveLastUserLindManId({ linkManId, noloading:1 }).then(res => {
      if (!res.code) {
        Toast.success(`已为您切换成${userName}`, 1.5)
        this.props.upLindManId(params)
      }
    })
  }

  // 勾选同意用户协议
  handleCheckAgree = () => {
    let { isAgree } = this.state

    this.setState({
      isAgree: !isAgree
    })
  }

  // 查看用户协议
  handleLookAgree = () => {
    this.setState({
      agreeModal: true
    })
  }

  // 关闭弹层
  closeModal = () => {
    this.setState({
      agreeModal: false,
      userModal: false
    })
  }
  // 跳转详情
  goDetail = () => {
    const { buyType } = getParams()
    let unlockList = getSetssion('unlockList')
    if (+buyType === 4) {
      this.props.history.push(`/productdetail?seriesIds=${unlockList[0].seriesId}`)
    } else if (+buyType === 2) {
      this.props.history.push(`/commodity?id=${unlockList[0].prodId}`)
    } else if (+buyType === 3) {
      this.props.history.push(`/productdetail?id=${unlockList[0].prodId}&seriesIds=${unlockList[0].seriesId}`)
    }
  }
  // 调微信的扫一扫
  handleScan = () => {
    const _this = this
    wx.scanQRCode({
      needResult: 1,
      success:function (res) {
        const scanBarCode = res.resultStr.split(',')[1] || res.resultStr.split(',')[0]
        _this.setState({ scanBarCode })
      },
      fail:function (res) {
      },
      error: function (res) {
        if (res.errMsg.indexOf('function_not_exist') > 0) {
          alert('版本过低请升级')
        }
      }
    })
  }

  handleCalculateClick = (type, e) => {
    const { code, max } = this.state
    this.setState({ couponType: e }, () => {
      if (type === 'code') {
        this.onHandleChange(code)
        this.handleCalculatePrice(type, '')
      } else {
        this.handleCalculatePrice(type, max && max.id)
      }
    })
  }
  handleChangeCoupon = (e) => {
    const { couponList, couponType } = this.state
    if (+couponType !== 1) return
    couponList.length ? this.setState({ visible:true }) : Toast.info('没有可用优惠券')
  }
  render () {
    const { buyType } = getParams()
    const { visible, list, code, couponList, money = 0, couponType, CodeMoney, type, agreeModal, isAgree, userModal, selectedLinkMan, canSwitch, isNewUser, isLover, isUnlockLand, scanBarCode, newPrices, selectedLinkMan299, isDisease, imgtype } = this.state
    const { totalPrice, actualPrice, totalDiscountPrice } = newPrices || {}
    const limitAmount = this.computrCoupan()
    const { userInfo } = this.props
    const costMoney = +couponType ? (money - limitAmount) < 0 ? 0
      : (money - limitAmount).toFixed(2) : (money - CodeMoney) < 0 ? 0 : (money - CodeMoney).toFixed(2)

    let vipData = getSetssion('unlockList')[0] || {}
    let userList = getSetssion('linkManList') || []
    const { vipBanner = '' } = vipData

    return (
      <Page title='提交订单' class={agreeModal ? 'notScroll' : ''}>
        <div className={`pb66`}>
          { /* 会员banner */
            buyType && +buyType === 5
              ? <div>
                {
                  vipBanner && vipBanner !== ''
                    ? <Banner data={vipData} />
                    : null
                }
                <div className={`${styles.linkWrap} mb8`}>
                  <LinkMan
                    data={vipData}
                    linkManData={selectedLinkMan299.linkManId ? selectedLinkMan299 : selectedLinkMan}
                    canSwitch={isUnlockLand ? false : canSwitch}
                    userInfo={userInfo}
                    isUnlockLand={isUnlockLand}
                    onHandle={() => this.handleSwitchLinkMan()} />
                </div>
              </div> : null
          }

          { /* 订单信息 */}
          <div className={`${styles.unlockPayWrap}`}>
            {/* 收货信息 */
              +buyType === 5 && isNewUser && !isUnlockLand
                ? <div className={`${styles.blockFloor} ${styles.submitForm} mb16`}>
                  <Form onChange={this.onChange} hasSpace={'N'} />
                </div> : null
            }

            <div className={`${styles.unlockPay} mb16`}>
              {
                buyType && +buyType !== 5
                  ? <List list={list} buyType={buyType} goDetail={this.goDetail} imgtype={imgtype} />
                  : null
              }

              {/* 会员订单信息相关 */
                buyType && +buyType === 5
                  ? <div className='white'>
                    <MemberList data={vipData} />
                  </div> : null
              }
              {/* 299解锁订单页 */}
              {
                isUnlockLand && !selectedLinkMan299.linkManId
                  ? <ul className={`fz14 ${styles.info} ${styles.coupan} ${styles.uniockCoupan}`}>
                    <li className={`flex ${styles.border1px} ${styles.barcodeBox}`}>
                      <label>
                        <span>*</span>
                        采样器编号
                      </label>
                      <div className={`${styles.info}`}>
                        <input type='text' placeholder='请扫描采样器条形码' value={scanBarCode} className={`input ${styles.input1}`} readOnly
                          onClick={this.handleScan}
                        />
                      </div>
                      <img onClick={this.handleScan} className={styles.scan} src={scanIcon} alt='' />
                    </li>
                  </ul>
                  : ''
              }

              {
                !type ? (
                  <div className='white'>
                    <ul className={`fz14 ${styles.info} ${styles.coupan} ${styles.uniockCoupan}`}>
                      <li className='flex jt'>
                        <Check name='coupon'
                          value='1'
                          type='radio'
                          id='ts'
                          label='优惠券'
                          defaultChecked
                          onChange={e => { this.setState({ couponType:e }) }}
                        />
                        <span className={`item ${limitAmount > 0 ? 'red' : ''}`}
                          onClick={() => {
                            couponList.length ? this.setState({ visible:true }) : Toast.info('没有可用优惠券')
                          }}
                        >{limitAmount > 0 ? '-￥' + limitAmount : '无'}</span>
                      </li>
                      <li className='flex'>
                        <Check
                          name='coupon'
                          value='0'
                          id='sv'
                          type='radio'
                          label='优惠码'
                          onChange={e => {
                            this.setState({ couponType:e }, () => {
                              this.onHandleChange(code)
                            })
                          }}
                        />
                        <div className='item fz15'>
                          <input type='text'
                            onBlur={() => {
                              isIos() && window.scrollBy(0, fixScroll().top)
                              this.onHandleChange()
                            }}
                            placeholder='选填 | 请在这里输入优惠码'
                            onChange={e => { this.setState({ code:e.target.value }) }}
                            className='input' />
                        </div>
                      </li>
                    </ul>
                  </div>
                ) : ''
              }
              <div className='white'>
                <ul className={`fz14 ${styles.info} ${styles.couponInfo}`}>
                  <li className='flex'>
                    <label>订单金额</label>
                    <span className={`item ${styles.black}`}>￥{(isUnlockLand || isDisease) ? totalPrice : money}</span>
                  </li>
                  {
                    !type ? (
                      <li className='border flex'>
                        <label>优惠金额</label>
                        {
                          (isUnlockLand || isDisease)
                            ? <span className='item red'>
                          -￥{totalDiscountPrice}</span>
                            : <span className='item red'>
                    -￥{+couponType ? limitAmount : money > CodeMoney ? CodeMoney : money}</span>
                        }
                      </li>
                    ) : ''
                  }
                  <li className='border flex'>
                    <label>实付金额</label>
                    {
                      (isUnlockLand || isDisease)
                        ? <span className={`item ${styles.black}`}>￥{actualPrice}</span>
                        : <span className={`item ${styles.black}`}>￥{type ? money : costMoney}</span>
                    }

                  </li>
                </ul>
              </div>

              <footer className={`imgCenter ${styles.footer} ${styles.pd15}`}>
                <div
                  onClick={this.handleSubmit}
                  className={'redBtn fz17 ' + styles.redBtn}>提交订单 </div>
              </footer>

              <div onClick={() => { this.setState({ visible:false }) }}
                className={styles.coupanbox} style={{ display:visible ? 'block' : 'none' }} />

              <div className={styles.coupanlist} style={{ display:visible ? 'block' : 'none' }}>
                <div className={styles.back}>
                  <span>可用优惠券</span>
                  <i className={styles.close} onClick={() => { this.setState({ visible:false }) }} />
                </div>
                <div className={styles.scroll}>
                  <Coupon list={couponList} onSelect={this.handleSelectCoupn} />
                </div>
              </div>
            </div>

            <div className={`${styles.unlockExem} mb16`}>
              声明：选择解锁即授权安我基因提取当前检测者的原始数据以再次解读，
              为其生成对应产品的检测报告，未经您的授权，我们不会对数据做其他分析解读；
              解锁产品一经购买，不支持退款。
            </div>
            {/* 用户协议按钮栏 */}

            <div className={`${styles.agreeBlock}`}>
              <span className={`${isAgree ? styles.isChecked : ''}`}
                onClick={() => this.handleCheckAgree()}
              >
                <span className={`${styles.checkInner}`} />
              </span>
              <div className={`${styles.text}`} onClick={() => this.handleLookAgree()}>
                {
                  isLover ? '基因检测知情同意书' : '同意安我服务协议'
                }
              </div>
            </div>
            {/* 用户协议弹层 */}
            <Case when={!!(agreeModal)}>
              <div>
                <Case when={!(isLover)}>
                  <AgreeModal onClose={() => this.closeModal()} />
                </Case>
                <Case when={!!(isLover)}>
                  <LoversAgreeModal onClose={() => this.closeModal()} />
                </Case>
              </div>
            </Case>
            { /* 检测者列表弹层 */
              <Modal
                visible={userModal}
                type
                style={{
                  top:'30%',
                  maxHeight:300,
                  overflowY:'hidden'
                }}
                handleToggle={() => { this.closeModal() }}
              >
                <div className={styles.scorll}>
                  <ul className={styles.userList}>
                    {
                      userList.map((item, i) =>
                        <li key={i} className='border jt'
                          onClick={() => { this.selectedLinkMan(item) }}
                        >
                          {item.relationName ? item.relationName + '-' : ''}{item.userName}
                        </li>
                      )
                    }
                  </ul>
                </div>
              </Modal>
            }

          </div>
        </div>
      </Page>
    )
  }
}

export default SubmitOrder
