import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const Tools = Loadable(() => import('./home'))

export default (
  <React.Fragment>
    <Route exact path='/selfTools' component={Tools} />
  </React.Fragment>
)