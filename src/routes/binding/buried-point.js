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

// 埋点 页面绑定页-banner点击
const trackPointBindCompletePageBannerGoto = (params) => {
  allPointTrack({
    eventName: 'bind_complete_page_banner_goto',
    pointParams: {
      ...params
    }
  })
}

// 埋点 绑定成功页_弹框点击
const trackPointBindCompletePopWinGoto = (params) => {
  allPointTrack({
    eventName: 'bind_complete_pop_win_goto',
    pointParams: {
      ...params
    }
  })
}

// 埋点 绑定成功页_弹框访问
const trackPointBindCompletePopWinView = (params) => {
  allPointTrack({
    eventName: 'bind_complete_pop_win_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 绑定完成页浏览
const trackPointFinishBindView = (params) => {
  allPointTrack({
    eventName: 'finish_bind_view',
    pointParams: {
      ...params
    }
  })
}

//绑定完成页点击
const trackPointFinishBindGoto = (params) => {
  allPointTrack({
    eventName: 'finish_bind_goto',
    pointParams: {
      ...params
    }
  })
}

//什么是解锁弹框浏览
const trackPointFinishBindJspopView = (params) => {
  allPointTrack({
    eventName: 'finish_bind_jspop_view',
    pointParams: {
      ...params
    }
  })
}

//什么是解锁弹框关闭按钮点击
const trackPointFinishBindJspopGoto = (params) => {
  allPointTrack({
    eventName: 'finish_bind_jspop_goto',
    pointParams: {
      ...params
    }
  })
}

export {
  trackPointBindAdultTipsView,
  trackPointBindAdultGoto,
  trackPointBindAdultNewGoto,
  trackPointBindNewUserGuideView,
  trackPointBindNewUserGuideShareGoto,
  trackPointBindCompletePopWinView,
  trackPointBindCompletePopWinGoto,
  trackPointBindCompletePageBannerGoto,
  trackPointFinishBindView,
  trackPointFinishBindGoto,
  trackPointFinishBindJspopView,
  trackPointFinishBindJspopGoto
}
