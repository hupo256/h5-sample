import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'

// 肠道报告首页
const ReportList = Loadable({
  loader: () => import('./report-list'),
  loading: Loading
})
// 肠道报告详情
const ReportDetail = Loadable({
  loader: () => import('./report-detail'),
  loading: Loading
})

// 详情2.0
const NewDetails = Loadable({
  loader: () => import('./newDetails'),
  loading: Loading
})
// 菌群建立的关键期
const KeyDetail = Loadable({
  loader: () => import('./keyDetail'),
  loading: Loading
})
// 菌群检测详情
const DetectionDetail = Loadable({
  loader: () => import('./detectionDetail'),
  loading: Loading
})
export default (
  <React.Fragment >
    <Route exact path='/anReports' component={ReportList} />
    <Route path='/anReports/cd-report-detail' component={ReportDetail} />
    <Route path='/anReports/newDetails' component={NewDetails} />
    <Route path='/anReports/keyDetail' component={KeyDetail} />
    <Route path='/anReports/detectionDetail' component={DetectionDetail} />

  </React.Fragment>
)
