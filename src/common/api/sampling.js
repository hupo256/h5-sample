const samplingCreate = (ajaxinstance) => {
  const sampling = {}
  // 用户获取已经绑定的采集器
  sampling.getBindCollectorUser = params => (
    ajaxinstance.get('collector/getBindCollectorUser', { params })
  )
  // 添加采集器
  sampling.addCollector = postData => (
    ajaxinstance.post('collector/addCollector', postData)
  )
  // 一键回寄
  sampling.returnCollectorOper = postData => (
    ajaxinstance.post('collector/returnCollectorBatchOper', postData)
  )
  // 用户绑定采集器
  sampling.bindCollectorUser = postData => (
    ajaxinstance.post('collector/bindCollectorUser', postData)
  )
  // 查询所有的有效联系人
  sampling.listAll = params => (
    ajaxinstance.get('linkman/listAll', { params })
  )
  // 查询关系列表
  sampling.relationListAll = params => (
    ajaxinstance.get('relation/listAll', { params })
  )
  // 添加联系人
  sampling.listAdd = postData => (
    ajaxinstance.post('linkman/add', postData)
  )
  // 校验联系人
  sampling.valiDation = params => (
    ajaxinstance.get('linkman/validation', { params })
  )
  // 修改联系人
  sampling.userupdate = postData => (
    ajaxinstance.post('linkman/update', postData)
  )
  // 根据id查询联系人
  sampling.selectById = params => (
    ajaxinstance.get('linkman/selectById', { params })
  )
  // 采集器状态更新
  sampling.uptCollectionStatusByColId = postData => (
    ajaxinstance.post('collector/uptCollectionStatusByColId', postData)
  )

  // 成人唯一绑定 验证绑定限制
  sampling.listOptionalLinkMan = params => (
    ajaxinstance.get('/linkman/listOptionalLinkMan', { params })
  )

  // 成人唯一绑定 验证绑定限制
  sampling.checkCollectorBindLimit = params => (
    ajaxinstance.get('/collector/checkCollectorBindLimit', { params })
  )
  // 用户绑定采集器前操作
  sampling.preBindCollectorUser = params => (
    ajaxinstance.get('collector/preBindCollectorUser', { params })
  )
  // 查看物流
  sampling.searchBymainNo = params => (
    ajaxinstance.get('sfexpress/collector/route/searchBymailNo', { params })
  )
  // 采样器状态
  sampling.listReportStatusInfoByBarCode = params => (
    ajaxinstance.get('collector/listReportStatusInfoByBarCode', { params })
  )

  // 用户绑定采集器前操作
  sampling.validateThirdOrderNo = params => (
    ajaxinstance.post('collector/validateThirdOrderNo', params)
  )
  // 样本绑定授权同意书
  sampling.getUserAuthorizedInfo = params => (
    ajaxinstance.get('collector/getUserAuthorizedInfo', { params })
  )
  // 验证样本绑定授权是否
  sampling.validIsAuthorized = params => (
    ajaxinstance.get('collector/validIsAuthorized', { params })
  )
  // 查看检测者有没有生成报告
  sampling.getLinkManIsHasReport = params => (
    ajaxinstance.get('linkman/getLinkManIsHasReport', { params })
  )
  // 更新检测都信息
  sampling.updateBindLinkMan = postData => (
    ajaxinstance.post('linkman/updateBindLinkMan', postData)
  )
  // 判断barCode对应的报告性别是否一致
  sampling.validBindUserGender = params => (
    ajaxinstance.get('userreport/validBindUserGender', { params })
  )
  // 判断barCode对应的报告性别是否一致
  sampling.validBindUserGender = params => (
    ajaxinstance.get('userreport/validBindUserGender', { params })
  )
  // 性别确认
  sampling.confirmGender = params => (
    ajaxinstance.get('userreport/confirmGender', { params })
  )
  // 样本3.0新增接口
  sampling.getSampleExceptionInfo = params => (
    ajaxinstance.get('repeatSample/getSampleExceptionInfo', { params })
  )
  // 提交修改信息
  sampling.repeatSample = postData => (
    ajaxinstance.post('repeatSample/repeatSample', postData)
  )
  // 放弃重新采样
  sampling.cancelRepeatSample = postData => (
    ajaxinstance.post('repeatSample/cancelRepeatSample', postData)
  )
  // 扫码后增加接口，校验是否是kit采样器
  sampling.checkCollectorType = params => (
    ajaxinstance.get('kitCollector/checkCollectorType', { params })
  )
  // 预绑定接口
  sampling.preBindCollectorUserKit = params => (
    ajaxinstance.get('kitCollector/preBindCollectorUser', { params })
  )
  // 在已有联系人上解锁，校验是否允许解锁
  sampling.validationKit = params => (
    ajaxinstance.get('kitCollector/validation', { params })
  )
  // 新增联系人
  sampling.updateBindLinkManKit = postData => (
    ajaxinstance.post('kitCollector/updateBindLinkMan', postData)
  )
  sampling.bindCollectorUserKit = postData => (
    ajaxinstance.post('kitCollector/bindCollectorUser', postData)
  )
  // 采样器列表
  sampling.getCollectorListKit = params => (
    ajaxinstance.get('kitCollector/getCollectorList', { params })
  )
  // 获取联系人列表
  sampling.listOptionalLinkManKit = params => (
    ajaxinstance.get('kitCollector/listOptionalLinkMan', { params })
  )
  return sampling
}

export default samplingCreate
