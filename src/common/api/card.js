const cardCreate = (ajaxinstance) => {
  const card = {}
  // 根据关联人ID获取系列信息（分页）
  card.findAllProductSeries = postData => (
    ajaxinstance.post('series/findAllProductSeries', postData)
  )
  // 根据系列ID和关联人ID获取报告产品信息
  card.findSeriesProductById = postData => (
    ajaxinstance.post('series/findSeriesProductById', postData)
  )
  // 卡片首页地图
  card.productSeriesMap = params => (
    ajaxinstance.get('series/productSeriesMap', { params })
  )
  // 商品详情
  card.getScrollbar = params => (
    ajaxinstance.get('series/getScrollbar', { params })
  )
  // 查询是否是新用户
  card.getIsNewOrOldUser = params => (
    ajaxinstance.get('linkman/getIsNewOrOldUser', { params })
  )
  // 老用户领卡
  card.receiveCardProduct = postData => (
    ajaxinstance.post('collector/receiveCardProduct', postData)
  )
  // 报告详情
  card.getReportModuleCardMainInfo = params => (
    ajaxinstance.get('report/getReportModuleCardMainInfo', { params })
  )
  // 判断是用户是否购买
  card.getRedirectParam = params => (
    ajaxinstance.get('report/getRedirectParam', { params })
  )
  // 获取二维
  card.createShareCardQRcode = params => (
    ajaxinstance.get('QRcode/createShareCardQRcode', { params })
  )

  // 卡片封面信息
  card.getUnlockMoudleSeriesInfo = params => (
    ajaxinstance.get('report/getUnlockMoudleSeriesInfo', { params })
  )
  // 获取账号密码
  card.getLeyouCardPasswordInfo = params => (
    ajaxinstance.get('report/getLeyouCardPasswordInfo', { params })
  )
  // 解密
  card.decryptLeyouCardPassword = postData => (
    ajaxinstance.post('report/decryptLeyouCardPassword', postData)
  )
  // 微信消息查询系列卡片并附带优惠券信息
  card.queryAndCheckSeriesProduc = postData => (
    ajaxinstance.post('series/queryAndCheckSeriesProduc', postData)
  )
  return card
}

export default cardCreate
