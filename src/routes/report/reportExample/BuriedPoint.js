import { point } from '@src/common/app'
const { allPointTrack } = point

/*** 埋点 示例报告 ****/

// 访问示例报告列表页
const sampleReportListPageView = (params) => {
  const { sample_linkman,
    relation_id
  } = params
  allPointTrack({
    eventName: 'sample_report_list_page_view',
    pointParams: {
      sample_linkman,
      relation_id
    }
  })
}

// 访问示例报告首页
const sampleReportNormalPageVeiw = (params) => {
  const { report_code,
    report_name,
    report_type,
    sample_linkman,
    relation_id
  } = params
  allPointTrack({
    eventName: 'sample_report_normal_page_veiw',
    pointParams: {
      report_code,
      report_name,
      report_type,
      sample_linkman,
      relation_id
    }
  })
}

// 访问检测项详情页-检测结果
const sampleReportDetailResultPageView = (params) => {
  const { trait_code,
    trait_name,
    report_code,
    report_type,
    sample_linkman,
    relation_id,
  } = params
  allPointTrack({
    eventName: 'sample_report_detail_result_page_view',
    pointParams: {
      trait_code,
      trait_name,
      report_code,
      report_type,
      sample_linkman,
      relation_id,
    }
  })
}

// 访问检测项详情页-科学细节
const sampleReportDetailSciencePageView = (params) => {
  const {
    trait_code,
    trait_name,
    report_code,
    report_type,
    sample_linkman,
    relation_id,
  } = params
  allPointTrack({
    eventName: 'sample_report_detail_science_page_view',
    pointParams: {
      trait_code,
      trait_name,
      report_code,
      report_type,
      sample_linkman,
      relation_id,
    }
  })
}

// 访问红亮点列表页
const sampleReportRedTraitPageView = (params) => {
  const {
    sample_linkman,
    sample_barcode,
    page_type,
    report_code
  } = params
  allPointTrack({
    eventName: 'sample_report_red_trait_page_view',
    pointParams: {
      sample_linkman,
      sample_barcode,
      page_type,
      report_code
    }
  })
}
// 访问用户评价
const sampleReportCommentView = (params) => {
  const {
    sample_linkman,
    relation_id,
    report_code
  } = params
  allPointTrack({
    eventName: 'sample_report_comment_view',
    pointParams: {
      sample_linkman,
      relation_id,
      report_code
    }
  })
}
// 访问引导解锁/新购弹窗
const sampleReportUnlockPopWinView = (params) => {
  const {
    sample_linkman,
    relation_id,
    report_code,
    page_code
  } = params
  allPointTrack({
    eventName: 'sample_report_unlock_pop_win_view',
    pointParams: {
      sample_linkman,
      relation_id,
      report_code,
      page_code
    }
  })
}
// 访问私人号二维码
const sampleReportQrcodeView = () => {
  allPointTrack({
    eventName: 'sample_report_qrcode_view',
  })
}
// 模块点击
const pageModuleClick = (params) => {
  const {
    page_code,
    module_code,
    module_content_type
  } = params
  allPointTrack({
    eventName: 'sample_page_module_click',
    pointParams: {
      page_code,
      module_code,
      module_content_type
    }
  })
}
// 按钮点击
const sampleReportPageButtonGoto = (params) => {
  console.log(params)
  const {
    Btn_name,
    page_code,
    sample_linkman,
    relation_id,
    report_code
  } = params
  allPointTrack({
    eventName: 'sample_report_page_button_goto',
    pointParams: {
      Btn_name,
      page_code,
      sample_linkman,
      relation_id,
      report_code
    }
  })
}
const backToSampleReportListGoto = (params) => {
  allPointTrack({
    eventName: 'back_to_sample_report_list_goto',
    pointParams: { ...params }
  })
}
const reportExampleGoto = (params) => {
  allPointTrack({
    eventName: 'reportExample_goto',
    pointParams: { ...params }
  })
}
const HPVReportSampleView = (params) => {
  allPointTrack({
    eventName: 'HPV_report_sample_view',
    pointParams: { ...params }
  })
}
export {
  sampleReportListPageView,
  sampleReportNormalPageVeiw,
  sampleReportDetailResultPageView,
  sampleReportDetailSciencePageView,
  sampleReportRedTraitPageView,
  sampleReportCommentView,
  sampleReportUnlockPopWinView,
  sampleReportQrcodeView,
  pageModuleClick,
  sampleReportPageButtonGoto,
  backToSampleReportListGoto,
  reportExampleGoto,
  HPVReportSampleView
}
