import ajaxinstance from './ajaxinstance'

const luckyCreate = () => {
  const lucky = {}

  // 用户信息
  lucky.myInfo = (params) => ajaxinstance.get('myInfo/myInfo', { params })

  //专家文章
  lucky.lottery = (params) => ajaxinstance.post('http://10.1.4.181:8291/api/v1/saas/activity/lottery', params)

  return lucky
}

export default luckyCreate()
