import { point } from '@src/common/app'

const { allPointTrack } = point
// 测评列表页访问
const healthTestListView = (params) => {
  allPointTrack({
    eventName: 'health_test_list_view',
    pointParams: {
      ...params
    }
  })
}
// 测评列表页点击
const healthTestListGoto = (params) => {
  allPointTrack({
    eventName: 'health_test_list_goto',
    pointParams: {
      ...params
    }
  })
}
// 已填写列表访问
const doneListView = (params) => {
  allPointTrack({
    eventName: 'done_list_view',
    pointParams: {
      ...params
    }
  })
}
//	已填写列表点击
const doneListGoto = (params) => {
  allPointTrack({
    eventName: 'done_list_goto',
    pointParams: {
      ...params
    }
  })
}
// 测评填写页访问
const healthTestDetailView = (params) => {
  allPointTrack({
    eventName: 'health_test_detail_view',
    pointParams: {
      ...params
    }
  })
}
// 测评填写页点击
const healthTestDetailGoto = (params) => {
  allPointTrack({
    eventName: 'health_test_detail_goto',
    pointParams: {
      ...params
    }
  })
}
export {
  healthTestListView,
  healthTestListGoto,
  doneListView,
  doneListGoto,
  healthTestDetailView,
  healthTestDetailGoto,
}
