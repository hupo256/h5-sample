import { point } from '@src/common/app'
const { allPointTrack } = point

/*** 埋点 4.4分享报告埋点 ****/

// 访问示例报告列表页
const shareLinkGoto = (params) => {
  const { page_code,
    sample_linkmanid,
    trait_code,
    trait_name,
    report_code,
    report_name
  } = params
  allPointTrack({
    eventName: 'share_link_goto',
    pointParams: {
      page_code,
      sample_linkmanid,
      trait_code,
      trait_name,
      report_code,
      report_name
    }
  })
}


export {
  shareLinkGoto
}
