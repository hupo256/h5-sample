import { point } from '@src/common/app'
const { allPointTrack } = point

/*** 埋点 新冠产品 ****/

// 活动页面访问
const newLoginView = (params) => {
  allPointTrack({
    eventName: 'new_login_view',
    pointParams: {...params}
  })
}

// 活动页面点击
const newLoginGoto = (params) => {
  allPointTrack({
    eventName: 'new_login_goto',
    pointParams: {...params}
  })
}

export {
  newLoginView,
  newLoginGoto,
}
