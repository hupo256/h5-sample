import ajaxinstance from './index'

const luckyCreate = () => {
  const lucky = {}

  //查询抽奖活动
  lucky.info = (params) => {
    return ajaxinstance.post('api/v1/sso/activity/info', params)
  }

  //开始抽奖
  lucky.lottery = (params) => {
    return ajaxinstance.post('api/v1/sso/activity/lottery', params)
  }

  //中奖记录
  lucky.reward = (params) => {
    return ajaxinstance.post('api/v1/sso/activity/reward', params)
  }

  return lucky
}

export default luckyCreate()
