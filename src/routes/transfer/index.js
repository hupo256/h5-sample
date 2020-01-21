import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'

const Toapp = Loadable({
  loader: () => import('./toapp'),
  loading: Loading
})

export default (
  <React.Fragment>
    <Route path='/toapp' component={Toapp} />
  </React.Fragment>
)
