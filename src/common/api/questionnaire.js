const questionnaire = (ajaxinstance) => {
  const questionnaire = {}
  // 获取问卷问题
  questionnaire.getQuestionList = params => (
    ajaxinstance.get('/qnaire/getQnaireInfoByQnaireCode', { params })
  )
  // 保存问卷答案
  questionnaire.saveQuestionAnswer = postData => (
    ajaxinstance.post('/qnaire/addOrUptUserAnswer', postData)
  )

  // 获取最后提交记录
  questionnaire.getUserLastCommitRecord = params => (
    ajaxinstance.get('/qnaire/getUserLastCommitRecord', { params })
  )
  // 获取上一题
  questionnaire.getPreQuestionId = params => (
    ajaxinstance.get('/qnaire/getPreQuestionId', { params })
  )
  // 获取OSStoken
  questionnaire.getOssToken = params => (
    ajaxinstance.get('oss/getOssToken', { params })
  )

  // 获取问卷的信息
  questionnaire.getBasicQnaireInfoByQnaireCode = params => (
    ajaxinstance.get('qnaire/getBasicQnaireInfoByQnaireCode', { params })
  )

  return questionnaire
}

export default questionnaire
