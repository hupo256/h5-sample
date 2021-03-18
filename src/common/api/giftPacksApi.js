import ajaxinstance from './ajaxinstance'

const giftPacksApi = () => {
  const gp = {}
  // 获取大礼包详情
  gp.getTradeSpreeDetail = postData => (
    ajaxinstance.post('productMatrix/getTradeSpreeDetail', postData)
  )
  // 获取优惠券吸
  gp.getCouponGroupDetail = params => {
    ajaxinstance.get('productMatrix/getCouponGroupDetail', { params })
  }
  return gp
}

export default giftPacksApi()
