import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import sensors from '@src/common/utils/sensors'
import Router from './router'
import Home from './sampling/home'

import sampling from './sampling'
// 绑定采集器
import binding from './binding'
// 销售盒子
import salebox from './salebox'
import Activity from './activity'
import Mkt from './mkt'
import Transfer from './transfer'
import detail from './detail' // 首页2.0
import height from './height' // 身高小工具

const routes = () => (
  <BrowserRouter basename='/andall-sample/'>
    <Switch>
      <Route path='/' component={({ match }) => {
        sensors.quick('autoTrackSinglePage')
        return (
          <Router>
            <React.Fragment>
              <Route exact path={match.url} render={() => <Home />} />
              <Route exact path='/activity' render={() => <Activity />} />
              {sampling}
              {binding}
              {salebox}
              {Mkt}
              {Transfer}
              {detail}
              {height}
            </React.Fragment>
          </Router>
        )
      }} />
    </Switch>
  </BrowserRouter>
)

export default routes
