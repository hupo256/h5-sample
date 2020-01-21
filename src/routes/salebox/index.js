import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'

const SaleSelect = Loadable({
  loader: () => import('./salebox/saleSelect'),
  loading: Loading
})
const SaleBinding = Loadable({
  loader: () => import('./salebox/saleBinding'),
  loading: Loading
})

export default (
  <React.Fragment>
    <Route path='/sale-select' component={SaleSelect} />
    <Route path='/sale-binding' component={SaleBinding} />
  </React.Fragment>
)
