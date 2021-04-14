// import React from 'react'
// import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import BaseLayer from './baseLayer'

// import Egg from './egg' // 报告相关
// import LuckyDraw from './luckyDraw' // 报告相关

// const routes = () => (
//   <BrowserRouter basename="/mkt/">
//     <Switch>
//       <Route
//         path="/"
//         component={({ match }) => {
//           return (
//             <BaseLayer>
//               <React.Fragment>
//                 <Route exact path="/xingg" render={() => <LuckyDraw />} />
//                 {Egg}
//                 {LuckyDraw}
//               </React.Fragment>
//             </BaseLayer>
//           )
//         }}
//       />
//     </Switch>
//   </BrowserRouter>
// )

// export default routes

import React from 'react'
// import ShowTex from './showTex'
// const RemoteNewsList = React.lazy(() => import("app2/NewsList"));

// SayHi是在remote项目里写的组件
// import(`${name/exposes[name]}`)
const SayHi = React.lazy(() => import('fdTest/sayHi'))

const App = () => (
  <div>
    <h2 style={{ textAlign: 'center' }}>App1, Local Slides, Remote NewsList</h2>
    {/* <ShowTex /> */}

    <React.Suspense fallback="Loading Slides">
      {/* 然后常规调用组件 */}
      <SayHi />
    </React.Suspense>
  </div>
)

export default App
