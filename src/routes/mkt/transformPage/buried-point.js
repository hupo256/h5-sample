import { point } from '@src/common/app'
const { allPointTrack } = point

// 埋点 访问101页
const trackPointLandingpage101View = (params) => {
  allPointTrack({
    eventName: 'landingpage101_view',
    pointParams: {
      ...params
    }
  })
}

export {
  trackPointLandingpage101View
}
