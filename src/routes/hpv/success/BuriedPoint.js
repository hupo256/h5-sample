import point from '@src/common/utils/point'
const { allPointTrack } = point

/*** 绑定成功埋点 ****/ 

// 绑定完成页浏览	
const AppBindFinishPageView = (params) => {
  allPointTrack({
    eventName: 'app_bind_finish_page_view',
    pointParams: {...params}
  })
}

// 绑定完成页点击	
const AppBindFinishPageGoto = (params) => {
  allPointTrack({
    eventName: 'app_bind_finish_page_goto',
    pointParams: {...params}
  })
}

// 采样指导页浏览		
const ReferencevideoPageView = (params) => {
  allPointTrack({
    eventName: 'referencevideo_page_view',
    pointParams: {...params}
  })
}

// 采样指导页点击		
const ReferencevideoPageGoto = (params) => {
  allPointTrack({
    eventName: 'referencevideo_page_goto',
    pointParams: {...params}
  })
}

//绑定完成页点击
const trackPointFinishBindGoto = (params) => {
  allPointTrack({
    eventName: 'finish_bind_goto',
    pointParams: {...params}
  })
}

// 埋点 绑定成功页_弹框点击
const trackPointBindCompletePopWinGoto = (params) => {
  allPointTrack({
    eventName: 'bind_complete_pop_win_goto',
    pointParams: {...params}
  })
}

const trackPointFinishBindJspopGoto = (params) => {
  allPointTrack({
    eventName: 'finish_bind_jspop_goto',
    pointParams: {...params}
  })
}


export {
  AppBindFinishPageView,
  AppBindFinishPageGoto,
  ReferencevideoPageView,
  ReferencevideoPageGoto,
  trackPointFinishBindGoto,
  trackPointBindCompletePopWinGoto,
  trackPointFinishBindJspopGoto,
}
