import ajaxinstance from './ajaxinstance'
const hpvReportCreate = () => {
  const hpvReport = {}
  // hpv列表
  hpvReport.getHPVList = postData => (
    ajaxinstance.post('upgradeReport/getHPVList', postData)
  )
  // 详情
  hpvReport.getHPVDetail = postData => (
    ajaxinstance.post('upgradeReport/getHPVDetail', postData)
  )
  // 反馈
  hpvReport.upgradeReportGetReportTraitFeedBack = (postData) => (
    ajaxinstance.post('upgradeReport/reportTraitEvaluateOperation', postData)
  )
  // 领取优惠券
  hpvReport.getUserCoupon = params => (
    ajaxinstance.get('upgradeReport/getUserCoupon', { params })
  )
  // 再测一次
  hpvReport.setNewQnaireInfo = (postData) => (
    ajaxinstance.post('qnaire/setNewQnaireInfo', postData)
  )
  // 下载报告确认信息
  hpvReport.userRealInfo = (postData) => (
    ajaxinstance.post('upgradeReport/userRealInfo', postData)
  )
  return hpvReport
}

export default hpvReportCreate()
