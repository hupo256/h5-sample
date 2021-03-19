import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/index'

const Egg = Loadable(() => import('./home'))

export default (
  <React.Fragment>
    <Route exact path="/egg" component={Egg} />
  </React.Fragment>
)
