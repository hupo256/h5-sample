import ajaxinstance from './ajaxinstance'
const healthyCreate = () => {
  const healthy = {}
  // 现状测评详情
  healthy.evaluationDetails = postData => (
    ajaxinstance.post('upgradeReport/indexEvaluation/evaluationDetails', postData)
  )
  // 未填写现状测评列表
  healthy.withFillEvaluationList = postData => (
    ajaxinstance.post('upgradeReport/indexEvaluation/withFillEvaluationList', postData)
  )
  // 已填写现状测评列表
  healthy.completedEvaluationList = postData => (
    ajaxinstance.post('upgradeReport/indexEvaluation/completedEvaluationList', postData)
  )
  // 准确度反馈列表
  healthy.accuracyFeedbackList = postData => (
    ajaxinstance.post('upgradeReport/indexEvaluation/accuracyFeedbackList ', postData)
  )
  // 提交问卷
  healthy.commitEvaluation = postData => (
    ajaxinstance.post('upgradeReport/indexEvaluation/commitEvaluation ', postData)
  )
  return healthy
}

export default healthyCreate()
