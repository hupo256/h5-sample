import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const OneKeyUnlock = Loadable(() => import('./andallPlatform'))
// const WxOneKeyUnlock = Loadable(() => import('./wxPlatform'))
export default (
  <React.Fragment>
    <Route exact path='/oneKeyUnlock' component={OneKeyUnlock} />
    {/*<Route exact path='/wxOneKeyUnlock' component={WxOneKeyUnlock} />*/}
  </React.Fragment>
)
