import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'
const PredictedHeight = Loadable({
  loader: () => import('./predicted-height'),
  loading: Loading
})
const BuySuccess = Loadable({
  loader: () => import('./buy-success'),
  loading: Loading
})
const UserInfo = Loadable({
  loader: () => import('./userInfo'),
  loading: Loading
})
const AddRecord = Loadable({
  loader: () => import('./add-record'),
  loading: Loading
})
const RecordList = Loadable({
  loader: () => import('./record-list'),
  loading: Loading
})
const HeightCurve = Loadable({
  loader: () => import('./height-curve'),
  loading: Loading
})
const HeightLand = Loadable({
  loader: () => import('./height-land'),
  loading: Loading
})
const HeightIndex = Loadable({
  loader: () => import('./height-index'),
  loading: Loading
})
const HeightPoster = Loadable({
  loader: () => import('./height-poster'),
  loading: Loading
})
export default (
  <React.Fragment >
    <Route path='/predicted-height' component={PredictedHeight} />
    <Route path='/buy-success' component={BuySuccess} />
    <Route path='/userInfo' component={UserInfo} />
    <Route path='/add-record' component={AddRecord} />
    <Route path='/record-list' component={RecordList} />
    <Route path='/height-curve' component={HeightCurve} />
    <Route path='/height-land' component={HeightLand} />
    <Route path='/height-index' component={HeightIndex} />
    <Route path='/height-poster' component={HeightPoster} />
  </React.Fragment>
)
