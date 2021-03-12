/**
  * @description: 身高小工具埋点
  * @author: gaoyanxia
  * @update: 2019-10-14
  */

import { point } from '@src/common/app'
const { allPointTrack } = point

// 埋点 访问基因预测身高页
const trackPointToolHeightGenemaxPageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_genemax_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 访问录入测量数据页
const trackPointToolHeightMeasurePageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_measure_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 访问数据对比页
const trackPointToolHeightComparePageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_compare_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 访问引导购买落地页
const trackPointToolHeightBuyguidePageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_buyguide_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 访问微信内购买成功页
const trackPointToolHeightOrdersuccessPageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_ordersuccess_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 页面内点击
const trackPointToolHeightPageBtnClick = (params) => {
  allPointTrack({
    eventName: 'tool_height_page_Btn_click',
    pointParams: {
      ...params
    }
  })
}

// 埋点 工具介绍页
const trackPointToolHeightIndexPageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_index_page_view',
  })
}
// 埋点 商品点击
const trackPointToolHeightGoodsClick = (params) => {
  allPointTrack({
    eventName: 'tool_height_goods_click',
    pointParams: {
      ...params
    }
  })
}
// 埋点 首页
const trackPointToolHeightGraphPageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_graph_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 确认信息页
const trackPointToolHeightLinkmanInfoPageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_linkmaninfo_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 输入测量值
const trackPointToolHeightInputRecordPageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_inputrecord_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 首页
const trackPointToolHeightHomePageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_home_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 测评页
const trackPointToolHeightAssessmentPageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_assessment_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 发现页
const trackPointToolHeightContentPageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_content_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 更多页
const trackPointToolHeightMorePageView = (params) => {
  allPointTrack({
    eventName: 'tool_height_more_page_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 首页tab
const trackPointToolHeightHomeTab = (params) => {
  allPointTrack({
    eventName: 'tool_height_home_tab',
    pointParams: {
      ...params
    }
  })
}
// 埋点 测评tab
const trackPointToolHeightAssessmentTab = (params) => {
  allPointTrack({
    eventName: 'tool_height_assessment_tab',
    pointParams: {
      ...params
    }
  })
}
// 埋点 发现tab
const trackPointToolHeightContentTab = (params) => {
  allPointTrack({
    eventName: 'tool_height_content_tab',
    pointParams: {
      ...params
    }
  })
}
// 埋点 更多tab
const trackPointToolHeightMoreTab = (params) => {
  allPointTrack({
    eventName: 'tool_height_more_tab',
    pointParams: {
      ...params
    }
  })
}
// 埋点 文章点击
const trackPointToolHeightArticleClick = (params) => {
  allPointTrack({
    eventName: 'tool_height_article_click',
    pointParams: {
      ...params
    }
  })
}
// 埋点 超过30天弹窗
const trackPointToolHeightOutPopup = (params) => {
  allPointTrack({
    eventName: 'tool_height_out30_popup',
    pointParams: {
      ...params
    }
  })
}
// 埋点 测评tab-身高曲线
const trackPointToolHeightAssessmentHeight = (params) => {
  allPointTrack({
    eventName: 'tool_height_assessment_height',
    pointParams: {
      ...params
    }
  })
}
// 埋点 测评tab-营养
const trackPointToolHeightAssessmentNutrition = (params) => {
  allPointTrack({
    eventName: 'tool_height_assessment_nutrition',
    pointParams: {
      ...params
    }
  })
}
// 埋点 测评tab-运动
const trackPointToolHeightAssessmentSport = (params) => {
  allPointTrack({
    eventName: 'tool_height_assessment_sport',
    pointParams: {
      ...params
    }
  })
}
// 埋点 测评tab-睡眠
const trackPointToolHeightAssessmentSleep = (params) => {
  allPointTrack({
    eventName: 'tool_height_assessment_sleep',
    pointParams: {
      ...params
    }
  })
}
// 埋点 测评tab-体质
const trackPointToolHeightAssessmentConstitution = (params) => {
  allPointTrack({
    eventName: 'tool_height_assessment_constitution',
    pointParams: {
      ...params
    }
  })
}
// 埋点 发现tab-文章
const trackPointToolHeightContentArticle = (params) => {
  allPointTrack({
    eventName: 'tool_height_content_article',
    pointParams: {
      ...params
    }
  })
}
// 埋点 发现tab-商品
const trackPointToolHeightContentGoods = (params) => {
  allPointTrack({
    eventName: 'tool_height_content_goods',
    pointParams: {
      ...params
    }
  })
}

export {
  trackPointToolHeightGenemaxPageView,
  trackPointToolHeightMeasurePageView,
  trackPointToolHeightComparePageView,
  trackPointToolHeightBuyguidePageView,
  trackPointToolHeightOrdersuccessPageView,
  trackPointToolHeightPageBtnClick,
  trackPointToolHeightIndexPageView,
  trackPointToolHeightGoodsClick,
  trackPointToolHeightGraphPageView,
  trackPointToolHeightLinkmanInfoPageView,
  trackPointToolHeightInputRecordPageView,
  trackPointToolHeightHomePageView,
  trackPointToolHeightAssessmentPageView,
  trackPointToolHeightContentPageView,
  trackPointToolHeightMorePageView,
  trackPointToolHeightHomeTab,
  trackPointToolHeightAssessmentTab,
  trackPointToolHeightContentTab,
  trackPointToolHeightMoreTab,
  trackPointToolHeightArticleClick,
  trackPointToolHeightOutPopup,
  trackPointToolHeightAssessmentHeight,
  trackPointToolHeightAssessmentNutrition,
  trackPointToolHeightAssessmentSport,
  trackPointToolHeightAssessmentSleep,
  trackPointToolHeightAssessmentConstitution,
  trackPointToolHeightContentArticle,
  trackPointToolHeightContentGoods
}
