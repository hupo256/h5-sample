import React from 'react'
import propTypes from 'prop-types'
import wx from 'weixin-js-sdk'
import { Toast } from 'antd-mobile'
import { Page, Check, Coupon, Form } from '@src/components'
import { reg, API, fun, ua, point } from '@src/common/app'
import List from './list'

import MemberList from '../component/memberList'
import Banner from '../component/memberBanner'
import LinkMan from '../component/linkMan'
import AgreeModal from '../component/agreeModal'
import noPay from '@static/nopay.png'
import styles from '../order'
import {
  trackPointOrderSubmitPageView,
  trackPointOrderSubmitPageGoto
} from '../buried-point'

const { getSetssion, setSetssion, fixScroll, getParams } = fun
const { isIos,isWechat,isAndall  } = ua
const { allPointTrack } = point
const viewTypeTxt = [
  'series_cover_map',
  'series_cover_list',
  'series_detail_all',
  'card_product_detail_all',
  'card_product_detail_card',
  'report_list_all',
  'report_list_card',
  'card_report_detail_all',
  'card_report_detail_card:'
]

class SubmitOrder extends React.Component {
  static propTypes = {
    userInfo: propTypes.object,
    history: propTypes.object
  }

  state = {
    formData: {},
    list: [],
    code: '',
    max: {},
    CodeMoney: 0,
    couponType: 1,
    visible: false,
    couponList: [],
    currencyProd: {}, // 通用商品
    isAgree: true, // 默认选中同意协议
    agreeModal: false, // 用户协议弹层
    formState: true,
    noPayVisible:false,
    getType:0
  }
  // 埋点记录去提交订单
  trackPointOrderSubmitGoto(productNum, productMoney) {
    const { list } = this.state
    const { buyType, viewType } = getParams()
    const { seriesId, productName } = list[0] || {}
    let params = {}
    if (+buyType === 4) {
      params = {
        business_type: 'unlock',
        product_num: 1,
        series_id: seriesId,
        series_name: productName,
        buy_type_desc: buyType,
      }
    }
    let obj = {
      eventName: 'order_submit_goto',
      pointParams: {
        business_type: !buyType ? 'test' : 'unlock',
        product_num: productNum,
        product_amount: +productMoney,
        view_type: viewTypeTxt[viewType],
        ...params
      }
    }
    allPointTrack(obj)
    // 埋点明细记录
    for (let od of buyType ? list[0].lockCards : list) {
      const { prodId, productName = '', productPrice = '', productNum = 1, productCode = '' } = od
      let obj = {
        eventName: 'order_product_submit_goto',
        pointParams: {
          ...params,
          product_id: prodId,
          product_name: productName,
          product_price: productPrice,
          product_type: productCode,
          business_type: !buyType ? 'test' : 'unlock',
          view_type: viewTypeTxt[viewType],
          product_num: +buyType ? 1 : productNum,
          product_amount: +buyType ? list[0].productPrice : productPrice * (+productNum)
        }
      }
      allPointTrack(obj)
    }
  }
  // 埋点记录提交订单
  trackPointOrderSubmit(eventOrder, eventOrderDetail, orderInfo) {
    let { money = 0, couponType, CodeMoney, list, type,orderUserInfoKitInfo } = this.state
    const limitAmount = orderUserInfoKitInfo?orderUserInfoKitInfo.totalDiscountPrice:this.computrCoupan()
    const costMoney = +couponType ? (money - limitAmount) < 0 ? 0
      : (money - limitAmount).toFixed(2) : (money - CodeMoney) < 0 ? 0 : (money - CodeMoney).toFixed(2)
    const { orderId, orderAddressRequest } = this.state.mdDataObj || {}
    const { name, mobile, provinces, city } = orderAddressRequest
    const { buyType="" } = getParams()
    const { seriesId, productName } = list[0] || {}
    const { channelCode, inviteCode = '', userCouponId = '' } = orderInfo
    let params = {}
    if (+buyType === 4) {
      params = {
        sale_channel: channelCode,
        series_name: productName,
        series_id: seriesId,
        buy_type_desc: buyType,
      }
    }
    let baseOrderInfo = {
      order_id: orderId,
      order_time: new Date(),
      order_amount: money,
      order_actual_amount: type ? money : costMoney,
      order_discount_amount: +couponType ? limitAmount : money > CodeMoney ? CodeMoney : money,
      coupon_code_amount: CodeMoney,
      coupon_amount: limitAmount,
      order_type: '1',
      business_type: +buyType === 1 ? 'test' : 'unlock',
      receiver_name: name.substr(0, 1) + '**',
      receiver_phone: mobile.substr(0, 3) + '*****' + mobile.substr(8, 3),
      receiver_province: provinces,
      receive_city: city,
      coupon_id: userCouponId,
      coupon_code: inviteCode,
      receiver_address: '******', // addressDetail
      ...params
    }
    let obj = {
      eventName: eventOrder,
      pointParams: baseOrderInfo
    }
    allPointTrack(obj)
    if(orderUserInfoKitInfo){
      list = Object.assign(list,getSetssion("shopList"))
    }
    // 埋点明细记录

    for (let od of buyType ? list[0].lockCards : list) {
      const { prodId, productName = '', productPrice = '', productNum = 1, productCode = '' } = od
      let obj = {
        eventName: eventOrderDetail,
        pointParams: {
          ...baseOrderInfo,
          ...params,
          product_id: prodId,
          product_name: productName,
          product_type: productCode,
          product_price: productPrice,
          coupon_id: userCouponId,
          coupon_code: inviteCode,
          product_amount: +buyType === 4 ? list[0].productPrice : productPrice * (+productNum),
          product_num: +buyType === 4 ? 1 : productNum,
        }
      }
      allPointTrack(obj)
    }
  }
  queryUserCouponParmas = () => {
    let shopList = getSetssion('shopList')
    let orderUserInfoKitInfo = null
    if(shopList[0].prodId){
      localStorage.removeItem("orderUserInfoKitInfo")
      this.setState({
        orderUserInfoKitInfo:null
      })
    }else{
      orderUserInfoKitInfo = getSetssion("orderUserInfoKitInfo")
    }

    let arr = []
    let str = ''
    const { buyType } = getParams()

    shopList.map((item, index) => {
      let obj = {}
      obj.productId = item.prodId?item.prodId:item.productId
      obj.productNum = item.productNum
      arr.push(obj)
      if(orderUserInfoKitInfo){
        str = str + item.productId + ','
      }else{
        str = str + item.prodId + ','
      }

    })
    let json = {
      orderType: 'JCD',
      orderDetailRequestList: arr,
      productId: str.slice(0, str.length - 1)
    }
    if(orderUserInfoKitInfo){
      json['operateType'] = (orderUserInfoKitInfo.actualType === 1 || orderUserInfoKitInfo.actualType === 3 || orderUserInfoKitInfo.actualType === 8) ? 1:2
      json['activeCode'] = orderUserInfoKitInfo.activeCode
    }
    /* 判断是否为解锁系列订单
    * 如果url上有buyType字段且buyType === 4 || buyType === 5
    * buyType === 4 新客解锁系列
    * buyType === 5 新客开通VIP
    */
    if (buyType && (+buyType === 4 || +buyType === 5)) {
      const { currencyProd } = this.state
      json.orderDetailRequestList = [
        {
          productId: currencyProd.id,
          productNum: 1
        }
      ]
      json['originAmount'] = shopList[0].productPrice
    }

    if (+buyType === 4) {
      json.orderType = 'JSD'
    }

    if (+buyType === 5) {
      json.orderType = 'HYD'
    }

    /** end **/
    return json
  }

