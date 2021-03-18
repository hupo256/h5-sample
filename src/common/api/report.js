const reportCreate = (ajaxinstance) => {
  const report = {}
  // 获取用户列表--暂时没用
  report.getUserReportList = params => (
    ajaxinstance.get('report/getUserReportList', { params })
  )
  // 查询当前用户下面所有的检测者，按照检测者绑定采样器时间升序
  report.listBindUserByUserId = params => (
    ajaxinstance.get('userreport/listBindUserByUserId', { params })
  )
  // 获取用户报告
  report.getUserReport = params => (
    ajaxinstance.get('userreport/getUserReport', { params })
  )
  // 获取示例报告
  report.getSampleUserReportList = params => (
    ajaxinstance.get('/report/getSampleUserReportList', { params })
  )
  // 获取示例报告分享信息，title,desc,imgUrl
  report.getSampleShareInfo = (params) => (
    ajaxinstance.get('/product/productInfo', { params })
  )
  // 过敏列表
  report.getUserReportItemList = params => (
    ajaxinstance.get('report/getUserReportItemList', { params })
  )
  // 过敏列表详情
  report.showSingleUserReportItemDetails = params => (
    ajaxinstance.get('report/showSingleUserReportItemDetails', { params })
  )
  // 营养封面页
  report.getUserReportCover = params => (
    ajaxinstance.get('report/getUserReportCover', { params })
  )
  // 营养列表页
  report.getUserReportItemList = params => (
    ajaxinstance.get('report/getUserReportItemList', { params })
  )

  // 新妈妈PGT 封面页
  report.getUserReportCover = (params) => (
    ajaxinstance.get('report/getUserReportCover', { params })
  )

  // 新妈妈PGT 列表页
  report.getUserReportItemList = (params) => (
    ajaxinstance.get('report/getUserReportItemList', { params })
  )

  // 新妈妈PGT 详情页
  report.showSingleUserReportItemDetails = (params) => (
    ajaxinstance.get('report/showSingleUserReportItemDetails', { params })
  )

  // 新妈妈 详情点赞按钮
  report.reportItemLikeFlagOper = (params) => (
    ajaxinstance.get('report/reportItemLikeFlagOper', { params })
  )

  // 新妈妈 获取用户点赞情况
  report.getReportItemLikeFlag = (params) => (
    ajaxinstance.get('report/getReportItemLikeFlag', { params })
  )

  // 推荐商品 用户领取优惠券
  report.insertRecordOfReceivingCouponsLog = (postData) => (
    ajaxinstance.post('/activ/insertRecordOfReceivingCouponsLog', postData)
  )

  // 推荐商品 唤醒用户--推荐商品
  report.getAwakenUserRecommendProductRest = (params) => (
    ajaxinstance.get('/awakenUserRecommendProduct/getAwakenUserRecommendProductRest', { params })
  )

  // 推荐商品三期
  report.getRecommendProductV3 = (params) => (
    ajaxinstance.get('/activ/getRecommendProductV3', { params })
  )
  // 新版首页
  report.getReportIndex = (params) => (
    ajaxinstance.get('report/getReportIndex', { params })
  )
  // 评论
  report.addSatisfactionRecordByUser = (postData) => (
    ajaxinstance.post('report/addSatisfactionRecordByUser', postData)
  )

  // 更新barcode对应的报告状态为查看
  report.updateUserReportLookStatus = (params) => (
    ajaxinstance.get('userreport/updateUserReportLookStatus', { params })
  )

  // 肌秘报告
  report.adultReport = (params) => (
    ajaxinstance.get('/report/adultReportIndex', { params })
  )
  // 机密报告详情
  report.adultReportTwoLevel = (params) => (
    ajaxinstance.get('/report/adultReportTwoLevelPage', { params })
  )
  // 机密报告的卡片首页信息（身高、体重）
  report.getUnlockMoudleSeriesInfo = (params) => (
    ajaxinstance.get('/report/getUnlockMoudleSeriesInfo', { params })
  )

  // 卡片封面数据请求  getAdultReportRecipes
  report.getAdultReportRecipes = (postData) => (
    ajaxinstance.post('/report/getAdultReportRecipes', postData)
  )

  // 获取用户未读报告标识
  report.getNotReadReportIdentification = (params) => (
    ajaxinstance.get('/report/getNotReadReportIdentification', { params })
  )

  // 报告4.2 主页详情配置
  report.upgradeReportDetail = (postData) => (
    ajaxinstance.post('/upgradeReport/reportDetail', postData)
  )
  // 报告4.2 用户点赞反馈
  report.upgradeReportTraitFeedBackOperation = (postData) => (
    ajaxinstance.post('/upgradeReport/reportTraitFeedBackOperation', postData)
  )
  // 报告4.2 用户意见反馈
  report.upgradeReportGetReportTraitFeedBack = (postData) => (
    ajaxinstance.post('upgradeReport/reportTraitEvaluateOperation', postData)
  )
  // 报告4.2 问卷
  report.microqnaireSubmitAnswer = (postData) => (
    ajaxinstance.post('/microqnaire/submitAnswer', postData)
  )
  // 报告4.3 预览
  report.previewRestructureReportDetail = (postData) => (
    ajaxinstance.post('/upgradeReport/previewRestructureReportDetail', postData)
  )
  
  // Rest-Client测试
  report.geneStory = (postData) => (
    ajaxinstance.get('/geneStory', { postData })
  )
  // 用户想法
  report.dialogueList = (postData) => (
    ajaxinstance.post(baseHost + '/upgradeReport/dialogueList', postData)
  )
  // 示例报告列表页
  report.getUserReports = (postData) => (
    ajaxinstance.post('/api/exampleReportDataRest/getUserReports', postData)
  )
  // 示例报告首页
  report.reportIndex = (postData) => (
    ajaxinstance.post('/api/exampleReportDataRest/reportIndex', postData)
  )
  // 示例红亮点页
  report.highLightList = (postData) => (
    ajaxinstance.post('/api/exampleReportDataRest/highLightList', postData)
  )
  // 示例详情页
  report.reportDetail = (postData) => (
    ajaxinstance.post('/api/exampleReportDataRest/reportDetail', postData)
  )

  // 报告4.4 提交表型
  report.commitPhenotypeCollection = (postData) => (
    ajaxinstance.post('/upgradeReport/upgradeReport/commitPhenotypeCollection', postData)
  )

  // 安小软报告列表
  report.getIntestinalList = (params) => (
    ajaxinstance.post('/upgradeReport/getIntestinalList', params)
  )
  // 安小软报告详情
  report.getIntestinalDetail = (params) => (
    ajaxinstance.get('/upgradeReport/getIntestinalDetail', { params })
  )
  // 领取优惠券
  report.userRreceiveCoupon = (params) => (
    ajaxinstance.post('/activ/userRreceiveCoupon', params)
  )
  // 报告4.4首页分享
  report.reportIndexShare = (postData) => (
    ajaxinstance.post('/upgradeReport/reportIndex', postData)
  )
  // 报告4.4红亮点分享
  report.highLightListShare = (postData) => (
    ajaxinstance.post('/upgradeReport/highLightList', postData)
  )

  //是否收藏
  report.upgradeReportSetCollectionData = (postData) => (
    ajaxinstance.post('/upgradeReport/setCollectionData', postData)
  )
  //
  report.getCollectionData = (postData) => (
    ajaxinstance.post('/upgradeReport/getCollectionData', postData)
  )

  return report
}

// const baseHost = 'https://mktapi.dnatime.com/api'

const baseHost = (location.host.indexOf('wechatshop') === 0) ? 'https://mktapi.dnatime.com/api' : 'https://testmktapi.dnatime.com/api'

// const baseHost = 'https://testmktapi.dnatime.com/api'
export default reportCreate
