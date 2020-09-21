import sensors from '@src/common/utils/sensors'
import fun from '@src/common/utils'

const point = {}
// 神策
point.sensorsTrack = (obj) => {
  // console.log('神策埋点数据', obj, sensors)
  sensors.track(obj.eventName, obj.pointParams)
}
// convertLab
point.convertLabTrack = (obj) => {
  // console.log('convertLab埋点数据', obj, window._cl_tracker)
  window._cl_tracker.track(`c_${obj.eventName}`, obj.pointParams)
}

point.allPointTrack = (obj) => {
  const pageIds = fun.togetPageIds()
  const pDate = Object.assign({}, obj.pointParams, pageIds)
  const clParams = {}

  for (let n in pDate) {
    clParams[`c_${n}`] = pDate[n]
  }
  sensors.track(obj.eventName, pDate)
  if (window.clab_tracker) {
    // console.log('埋点数据', obj, sensors, window._cl_tracker)
    window._cl_tracker.track(`c_${obj.eventName}`, clParams)
    return
  }
  window.onload = () => {
    window.clab_tracker && window.clab_tracker.ready(function () {
      // console.log('埋点数据', obj, sensors, window._cl_tracker)
      window._cl_tracker.track(`c_${obj.eventName}`, clParams)
    })
  }
}

export default {
  ...point
}
