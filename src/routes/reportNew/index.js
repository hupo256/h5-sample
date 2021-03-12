import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'


const Report = Loadable({
  loader: () => import('./reportNew/reportNew'),
  loading: Loading
})


export default (
  <React.Fragment>
    <Route exact path='/reportNew' component={Report} />
  </React.Fragment>
)
