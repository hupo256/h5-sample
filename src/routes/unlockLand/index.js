import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const UnlockLand = Loadable(() => import('./home'))

export default (
  <React.Fragment>
    <Route exact path='/unlockLand' component={UnlockLand} />
  </React.Fragment>
)
