import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const Assessment = Loadable(() => import('./assessment'))
const HasWrite = Loadable(() => import('./hasWrite'))
const Checkout = Loadable(() => import('./checkout'))

export default (
  <React.Fragment>
    <Route exact path='/healthy/assessment' component={Assessment} />
    <Route exact path='/healthy/hasWrite' component={HasWrite} />
    <Route exact path='/healthy/checkout' component={Checkout} />
  </React.Fragment>
)
