const activContentCreate = (ajaxinstance) => {
  const activContent = {}
  // 根据话题Id查询文章列表
  activContent.getActivContentArticleListByTopicId = postData => (
    ajaxinstance.post('/activ/getActivContentArticleListByTopicId', postData)
  )
  // 根据内容Id查询内容详情
  activContent.getActivContentDetailById = postData => (
    ajaxinstance.post('/activ/getActivContentDetailById', postData)
  )
  // 根据话题Id查询话题详情
  activContent.getActivContentTopicById = params => (
    ajaxinstance.get('/activ/getActivContentTopicById', { params })
  )
  // 查询某个专家的课程列表
  activContent.getActivContentCourseListByExpertId = postData => (
    ajaxinstance.post('/activ/getActivContentCourseListByExpertId', postData)
  )
  // 查询某个专家的文章列表
  activContent.getActivContentArticleListByExpertId = postData => (
    ajaxinstance.post('/activ/getActivContentArticleListByExpertId', postData)
  )
  // 点赞
  activContent.addActivUserUpDown = postData => (
    ajaxinstance.post('/activ/addActivUserUpDown', postData)
  )
  // 更新浏览量
  activContent.updateActivContentBrowseNumber = postData => (
    ajaxinstance.post('/activ/updateActivContentBrowseNumber', postData)
  )

  return activContent
}

export default activContentCreate
