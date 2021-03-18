import sensors from 'sa-sdk-javascript'
import heatmapUrl from '../../../node_modules/sa-sdk-javascript/heatmap.min'
const domain = location.host.includes('.andall.') ? 'andall' : 'dnatime'
let sensorsServerUrl =
  location.host.indexOf('wechatshop') === 0
    ? `https://scdata.${domain}.com/sa?project=production` // 生产production
    : `https://scdata.${domain}.com/sa?project=default` // 测试 default
sensors.init({
  //show_log: true,
  show_log: false,
  server_url: sensorsServerUrl,
  // heatmap_url神策分析中点击分析及触达分析功能代码，代码生成工具会自动生成。如果神策代码中 `sensorsdata.min.js` 版本是 1.9.1 及以上版本，这个参数必须配置，低于此版本不需要配置。
  heatmap_url: heatmapUrl,
  // web_url 神策分析中点击分析及触达分析功能会用到此地址，代码生成工具会自动生成。如果神策后台版本及 `sensorsdata.min.js` 均是 1.10 及以上版本，这个参数不需要配置。
  // web_url:'神策分析后台地址',
  heatmap: {
    // 是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
    // 需要 JSSDK 版本号大于 1.7
    clickmap: 'default',
    // 是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
    // 需要 JSSDK 版本号大于 1.9.1
    scroll_notice_map: 'default',
  },
})
// sensors.quick('autoTrack')
// sensors.quick('autoTrackSinglePage')
export default sensors
