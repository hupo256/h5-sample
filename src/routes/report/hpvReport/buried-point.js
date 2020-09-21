import { point } from '@src/common/app'
const { allPointTrack } = point

// 访问HPV报告列表
const trackPointReportHpvListView = (params) => {
  allPointTrack({
    eventName: 'report_hpv_list_view',
    pointParams: {
      ...params
    }
  })
}

// 点击HPV报告列表购买入口
const trackPointReportHpvListBuyGoto = (params) => {
  allPointTrack({
    eventName: 'report_hpv_list_buy_goto',
    pointParams: {
      ...params
    }
  })
}
// 点击HPV报告列表的查看报告
const trackPointReportHpvListReportGoto = (params) => {
  allPointTrack({
    eventName: 'report_hpv_list_report_goto',
    pointParams: {
      ...params
    }
  })
}
// 访问HPV报告详情页-检测结果
const trackPointHpvReportDetailResultPageView = (params) => {
  allPointTrack({
    eventName: 'hpv_report_detail_result_page_view',
    pointParams: {
      ...params
    }
  })
}
// 专家建议
const HpvReportDetailSciencePageView = (params) => {
  allPointTrack({
    eventName: 'hpv_report_detail_science_page_view',
    pointParams: {
      ...params
    }
  })
}
// 下载报告
const trackPointHpvPdfReportGoto = (params) => {
  allPointTrack({
    eventName: 'hpv_pdf_report_goto',
    pointParams: {
      ...params
    }
  })
}
// 确认报告信息
const HpvPdfReportInfoConfirmGoto = (params) => {
  allPointTrack({
    eventName: 'hpv_pdf_report_info_confirm_goto',
    pointParams: {
      ...params
    }
  })
}
// 点击测评
const HpvReportDetailQnaireGoto = (params) => {
  allPointTrack({
    eventName: 'hpv_report_detail_qnaire_goto',
    pointParams: {
      ...params
    }
  })
}
// 领取优惠券
const HpvCouponGoto = (params) => {
  allPointTrack({
    eventName: 'hpv_coupon_goto',
    pointParams: {
      ...params
    }
  })
}
// 商品购买入口点击
const HpvPurchaseGoto = (params) => {
  allPointTrack({
    eventName: 'hpv_purchase_goto',
    pointParams: {
      ...params
    }
  })
}
// 综合免疫力
const HpvDccv2Goto = (params) => {
  allPointTrack({
    eventName: 'hpv_dccv2_goto',
    pointParams: {
      ...params
    }
  })
}
// 分享内点击
const ShareLinkGoto = (params) => {
  allPointTrack({
    eventName: 'share_link_goto',
    pointParams: {
      ...params
    }
  })
}
export {
  trackPointReportHpvListView,
  trackPointReportHpvListBuyGoto,
  trackPointReportHpvListReportGoto,
  trackPointHpvReportDetailResultPageView,
  trackPointHpvPdfReportGoto,
  HpvReportDetailQnaireGoto,
  HpvCouponGoto,
  HpvPurchaseGoto,
  HpvReportDetailSciencePageView,
  HpvDccv2Goto,
  HpvPdfReportInfoConfirmGoto,
  ShareLinkGoto,
}
