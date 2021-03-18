import ajaxinstance from './ajaxinstance'

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

  return lucky
}

export default luckyCreate()
