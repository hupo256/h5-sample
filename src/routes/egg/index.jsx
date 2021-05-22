import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/index'

const Home = Loadable(() => import('./home'))

export default (
  <React.Fragment>
    <Route exact path="/egg" component={Home} />
  </React.Fragment>
)
