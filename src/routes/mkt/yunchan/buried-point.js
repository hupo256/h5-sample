import { point } from '@src/common/app'
const { allPointTrack } = point

// 埋点 孕妈拉新活动首页
const trackPointYmlxView = (params) => {
  // sourceType
  const {view_type, client_type} = params
  allPointTrack({
    eventName: 'Ymlx_landingpage_view',
    pointParams: {
      view_type, client_type
    }
  })
}
// 埋点 首页_去领取按钮
const trackPointYmlxGoto = (params) => {
  const {DeviceID} = params
  allPointTrack({
    eventName: 'Ymlx_Landingpage_Goto',
    pointParams: {DeviceID}
  })
}
// 埋点 首页_查看订单进度
const trackPointYmlxNewOrderGoto = (params) => {
  allPointTrack({
    eventName: 'Ymlx_Landingpage_OrderDetail_Goto',
    pointParams: {}
  })
}

// 埋点 首页_活动结束按钮
const trackPointYmlxCloseGoto = (params) => {
  allPointTrack({
    eventName: 'Ymlx_Landingpage_Close_Goto',
    pointParams: {}
  })
}

// 埋点 首页_访问优惠券列表
const trackPointYmlxCouponlistGoto = (params) => {
  allPointTrack({
    eventName: 'Ymlx_Landingpage_Couponlist_Goto',
    pointParams: {}
  })
}

// 埋点 首页_分享活动
const trackPointYmlxLandingpageShareGoto = (params) => {
  allPointTrack({
    eventName: 'Ymlx_Landingpage_Share_Goto',
    pointParams: {}
  })
}

// 埋点 访问收件信息填写页
const trackPointYmlxFreeOrdeView = (params) => {
  allPointTrack({
    eventName: 'Ymlx_FreeOrder_View',
    pointParams: {}
  })
}

// 埋点 收件信息填写页_确认领取按钮
const trackPointYmlxFreeOrderGoto = (params) => {
  const {order_id} = params
  allPointTrack({
    eventName: 'Ymlx_FreeOrder_Goto',
    pointParams: {order_id}
  })
}

// 埋点 访问领取成功页
const trackPointYmlxSuccessView = (params) => {
  const {order_id} = params
  allPointTrack({
    eventName: 'Ymlx_Success_View',
    pointParams: {order_id}
  })
}

// 埋点 领取成功页_分享活动
const trackPointYmlxSuccessShareGoto = (params) => {
  allPointTrack({
    eventName: 'Ymlx_Success_Share_Goto',
    pointParams: {}
  })
}

// 埋点 领取成功页_查看订单进度
const trackPointYmlxOrderDetailGoto = (params) => {
  allPointTrack({
    eventName: 'Ymlx_Success_OrderDetail_Goto',
    pointParams: {}
  })
}

// 埋点 好友访问分享后的链接
const trackPointYmlxHYAccessView = (params) => {
  const {DeviceID} = params
  allPointTrack({
    eventName: 'Ymlx_HYAccess_View',
    pointParams: {DeviceID}
  })
}

// 埋点 样本状态页_访问宝宝199banner
const trackPointYmlxBaby199bannerGoto = (params) => {
  allPointTrack({
    eventName: 'Sample_State_Page_Baby199_banner_Goto',
    pointParams: {}
  })
}

// 埋点 样本状态页_访问成人女199banner
const trackPointYmlxWoman199bannerGoto = (params) => {
  allPointTrack({
    eventName: 'Sample_State_Page_Woman199_banner_Goto',
    pointParams: {}
  })
}

// 埋点 样本状态页_访问成人男199banner
const trackPointYmlxMan199bannerGoto = (params) => {
  allPointTrack({
    eventName: 'Sample_State_Page_Man199_banner_Goto',
    pointParams: {}
  })
}

// 埋点 绑定完成页_弹框领取按钮（宝宝用户）
const trackPointYmlxPageBindBabyGoto = (params) => {
  allPointTrack({
    eventName: 'Bind_Success_Page_BindBaby_Goto',
    pointParams: {}
  })
}

// 埋点 绑定完成页_弹框领取按钮（孕妈用户）
const trackPointYmlxPageBindPregnantGoto = (params) => {
  allPointTrack({
    eventName: 'Bind_Success_Page_BindPregnant_Goto',
    pointParams: {}
  })
}

// 埋点 绑定完成页_弹框领取按钮（其他成人用户）
const trackPointYmlxPageBindOtherAdultGoto = (params) => {
  allPointTrack({
    eventName: 'Bind_Success_Page_BindOtherAdult_Goto',
    pointParams: {}
  })
}


export {
  trackPointYmlxView,
  trackPointYmlxGoto,
  trackPointYmlxNewOrderGoto,
  trackPointYmlxCloseGoto,
  trackPointYmlxCouponlistGoto,
  trackPointYmlxLandingpageShareGoto,
  trackPointYmlxFreeOrdeView,
  trackPointYmlxFreeOrderGoto,
  trackPointYmlxSuccessView,
  trackPointYmlxSuccessShareGoto,
  trackPointYmlxOrderDetailGoto,
  trackPointYmlxHYAccessView,
  trackPointYmlxBaby199bannerGoto,
  trackPointYmlxWoman199bannerGoto,
  trackPointYmlxMan199bannerGoto,
  trackPointYmlxPageBindBabyGoto,
  trackPointYmlxPageBindPregnantGoto,
  trackPointYmlxPageBindOtherAdultGoto,
}
