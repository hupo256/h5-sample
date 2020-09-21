/**
  * @description: 首页2.0埋点
  * @author: gaoyanxia
  * @update: 2020-01-11
  */

import { point } from '@src/common/app'
const { allPointTrack } = point

// 埋点 专家模块点击
const trackHomepageExpertsGoto = (params) => {
  allPointTrack({
    eventName: 'homepage_experts_goto',
    pointParams: {
      ...params
    }
  })
}
// 埋点 访问专家主页
const trackExpertsPageView = (params) => {
  allPointTrack({
    eventName: 'experts_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 专家主页点击
const trackExpertsPageGoto = (params) => {
  allPointTrack({
    eventName: 'experts_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 埋点 访问专家列表页
const trackExpertsListView = (params) => {
  allPointTrack({
    eventName: 'experts_list_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 专家列表页点击
const trackExpertsListGoto = (params) => {
  allPointTrack({
    eventName: 'experts_list_goto',
    pointParams: {
      ...params
    }
  })
}



export {
  trackHomepageExpertsGoto,
  trackExpertsPageView,
  trackExpertsPageGoto,
  trackExpertsListView,
  trackExpertsListGoto
}
