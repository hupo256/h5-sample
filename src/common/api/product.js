const productCreate = (ajaxinstance) => {
  const product = {}
  // 有宝宝解锁列表
  product.categoryListUnLockChild = params => (
    ajaxinstance.get('product/unlock/categoryList', { params })
  )
  // 解锁分类列表
  product.categoryListUnLock = params => (
    ajaxinstance.get('product/unlock/active/categoryList', { params })
  )
  // 计算金额
  product.calculatePrice = postData => (
    ajaxinstance.post('product/unlock/calculatePrice', postData)
  )
  // 提交订单
  product.simpleSubmitOrder = postData => (
    ajaxinstance.post('order/simpleSubmitOrder', postData)
  )
  //  提交订单 有宝宝
  product.simpleSubmitOrderChild = postData => (
    ajaxinstance.post('order/unlockSubmitOrder', postData)
  )
  // 299落地页获取检测人信息
  product.getAvailableLinkMan = postData => (
    ajaxinstance.post('app/shop/getAvailableLinkMan', postData)
  )
  // 299详情接口
  product.getPackageActiveByCode = params => (
    ajaxinstance.get('activ/getPackageActiveByCode', { params })
  )
  
  return product
}

export default productCreate
