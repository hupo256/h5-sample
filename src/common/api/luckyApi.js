import ajaxinstance from './index'

const luckyCreate = () => {
  const lucky = {}

  // 用户信息
  lucky.query = (params) => {
    return ajaxinstance.get('api/v1/saas/activity/query', { params })
  }

  //专家文章
  lucky.lottery = (params) => {
    return ajaxinstance.post('api/v1/saas/activity/lottery', params)
  }

  //专家文章
  lucky.items = (params) => {
    return ajaxinstance.post('https://www.dianrong.com/feapi/items?type=iAboutDR', params)
    // return ajaxinstance.post('apis/feapi/items?type=iAboutDR', params)
  }

  return lucky
}

export default luckyCreate()
