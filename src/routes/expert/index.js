import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'

const Expert = Loadable({
  loader: () => import('./expert'),
  loading: Loading
})
const ExpertDetail = Loadable({
  loader: () => import('./expertDetail'),
  loading: Loading
})

export default (
  <React.Fragment>
    <Route exact path='/expert' component={Expert} />
    <Route path='/expert/expertDetail' component={ExpertDetail} />
  </React.Fragment>
)
