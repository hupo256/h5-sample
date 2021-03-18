const milvCreate = (ajaxinstance) => {
  const milv = {}
  // 用户获取已经绑定的采集器
  milv.getMatchedLinkMan = params => (
    ajaxinstance.get('linkman/getNoProdMatchedLink', { params })
  )
  // 邀请的二维码
  milv.createMatchQRcode = params => (
    ajaxinstance.get('QRcode/createMatchQRcode', { params })
  )

  // 扫码到邀请页
  milv.checkMatchQRcode = params => (
    ajaxinstance.get('QRcode/checkMatchQRcode', { params })
  )
  // 返回指定条件联系人信息
  milv.listLinkMan = params => (
    ajaxinstance.get('linkman/listHasProdNoMatchedLinkMan', { params })
  )
  // 支付成功页面是否弹蜜侣邀请码的弹框
  milv.getOrderDetailsById = params => (
    ajaxinstance.get('order/getOrderDetailsById', { params })
  )
  // 我们的相处报告
  milv.matchReportIndex = postData => (
    ajaxinstance.post('matchReport/matchReportIndex', postData)
  )

  // 我愿意点击按钮
  milv.createMatchRelation = postData => (
    ajaxinstance.post('userreport/createMatchRelation', postData)
  )

  return milv
}

export default milvCreate
