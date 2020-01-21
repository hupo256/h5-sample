import { point } from '@src/common/app'
const { allPointTrack } = point

/*** 埋点 营养小工具 ****/ 

// 分享有礼分享者首页
const ActivityShareCouponLandingpage1View = () => {
  allPointTrack({
    eventName: 'Activity_Share_Coupon_Landingpage1_View',
  })
}

// 分享有礼活动分享按钮
const ActivityShareCouponLandingpage1ButtonGoto = () => {
  allPointTrack({
    eventName: 'Activity_Share_Coupon_Landingpage1_Button_Goto',
  })
}

const ActivityShareCouponLandingpage2View = () => {
// 分享有礼活动被分享者首页
  allPointTrack({
    eventName: 'Activity_Share_Coupon_Landingpage2_View',
  })
}

// 分享有礼活动被分享者首页按钮
const ActivityShareCouponLandingpage2GetButtonGoto = (phonenumber) => {
  allPointTrack({
    eventName: 'Activity_Share_Coupon_Landingpage2_Get_Button_Goto',
    pointParams: {phonenumber}
  })
}

// 分享有礼活动被分享者领券使用按钮
const ActivityShareCouponLandingpage2UseButtonGoto = () => {
  allPointTrack({
    eventName: 'Activity_Share_Coupon_Landingpage2_Use_Button_Goto',
  })
}

// 分享有礼活动被分享者领券使用按钮
const BindSuccessPageCouponPopupGoto = (url) => {
  allPointTrack({
    eventName: 'Bind_Success_Page_Coupon_Popup_Goto',
    pointParams: {url}
  })
}

export {
  ActivityShareCouponLandingpage1View,
  ActivityShareCouponLandingpage1ButtonGoto,
  ActivityShareCouponLandingpage2View,
  ActivityShareCouponLandingpage2GetButtonGoto,
  ActivityShareCouponLandingpage2UseButtonGoto,
  BindSuccessPageCouponPopupGoto,
}
