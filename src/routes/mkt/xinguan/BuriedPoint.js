import { point } from '@src/common/utils/point'
const { allPointTrack } = point

/*** 埋点 新冠产品 ****/ 

// 活动页面访问
const XgLandingpageView = (params) => {
  const {view_type, client_type} = params
  allPointTrack({
    eventName: 'xg_landingpage_view',
    pointParams: {view_type, client_type}
  })
}

// 活动页面点击
const XgLandingpageGoto = (params) => {
  const {Btn_name, product_id, user_status} = params
  allPointTrack({
    eventName: 'xg_landingpage_goto',
    pointParams: {Btn_name, product_id, user_status}
  })
}

export {
  XgLandingpageView,
  XgLandingpageGoto,
}
