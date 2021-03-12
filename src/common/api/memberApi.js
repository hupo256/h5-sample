import ajaxinstance from './ajaxinstance'

const memberCreate = () => {
  const member = {}

  // 用户信息
  member.myInfo = params => (
    ajaxinstance.get('myInfo/myInfo', { params })
  )

  // 根据关系人ID&vipID 查询是否开通会员
  member.queryLinkManVipByLinkManIdAndVipId = (params) => (
    ajaxinstance.get('vip/queryLinkManVipByLinkManIdAndVipId', { params })
  )

  // 获取vip产品信息
  member.queryVipInfo = (params) => (
    ajaxinstance.get('vip/queryVipInfo', { params })
  )

  // 获取成人vip产品信息
  member.getBannerProductInfoByProductCode = (params) => (
    ajaxinstance.get('app/home/getBannerProductInfoByProductCode', { params })
  )
  //绑定成功页获取banner接口
  member.getBindSuccessBanner = (params) => (
    ajaxinstance.get('product/unlock/bindRecommendList', {params})
  )

  //会员权益信息
  member.getModel = (params) => (
    ajaxinstance.post('member/getModel', params)
  )

   // 领取优惠券 
  member.userRreceiveCoupon = (params) => (
    ajaxinstance.post('/activ/userRreceiveCoupon',  params)
  )

  //会员权益优惠券
  member.getIndexCouponList = (params) => (
    ajaxinstance.get('member/getIndexCouponList', {params})
  )

  //会员购买计录
  member.getBuyLogList = (params) => (
    ajaxinstance.get('member/getBuyLogList', {params})
  )

  //会员支付
  member.submitOrder = (params) => (
    ajaxinstance.post('member/submitOrder', params)
  )

  //取消自动续费
  member.agreementUnSign = (params) => (
    ajaxinstance.post('member/agreementUnSign', params)
  )

  //研究院首页信息
  member.getResearchPageInfo = (params) => (
    ajaxinstance.post('qnaire/getResearchPageInfo', params)
  )

  //专家文章
  member.getArticleInfo = (params) => (
    ajaxinstance.post('qnaire/getArticleInfo', params)
  )

  //专家介绍
  member.getExpertInfo = (params) => (
    ajaxinstance.get('qnaire/getExpertInfo', {params})
  )

  //省钱记录
  member.getUseMemberOrder = (params) => (
    ajaxinstance.post('member/getUseMemberOrder', params)
  )

  return member
}

export default memberCreate()
