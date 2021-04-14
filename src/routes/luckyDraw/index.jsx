import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/index'

import Home from './home'
import Recods from './recods'
// const Home = Loadable(() => import('./home'))
// const Home = Loadable(() => import('./home'))
// const LuckyWheel = Loadable(() => import('./componets/luckyWheel'))
// const LuckyGrid = Loadable(() => import('./componets/luckyGrid'))
// const LuckEgg = Loadable(() => import('./componets/luckEgg'))
// const Recods = Loadable(() => import('./recods'))

export default (
  <React.Fragment>
    <Route exact path="/luckyDraw" component={Home} />
    {/* <Route exact path="/luckyWheel" component={LuckyWheel} />
    <Route exact path="/luckyGrid" component={LuckyGrid} />
    <Route exact path="/luckyegg" component={LuckEgg} /> */}
    <Route exact path="/recods" component={Recods} />
  </React.Fragment>
)
