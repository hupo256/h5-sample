import { point } from '@src/common/app'
const { allPointTrack } = point

// 埋点 进入领券页面
const trackPointCouponListView = (params) => {
  allPointTrack({
    eventName: 'coupon_list_view',
  })
}
// 埋点 查看免费卡片产品详情页
const trackPointCouponGetGoto = (params) => {
  allPointTrack({
    eventName: 'coupon_get_goto',
    pointParams: {
      ...params
    }
  })
}
// 埋点
const trackPointCouponGet = (params) => {
  allPointTrack({
    eventName: 'coupon_get',
    pointParams: {
      ...params
    }
  })
}
// 埋点 去使用
const trackPointCouponUseGoto = (params) => {
  allPointTrack({
    eventName: 'coupon_use_goto',
    pointParams: {
      ...params
    }
  })
}
export {
  trackPointCouponListView,
  trackPointCouponGetGoto,
  trackPointCouponGet,
  trackPointCouponUseGoto
}
