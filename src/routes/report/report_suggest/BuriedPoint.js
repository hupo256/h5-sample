import { point } from '@src/common/app'
const { allPointTrack } = point

/*** 埋点 报告5.0 ****/

// 访问检测项详情页-检测结果
const reportDetailResultPageView = (params) => {
  const { trait_code,
    trait_name,
    report_code,
    report_type,
    sample_linkmanid,
    sample_barcode,
  } = params
  allPointTrack({
    eventName: 'report_detail_result_page_view',
    pointParams: {
      trait_code,
      trait_name,
      report_code,
      report_type,
      sample_linkmanid,
      sample_barcode,
    }
  })
}

// 访问检测项详情页-科学细节
const reportScenarioPageView = (params) => {
  const { trait_code,
    trait_name,
    report_code,
    report_type,
    sample_linkmanid,
    sample_barcode,
  } = params
  allPointTrack({
    eventName: 'report_scenario_page_view',
    pointParams: {
      trait_code,
      trait_name,
      report_code,
      report_type,
      sample_linkmanid,
      sample_barcode,
    }
  })
}

// 检测项现状测评提交
const reportQuestionnaireSubmitClick = (params) => {
  const { trait_code,
    trait_name,
    report_code,
    report_type,
    sample_linkmanid,
    sample_barcode,
  } = params
  allPointTrack({
    eventName: 'report_questionnaire_submit_click',
    pointParams: {
      trait_code,
      trait_name,
      report_code,
      report_type,
      sample_linkmanid,
      sample_barcode,
    }
  })
}

// 推荐解锁报告点击
const recomReportGoto = (params) => {
  const {
    Btn_name,
    page_code,
    sample_linkmanid,
    sample_barcode,
    report_code,
    report_name,
    detail_source,
    order_source,
    recom_product_id
  } = params
  allPointTrack({
    eventName: 'recom_report_goto',
    pointParams: {
      Btn_name,
      page_code,
      sample_linkmanid,
      sample_barcode,
      report_code,
      report_name,
      detail_source,
      order_source,
      recom_product_id
    }
  })
}

// 报告内现状测评访问
const recomQuestGoto = (params) => {
  const {
    trait_code,
    trait_name,
    report_code,
    report_type,
    sample_linkmanid,
    sample_barcode
  } = params
  allPointTrack({
    eventName: 'report_quest_view',
    pointParams: {
      trait_code,
      trait_name,
      report_code,
      report_type,
      sample_linkmanid,
      sample_barcode
    }
  })
}
// 分享报告点击
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
const reportDetailResultBottomFeedbackView = (params) => {
  allPointTrack({
    eventName: 'report_detail_result_bottom_feedback_view',
    pointParams: {
      ...params
    }
  })
}
const compreSugResultView = (params) => {
  allPointTrack({
    eventName: 'compre_sug_result_view',
    pointParams: {
      ...params
    }
  })
}
const compreSugResultGoto = (params) => {
  allPointTrack({
    eventName: 'compre_sug_result_goto',
    pointParams: {
      ...params
    }
  })
}

export {
  reportDetailResultPageView,
  reportScenarioPageView,
  reportQuestionnaireSubmitClick,
  recomReportGoto,
  recomQuestGoto,
  shareLinkGoto,
  reportDetailResultBottomFeedbackView,
  compreSugResultView,
  compreSugResultGoto
}
