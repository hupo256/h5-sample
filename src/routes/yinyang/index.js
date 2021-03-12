import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const YinYang = Loadable(() => import('./home'))
const yinyangSolution = Loadable(() => import('./solution'))
const Bbinfor = Loadable(() => import('./bbinfor'))
const articleDtail = Loadable(() => import('./article-detail'))
// const Callapp = Loadable(() => import('./callapp'))
// const LandingPage = Loadable(() => import('../mkt/LandingPage'))

export default (
  <React.Fragment>
    <Route exact path='/yinyang' component={YinYang} />
    <Route path='/yinyang/yinyang-solution' component={yinyangSolution} />
    <Route path='/yinyang/yinyang-bbinfor' component={Bbinfor} />
    <Route path='/yinyang/article-detail' component={articleDtail} />
    {/* <Route path='/yinyang/callapp' component={Callapp} /> */}

    {/* <Route path='/yinyang/mktlanding' component={LandingPage} /> */}
  </React.Fragment>
)
