import ajaxinstance from './ajaxinstance'
const brcaReportCreate = () => {
  const brcaReport = {}
 
  // 详情
  brcaReport.getBRCADetail = postData => (
    ajaxinstance.post('upgradeReport/getBRCADetail', postData)
  )

  // 领取优惠券
  brcaReport.userRreceiveCoupon = postData => (
    ajaxinstance.post('activ/userRreceiveCoupon', postData)
  )
  //获取更多信息
  brcaReport.getCollectionData = params => (
    ajaxinstance.get('upgradeReport/getBRCAVariant', {params})
  )
  
  
  return brcaReport
}

export default brcaReportCreate()
