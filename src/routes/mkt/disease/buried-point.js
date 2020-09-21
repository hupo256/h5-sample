import { point } from '@src/common/app'
const { allPointTrack } = point


// 页面浏览
const trackPointView= (params) => {
  allPointTrack({
    eventName: 'JB_page_view',
    pointParams: {
        ...params
    }
  })
}
//活动首页点击
const trackPointClick=(params)=>{
  allPointTrack({
    eventName: 'JB_landingpage_goto',
    pointParams: {
      ...params
    }
  })
}
// 切换检测人点击
const trackPointChangerole= (params) => {
  allPointTrack({
    eventName: 'JB_changerole_goto',
    pointParams: {
        ...params
    }
  })
}
// 温馨提示弹框点击
const trackPointTips= (params) => {
  allPointTrack({
    eventName: 'JB_tipspop_goto',
    pointParams: {
        ...params
    }
  })
}
export {
  trackPointView,
  trackPointClick,
  trackPointChangerole,
  trackPointTips
}
  