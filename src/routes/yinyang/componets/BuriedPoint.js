import point from '@src/common/utils/point'
const { allPointTrack } = point

/*** 埋点 营养小工具 ****/ 

// 页面访问
const YYGJlandingpageview = (params) => {
  const {view_type} = params
  allPointTrack({
    eventName: 'YYGJ_landingpage_view',
    pointParams: {view_type}
  })
}
// 表型填写
const YYGJlandingpageinputgoto = (params) => {
  const {view_type} = params
  allPointTrack({
    eventName: 'YYGJ_landingpage_input_goto',
    pointParams: {view_type}
  })
}
// 图表介绍按钮
const YYGJresultinfogoto = (params) => {
  allPointTrack({
    eventName: 'YYGJ_result_info_goto',
    pointParams: {}
  })
}
// 填写表型问卷按钮
const YYGJresultinputgoto = (params) => {
  const {view_type, view_Ltype} = params
  allPointTrack({
    eventName: 'YYGJ_result_input_goto',
    pointParams: {view_type, view_Ltype}
  })
}
// 购买宝宝营养基因入口（图表上）
const YYGJresultbuyNutrition = (params) => {
  const {product_id} = params
  allPointTrack({
    eventName: 'YYGJ_result_buy_Nutrition',
    pointParams: {
      product_id
    }
  })
}
// 营养模块解决方案按钮
const YYGJresultsolutiongoto = (params) => {
  const {view_type} = params
  allPointTrack({
    eventName: 'YYGJ_result_solution_goto',
    pointParams: {view_type}
  })
}
// B端商品推荐入口
const YYGJresultgoodsgoto = (params) => {
  const {content_id} = params
  allPointTrack({
    eventName: 'YYGJ_result_goods_goto',
    pointParams: {content_id}
  })
}

// 分类TAB点击
const YYGJsolutiondetailtabgoto = (params) => {
  allPointTrack({
    eventName: 'YYGJ_solution_detail_tab_goto',
    pointParams: {}
  })
}
// 推荐食谱入口点击 
const YYGJolutiondetailrecipegoto = (params) => {
  const {content_id} = params
  allPointTrack({
    eventName: 'YYGJ_solution_detail_recipe_goto',
    pointParams: {
      content_id
    }
  })
}
// 推荐知识入口点击 
const YYGJsolutiondetailknowledgegoto = (params) => {
  const {content_id} = params
  allPointTrack({
    eventName: 'YYGJ_solution_detail_knowledge_goto',
    pointParams: {
      content_id
    }
  })
}
// 问问专家按钮 
const YYGJsolutiondetailexpertsgoto = (params) => {
  const {} = params
  allPointTrack({
    eventName: 'YYGJ_solution_detail_experts_goto',
    pointParams: {}
  })
}

// 分享按钮 
const YYGJsharegoto = (params) => {
  const {view_type} = params
  allPointTrack({
    eventName: 'YYGJ_share_goto',
    pointParams: {view_type}
  })
}


// 检测人切换
const YYGJchangerolegoto = (params) => {
  const {view_type, linkman_id} = params
  allPointTrack({
    eventName: 'YYGJ_change_role_goto',
    pointParams: {
      view_type, linkman_id
    }
  })
}

// 检测产品推荐入口
const YYGJbannergoto = (params) => {
  const {view_type, product_id} = params
  allPointTrack({
    eventName: 'YYGJ_banner_goto',
    pointParams: {
      view_type, product_id
    }
  })
}

// 页面访问
const YYGJpageview = (params) => {
  const {view_type} = params
  allPointTrack({
    eventName: 'YYGJ_page_view',
    pointParams: {
      view_type
    }
  })
}

// 页面访问
const YYGJZJbannergoto = () => {
  allPointTrack({
    eventName: 'YYGJ_ZJbanner_goto',
  })
}

// 页面访问
const newmallarticleview = (params) => {
  const {content_id} = params
  allPointTrack({
    eventName: 'newmall_article_view',
    pointParams: {
      content_id
    }
  })
}

export {
  YYGJlandingpageview,
  YYGJlandingpageinputgoto,
  YYGJresultinfogoto,
  YYGJresultinputgoto,
  YYGJresultbuyNutrition,
  YYGJresultsolutiongoto,
  YYGJresultgoodsgoto,
  
  YYGJsolutiondetailtabgoto,
  YYGJolutiondetailrecipegoto,
  YYGJsolutiondetailknowledgegoto,
  
  YYGJsolutiondetailexpertsgoto,
  YYGJsharegoto,
  YYGJchangerolegoto,
  
  YYGJbannergoto,
  YYGJpageview,

  YYGJZJbannergoto,
  newmallarticleview,
}
