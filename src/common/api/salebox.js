const saleboxCreate = (ajaxinstance) => {
  const salebox = {}
  // 获取用户选择（购买）产品记录
  salebox.getReportUserSelect = postData => (
    ajaxinstance.post('/sellbox/userselect/getReportUserSelect', postData)
  )
  // 根据渠道码查询产品信息
  salebox.listReportSellBoxProduct = postData => (
    ajaxinstance.post('/sellbox/sellboxproduct/listReportSellBoxProduct', postData)
  )
  // 用户确认产品选择
  salebox.userConfirmSelect = postData => (
    ajaxinstance.post('/sellbox/userselect/userConfirmSelect', postData)
  )
  return salebox
}

export default saleboxCreate
