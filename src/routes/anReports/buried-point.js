import { point } from '@src/common/app'

const { allPointTrack } = point
// 访问安小软报告列表
const trackPointListView = (params) => {
  allPointTrack({
    eventName: 'report_axr_list_view',
    pointParams: {
      ...params
    }
  })
}
// 安小软报告列表购买
const trackPointBuyClick = (params) => {
  allPointTrack({
    eventName: 'report_axr_list_buy_click',
    pointParams: {
      ...params
    }
  })
}
// 安小软报告列表查看报告
const trackPointReadClick = (params) => {
  allPointTrack({
    eventName: 'report_axr_list_read_click',
    pointParams: {
      ...params
    }
  })
}

// 安小软检测结果页访问
const reportAxrResultView = (params) => {
  allPointTrack({
    eventName: 'report_axr_result_view',
    pointParams: {
      ...params
    }
  })
}
// 安小软报告推荐外部商品点击
const reportAxrResultRecomProductGoto = (params) => {
  allPointTrack({
    eventName: 'report_axr_result_recom_product_goto',
    pointParams: {
      ...params
    }
  })
}
// 安小软肠道菌群检测报告详情页点击
const reportAxrDetailResultPageGoto = (params) => {
  allPointTrack({
    eventName: 'report_axr_detail_result_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 安小软检测结果页右上角分享
const reportAxrShareBtnGoto = (params) => {
  allPointTrack({
    eventName: 'report_axr_share_btn_goto',
    pointParams: {
      ...params
    }
  })
}
// 肠道菌群建立关键期分享
const babyBacteriumCreateKeypointGoto = (params) => {
  allPointTrack({
    eventName: 'baby_bacterium_create_keypoint_goto',
    pointParams: {
      ...params
    }
  })
}
// 领取优惠券
const reportAxrResultPageBottomBannerGoto = (params) => {
  allPointTrack({
    eventName: 'report_axr_result_page_bottom_banner_goto',
    pointParams: {
      ...params
    }
  })
}
export {
  trackPointListView,
  trackPointBuyClick,
  trackPointReadClick,
  reportAxrResultView,
  reportAxrResultRecomProductGoto,
  reportAxrDetailResultPageGoto,
  babyBacteriumCreateKeypointGoto,
  reportAxrShareBtnGoto,
  reportAxrResultPageBottomBannerGoto
}
