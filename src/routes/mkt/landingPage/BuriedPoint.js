import point from '@src/common/utils/point'
const { allPointTrack } = point
/*** 埋点 新冠产品 ****/

// 活动页面访问
const activLandingpageView = (params) => {
  allPointTrack({
    eventName: 'activ_landingpage_view',
    pointParams: {...params}
  })
}

// 活动页面点击
const activLandingpageGoto = (params) => {
  allPointTrack({
    eventName: 'activ_landingpage_goto',
    pointParams: {...params}
  })
}

export {
  activLandingpageView,
  activLandingpageGoto,
}
