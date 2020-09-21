import point from '@src/common/utils/point'
const { allPointTrack } = point

/*** 埋点 研究院埋点 ****/ 

// 问卷首页访问
const qnaireBeginPageView = (params) => {
  allPointTrack({
    eventName: 'qnaire_begin_page_view',
    pointParams: {...params}
  })
}

// 问卷首页点击
const qnaireBeginPageGoto = (params) => {
  allPointTrack({
    eventName: 'qnaire_begin_page_goto',
    pointParams: {...params}
  })
}

// 问卷完成页访问
const qnaireCompletePageView = (params) => {
  allPointTrack({
    eventName: 'qnaire_complete_page_view',
    pointParams: {...params}
  })
}

// 问卷完成页点击
const qnaireCompletePageGoto = (params) => {
  allPointTrack({
    eventName: 'qnaire_complete_page_goto',
    pointParams: {...params}
  })
}


// 基础测评信息页访问
const qnaireBasicInfoView = (params) => {
  allPointTrack({
    eventName: 'qnaire_basic_info_view',
    pointParams: {...params}
  })
}

// 基础测评信息页-开始答题点击
const qnaireBasicInfoStartGoto = (params) => {
  allPointTrack({
    eventName: 'qnaire_basic_info_start_goto',
    pointParams: {...params}
  })
}

// 问卷封面页访问
const qnaireCoverView = (params) => {
  allPointTrack({
    eventName: 'qnaire_cover_view',
    pointParams: {...params}
  })
}

// 问卷封面页点击
const qnaireCoverGoto = (params) => {
  allPointTrack({
    eventName: 'qnaire_cover_goto',
    pointParams: {...params}
  })
}

export {
  qnaireBeginPageView,
  qnaireBeginPageGoto,
  qnaireCompletePageView,
  qnaireCompletePageGoto,
  qnaireBasicInfoView,
  qnaireBasicInfoStartGoto,
  qnaireCoverView,
  qnaireCoverGoto
}
