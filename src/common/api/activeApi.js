import ajaxinstance from './index'

const activeCreate = () => {
  const active = {}
  // 微信消息查询系列卡片并附带优惠券信息
  active.queryAndCheckSeriesProduct = (postData) => ajaxinstance.post('series/queryAndCheckSeriesProduct', postData)
  // 查询优惠券的接口
  active.listSixChooseOneCoupon = (postData) => ajaxinstance.post('activ/listSixChooseOneCoupon', postData)
  //
  active.receiveCardProduct = (postData) => ajaxinstance.post('collector/receiveCardProduct', postData)
  active.receiveCoupon = (postData) => ajaxinstance.post('activ/receiveCoupon', postData)
  active.checkUserPlanInfo = (params) => ajaxinstance.get('activ/checkUserPlanInfo', { params })
  active.makePlanForLinkMan = (postData) => ajaxinstance.post('activ/makePlanForLinkMan', postData)

  active.queryCouponInfo = (postData) => ajaxinstance.post('activ/queryCouponInfo', postData)
  active.userRreceiveCoupon = (postData) => ajaxinstance.post('activ/userRreceiveCoupon', postData)
  // 提交礼品券
  active.sampling = (postData) => ajaxinstance.post('/scene/sampling', postData)
  // 查询礼品券
  active.findCardAll = (postData) => ajaxinstance.post('/scene/findCardAll', postData)
  // 渠道
  active.findCardChannelAll = (postData) => ajaxinstance.get('scene/findCardChannelAll')

  // 孕产下单
  active.activOrderSubmit = (postData) => ajaxinstance.post('/order/activOrderSubmit', postData)

  // 获取孕产活动信息
  active.getACPAActivInfo = (params) => ajaxinstance.get('activ/getACPAActivInfo', { params })

  // 生成孕产活动分享链接
  active.createShareUrl = (postData) => ajaxinstance.get('activ/createShareUrl', postData)

  // 生成孕产活动
  active.getExpectDateInfo = (params) => ajaxinstance.get('collector/getExpectDateInfo', { params })

  // 生成孕产二期  助力活动管理
  active.getActivInfoByActivId = (params) => ajaxinstance.get('/assist/getActivInfoByActivId', { params })

  // 生成孕产二期 获取分享链接
  active.createShareCode = (params) => ajaxinstance.get('/QRcode/createShareCode', { params })

  // 生成孕产二期 是否已关注
  active.getSubscribe = (params) => ajaxinstance.get('/wx/getSubscribe', { params })

  // 生成孕产二期 开始计时
  active.insertShareRecordTime = (params) => ajaxinstance.post('activ/insertShareRecordTime', { params })

  // 生成孕产二期 助力
  active.assistActiv = (params) => ajaxinstance.get('/assist/assistActiv', { params })

  // 营养小工具 收集基本信息
  active.saveBaseUser = (params) => ajaxinstance.post('/tools/saveBaseUser', params)

  // 营养小工具 收集基本信息
  active.getNutrilonToolsIndex = (params) => ajaxinstance.get('/tools/nutriUtils/index', { params })

  // 营养小工具 收集基本信息
  active.getNutrilonToolsSolution = (params) => ajaxinstance.get('/tools/nutriUtils/solution', { params })

  // 引导解锁
  active.getActivShareActivityInfo = (params) => ajaxinstance.get('/shareActivity/getActivShareActivityInfo', { params })

  active.sendShareActivCoupon = (params) => ajaxinstance.get('/shareActivity/sendShareActivCoupon', { params })

  // 悦跑提现
  active.getCashWithdrawalInfo = (params) => ajaxinstance.post('/upgradeReport/getCashWithdrawalInfo', params)
  active.cashWithdrawal = (params) => ajaxinstance.post('/upgradeReport/cashWithdrawal', params)

  // 春节返现
  active.getSpringIndexConfig = (params) => ajaxinstance.post('/pfactiv/getIndexConfig', params)
  active.getSpringShareConfig = (params) => ajaxinstance.post('/pfactiv/getShareConfig', params)
  active.getSpringShareActivPageInfo = (params) => ajaxinstance.get('/pfactiv/getShareActivPageInfo', { params })
  active.getSpringInvitationRecord = (params) => ajaxinstance.get('/pfactiv/getInvitationRecord', { params })
  active.getSpringRankingRecord = (params) => ajaxinstance.get('/pfactiv/getRankingRecord', { params })

  // 新冠商品
  active.xinguanActiveRule = (params) => ajaxinstance.get('/product/activeRule', { params })

  // 获取领取保险状态
  active.getNewCoronaryInsureRecord = (params) => ajaxinstance.get('/upgradeReport/getNewCoronaryInsureRecord', { params })
  // 提交保险人信息
  active.recordNewCoronaryInsureRecord = (params) => ajaxinstance.post('/upgradeReport/recordNewCoronaryInsureRecord', params)

  //活动模板接口
  active.getPopularizeActive = (params) => ajaxinstance.get('/activ/getPopularizeActive', { params })
  //获取有效检测人
  active.getAvailableLinkMan = (params) => ajaxinstance.get('/app/shop/getAvailableLinkMan', { params })
  //获取产品下单详情 新！！！
  active.getProductBuyDetailInfo = (params) => ajaxinstance.post('/orderRemould/getProductBuyDetailInfo', params)

  //检验检测人可解锁产品
  active.checkUnlockProducts = (params) => ajaxinstance.post('/app/shop/checkUnlockProducts', params)

  // app工具列表
  active.indexToolList = (params) => ajaxinstance.get('/tools/indexToolList', { params })

  return active
}

export default activeCreate()
