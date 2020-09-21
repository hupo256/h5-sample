const memberCreate = (ajaxinstance) => {
  const member = {}

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
    ajaxinstance.get('product/unlock/bindRecommendList', {params })
  )

  return member
}

export default memberCreate
