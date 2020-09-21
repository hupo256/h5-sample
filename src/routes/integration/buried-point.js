import { point } from '@src/common/app'
const { allPointTrack } = point

// 埋点 积分首页
const trackPointPointsPageView = (params) => {
  allPointTrack({
    eventName: 'points_page_view',
    pointParams: {
      ...params
    }
  })
}
// 积分页面内点击
const trackPointMyPointsGoto = (params) => {
  allPointTrack({
    eventName: 'my_points_goto',
    pointParams: {
      ...params
    }
  })
}
// 积分明细内点击
const trackPointPointsDetailGoto = (params) => {
  allPointTrack({
    eventName: 'points_detail_goto',
    pointParams: {
      ...params
    }
  })
}
// 抽奖首页
const trackPointLuckyDrawView = (params) => {
  allPointTrack({
    eventName: 'lucky_draw_view',
    pointParams: {
      ...params
    }
  })
}
// 抽奖页面点击
const trackPointLuckyDrawGoto = (params) => {
  allPointTrack({
    eventName: 'lucky_draw_goto',
    pointParams: {
      ...params
    }
  })
}
// 我的奖品
const trackPointMyRewardsView = (params) => {
  allPointTrack({
    eventName: 'my_rewards_view',
    pointParams: {
      ...params
    }
  })
}
// 奖品点击事件
const trackPointMyRewardsGoto = (params) => {
  allPointTrack({
    eventName: 'my_rewards_goto',
    pointParams: {
      ...params
    }
  })
}
// 领取奖品
const trackPointGetRewardView = (params) => {
  allPointTrack({
    eventName: 'get_reward_view',
    pointParams: {
      ...params
    }
  })
}
// 领取成功
const trackPointGetRewardGoto = (params) => {
  allPointTrack({
    eventName: 'get_reward_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问兑换列表页
const exchangeListView = (params) => {
  allPointTrack({
    eventName: 'exchange_list_view',
    pointParams: {
      ...params
    }
  })
}
// 兑换列表页点击
const exchangeListGoto = (params) => {
  allPointTrack({
    eventName: 'exchange_list_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问兑换详情页
const exchangeDetailView = (params) => {
  allPointTrack({
    eventName: 'exchange_detail_view',
    pointParams: {
      ...params
    }
  })
}
// 兑换详情页点击
const exchangeDetailGoto = (params) => {
  allPointTrack({
    eventName: 'exchange_detail__goto',
    pointParams: {
      ...params
    }
  })
}
// 积分不足弹框
const notEnoughView = (params) => {
  allPointTrack({
    eventName: 'not_enough_view',
    pointParams: {
      ...params
    }
  })
}
// 积分不足点击
const notEnoughGoto = (params) => {
  allPointTrack({
    eventName: 'integration_not_enough_goto',
    pointParams: {
      ...params
    }
  })
}
// 确认兑换弹窗展示
const exchangeConfirmView = (params) => {
  allPointTrack({
    eventName: 'exchange_confirm_view',
    pointParams: {
      ...params
    }
  })
}
// 确认兑换弹窗点击
const exchangeConfirmGoto = (params) => {
  allPointTrack({
    eventName: 'exchange_confirm_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问确认兑换页
const exchangeConfirmPageView = (params) => {
  allPointTrack({
    eventName: 'exchange_confirm_page_view',
    pointParams: {
      ...params
    }
  })
}
// 确认兑换页点击
const exchangeConfirmPageGoto = (params) => {
  allPointTrack({
    eventName: 'exchange_confirm_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问兑换完成页
const exchangeSuccessPageView = (params) => {
  allPointTrack({
    eventName: 'exchange_success_page_view',
    pointParams: {
      ...params
    }
  })
}
// 兑换完成页点击
const exchangeSuccessPageGoto = (params) => {
  allPointTrack({
    eventName: 'exchange_success_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问兑换记录页
const exchangeRecordPageView = (params) => {
  allPointTrack({
    eventName: 'exchange_record_page_view',
    pointParams: {
      ...params
    }
  })
}
// 兑换记录页点击
const exchangeRecordPageGoto = (params) => {
  allPointTrack({
    eventName: 'exchange_record_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 兑换记录页详情页
const exchangeRecordDetailPageView = (params) => {
  allPointTrack({
    eventName: 'exchange_record_detail_page_view',
    pointParams: {
      ...params
    }
  })
}
// 兑换详情页点击
const exchangeRecordDetailPageGoto = (params) => {
  allPointTrack({
    eventName: 'exchange_record_detail_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问余额页
const balancePageView = (params) => {
  allPointTrack({
    eventName: 'balance_page_view',
    pointParams: {
      ...params
    }
  })
}
// 余额页点击
const balancePageGoto = (params) => {
  allPointTrack({
    eventName: 'balance_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问充值完成页
const rechargeCompletePageView = (params) => {
  allPointTrack({
    eventName: 'recharge_complete_page_view',
    pointParams: {
      ...params
    }
  })
}
// 访问激活礼品卡页
const cardActivatePageView = (params) => {
  allPointTrack({
    eventName: 'card_activate_page_view',
    pointParams: {
      ...params
    }
  })
}
// 激活礼品卡页点击
const cardActivatePageGoto = (params) => {
  allPointTrack({
    eventName: 'card_activate_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问激活完成页
const activateCompletePageView = (params) => {
  allPointTrack({
    eventName: 'activate_complete_page_view',
    pointParams: {
      ...params
    }
  })
}
// 激活完成页点击
const activateCompletePageGoto = (params) => {
  allPointTrack({
    eventName: 'activate_complete_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 查看明细页
const detailedPageView = (params) => {
  allPointTrack({
    eventName: 'detailed_page_view',
    pointParams: {
      ...params
    }
  })
}
export {
  trackPointPointsPageView,
  trackPointMyPointsGoto,
  trackPointPointsDetailGoto,
  trackPointLuckyDrawView,
  trackPointLuckyDrawGoto,
  trackPointMyRewardsView,
  trackPointMyRewardsGoto,
  trackPointGetRewardView,
  trackPointGetRewardGoto,
  exchangeListView,
  exchangeListGoto,
  exchangeDetailView,
  exchangeDetailGoto,
  notEnoughView,
  notEnoughGoto,
  exchangeConfirmView,
  exchangeConfirmGoto,
  exchangeConfirmPageView,
  exchangeConfirmPageGoto,
  exchangeSuccessPageView,
  exchangeSuccessPageGoto,
  exchangeRecordPageView,
  exchangeRecordPageGoto,
  exchangeRecordDetailPageView,
  exchangeRecordDetailPageGoto,
  balancePageView,
  balancePageGoto,
  rechargeCompletePageView,
  cardActivatePageView,
  cardActivatePageGoto,
  activateCompletePageView,
  activateCompletePageGoto,
  detailedPageView,
}
