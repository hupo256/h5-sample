import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Loadable from '@src/components/loading/index'
import BaseLayer from './baseLayer'

import Egg from './egg' // 报告相关
import LuckyDraw from './luckyDraw' // 报告相关

const routes = () => (
  <BrowserRouter basename="/mkt/">
    <Switch>
      <Route
        path="/"
        component={({ match }) => {
          return (
            <BaseLayer>
              <React.Fragment>
                {/* <Route exact path="/xingg" render={() => <Egg />} /> */}
                {Egg}
                {LuckyDraw}
              </React.Fragment>
            </BaseLayer>
          )
        }}
      />
    </Switch>
  </BrowserRouter>
)

export default routes

// import React from 'react'
// import Loadable from '@src/components/loading/index'
// const SayHi = Loadable(() => import('fdTest/sayHi'))
// const RemoteSlides = Loadable(() => import('app1/Slides'))
// const ShowTex = Loadable(() => import('./egg/showTex'))

// export default function Sample(props) {
//   return (
//     <div>
//       <h2>App1, Local Slides, Remote NewsList</h2>
//       <ShowTex />
//       <RemoteSlides />
//       <SayHi />
//     </div>
//   )
// }
