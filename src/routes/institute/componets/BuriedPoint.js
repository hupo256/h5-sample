import point from '@src/common/utils/point'
const { allPointTrack } = point

/*** 埋点 研究院埋点 ****/ 

// 研究院主页访问
const institutePageView = (params) => {
  allPointTrack({
    eventName: 'institute_page_view',
    pointParams: {...params}
  })
}

// 研究院主页的点击
const institutePageGoto = (params) => {
  allPointTrack({
    eventName: 'institute_page_goto',
    pointParams: {...params}
  })
}

// 选检测人页访问
const chooseLinkmanNamePageView = (params) => {
  allPointTrack({
    eventName: 'choose_linkman_name_page_view',
    pointParams: {...params}
  })
}

// 选检测人页点击
const chooseLinkmanNamePageGoto = (params) => {
  allPointTrack({
    eventName: 'choose_linkman_name_page_goto',
    pointParams: {...params}
  })
}

// 主题页访问
const subjectPageView = (params) => {
  allPointTrack({
    eventName: 'subject_page_view',
    pointParams: {...params}
  })
}

// 主题页点击
const subjectPageGoto = (params) => {
  allPointTrack({
    eventName: 'subject_page_goto',
    pointParams: {...params}
  })
}

export {
  institutePageView,
  institutePageGoto,
  chooseLinkmanNamePageView,
  chooseLinkmanNamePageGoto,
  subjectPageView,
  subjectPageGoto,
}
