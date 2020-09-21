const heightCreate = (ajaxinstance) => {
  const height = {}
  // 首页
  height.getHeightHomeInfo = params => (
    ajaxinstance.get('height/getHeightHomeInfo', { params })
  )
  // 计算身高
  height.caculateHeight = postData => (
    ajaxinstance.post('height/caculateHeight', postData)
  )
  // 分享信息
  height.getActivShareInfo = params => (
    ajaxinstance.get('height/getActivShareInfo', { params })
  )
  // 微信首页是否跳转到输入页面
  height.checkHasChildHeightReport = params => (
    ajaxinstance.get('height/checkHasChildHeightReport', { params })
  )
  // 查询上次填写信息
  height.getLastInput = params => (
    ajaxinstance.get('height/getLastInput', { params })
  )
  // 宝宝身高记录修改
  height.editHeightInputRecords = postData => (
    ajaxinstance.post('height/editHeightInputRecords', postData)
  )
  // 添加专家预约数据
  height.insertExpertAppointment = postData => (
    ajaxinstance.post('height/insertExpertAppointment', postData)
  )
  // 查询专家预约数据
  height.selectExpertAppointment = params => (
    ajaxinstance.get('height/selectExpertAppointment', { params })
  )
  // 宝宝身高记录查询列表分页
  height.selectHeightInputRecords = postData => (
    ajaxinstance.post('height/selectHeightInputRecords', postData)
  )
  // 查询身高数据
  height.selectHeightRecordsWithoutOrPresentation = postData => (
    ajaxinstance.post('height/selectHeightRecordsWithoutOrPresentation', postData)
  )
  // 添加宝宝身高记录
  height.recordHeightInput = postData => (
    ajaxinstance.post('height/recordHeightInput', postData)
  )
  // 获取商品详情
  height.getHeightProductInfo = params => (
    ajaxinstance.get('height/getHeightProductInfo', { params })
  )

  // 身高工具首页
  height.getHeightHomePageInfo = postData => (
    ajaxinstance.post('height/getHeightHomePageInfo', postData)
  )
  // 3个维度的测评结果查询
  height.getDimensionCheckInfo = postData => (
    ajaxinstance.post('height/getDimensionCheckInfo', postData)
  )
  // 获取文章列表
  height.getArticleByCategory = postData => (
    ajaxinstance.post('height/getArticleByCategory', postData)
  )
  // 获取产品列表
  height.getGoodsByCategory = postData => (
    ajaxinstance.post('height/getGoodsByCategory', postData)
  )
  // 获取问卷信息
  height.getQnaireInfo = params => (
    ajaxinstance.get('height/heightTools/getQnaireInfo', { params })
  )
  // 获取体质的雷达图
  height.getPhysiqueData = params => (
    ajaxinstance.get('height/getPhysiqueData', { params })
  )
  // 宝宝身高记录修改
  height.editHeightInputRecords = postData => (
    ajaxinstance.post('height/editHeightInputRecords', postData)
  )
  // 添加用户问答
  height.addInterlocutionRecord = postData => (
    ajaxinstance.post('height/addInterlocutionRecord', postData)
  )
  // 查询用户问答
  height.getInterlocutionRecord = params => (
    ajaxinstance.get('height/getInterlocutionRecord', { params })
  )
  // 新增家庭身高记录
  height.insertFamilyHeightRecord = postData => (
    ajaxinstance.post('height/insertFamilyHeightRecord', postData)
  )
  
  return height
}

export default heightCreate
