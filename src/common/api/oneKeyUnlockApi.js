import ajaxinstance from './ajaxinstance'

const oneKeyUnlockApi = () => {
  const oku = {}
  // 获取所有检测人
  oku.getLinkMan = params => (
    ajaxinstance.get('/app/home/queryBindingInfo', { params })
  )
  oku.getCoupon = params => (
    ajaxinstance.get('/productMatrix/getCouponGroupDetail', { params })
  )
  // 获取检测人解锁列表
  oku.categoryList = params => (
    ajaxinstance.get('/product/unlock/categoryList', { params })
  )
  oku.getProductBuyDetailInfo = params => (
    ajaxinstance.post('/orderRemould/getProductBuyDetailInfo', params)
  )
  return oku
}

export default oneKeyUnlockApi()
