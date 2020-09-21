import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'
import { KeepAlive } from 'react-keep-alive'

const Order = Loadable({
  loader: () => import('./order/order'),
  loading: Loading
})

const Details = Loadable({
  loader: () => import('./details'),
  loading: Loading
})
const SubmitOrder = Loadable({
  loader: () => import('./submit'),
  loading: Loading
})
const UnlockSubmit = Loadable({
  loader: () => import('./unlock-submit'),
  loading: Loading
})
const PaySuccess = Loadable({
  loader: () => import('./pay-success'),
  loading: Loading
})
const UnlockDetails = Loadable({
  loader: () => import('./unlock-details'),
  loading: Loading
})
const MemberSubmit = Loadable({
  loader: () => import('./member-submit'),
  loading: Loading
})

export default (
  <React.Fragment>
    {/* <Route path='/orders' render={props=>(
      <KeepAlive key='myOrder'>
        <div><Order {...props} /></div>
      </KeepAlive>
    )} /> */} 
    <Route exact path='/orders' component={Order} />
    <Route path='/orders/order-details' component={Details} />
    <Route path='/orders/order-submit' component={SubmitOrder} />
    <Route path='/orders/unlock-submit' component={UnlockSubmit} />
    <Route path='/orders/pay-success' component={PaySuccess} />
    <Route path='/orders/unlock-details' component={UnlockDetails} />
    <Route path='/orders/member-submit' component={MemberSubmit} />
  </React.Fragment>
)
