import point from '@src/common/utils/point'
const { allPointTrack } = point

/*** 埋点 会员页面 ****/ 
// 访问会员页面
const vipPageView = (params) => {
  allPointTrack({
    eventName: 'vip_page_view',
    pointParams: {...params}
  })
}

// 会员页面点击
const vipPageGoto = (params) => {
  allPointTrack({
    eventName: 'vip_page_goto',
    pointParams: {...params}
  })
}
//购买会员弹窗点击
const vipBuyPageGoto = (params) => {
  allPointTrack({
    eventName: 'vip_buy_page_goto',
    pointParams: {...params}
  })
}

// 访问续费页面
const vipManageView = (params) => {
  allPointTrack({
    eventName: 'vip_manage_view',
    pointParams: {...params}
  })
}

// 续费页面点击
const vipManageGoto = (params) => {
  allPointTrack({
    eventName: 'vip_manage_goto',
    pointParams: {...params}
  })
}

// // 访问购买会员页面
// const vipBuyPageView = (params) => {
//   allPointTrack({
//     eventName: 'vip_buy_page_view',
//     pointParams: {...params}
//   })
// }

// // 购买会员页点击
// const vipBuyPageGoto = (params) => {
//   allPointTrack({
//     eventName: 'vip_buy_page_goto',
//     pointParams: {...params}
//   })
// }

// 购买会员成功页访问
const vipPaidPageView = (params) => {
  allPointTrack({
    eventName: 'vip_paid_page_view',
    pointParams: {...params}
  })
}

// 会员成功页点击
const vipPaidPageBoto = (params) => {
  allPointTrack({
    eventName: 'vip_paid_page_goto',
    pointParams: {...params}
  })
}

export {
  vipPageView,
  vipPageGoto,
  vipManageView,
  vipManageGoto,
  vipPaidPageView,
  vipPaidPageBoto,
  vipBuyPageGoto
}
