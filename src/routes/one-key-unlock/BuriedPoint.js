import point from '@src/common/utils/point'
const { allPointTrack } = point

/*** 埋点 会员页面 ****/ 
// 一键解锁详情页浏览
const unlockAllProductDetailPageView = (params) => {
  allPointTrack({
    eventName: 'unlock_all_product_detail_page_view',
    pointParams: {...params}
  })
}

// 一键解锁详情页点击
const unlockAllProductDetailPageGoto = (params) => {
  allPointTrack({
    eventName: 'unlock_all_product_detail_page_goto',
    pointParams: {...params}
  })
}



export {
  unlockAllProductDetailPageView,
  unlockAllProductDetailPageGoto
}
