import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const Institute = Loadable(() => import('./home'))
const Touchrole = Loadable(() => import('./touchrole'))
const Articles = Loadable(() => import('./articles/index'))
const Experts = Loadable(() => import('./experts'))

export default (
  <React.Fragment>
    <Route exact path='/institute' component={Institute} />
    <Route path='/institute/touchrole' component={Touchrole} />
    <Route path='/institute/prod-articles' component={Articles} />
    <Route path='/institute/experts' component={Experts} />
  </React.Fragment>
)
