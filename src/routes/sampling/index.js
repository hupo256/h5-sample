import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'

const Return = Loadable({
  loader: () => import('./return'),
  loading: Loading
})
const Reserve = Loadable({
  loader: () => import('./reserve'),
  loading: Loading
})
const Shipping = Loadable({
  loader: () => import('./shipping/shipping'),
  loading: Loading
})
const SamplingStatus = Loadable({
  loader: () => import('./status'),
  loading: Loading
})
const SamplingStatusError = Loadable({
  loader: () => import('./statusError'),
  loading: Loading
})

export default (
  <React.Fragment>
    <Route path='/return' component={Return} />
    <Route path='/reserve' component={Reserve} />
    <Route path='/shipping' component={Shipping} />
    <Route path='/sampling-status' component={SamplingStatus} />
    <Route path='/sampling-status-error' component={SamplingStatusError} />
  </React.Fragment>
)
