import { point } from '@src/common/app'

const { allPointTrack } = point

// 访问299落地页
const trackPointLandingpageView = (params) => {
  allPointTrack({
    eventName: 'zybindjs_landingpage_view',
    pointParams: {
      ...params
    }
  })
}
// 访问299点击
const trackPointLandingpageGoto = (params) => {
  allPointTrack({
    eventName: 'zybindjs_landingpage_goto',
    pointParams: {
      ...params
    }
  })
}

export {
  trackPointLandingpageView,
  trackPointLandingpageGoto
}
