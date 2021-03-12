const appCreate = ajaxinstance => {
  const app = {}
  app.queryArticleByArticleId = params => ajaxinstance.get('app/home/queryArticleByArticleId', { params })
  app.insertThumbsUpRecord = postData => ajaxinstance.post('app/home/insertThumbsUpRecord', postData)
  app.helpCenter = params => ajaxinstance.get('app/user/helpCenter', { params })

  return app
}

export default appCreate
