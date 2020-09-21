import point from '@src/common/utils/point'
const { allPointTrack } = point

/*** 埋点 研究院埋点 ****/ 

// 问卷首页访问
const toolListView = (params) => {
  allPointTrack({
    eventName: 'tool_list_view',
    pointParams: {...params}
  })
}

// 问卷首页点击
const toolListGoto = (params) => {
  allPointTrack({
    eventName: 'tool_list_goto',
    pointParams: {...params}
  })
}

export {
  toolListView,
  toolListGoto,
}
