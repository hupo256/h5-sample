import { API } from '@src/common/app'
import wxconfig from './wxconfig'
import { allPointTrack } from './point'

/**
 * reportType:cas,cnn.cht...
 * reportId:报告ID  -1：示例报告列表页
 */

let link = `${window.location.origin}/sample-report`

const wxExReportShare = obj => {
  const { reportType, reportId } = obj
  const isType = obj.type
  if (reportId !== -1) {
    let type = reportType.toLowerCase()
    if (type === 'cnn' || type === 'cas' || type === 'pgl' || type === 'anf' || type === 'lab' ||
      type === 'cht' || type === 'cts') {
      type = 'report-cover'
    }
    link = `${window.location.origin}/${type}?id=${reportId}&report_share=4`
  }
  return API.getSampleShareInfo({
    productCode: isType ? reportType.toUpperCase() : '', reportId: isType ? '' : reportId, nomsg: 1
  })
    .then(res => {
      const { code, data } = res
      if (!code) {
        const { reportName, productName, headPicUrl } = data
        reportId !== -1 && (link += isType ? '&reportCategory=example' : `&shareToken=${data.shareToken}`)
        wxconfig({
          showMenu: true,
          params: {
            title: reportName,
            desc: productName,
            imgUrl: headPicUrl,
            link,
            success () {
              const obj = {
                eventName: 'report_share_complete',
                pointParams: {
                  // sample_barcode:barCode || '',
                  report_id: reportId,
                  report_type: isType ? 0 : 1,
                  report_code: reportType,
                  report_name: reportName
                }
              }
              allPointTrack(obj)
            }
          }
        })
      }
      return res
    })
}

export default wxExReportShare
