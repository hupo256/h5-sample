import ajaxinstance from './ajaxinstance'
const integrationCreate = () => {
  const integration = {}
  // 查询积分主页信息
  integration.getPointHomeInfo = params => (
    ajaxinstance.get('point/getPointHomeInfo', { params })
  )
  // 回答题目
  integration.submitAnswer = postData => (
    ajaxinstance.post('microqnaire/submitAnswer', postData)
  )
  // 积分明细
  integration.getUserPointDetail = params => (
    ajaxinstance.get('point/getUserPointDetail', { params })
  )
  // 积分规则
  integration.getPointRuleInfo = params => (
    ajaxinstance.get('point/getPointRuleInfo', { params })
  )
  // 提示信息
  integration.getPointTip = params => (
    ajaxinstance.get('point/getPointTip', { params })
  )
  // 抽奖首页
  integration.getAwardHomeInfo = params => (
    ajaxinstance.get('award/getAwardHomeInfo', { params })
  )
  // 抽奖
  integration.doAwardAction = params => (
    ajaxinstance.get('award/doAwardAction', { params })
  )
  // 我的奖品
  integration.getAwardList = params => (
    ajaxinstance.get('award/getAwardList', { params })
  )
  // 未领取实物
  integration.getDrawAwardInfo = params => (
    ajaxinstance.get('award/getDrawAwardInfo', { params })
  )
  // 领取奖品
  integration.drawAward = params => (
    ajaxinstance.post('award/drawAward', params)
  )
  // 规则
  integration.getAwardRule = params => (
    ajaxinstance.get('award/getAwardRule', { params })
  )
  // 查看信息
  integration.integrationSelectById = params => (
    ajaxinstance.get('linkman/selectById', { params })
  )
  integration.integrationListAll = params => (
    ajaxinstance.get('relation/listAll', { params })
  )
  /// 校验联系人信息
  integration.validateLinkManInfoRange = params => (
    ajaxinstance.post('linkman/validateLinkManInfoRange', params)
  )
  // 提交联系人信息
  integration.perfectLinkManInfo = params => (
    ajaxinstance.post('linkman/perfectLinkManInfo', params)
  )
  // 我的信息
  integration.myInfo = params => (
    ajaxinstance.get('myInfo/myInfo', { params })
  )
  // 查询全部商品
  integration.getGoodsList = params => (
    ajaxinstance.get('pointExchange/getGoodsList', { params })
  )
  // 兑换记录
  integration.getExchangeOrderList = params => (
    ajaxinstance.get('pointExchange/getExchangeOrderList', { params })
  )
  // 预校验用户积分是否足够
  integration.preExchangeGoods = params => (
    ajaxinstance.get('pointExchange/preExchangeGoods', { params })
  )
  // 商品详情
  integration.getGoodsDetail = params => (
    ajaxinstance.get('pointExchange/getGoodsDetail', { params })
  )
  // 提交兑换订单
  integration.exchangeGoods = params => (
    ajaxinstance.post('pointExchange/exchangeGoods', params)
  )
  // 查询支付结果
  integration.getPayResult = params => (
    ajaxinstance.get('pointExchange/getPayResult', { params })
  )
  // 订单详情
  integration.getOrderDetail = params => (
    ajaxinstance.get('pointExchange/getOrderDetail', { params })
  )
  // 重新支付
  integration.prePayOrder = params => (
    ajaxinstance.get('pointExchange/prePayOrder', { params })
  )
  // 取消订单
  integration.cancelExchangeOrder = params => (
    ajaxinstance.get('pointExchange/cancelExchangeOrder', { params })
  )
  // 读取充值配置
  integration.readRechargeConfig = params => (
    ajaxinstance.get('app/user/recharge/readRechargeConfig', { params })
  )
  // 预支付GET
  integration.preRecharge = params => (
    ajaxinstance.get('app/user/recharge/preRecharge', { params })
  )
  // 支付成功回调GET
  integration.rechargePaySuccess = params => (
    ajaxinstance.get('app/user/recharge/paySuccess', { params })
  )
  // 绑定充值卡
  integration.bindCard = params => (
    ajaxinstance.get('app/user/recharge/bindCard', { params })
  )
  // 充值明细
  integration.userRechargeDetail = params => (
    ajaxinstance.post('app/user/recharge/userRechargeDetail', params)
  )
  return integration
}

export default integrationCreate()
