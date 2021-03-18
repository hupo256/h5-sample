const diseaseCreate = (ajaxinstance) => {
    const disease = {}
    // 落地页产品（宝宝，成人）
    disease.activeRule = params => (
      ajaxinstance.get('/product/activeRule', {params})
    )
    // 点击马上解锁, 获取有效联系人
    disease.getAvailableLinkMan = params => (
      ajaxinstance.post('/app/shop/getAvailableLinkMan', params)
    )
    // 
    disease.categoryList = params => (
      ajaxinstance.get('/product/unlock/categoryList', {params})
    )
    // 
    disease.submitProduct = params => (
      ajaxinstance.post('/product/unlock/submitProduct', params)
    )
    return disease
  }
  
  export default diseaseCreate
  