import { point } from '@src/common/app'
const { allPointTrack } = point

// 埋点 美妆小工具首页
const trackPointSkinToolView = (params) => {
  const { view_type, os_version, user_state } = params
  allPointTrack({
    eventName: 'SkinTool_Home_View',
    pointParams: {
      view_type, os_version, user_state
    }
  })
}
// 搜索页
const trackPointSkinToolSearch = (params) => {
  const { os_version, user_state } = params
  allPointTrack({
    eventName: 'SkinTool_Search_View',
    pointParams: {
      os_version, user_state
    }
  })
}
// 产品详情页
const trackPointSkinToolProduct = (params) => {
  const { os_version, user_state, cream_product_id } = params
  allPointTrack({
    eventName: 'SkinTool_Product_View',
    pointParams: {
      os_version, user_state, cream_product_id
    }
  })
}
// 成分详情页
const trackPointSkinToolElement = (params) => {
  const { os_version, user_state, element_id } = params
  allPointTrack({
    eventName: 'SkinTool_Element_View',
    pointParams: {
      os_version, user_state, element_id
    }
  })
}
// 分享页
const trackPointSkinToolPoster = (params) => {
  const { os_version, user_state } = params
  allPointTrack({
    eventName: 'SkinTool_Poster_View',
    pointParams: {
      os_version, user_state
    }
  })
}
// 页面内点击
const trackPointSkinToolPageGoto = (params) => {
  const { os_version, user_state, Btn_name, cream_product_id, element_id } = params
  allPointTrack({
    eventName: 'SkinTool_Page_Goto',
    pointParams: {
      os_version, user_state, Btn_name, cream_product_id, element_id
    }
  })
}

export {
  trackPointSkinToolView,
  trackPointSkinToolSearch,
  trackPointSkinToolProduct,
  trackPointSkinToolElement,
  trackPointSkinToolPoster,
  trackPointSkinToolPageGoto,
}
