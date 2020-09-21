import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const Return = Loadable(() => import('./return'))
const Reserve = Loadable(() => import('./reserve'))
const Shipping = Loadable(() => import('./shipping/shipping'))
const SamplingStatus = Loadable(() => import('./status'))
const HpvStatus = Loadable(() => import('./status/hpvStatus'))
const SamplingStatusError = Loadable(() => import('./statusError'))
const Home = Loadable(() => import('./home'))

export default (
  <React.Fragment>
    <Route exact path='/sampling' component={Home} />
    <Route path='/sampling/shipping' component={Shipping} />
    <Route path='/sampling/return' component={Return} />
    <Route path='/sampling/reserve' component={Reserve} />
    <Route path='/sampling/sampling-status' component={SamplingStatus} />
    <Route path='/sampling/sampling-status-error' component={SamplingStatusError} />
    <Route path='/sampling/hpv-status' component={HpvStatus} />
  </React.Fragment>
)
