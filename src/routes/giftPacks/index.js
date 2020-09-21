import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'
const GiftPacks = Loadable({
  loader: () => import('./giftPacks/index'),
  loading: Loading
})
const CounponDetail = Loadable({
  loader: () => import('./giftPacks/couponDetail'),
  loading: Loading
})
export default (
  <React.Fragment>
    <Route exact path='/giftPacks' component={GiftPacks} />
    <Route exact path='/giftPacks/couponDetail' component={CounponDetail} />
  </React.Fragment>
)
