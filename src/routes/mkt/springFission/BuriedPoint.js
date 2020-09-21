import { point } from '@src/common/app'
const { allPointTrack } = point

/*** 埋点 春节裂变 ****/

// 访问活动购买返现页
const GMFXLandingpageView = (params) => {
  const { view_type } = params
  allPointTrack({
    eventName: 'GMFX_landingpage_view',
    pointParams: {
      view_type
    }
  })
}
// 领券弹框
const GMFXLandingpageCouponPopupGoto = (params) => {
  allPointTrack({
    eventName: 'GMFX_landingpage_coupon_popup_goto',
  })
}
// 优惠券弹框访问
const GMFXLandingpageCouponPopupView = (params) => {
  allPointTrack({
    eventName: 'GMFX_landingpage_coupon_popup_view',
  })
}
// 关闭领券弹框
const GMFXLandingpageCancelCouponPopup = (params) => {
  allPointTrack({
    eventName: 'GMFX_landingpage_cancel_coupon_popup',
  })
}
// 立即领取按钮
const GMFXLandingpageBuyNowGoto = (params) => {
  const { product_id } = params
  allPointTrack({
    eventName: 'GMFX_landingpage_buy_now_goto',
    pointParams: {
      product_id
    }
  })
}
// 购买成功-分享弹框
const GMFXSuccessSharePopupGoto = (params) => {
  allPointTrack({
    eventName: 'GMFX_success_share_popup_goto',
  })
}
// 购买成功-分享弹框访问
const GMFXSuccessSharePopupView = (params) => {
  allPointTrack({
    eventName: 'GMFX_success_share_popup_view',
  })
}
// 购买成功-关闭分享弹框
const GMFXSuccessCancelSharePopup = (params) => {
  allPointTrack({
    eventName: 'GMFX_success_cancel_share_popup',
  })
}
// 购买成功-查看订单按钮
const GMFXSuccessProductViewGoto = (params) => {
  const { product_id } = params
  allPointTrack({
    eventName: 'GMFX_success_product_view_goto',
    pointParams: {
      product_id
    }
  })
}
// 去兑换按钮
const GMFXConvertGoto = (params) => {
  allPointTrack({
    eventName: 'GMFX_convert_goto',
  })
}

// 分享按钮
const GMFXShareGoto = (params) => {
  allPointTrack({
    eventName: 'GMFX_share_goto',
  })
}
//----------------------------------------
// 分享裂变页页面访问
const FXLBLandingpageView = (params) => {
  const { view_type } = params
  allPointTrack({
    eventName: 'FXLB_landingpage_view',
    pointParams: {
      view_type
    }
  })
}
// 累计奖金按钮
const FXLBAccountGoto = (params) => {
  allPointTrack({
    eventName: 'FXLB_account_goto',
  })
}
// 立即邀请赚钱按钮
const FXLBShareGoto = (params) => {
  allPointTrack({
    eventName: 'FXLB_share_goto',
  })
}
// 邀请好友数按钮
const FXLBInvitationRecordGoto = (params) => {
  allPointTrack({
    eventName: 'FXLB_invitation_record_goto',
  })
}
//----------------------------------------
const invitationpageView = (params) => {
  allPointTrack({
    eventName: 'invitationpage_view',
  })
}


/***  账户详情页  ****/

// 页面访问
const accountpageView = (params) => {
  const { view_type } = params
  allPointTrack({
    eventName: 'accountpage_view',
    pointParams: {view_type}
  })
}
// 兑换按钮
const accountpageConvertGoto = () => {
  allPointTrack({
    eventName: 'accountpage_convert_goto',
  })
}
// 奖励明细
const accountpageAwardRecordGoto = () => {
  allPointTrack({
    eventName: 'accountpage_award_record_goto',
  })
}
// 兑换记录
const accountpageConvertRecordGoto = () => {
  allPointTrack({
    eventName: 'accountpage_convert_record_goto',
  })
}

/***  兑换详情页  ****/

// 页面访问
const convertpageView = () => {
  allPointTrack({
    eventName: 'convertpage_view',
  })
}

// 选择兑换卡面
const convertpageChooseDenomination = (params) => {
  const { card_id } = params
  allPointTrack({
    eventName: 'convertpage_choose_denomination',
    pointParams: {card_id}
  })
}
// 立即兑换按钮
const convertpageConvertNowGoto = () => {
  allPointTrack({
    eventName: 'convertpage_convert_now_goto',
  })
}
// 兑换成功弹框
const convertpageSuccessPopupView = () => {
  allPointTrack({
    eventName: 'convertpage_success_popup_view',
  })
}
// 兑换成功去查看
const convertpageSuccessPopupGoto = () => {
  allPointTrack({
    eventName: 'convertpage_success_popup_goto',
  })
}


/***  兑换E卡页  ****/

// 页面访问
const DHEKView = () => {
  allPointTrack({
    eventName: 'DHEK_view',
  })
}
// 刮开涂层按钮
const DHEKScrapeGoto = () => {
  allPointTrack({
    eventName: 'DHEK_scrape_goto',
  })
}

/***  刮开涂层页  ****/

// 页面访问
const scrapepageView = () => {
  allPointTrack({
    eventName: 'scrapepage_view',
  })
}


export {
  GMFXLandingpageView,
  GMFXLandingpageCouponPopupGoto,
  GMFXLandingpageCouponPopupView,
  GMFXLandingpageCancelCouponPopup,
  GMFXLandingpageBuyNowGoto,
  GMFXSuccessProductViewGoto,
  GMFXShareGoto,
  GMFXConvertGoto,
  GMFXSuccessSharePopupGoto,
  GMFXSuccessSharePopupView,
  GMFXSuccessCancelSharePopup,

  accountpageView,
  accountpageConvertGoto,
  accountpageAwardRecordGoto,
  accountpageConvertRecordGoto,

  convertpageView,
  convertpageChooseDenomination,
  convertpageConvertNowGoto,
  convertpageSuccessPopupView,
  convertpageSuccessPopupGoto,

  DHEKView,
  DHEKScrapeGoto,

  scrapepageView,
  
  FXLBLandingpageView,
  FXLBAccountGoto,
  FXLBShareGoto,
  FXLBInvitationRecordGoto,

  invitationpageView
}
