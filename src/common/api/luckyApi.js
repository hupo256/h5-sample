import creatFech from './fetch'

const luckyCreate = () => {
  const lucky = {}

  //查询抽奖活动
  lucky.info = async params => {
    return await creatFech('api/v1/wechat/activity/info', {
      method: 'POST',
      body: params,
    })
  }

  //开始抽奖
  lucky.lottery = async params => {
    return await creatFech('api/v1/wechat/activity/lottery', {
      method: 'POST',
      body: params,
    })
  }

  //中奖记录
  lucky.reward = async params => {
    return await creatFech('api/v1/wechat/activity/reward', {
      method: 'POST',
      body: params,
    })
  }

  return lucky
}

export default luckyCreate()
