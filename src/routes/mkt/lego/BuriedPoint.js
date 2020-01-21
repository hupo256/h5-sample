import { point } from '@src/common/app'
const { allPointTrack } = point

/*** 埋点 孕产二期 ****/ 

// 访问活动首页
const ZlLandingpageView = (params) => {
  const {view_type, client_type, product_id, user_state} = params
  allPointTrack({
    eventName: 'Zl_Landingpage_View',
    pointParams: {
      view_type, client_type, product_id, user_state
    }
  })
}
// 首页_主人_原价购买
const ZlLandingpageMyDirectBuyGoto = (params) => {
  const {product_id} = params
  allPointTrack({
    eventName: 'Zl_Landingpage_My_DirectBuy_Goto',
    pointParams: {
      product_id
    }
  })
}
// 首页_主人_邀请助力
const ZlLandingpageMyInviteGoto = (params) => {
  const {product_id, client_type} = params
  allPointTrack({
    eventName: 'Zl_Landingpage_My_Invite_Goto',
    pointParams: {
      product_id, client_type
    }
  })
}
// 首页_主人_点击领取
const ZlLandingpageMyGetGoto = (params) => {
  const {product_id} = params
  allPointTrack({
    eventName: 'Zl_Landingpage_My_Get_Goto',
    pointParams: {
      product_id
    }
  })
}
// 首页_客人_为TA助力
const ZlLandingpageFriendHelpGoto = (params) => {
  const {product_id} = params
  allPointTrack({
    eventName: 'Zl_Landingpage_Friend_Help_Goto',
    pointParams: {
      product_id
    }
  })
}
// 首页_客人_助力成功
const ZlLandingpageFriendDoneView = (params) => {
  const {product_id} = params
  allPointTrack({
    eventName: 'Zl_Landingpage_Friend_Done_View',
    pointParams: {
      product_id
    }
  })
}
// 首页_客人_好友参与活动
const ZlLandingpageFriendJoinGoto = (params) => {
  const {product_id} = params
  allPointTrack({
    eventName: 'Zl_Landingpage_Friend_Join_Goto',
    pointParams: {
      product_id
    }
  })
}

// 访问收件信息填写页
const ZlAddresseeView = (params) => {
  const {product_id} = params
  allPointTrack({
    eventName: 'Zl_Addressee_View',
    pointParams: {
      product_id
    }
  })
}
// 收件信息填写页_确认领取
const ZlAddresseeConfirmGoto = (params) => {
  const {order_id, product_id} = params
  allPointTrack({
    eventName: 'Zl_Addressee_Confirm_Goto',
    pointParams: {
      order_id, product_id
    }
  })
}

// 领取成功页_访问
const ZlSuccessView = (params) => {
  const {product_id, user_state} = params
  allPointTrack({
    eventName: 'Zl_Success_View',
    pointParams: {
      product_id, user_state
    }
  })
}
// 领取成功页_banner入口 
const ZlSuccessBannerGoto = (params) => {
  const {URL, product_id} = params
  allPointTrack({
    eventName: 'Zl_Success_Banner_Goto',
    pointParams: {
      product_id
    }
  })
}

// 领取成功页_查看点击
const ZlSuccessCheckGoto = (params) => {
  const {client_type, product_id, user_state, button_type} = params
  allPointTrack({
    eventName: 'Zl_Success_Check_Goto',
    pointParams: {
      client_type, product_id, user_state, button_type
    }
  })
}
// 领取成功页_分享
const ZlSuccessShareGoto = (params) => {
  const {client_type, product_id, user_state} = params
  allPointTrack({
    eventName: 'Zl_Success_Share_Goto',
    pointParams: {
      client_type, product_id, user_state
    }
  })
}


/*** 宝宝199 ****/ 

// 首页_主人_点击去购买
const ZlLandingpageMyCouponBuyGoto = (params) => {
  const {product_id} = params
  allPointTrack({
    eventName: 'Zl_Landingpage_My_CouponBuy_Goto',
    pointParams: {
      product_id
    }
  })
}

// 访问优惠券弹窗
const ZlCouponView = (params) => {
  const {product_id} = params
  allPointTrack({
    eventName: 'Zl_Coupon_View',
    pointParams: {
      product_id
    }
  })
}
// 优惠券弹窗点击去使用
const ZlCouponGoto = (params) => {
  const {product_id} = params
  allPointTrack({
    eventName: 'Zl_Coupon_Goto',
    pointParams: {
      product_id
    }
  })
}

export {
  ZlLandingpageView,
  ZlLandingpageMyDirectBuyGoto,
  ZlLandingpageMyInviteGoto,
  ZlLandingpageMyGetGoto,
  ZlLandingpageFriendHelpGoto,
  ZlLandingpageFriendDoneView,
  ZlLandingpageFriendJoinGoto,
  
  ZlLandingpageMyCouponBuyGoto,
  ZlCouponView,
  ZlCouponGoto,
  
  ZlAddresseeView,
  ZlAddresseeConfirmGoto,
  
  ZlSuccessView,
  ZlSuccessBannerGoto,
  ZlSuccessCheckGoto,
  ZlSuccessShareGoto
}