  componentDidMount() {
    const { buyType } = getParams()
    const { channelCode, barCode } = getParams()
    if (channelCode && barCode) {
      this.setState({
        formState: false
      })
    }
    const orderUserInfoKitInfo = getSetssion("orderUserInfoKitInfo")
    if(orderUserInfoKitInfo){
      //1-火锅购买 2-火锅解锁 3-直接购买 5-直接解锁
      const getType = orderUserInfoKitInfo.actualType;
      trackPointOrderSubmitPageView({business_type: (getType === 3 || getType === 1)?"test":"unlock",active_code:orderUserInfoKitInfo.activeCode});
      this.setState({
        active_code:orderUserInfoKitInfo.activeCode,
        getType
      })
    }else{
      trackPointOrderSubmitPageView({ business_type: 'test' })
    }
    getSetssion('medical') && this.setState({ type: true })
    this.getOderMOney()
    /* 如果是新客解锁系列订单 || 新客开通vip
    *
    */
    if(orderUserInfoKitInfo){
      if(!isWechat() && !isAndall()){
        var oHead = document.getElementsByTagName('head')[0]; // 在head标签中创建创建script
        var oScript = document.createElement("script");
        oScript.type = "text/javascript";
        oScript.src = "https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.1/alipayjsapi.min.js";
        oHead.appendChild(oScript)
      }
      this.setState({
        orderUserInfoKitInfo
      })
    }
    if (+buyType === 4 || +buyType === 5) {
      this.getCommomProduct()
    } else {
      this.queryUserCoupon()
    }

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

  // 查询用户优惠券
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

  // 计算订单总金额
  getOderMOney = () => {
    const list = getSetssion('shopList') || []
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
      this.trackPointOrderSubmitGoto(totalNum, money)
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
    })
  }
  // 选择优惠券
  handleSelectCoupn = (max) => {
    let orderUserInfoKitInfo = getSetssion("orderUserInfoKitInfo")
    let shopList = getSetssion("shopList")
    if(orderUserInfoKitInfo){
      let finallProductIds = []
      for(let i = 0;i<shopList.length;i++){
        finallProductIds.push({productId:shopList[i].productId,productNum:shopList[i].productNum})
      }
      const params = {
        linkManId:orderUserInfoKitInfo.linkManId,
        actualType:orderUserInfoKitInfo.actualType,
        productList:finallProductIds,
        activeCode:orderUserInfoKitInfo.activeCode,
        userCouponId:max.id
      }
      if (orderUserInfoKitInfo.extraData) params.extraData = orderUserInfoKitInfo.extraData
      API.getProductBuyDetailInfo(params).then((res)=>{
        if(res.data.buyInfo['transportCost']){
          res.data.buyProductList[0].productList[0]["transportCost"] = res.data.buyInfo['transportCost']
        }
        const tempList = res.data.buyProductList[0].productList
        const tempObj = {...res.data.userInfo,...res.data.buyInfo,kitInfo:res.data.buyProductList[0].kitInfo,actualType:params.actualType,activeCode:params.activeCode,extraData:orderUserInfoKitInfo.extraData || null}
        //setSetssion("orderUserInfoKitInfo", tempObj)
        this.setState({
          orderUserInfoKitInfo:tempObj,
        })

      })
    }
    this.setState({
      max,
      visible: false,

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
  // 优惠码
  onHandleChange = () => {
    const { couponType, code, money } = this.state
    const list = getSetssion('shopList') || []

    let orderUserInfoKitInfo = getSetssion("orderUserInfoKitInfo")
    if (!/^[A-Za-z0-9]+$/.test(code) && !+couponType){

      this.setState({
        orderUserInfoKitInfo
      })
      return
    }

    let shopList = getSetssion("shopList")
    if(orderUserInfoKitInfo){
      let finallProductIds = []
      for(let i = 0;i<shopList.length;i++){
        finallProductIds.push({productId:shopList[i].productId,productNum:shopList[i].productNum})
      }
      const params = {
        linkManId:orderUserInfoKitInfo.linkManId,
        actualType:orderUserInfoKitInfo.actualType,
        productList:finallProductIds,
        activeCode:orderUserInfoKitInfo.activeCode,
        inviteCodeNumber:+couponType?"":code,
      }
      if (orderUserInfoKitInfo.extraData) params.extraData = orderUserInfoKitInfo.extraData
      API.getProductBuyDetailInfo(params).then((res)=>{
        if(res.data.buyInfo['transportCost']){
          res.data.buyProductList[0].productList[0]["transportCost"] = res.data.buyInfo['transportCost']
        }
        const tempList = res.data.buyProductList[0].productList
        const tempObj = {...res.data.userInfo,...res.data.buyInfo,kitInfo:res.data.buyProductList[0].kitInfo,actualType:params.actualType,activeCode:params.activeCode,extraData:orderUserInfoKitInfo.extraData || null}
        //setSetssion("orderUserInfoKitInfo", tempObj)
        this.setState({
          orderUserInfoKitInfo:tempObj,
        })
      })
    }

    const getInviteCodeByCode = () => {
      API.getInviteCodeByCode({ inviteCode: code, noloading: 1 }).then(res => {
        const { data } = res
        if (data) {
          const { limitProduct, discountValue, limitAmount } = data
          const id = list.find(item => +item.prodId === limitProduct)
          if (limitAmount <= +money && (id || !limitProduct)) {
            this.setState({
              CodeMoney: discountValue,
            })
          }
          return
        }
        this.setState({ CodeMoney: 0 })
      })
    }
    if(!+couponType){
      getInviteCodeByCode()
    }

  }
  // 提交订单
  handleSubmit = () => {
    const { formData, list, couponType, max, code, type, isAgree,orderUserInfoKitInfo } = this.state
    let { name, adders = [], mobile, addressDetail } = formData
    const { buyType, barCode } = getParams()
    const saleChannelCode = getParams().channelCode
    name && (name = name.replace(/(^\s*)|(\s*$)/g, ''))

    addressDetail && (addressDetail = addressDetail.replace(/(^\s*)|(\s*$)/g, ''))

    if(!orderUserInfoKitInfo || orderUserInfoKitInfo.addressFlag === 1){
      if (!saleChannelCode || !barCode) {
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
    }


    if (!+couponType && !/^[A-Za-z0-9]+$/.test(code)) {
      Toast.info('优惠码格式不正确')
      return
    }

    if (!isAgree) {
      Toast.info('请了解安我服务协议')
      return
    }

    Toast.loading('提交订单中...', 20)
    const [provinces, city, area] = adders
    const source = localStorage.getItem('source') || ''
    const medium = localStorage.getItem('medium') || ''
    let channelCode = 'YATGTI'
    let coupon = { userCouponId: couponType ? max.id ? max.id + '' : '' : '' }
    !+couponType && (coupon = { inviteCode: code })
    const yqyInfo = getSetssion('yqyInfo') || {}
    let yqy = {}
    if (yqyInfo.docterid) {
      yqy = {
        channelCode: yqyInfo.channelcode,
        source: 'yunqy',
        medium: 'yunqy',
        referenceId: yqyInfo.docterid
      }
    }

    let obj = {
      ...coupon,
      fromCartFlag: list[0].fromCartFlag ? '' : '1',
      activeCode: list[0].activeCode || '',
      source,
      medium,
      channelCode,
      noloading: 1,
      limitOrderType: 'JCD',
      orderDetailRequestList: [],
      ...yqy
    }
    // 春节分享添加来源
    const sF = getSetssion('springFission')
    if (sF.name == 'springFission') {
      obj.source = sF.userCode
      localStorage.removeItem('springFission')
    }
    if (saleChannelCode && barCode) {
      obj.channelCode = saleChannelCode
      obj.barCode = barCode
      obj.orderAddressRequest = {
        name: 'xuejiao',
        addressDetail: '天安门广场',
        adders: '',
        provinces: '北京市',
        area: '东城区',
        city: '北京市',
        mobile: '15019821795'
      }
    } else {
      if(!orderUserInfoKitInfo || orderUserInfoKitInfo.addressFlag === 1){

        obj.orderAddressRequest = {
          ...formData,
          name,
          addressDetail,
          adders: '',
          provinces: provinces,
          city: city.split('-')[1],
          area: area.split('-')[1]
        }
      }else{
        obj.orderAddressRequest = {}
      }

    }
    /* 判断是否为解锁系列订单
    * 如果url上有buyType字段且buyType === 4 则为新客解锁卡片系列订单
    */
    if (buyType && +buyType === 4) {
      obj.buyType = buyType
      obj.seriesId = list[0].seriesId
      obj.linkManId = list[0].linkManId
      obj.orderType = 'JSD'
      obj.limitOrderType = 'JSD'
    }

    if (buyType && +buyType === 5) {
      obj.buyType = buyType
      obj.vipId = getParams().vipId || ''
      obj.orderType = 'HYD'
      obj.limitOrderType = 'HYD'
      obj.originAmount = list[0].productPrice
    }
    /** end **/

    list.map(item => {
      const shopObj = {
        productId: '' + item.prodId,
        productNum: item.productNum ? '' + item.productNum : '1'
      }
      obj.orderDetailRequestList.push(shopObj)
    })

    type && (obj.userCouponId = '')

    const productAry = getSetssion('shopList')
    let saveProductList = [];
    productAry.map(item=>{
      saveProductList.push({productId:item.productId,productNum:item.productNum})
    })
    if(orderUserInfoKitInfo){
      let orderKitInfo = getSetssion("orderUserInfoKitInfo")
      let params = {
        extParameters:{
          ...orderKitInfo.people,
          linkManId:orderUserInfoKitInfo.linkManId,
          actualType:orderUserInfoKitInfo.actualType,
          source,
          channelCode:orderUserInfoKitInfo.channelCode ? orderUserInfoKitInfo.channelCode : 'YATGTI',
          channelId:orderUserInfoKitInfo.channelId,
          viewType:orderUserInfoKitInfo.viewType,
          ...yqy,
          medium,
          clientType:"h5",
          activeCode:orderUserInfoKitInfo.activeCode,
          orderAddressReq:{...obj.orderAddressRequest},
        },

        orderSubmitProductList:[
          {kitInfo:orderUserInfoKitInfo.kitInfo,productList:saveProductList}
        ]
      }
      if(+couponType){
        params.extParameters['userCouponIds'] = [orderUserInfoKitInfo.userCouponId]
      }else{
        params.extParameters['inviteCodeNumber'] = code?code:null
      }
      if (orderUserInfoKitInfo.giveFlag) {
        params.extParameters['giveFlag'] = true
      }
      if (orderUserInfoKitInfo.extraData) {
        params.extraData = orderUserInfoKitInfo.extraData
      }
      this.NewSubmitOrder(params)
    }else{
      this.submitOrder(obj)
    }
  }

  NewSubmitOrder = (obj) => {
    const {getType,active_code} = this.state;
    let setRes = null;
    API.submitOrderNew(obj).then(result => {
      if (!result.code) {
        const { orderId,payFlag } = result.data
        this.setState({ mdDataObj: { orderId, ...obj } })
        let postData = { orderId, noloading: 1 }
        // 判断是否是在wx小程序环境if(res.miniprogram)
        if(!isWechat() && !isAndall()){
          postData.payType = 'MWEB'
        }

        wx.miniProgram.getEnv(function (res) {
          let postData = { orderId, noloading: 1 }
          if (res.miniprogram) {
            postData.payType = 'miniPay'
          }
          setRes = res;
        })
        this.prepayOrder(postData,setRes,payFlag)
      }
    })
  }

  prepayOrder = (postData,res,payFlag) =>{

    const _this = this
    const yqyInfo = getSetssion('yqyInfo') || {}
    const {getType,active_code} = this.state;
    const { buyType, channelCode, barCode } = getParams()
    const {orderId} = postData;
    trackPointOrderSubmitPageGoto({ business_type: (getType === 3 || getType === 1)?"test":"unlock",active_code })
    if(!payFlag){
      Toast.info("支付成功")
      this.goToSuccess(orderId);
      return;
    }

    API.prepayOrder(postData)
    .then(response => {
      if (!response.code) {

        // _this.props.queryCartProdCount()
        const { prepayId, packageStr, ...obj } = response.data
        Toast.hide()
        Toast.info('正在跳转..')
        if (!isWechat() && !isAndall()) {
          if(localStorage.getItem('orderBack')){
            localStorage.removeItem('orderBack')
          }

          if(meteor){
            meteor.track("shopping", {convert_id: "1666661510189060"})
          }
          setTimeout(() => {
            Toast.hide()
            window.location.href = response.data.mwebUrl
          }, 500)

          // var referLink = document.createElement('a')
          // referLink.href = response.data.mwebUrl
          // referLink.target = '_blank'
          // document.body.appendChild(referLink)
          // referLink.click()
        }
        if ( res && res['miniprogram']) {
          // 点击微信支付后，调取统一下单接口生成微信小程序支付需要的支付参数
          let params = '?appId=' + obj.appId + '&timestamp=' + obj.timestamp +
            '&nonceStr=' + obj.nonceStr + '&' + packageStr + '&prepayId=' + prepayId +
            '&signType=' + obj.signType + '&paySign=' + obj.paySign +
            '&orderId=' + orderId + '&type=0'
          // 定义path 与小程序的支付页面的路径相对应
          let path = '/pages/wxpay/wxpay' + params
          // 通过JSSDK的api使小程序跳转到指定的小程序页面
          wx.miniProgram.navigateTo({ url: path })
        } else if(isWechat()){
          wx.chooseWXPay({
            ...obj,
            package: packageStr,
            success: (res) => {
              // yqyInfo.docterid && setSetssion('yqyInfo', {})
              // // 完成支付埋点
              //_this.trackPointOrderSubmit('order_complete', 'order_product_complete', { orderId, ...obj })
              // _this.props.history.push(
              //   `/pay-success?orderId=${orderId}&type=0&buyType=${buyType}` +
              //   `&docterid=${yqyInfo.docterid || ''}&pageSource=orderSubmit` +
              //   `&channelCode=${channelCode || ''}&barCode=${barCode || ''}`
              // )

              //window.location.replace(`${origin}/andall-report/pay-success?orderId=${orderId}&type=0&buyType=${buyType}` +
              // `&docterid=${yqyInfo.docterid || ''}&pageSource=orderSubmit` +
              // `&channelCode=${channelCode || ''}&barCode=${barCode || ''}`);
              this.goToSuccess(orderId);
            }
          })
        }
        // if(!isWechat() && !isAndall()){
        //   const div = document.createElement('div');
        //   div.innerHTML = response.data.alipayHtml
        //   document.body.appendChild(div);
        //   document.forms[0].submit();
        // }
      }
    })
  }

  goToSuccess =  (orderId) =>{
    const yqyInfo = getSetssion('yqyInfo') || {}
    const {getType,active_code} = this.state;
    const { buyType, channelCode, barCode } = getParams()
    window.history.replaceState({}, '', `${origin}/mkt/orders/pay-success?orderId=${orderId}&type=0&buyType=${buyType}` +
    `&docterid=${yqyInfo.docterid || ''}&pageSource=orderSubmit` +
    `&channelCode=${channelCode || ''}&barCode=${barCode || ''}&activeCode=${active_code}&getType=${getType}`)
    window.location.reload()
  }

  // 提交订单
  submitOrder = (obj) => {
    const _this = this
    const yqyInfo = getSetssion('yqyInfo') || {}
    const { buyType, channelCode, barCode } = getParams()
    API.submitOrder(obj).then(result => {
      if (!result.code) {
        const { orderId } = result.data
        this.setState({ mdDataObj: { orderId, ...obj } })
        trackPointOrderSubmitPageGoto({ business_type: 'test' })
        // 判断是否是在wx小程序环境if(res.miniprogram)
        let postData = { orderId, noloading: 1 }

        wx.miniProgram.getEnv(function (res) {
          if (res.miniprogram) {
            postData.payType = 'miniPay'
          }
          API.prepayOrder(postData)
            .then(response => {
              if (!response.code) {
                // _this.props.queryCartProdCount()
                const { prepayId, packageStr, ...obj } = response.data
                Toast.hide()
                if (res.miniprogram) {
                  // 点击微信支付后，调取统一下单接口生成微信小程序支付需要的支付参数
                  let params = '?appId=' + obj.appId + '&timestamp=' + obj.timestamp +
                    '&nonceStr=' + obj.nonceStr + '&' + packageStr + '&prepayId=' + prepayId +
                    '&signType=' + obj.signType + '&paySign=' + obj.paySign +
                    '&orderId=' + orderId + '&type=0'
                  // 定义path 与小程序的支付页面的路径相对应
                  let path = '/pages/wxpay/wxpay' + params
                  // 通过JSSDK的api使小程序跳转到指定的小程序页面
                  wx.miniProgram.navigateTo({ url: path })
                } else if(isWechat()){
                  wx.chooseWXPay({
                    ...obj,
                    package: packageStr,
                    success: (res) => {
                      yqyInfo.docterid && setSetssion('yqyInfo', {})
                      // 完成支付埋点
                      _this.trackPointOrderSubmit('order_complete', 'order_product_complete', { orderId, ...obj })

                      _this.props.history.push(
                        `/orders/pay-success?orderId=${orderId}&type=0&buyType=${buyType}` +
                        `&docterid=${yqyInfo.docterid || ''}&pageSource=orderSubmit` +
                        `&channelCode=${channelCode || ''}&barCode=${barCode || ''}`
                      )
                    }
                  })
                }
              }
            })
        })
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
    let shopList = getSetssion('shopList')
    if (+buyType === 4) {
      this.props.history.push(`/productdetail?seriesIds=${shopList[0].seriesId}`)
    } else if (typeof buyType === 'undefined') {
      this.props.history.push(`/commodity?id=${shopList[0].prodId}`)
    }
  }
  render() {
    const { visible, list, code, couponList, money = 0, couponType, CodeMoney, type, agreeModal,
      isAgree, formState,orderUserInfoKitInfo ,noPayVisible} = this.state

    const limitAmount = this.computrCoupan()
    const costMoney = +couponType ? (money - limitAmount) < 0 ? 0
      : (money - limitAmount).toFixed(2) : (money - CodeMoney) < 0 ? 0 : (money - CodeMoney).toFixed(2)

    const { buyType } = getParams()

    let vipData = getSetssion('shopList')[0] || {}

    const { vipBanner = '', productBuyDesc, showPrice, transportCost, orderRemark } = vipData
    let headUrl = "";
    if(this.props.userInfo){
      headUrl = this.props.userInfo.headUrl
    }


    const couponAmount = +couponType ? limitAmount : money > CodeMoney ? CodeMoney : money
    const couponTex = couponAmount ? `-￥${couponAmount}` : `￥0`
    return (
      <Page title='提交订单' class={agreeModal ? 'notScroll' : ''}>
        <div className={`pb66 ${visible?styles.noTouch:null}`}>
          {/* 新会员购买 */
            buyType && +buyType === 5
              ? <div className={`mb16`}>
                {
                  vipBanner && vipBanner !== ''
                    ? <Banner data={vipData} />
                    : null
                }

                <div className={`${styles.linkWrap}`}>
                  <LinkMan data={vipData} linkManData={{ avator: headUrl }} />
                </div>
              </div> : null
          }

          <div className={`${styles.orderCon} pb16`}>
            {/* 商品信息 */
              +buyType !== 5
                ? <div className={`${styles.blockFloor} mb16`}>
                  <List
                    list={list}
                    productBuyDesc={productBuyDesc}
                    goDetail={this.goDetail}
                    transportCost={transportCost}
                    showPrice={showPrice}
                    orderUserInfoKitInfo={orderUserInfoKitInfo}
                  />
                </div> : null
            }

            {/* 收货信息 */}

            {!orderUserInfoKitInfo &&
              <div className={`${styles.blockFloor} ${styles.submitForm} mb16`}>
                {
                  formState ? <Form onChange={this.onChange} hasSpace={'N'} /> : ''
                }
              </div>
            }

            {orderUserInfoKitInfo && +orderUserInfoKitInfo.addressFlag === 1 &&
              <div className={`${styles.blockFloor} ${styles.submitForm} mb16`}>
                {
                  formState ? <Form onChange={this.onChange} hasSpace={'N'} /> : ''
                }
              </div>
            }

            {/* 订单信息 */}

            {!orderUserInfoKitInfo &&
              <div className={`${styles.blockFloor} mb16`}>
                {
                  buyType && +buyType === 5
                    ? <MemberList data={vipData} /> : null
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
                            onChange={e => { this.setState({ couponType: e }) }}
                          />
                          <span className={`item ${limitAmount > 0 ? 'red' : ''}`}
                            onClick={() => {
                              couponList.length ? this.setState({ visible: true }) : Toast.info('没有可用优惠券')
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
                              this.setState({ couponType: e }, () => {
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
                              onChange={e => { this.setState({ code: e.target.value }) }}
                              className='input' />
                          </div>
                        </li>
                      </ul>
                    </div>
                  ) : ''
                }
                <div className={`${styles.blockFloor} mb16`}>
                  <div className='white'>
                    <ul className={`fz14 ${styles.info} ${styles.couponInfo}`}>
                      <li className='flex'>
                        <label>商品金额</label>
                        <span className={`item ${styles.black}`}>￥{transportCost ? showPrice : money}</span>
                      </li>

                      { transportCost && <li className='flex'>
                        <label>运费(往返)</label>
                        <span className={`item ${styles.black}`}>￥{transportCost}</span>
                      </li>}

                      {
                        !type ? (
                          <li className='border flex'>
                            <label>优惠金额</label>
                            <span className={`item ${couponAmount ? 'red' : styles.black}`}>{couponTex}</span>
                          </li>
                        ) : ''
                      }
                      <li className='border flex'>
                        <label>实付金额</label>
                        <span className={`item ${styles.black}`}>￥{type ? money : costMoney}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                { // 新用户解锁系列出现该模块
                  buyType && +buyType === 4
                    ? (
                      <div className={`mb10`}>
                        <p className={`${styles.unlockTips}`}>
                          温馨提示：如果您是买给同一个人，只需购买1个系列，就可以解锁其他产品。
                        </p>
                      </div>
                    ) : null
                }
                {
                  buyType ? (
                    <div className={`${styles.unlockExem} mb16`}>
                      选择解锁即授权安我基因提取当前检测者的原始数据以再次解读，
                      为其生成对应产品的检测报告，未经您的授权，我们不会对数据做其他分析解读；
                      解锁产品一经购买，不支持退款。
                    </div>
                  ) : ''
                }
                { /* 用户协议按钮栏 */
                  <div className={`${styles.agreeBlock}`}>
                    <span className={`${isAgree ? styles.isChecked : ''}`}
                      onClick={() => this.handleCheckAgree()}
                    >
                      <span className={`${styles.checkInner}`} />
                    </span>
                    <div className={`${styles.text}`} onClick={() => this.handleLookAgree()}>同意安我服务协议</div>
                  </div>
                }

                {orderRemark && <div className={styles.ordermark}>{orderRemark}</div> }
              </div>
            }

            {orderUserInfoKitInfo &&
              <div className={`${styles.blockFloor} mb16`}>

                {
                  !type ? (
                    <div className='white'>
                      <ul className={`fz14 ${styles.info} ${styles.coupan} ${styles.uniockCoupan}`}>
                        <li className='flex'>
                          <Check name='coupon'
                            value='1'
                            type='radio'
                            id='ts'
                            label='优惠券'
                            defaultChecked
                            onChange={e => { this.setState({ couponType: e },()=>{this.onHandleChange()}) }}
                          />
                          <span className={`item ${couponList.length > 0 && +couponType && orderUserInfoKitInfo.userCouponId ? 'red' : ''}`}
                            onClick={() => {
                              couponList.length ? this.setState({ visible: true }) : Toast.info('没有可用优惠券')
                            }}
                          >{+couponType?couponList.length > 0 && orderUserInfoKitInfo.userCouponId ? '-￥' + orderUserInfoKitInfo.userCouponPrice : '无':`当前共有${couponList.length}张优惠券`}</span>
                        </li>
                        <li className='flex'>
                          <Check
                            name='coupon'
                            value='0'
                            id='sv'
                            type='radio'
                            label='优惠码'
                            onChange={e => {
                              this.setState({ couponType: e }, () => {
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
                              onChange={e => { this.setState({ code: e.target.value }) }}
                              className='input' />
                          </div>
                        </li>
                      </ul>
                    </div>
                  ) : ''
                }
                <div className={`${styles.blockFloor} mb16`}>
                  <div className='white'>
                    <ul className={`fz14 ${styles.info} ${styles.couponInfo}`}>
                      <li className='flex'>
                        <label>商品金额</label>
                        <span className={`item ${styles.black}`}>￥{orderUserInfoKitInfo.totalPrice}</span>
                      </li>

                      { transportCost && <li className='flex'>
                        <label>运费(往返)</label>
                        <span className={`item ${styles.black}`}>￥{orderUserInfoKitInfo.transportCost?orderUserInfoKitInfo.transportCost:0}</span>
                      </li>}

                      {
                        !type ? (
                          <li className='border flex'>
                            <label>优惠金额</label>
                            <span className={`item ${orderUserInfoKitInfo.totalDiscountPrice ? 'red' : styles.black}`}>{orderUserInfoKitInfo.totalDiscountPrice?orderUserInfoKitInfo.totalDiscountPrice:0}</span>
                          </li>
                        ) : ''
                      }
                      <li className='border flex'>
                        <label>实付金额</label>
                        <span className={`item ${styles.black}`}>￥{orderUserInfoKitInfo.actualPrice}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                { // 新用户解锁系列出现该模块
                  buyType && +buyType === 4
                    ? (
                      <div className={`mb10`}>
                        <p className={`${styles.unlockTips}`}>
                          温馨提示：如果您是买给同一个人，只需购买1个系列，就可以解锁其他产品。
                        </p>
                      </div>
                    ) : null
                }
                {
                  buyType ? (
                    <div className={`${styles.unlockExem} mb16`}>
                      选择解锁即授权安我基因提取当前检测者的原始数据以再次解读，
                      为其生成对应产品的检测报告，未经您的授权，我们不会对数据做其他分析解读；
                      解锁产品一经购买，不支持退款。
                    </div>
                  ) : ''
                }
                { /* 用户协议按钮栏 */
                  <div className={`${styles.agreeBlock}`}>
                    <span className={`${isAgree ? styles.isChecked : ''}`}
                      onClick={() => this.handleCheckAgree()}
                    >
                      <span className={`${styles.checkInner}`} />
                    </span>
                    <div className={`${styles.text}`} onClick={() => this.handleLookAgree()}>同意安我服务协议</div>
                  </div>
                }

                {orderRemark && <div className={styles.ordermark}>{orderRemark}</div> }
              </div>
            }
              {/* <div className='white'>
                <h5 className='fz15 p10'>结算</h5>
                <ul className={'fz14 ' + styles.info}>
                  <li className='flex'>
                    <label>商品金额</label>
                    <span className='item'>￥{money}</span>
                  </li>
                  {
                    !type ? (
                      <li className='flex'>
                        <label>优惠</label>
                        <span className='item red'>
                    -￥{+couponType ? limitAmount : money > CodeMoney ? CodeMoney : money}</span>
                      </li>
                    ) : ''
                  }
                  <li className='flex'>
                    <label>实付款</label>
                    <span className='item blue'>￥{type ? money : costMoney}</span>
                  </li>
                </ul>
              </div>
            </div> */}


          <footer className={`imgCenter ${styles.footer} ${styles.pd15}`}>
            {/* <div className='item fz15'>合计：
                <label className='fz17 blue'>¥{type ? money : +costMoney}</label>
              </div>
              <button
                onClick={this.handleSubmit}
                className={'btn fz17 ' + styles.submit}>提交订单 </button> */}
            <div
              onClick={this.handleSubmit}
              className={'redBtn fz17 ' + styles.redBtn}>提交订单 </div>
          </footer>

          <div onClick={() => { this.setState({ visible: false }) }}
            className={styles.coupanbox} style={{ display: visible ? 'block' : 'none' }} >

            <div className={styles.coupanlist} style={{ display: visible ? 'block' : 'none' }}>
              <div className={styles.back}>
                <span>可用优惠券</span>
                <i className={styles.close} onClick={() => { this.setState({ visible: false }) }} />
              </div>
              <div className={styles.scroll}>
                <Coupon list={couponList} onSelect={this.handleSelectCoupn} />
              </div>
            </div>
         </div>
        { /* 用户协议弹层 */
              agreeModal ? <AgreeModal onClose={() => this.closeModal()} /> : null
            }
        </div>

        {noPayVisible &&
        <div className={styles.noPayMask}>
          <div onClick={()=>this.setState({noPayVisible:false})}>
            <img src={noPay} />
          </div>
        </div>
        }
        </div>
      </Page>
    )
  }
}

export default SubmitOrder
