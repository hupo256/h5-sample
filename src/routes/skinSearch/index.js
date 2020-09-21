import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const HomePage = Loadable(() => import('./pages/homePage'))
const Records = Loadable(() => import('./pages/records'))
const SkinSearch = Loadable(() => import('./pages/skinSearch'))
const GoodsDetail = Loadable(() => import('./pages/goodsDetail'))
const GroupDetail = Loadable(() => import('./pages/groupDetail'))
const SharePage = Loadable(() => import('./pages/sharePage'))

export default (
  <React.Fragment>
    <Route exact path='/skinSearch/homePage' component={HomePage} />
    <Route exact path='/skinSearch/records' component={Records} />
    <Route exact path='/skinSearch/skinSearch' component={SkinSearch} />
    <Route exact path='/skinSearch/goodsDetail' component={GoodsDetail} />
    <Route exact path='/skinSearch/groupDetail' component={GroupDetail} />
    <Route exact path='/skinSearch/sharePage' component={SharePage} />
  </React.Fragment>
)
