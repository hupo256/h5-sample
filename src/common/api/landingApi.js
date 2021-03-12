import ajaxinstance from './ajaxinstance'

const landingApi = () => {
  const landing = {}
  // 获取问卷问题
  landing.myInfo = params => (
    ajaxinstance.get('myInfo/myInfo', { params })
  )
  // 活动模板接口
  landing.getPopularizeActive = params => (
    ajaxinstance.get('/activ/getPopularizeActive', {params})
  )
  // 获取有效检测人
  landing.getAvailableLinkMan = params => (
    ajaxinstance.post('/app/shop/getAvailableLinkMan', params)
  )
  // 获取产品下单详情 新！！！
  landing.getProductBuyDetailInfo = params => (
    ajaxinstance.post('/orderRemould/getProductBuyDetailInfo', params)
  )

  // 检验检测人可解锁产品
  landing.checkUnlockProducts = params => (
    ajaxinstance.post('/app/shop/checkUnlockProducts', params)
  )

  // 非商城发送验证码
  landing.sendMessageCodeNoShop = params => (
    ajaxinstance.post(`app/login/sendVertifyCode?mobileNo=${params.mobileNo}`, params)
  )
  // h5登录h5Login
  landing.h5Login = postData => (
    ajaxinstance.post(`login/h5Login?mobileNo=${postData.mobileNo}&code=${postData.code}&type=${postData.type}`, postData)
  )

  return landing
}

export default landingApi()
