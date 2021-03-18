import ajaxinstance from './ajaxinstance'

const questionnaire = () => {
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
  // 获取微问卷的信息
  questionnaire.queryinfobycode = params => (
    ajaxinstance.get('microqnaire/queryinfobycode', { params })
  )
  // 保存微问卷答案
  questionnaire.submitAnswer = postData => (
    ajaxinstance.post('/microqnaire/submitAnswer', postData)
  )

  // 获取推荐信息
  questionnaire.getRecommendInfo = postData => (
    ajaxinstance.post('/qnaire/getRecommendInfo', postData)
  )

  // 获取linkManInfo
  questionnaire.getLinkManInfo = params => (
    ajaxinstance.get('/qnaire/getLinkManInfo', { params })
  )

  //getLinkManInfo
  questionnaire.selectById = params => (
    ajaxinstance.get('/linkman/selectById', { params })
  )
  

  // 修改linkManInfo
  questionnaire.updateLinkManInfo = postData => (
    ajaxinstance.post('/qnaire/update', postData)
  )

  // 修改疾病史
  questionnaire.updSick = postData => (
    ajaxinstance.post('sickDoc/updSick', postData)
  )
  // 删除疾病史
  questionnaire.delSick = postData => (
    ajaxinstance.post('sickDoc/delSick', postData)
  )
  // 添加联系人时，展示的疾病列表信息
  questionnaire.getSickList = params => (
    ajaxinstance.get('sickDoc/getSickList', { params })
  )

  // 添加联系人时，展示的疾病列表信息
  questionnaire.getQnaireJumpInfo = params => (
    ajaxinstance.get('/qnaire/getQnaireJumpInfo', { params })
  )

  return questionnaire
}

export default questionnaire()
