const orderCreate = (ajaxinstance) => {
  const order = {}
  // 商品添加购物车
  order.addProduct = postData => (
    ajaxinstance.post('cart/addProduct', postData)
  )
  // 删除购物车商品
  order.delCartProduct = postData => (
    ajaxinstance.post('cart/delCartProduct', postData)
  )
  // 查询购物车列表
  order.queryCartProdList = params => (
    ajaxinstance.get('cart/queryCartProdList', { params })
  )
  // 单个物件更新购物车商品数量
  order.addOrUptProduct = postData => (
    ajaxinstance.post('cart/addOrUptProduct', postData)
  )
  // 批量更新购物车商品数量
  order.uptBatchCartProdCount = postData => (
    ajaxinstance.post('cart/uptBatchCartProdCount', postData)
  )
  // 获取用户
  order.orderPaySuccess = params => (
    ajaxinstance.get('/order/orderPaySuccess', { params })
  )
  // 更新商品种类
  order.queryCartProdCount = params => (
    ajaxinstance.get('cart/queryCartProdCount', { params })
  )
  // 提交订单
  order.submitOrder = postData => (
    ajaxinstance.post('order/submitOrder', postData)
  )
  //提交订单 新
  order.submitOrderNew = postData => (
    ajaxinstance.post('orderRemould/submitOrder', postData)
  )
  // 订单详情
  order.myOrderInfo = params => (
    ajaxinstance.get('myInfo/myOrderInfo', { params })
  )
  // 订单详情--新
  order.myOrderKitInfo = params => (
    ajaxinstance.get('myInfo/myOrderKitInfo', { params })
  )
  // 获取用户可用优惠券
  order.couponList = params => (
    ajaxinstance.get('order/couponList', { params })
  )
  // 获取通用产品ID
  order.getCommomProduct = (params) => (
    ajaxinstance.get('product/getCommomProduct', { params })
  )
  // 获取用户可用优惠券--2019年3月1日新加的接口
  order.queryUserCoupon = postData => (
    ajaxinstance.post('activ/queryUserCoupon', postData)
  )
  // 获取订单支付参数
  order.prepayOrder = params => (
    ajaxinstance.get('order/prepayOrder', { params })
  )
  // 获取顺丰订单跟踪查询
  order.sfexpress = params => (
    ajaxinstance.get('/sfexpress/order/route/search', { params })
  )
  // 获取顺丰订单跟踪查询
  order.cancelOrder = postData => (
    ajaxinstance.post('/order/cancelOrder', postData)
  )
  // 获取顺丰订单跟踪查询
  order.getInviteCodeByCode = params => (
    ajaxinstance.get('/order/getInviteCodeByCode', { params })
  )
  // 获取顺丰订单跟踪查询
  order.getChannelProduct = params => (
    ajaxinstance.get('/channelExpand/getChannelProduct', { params })
  )
  // 获取用户
  order.selectBuyUser = params => (
    ajaxinstance.get('/cart/selectBuyUser', { params })
  )

  // 获取订单列表信息
  order.submitProduct = params => (
    ajaxinstance.post('/product/unlock/submitProduct', params)
  )
  return order
}

export default orderCreate
