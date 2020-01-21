import React from 'react'
import { API, fun, filter, point } from '@src/common/app'
import { Page } from '@src/components'
import Info from './info'
const { getParams } = fun
const { samplingNewStatus } = filter
const { allPointTrack } = point
class Status extends React.Component {
  state = {
    noData:false,
    status:[],
    data: {}
  }
  // 埋点记录查看样本状态
  trackPointSampleStatusView () {
    let obj = {
      eventName:'sample_status_view',
      pointParams:{
        sample_barcode:getParams().barCode
      }
    }
    allPointTrack(obj)
  }
  componentDidMount () {
    const obj = getParams()
    API.listReportStatusInfoByBarCode(obj).then(res => {
      const { code, data } = res
      if (!code) {
        const status = ['', '', '', '', '', '', '', '', '', '', '']
        this.setState({ order: obj.barCode, data })
        const { reportStatusInfoRespList = [] } = data || {}
        reportStatusInfoRespList.map((item, index) => {
          if (item.labStage === '报告生成') return false
          samplingNewStatus.map((items, i) => {
            if (item.labStage === items.name) {
              item['indexFlag'] = i
              status[i] = item
            }
          })
        })
        this.setState({ status, data },
          () => {
            // 加载页面完成触发
            this.trackPointSampleStatusView()
          })
      }
    })
  }
  render () {
    const { order, status, data } = this.state
    return (
      <Page title='样本状态'>
        <Info order={order} status={status} data={data} />
      </Page>
    )
  }
}

export default Status
