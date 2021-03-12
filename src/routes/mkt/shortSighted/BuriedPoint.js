import { point } from '@src/common/app'
const { allPointTrack } = point

/*** 埋点 新冠产品 ****/ 

// 活动页面访问
const XgLandingpageView = (params) => {
  allPointTrack({
    eventName: 'xg_landingpage_view',
    pointParams: {...params}
  })
}

// 活动页面点击
const XgLandingpageGoto = (params) => {
  allPointTrack({
    eventName: 'xg_landingpage_goto',
    pointParams: {...params}
  })
}

export {
  XgLandingpageView,
  XgLandingpageGoto,
}
