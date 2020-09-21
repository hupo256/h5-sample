import ajaxinstance from './ajaxinstance'

const accountCreate = () => {
  const account = {}
  // 获取分享列表
  account.queryActivShareRecord = params => (
    ajaxinstance.get('activ/queryActivShareRecord', { params })
  )

  // 发送提醒消息
  account.remindUserNews = params => (
    ajaxinstance.get('QRcode/remindUserNews', { params })
  )
  // 获取提现数据
  account.getAccountDetail = params => (
    ajaxinstance.get('account/getAccountDetail', { params })
  )

  // 提现
  account.withdraw = params => (
    ajaxinstance.get('account/withdraw', { params })
  )
  // 活动滚动页
  account.queryRollingMsg = params => (
    ajaxinstance.get('QRcode/queryRollingMsg', { params })
  )
  // 海报接口
  account.queryQRCode = params => (
    ajaxinstance.get('QRcode/createQRCode', { params })
  )
  // 我的页面加合伙人的入口小气泡是否显示
  account.userNoHJMsg = params => (
    ajaxinstance.get('QRcode/userNoHJMsg', { params })
  )
  // 分享获取红包的接口
  account.userScanQRCode = params => (
    ajaxinstance.get('QRcode/userScanQRCode', { params })
  )
  // 会员列表接口
  account.queryBabyMsg = params => (
    ajaxinstance.get('vip/listVip', { params })
  )
  // 系列列表接口
  account.querySeriesMsg = params => (
    ajaxinstance.post('series/listProductSeries', params)
  )
  // 标品列表接口
  account.queryTalentMsg = params => (
    ajaxinstance.get('product/getProductById', { params })
  )
  return account
}

export default accountCreate()
