import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/index'

const LuckyDraw = Loadable(() => import('./home'))

export default (
  <React.Fragment>
    <Route exact path="/luckyDraw" component={LuckyDraw} />
  </React.Fragment>
)
