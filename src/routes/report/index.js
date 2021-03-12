import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'
//const Report4_2 = Loadable(() => import('./report4_2')) // 示例报告列表

// const ReportExample = Loadable(() => import('./reportExample')) // 示例报告列表
// const ReportExampleList = Loadable(() => import('./reportExample/list')) // 示例报告列表
// const ReportExampleHighlight = Loadable(() => import('./reportExample/highlight')) // 示例报告红亮点
// const ReportExampleDetail = Loadable(() => import('./reportExample/detail')) // 示例报告详情
// const HpvDetail = Loadable(() => import('./reportExample/hpvDetail')) // 示例报告详情
// const AnDetail = Loadable(() => import('./reportExample/anReportDetail'))

// const ReportExample = Loadable(() => import('./reportExample')) // 示例报告列表
// const ReportExampleList = Loadable(() => import('./reportExample/list')) // 示例报告列表
// const ReportExampleHighlight = Loadable(() => import('./reportExample/highlight')) // 示例报告红亮点
// const ReportExampleDetail = Loadable(() => import('./reportExample/detail')) // 示例报告详情
// const HpvDetail = Loadable(() => import('./reportExample/hpvDetail')) // 示例报告详情
// const AnDetail = Loadable(() => import('./reportExample/anReportDetail'))

// const Report4_2 = Loadable(() => import('./report4_2')) // 报告列表
const ReportIndex = Loadable(() => import('./reportShare/index')) // 报告详情
const ReportHighlight = Loadable(() => import('./reportShare/highlight')) // 报告详情
const Guide = Loadable(() => import('./reportShare/guide')) // 报告详情
// const HpvReportList = Loadable(() => import('./hpvReportList')) // hpv报告列表
// const HpvReport = Loadable(() => import('./hpvReport')) // hpv报告
// const HpvReportDetail = Loadable(() => import('./hpvReport/hpvDetail')) // hpv报告详情


// const BrcaReport = Loadable(() => import('./brcaReport')) // 乳腺癌报告
// const BrcaReportDetail = Loadable(() => import('./brcaReport/brcaDetail')) // 乳腺癌报告详情
// const MoreBrcaReportDetail = Loadable(() => import('./brcaReport/moreBrcaDetail')) // 更多乳腺癌报告详情

const ReportSuggest = Loadable(() => import('./report_suggest')) //报告综合建议

//const ReportSuggest = Loadable(() => import('./report_suggest')) //报告综合建议

//const Report5 = Loadable(() => import('./report5')) // 报告5.0
//const ReportChart  = Loadable(() => import('./reportChart')) //报告雷达图

export default (
  <React.Fragment>

     {/* <Route exact path='/reportExample' component={ReportExample} />
     <Route exact path='/reportExample/list' component={ReportExampleList} />
     <Route exact path='/reportExample/highlight' component={ReportExampleHighlight} />
     <Route exact path='/reportExample/detail' component={ReportExampleDetail} />
     <Route exact path='/reportExample/hpvDetail' component={HpvDetail} />
     <Route exact path='/reportExample/anDetail' component={AnDetail} /> 
    <Route exact path='/report_suggest' component={ReportSuggest} /> */}

    {/* <Route exact path='/report4_2' component={Report4_2} /> */}
    <Route exact path='/reportShare' component={ReportIndex} /> 
    <Route exact path='/reportShare/highlight' component={ReportHighlight} />
    <Route exact path='/reportShare/guide' component={Guide} />  
    {/* <Route exact path='/reportChart' component={ReportChart} /> */}

    {/* <Route exact path='/hpvReport' component={HpvReport} />
    <Route exact path='/hpvReport/hpvDetail' component={HpvReportDetail} /> */}
    {/* <Route exact path='/hpvReportList' component={HpvReportList} /> */}

    {/* <Route exact path='/brcaReport' component={BrcaReport} /> 
    <Route exact path='/brcaReport/brcaDetail' component={BrcaReportDetail} />  
    <Route exact path='/brcaReport/moreBrcaDetail' component={MoreBrcaReportDetail} />   */}

  </React.Fragment>
)
