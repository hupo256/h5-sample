import ajaxinstance from './ajaxinstance'

const userCreate = () => {
  const user = {}
  // 我的优惠券
  user.myCoupon = params => (
    ajaxinstance.get('myInfo/myCoupon', { params })
  )
  // 我的信息
  user.myInfo = params => (
    ajaxinstance.get('myInfo/myInfo', { params })
  )
  // 我的订单
  user.myOrder = params => (
    ajaxinstance.get('myInfo/myOrder', { params })
  )
  // 登陆
  user.login = params => (
    ajaxinstance.get('login/checkMobile', { params })
  )
  // 发送验证码
  user.sendMessageCode = params => (
    ajaxinstance.get('login/sendMessageCode', { params })
  )

  //非商城发送验证码
  user.sendMessageCodeNoShop = params => (
    ajaxinstance.post(`app/login/sendVertifyCode?mobileNo=${params.mobileNo}`, params)
  )
  // 领取优惠券
  user.receiveCoupon = postData => (
    ajaxinstance.post(`activ/receiveCoupon`, postData)
  )
  user.updateBaseInfo = postData => (
    ajaxinstance.post('myInfo/updateBaseInfo', postData)
  )

  //h5登录h5Login
  user.h5Login = postData => (
    ajaxinstance.post(`login/h5Login?mobileNo=${postData.mobileNo}&code=${postData.code}&type=${postData.type}`, postData)
  )
  // 获取账户信息
  user.getMyAccountInfo = () => (
    ajaxinstance.get('pfactiv/getMyAccountInfo')
  )

  // 获取兑换信息
  user.getExchangeInfo = params => (
    ajaxinstance.get('/pfactiv/getExchangeInfo', {params} )
  )

  // 获取卡密
  user.getCdKeyList = params => (
    ajaxinstance.post('/pfactiv/getCdKeyList', params )
  )

  // 设置卡密状态
  user.setCardStatus = params => (
    ajaxinstance.get('/pfactiv/setCardStatus', {params} )
  )

  // 申请兑换
  user.applicateExchange = params => (
    ajaxinstance.post('/pfactiv/applicateExchange', params )
  )
  
  return user
}

export default userCreate()
