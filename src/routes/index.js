import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Router from './router'

import Institute from './institute' // 报告相关
import Egg from './egg' // 报告相关

const routes = () => (
  <BrowserRouter basename="/mkt/">
    <Switch>
      <Route
        path="/"
        component={({ match }) => {
          return (
            <Router>
              <React.Fragment>
                <Route exact path="/xingg" render={() => <Institute />} />
                {Institute}
                {Egg}
              </React.Fragment>
            </Router>
          )
        }}
      />
    </Switch>
  </BrowserRouter>
)

export default routes
