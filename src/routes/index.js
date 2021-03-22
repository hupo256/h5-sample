import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import BaseLayer from './baseLayer'

import Home from './egg/home' // 报告相关
import Egg from './egg' // 报告相关
import TodoItem from './todoItem' // 报告相关

const routes = () => (
  <BrowserRouter basename="/mkt/">
    <Switch>
      <Route
        path="/"
        component={({ match }) => {
          return (
            <BaseLayer>
              <React.Fragment>
                <Route exact path="/xingg" render={() => <Home />} />
                {Egg}
                {TodoItem}
              </React.Fragment>
            </BaseLayer>
          )
        }}
      />
    </Switch>
  </BrowserRouter>
)

export default routes
