const reportCreate = (ajaxinstance) => {
  const report = {}
  report.getVerdictInfo = postData => (
    ajaxinstance.post('qnaire/getVerdictInfo', postData)
  ) 
  report.getRecommendProductInfo = postData => (
    ajaxinstance.post('upgradeReport/getRecommendProductInfo', postData)
  )  
  return report
}
export default reportCreate
