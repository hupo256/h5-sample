/**
  * @description: 订单小工具埋点
  * @author: dingyadong
  * @update: 2020-3-4
  */

import { point } from '@src/common/app'
const { allPointTrack } = point

// 埋点 微信商城支付完成页面浏览
const trackPointToolOrderSuccessPageView = (params) => {
  allPointTrack({
    eventName: 'weshop_finish_pay_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 页面banner点击
const trackPointToolFinishPayBannerClickPageView = (params) => {
  allPointTrack({
    eventName: 'weshop_finish_pay_banner_goto',
    pointParams: {
      ...params
    }
  })
}

// 访问订单支付页
const trackPointOrdersubmitView = (params) => {
  allPointTrack({
    eventName: 'zybindjs_ordersubmit_view',
    pointParams: {
      ...params
    }
  })
}
// 订单支付页点击
const trackPointOrdersubmitGoto = (params) => {
  allPointTrack({
    eventName: 'zybindjs_ordersubmit_goto',
    pointParams: {
      ...params
    }
  })
}
// 支付成功页
const trackPointOrderfinishView = (params) => {
  allPointTrack({
    eventName: 'zybindjs_orderfinish_view',
    pointParams: {
      ...params
    }
  })
}
// 支付成功页
const trackPointOrderfinishGoto = (params) => {
  allPointTrack({
    eventName: 'zybindjs_orderfinish_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问订单提交页
const trackPointOrderSubmitPageView = (params) => {
  allPointTrack({
    eventName: 'order_submit_page_view',
    pointParams: {
      ...params
    }
  })
}
// 确认提交订单
const trackPointOrderSubmitPageGoto = (params) => {
  allPointTrack({
    eventName: 'order_submit_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问订单支付成功页
const trackPointOrderCompletePageView = (params) => {
  allPointTrack({
    eventName: 'order_complete_page_view',
    pointParams: {
      ...params
    }
  })
}
// 订单支付成功页-按钮点击
const trackPointOrderCompletePageButtonGoto = (params) => {
  allPointTrack({
    eventName: 'order_complete_page_button_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问订单支付成功页弹窗
const trackPointOrderCompletePopWinView = (params) => {
  allPointTrack({
    eventName: 'order_complete_pop_win_view',
    pointParams: {
      ...params
    }
  })
}
const trackPointOrderCompletePopWinGoto = (params) => {
  allPointTrack({
    eventName: 'order_complete_pop_win_goto',
    pointParams: {
      ...params
    }
  })
}

// 访问订单支付成功页弹窗
const trackPointOrderCompletePageBannerGoto = (params) => {
  allPointTrack({
    eventName: 'order_complete_page_banner_goto',
    pointParams: {
      ...params
    }
  })
}

export {
  trackPointOrdersubmitView,
  trackPointOrdersubmitGoto,
  trackPointOrderfinishView,
  trackPointOrderfinishGoto,
  trackPointToolOrderSuccessPageView,
  trackPointToolFinishPayBannerClickPageView,
  trackPointOrderSubmitPageView,
  trackPointOrderSubmitPageGoto,
  trackPointOrderCompletePageView,
  trackPointOrderCompletePageButtonGoto,
  trackPointOrderCompletePopWinView,
  trackPointOrderCompletePopWinGoto,
  trackPointOrderCompletePageBannerGoto
}
