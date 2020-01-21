/**
  * @description: 成人唯一绑定埋点
  * @author: gaoyanxia
  * @update: 2019-9-25
  */

import { point } from '@src/common/app'
const { allPointTrack } = point

// 埋点 访问成人唯一绑定提示页
const trackPointBindAdultTipsView = (params) => {
  allPointTrack({
    eventName: 'bind_adult_tips_view',
    pointParams: {
      client_type: 'app'
    }
  })
}
// 埋点 点击为本账号绑定
const trackPointBindAdultGoto = (params) => {
  allPointTrack({
    eventName: 'bind_adult_goto',
    pointParams: {
      client_type: 'app'
    }
  })
}
// 埋点 点击注册新账号绑定
const trackPointBindAdultNewGoto = (params) => {
  allPointTrack({
    eventName: 'bind_adult_new_goto',
    pointParams: {
      client_type: 'app'
    }
  })
}
// 埋点 访问引导新人注册绑定页
const trackPointBindNewUserGuideView = (params) => {
  allPointTrack({
    eventName: 'bind_new_user_guide_view',
    pointParams: {
      client_type: 'app'
    }
  })
}
// 埋点 分享引导新人注册绑定页
const trackPointBindNewUserGuideShareGoto = (params) => {
  allPointTrack({
    eventName: 'bind_new_user_guide_share_goto',
    pointParams: {
      client_type: 'app'
    }
  })
}

export {
  trackPointBindAdultTipsView,
  trackPointBindAdultGoto,
  trackPointBindAdultNewGoto,
  trackPointBindNewUserGuideView,
  trackPointBindNewUserGuideShareGoto,
}
