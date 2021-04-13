import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/index'

// const LuckyDraw = Loadable(() => import('./home'))
const LuckyWheel = Loadable(() => import('./luckyWheel'))
const LuckyGrid = Loadable(() => import('./luckyGrid'))

export default (
  <React.Fragment>
    {/* <Route exact path="/luckyDraw" component={LuckyDraw} /> */}
    <Route exact path="/luckyWheel" component={LuckyWheel} />
    <Route exact path="/luckyGrid" component={LuckyGrid} />
  </React.Fragment>
)
