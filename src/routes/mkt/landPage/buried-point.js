import { point } from '@src/common/app'
const { allPointTrack } = point

// 埋点 优惠券领取
const trackPointCouponGoto= (params) => {
  allPointTrack({
    eventName: 'Axr_Landingpage_Coupon_Goto',
    pointParams: {
        ...params
      }
  })
  
}
// 商品购买入口点击
const trackPointGoodGoto= (params) => {
    // Product_ID
    allPointTrack({
      eventName: 'Axr_Purchase_Goto',
      pointParams: {
        ...params
      }
    })
    
  }
//访问量
const trackPointGoodVistits=(params)=>{
  allPointTrack({
    eventName: 'Axr_Landingpage_View',
    pointParams: {
      ...params
    }
  })
}
//分享
const trackPointGoodShare=()=>{
  allPointTrack({
    eventName: 'Axr_Share_Goto',
  })
}
export {
    trackPointCouponGoto,
    trackPointGoodGoto,
    trackPointGoodVistits,
    trackPointGoodShare
  }
  