import sensors from '@src/common/utils/sensors'

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
  // if (IS_ENV !== 'production' && IS_ENV !== 'pre') return false
  sensors.track(obj.eventName, obj.pointParams)
  if (window.clab_tracker) {
    // console.log('埋点数据', obj, sensors, window._cl_tracker)
    window._cl_tracker.track(`c_${obj.eventName}`, obj.pointParams)
    return
  }
  window.onload = () => {
    window.clab_tracker && window.clab_tracker.ready(function () {
      // console.log('埋点数据', obj, sensors, window._cl_tracker)
      window._cl_tracker.track(`c_${obj.eventName}`, obj.pointParams)
    })
  }
}

export default {
  ...point
}
