import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'

const Login = Loadable({
  loader: () => import('./oneKeyLogin'),
  loading: Loading
})
const MobileLogin = Loadable({
  loader: () => import('./mobileLogin'),
  loading: Loading
})
export default (
  <React.Fragment>
    <Route exact path='/login' component={Login} />
    <Route path='/login/mobileLogin' component={MobileLogin} />
  </React.Fragment>
)
