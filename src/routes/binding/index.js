import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'

const Binding = Loadable({
  loader: () => import('./binding/binding'),
  loading: Loading
})
const BindOnly = Loadable({
  loader: () => import('./binding/bindOnly'),
  loading: Loading
})
const BindNFrenid = Loadable({
  loader: () => import('./binding/bindNFrenid'),
  loading: Loading
})
const Success = Loadable({
  loader: () => import('./success'),
  loading: Loading
})

const BindUser = Loadable({
  loader: () => import('./bind-user'),
  loading: Loading
})
const Protocol = Loadable({
  loader: () => import('./protocol'),
  loading: Loading
})
const Buy = Loadable({
  loader: () => import('./protocol/buy'),
  loading: Loading
})
const Privacy = Loadable({
  loader: () => import('./protocol/privacy'),
  loading: Loading
})
const aboutAndall = Loadable({
  loader: () => import('./protocol/aboutAndall'),
  loading: Loading
})
const SelectUser = Loadable({
  loader: () => import('./select-user'),
  loading: Loading
})
const Authorization = Loadable({
  loader: () => import('./authorization'),
  loading: Loading
})
const Guide = Loadable({
  loader: () => import('./guide'),
  loading: Loading
})
const Demo = Loadable({
  loader: () => import('./demo'),
  loading: Loading
})
const CommonProblem = Loadable({
  loader: () => import('./commonProblem'),
  loading: Loading
})
const SelectUserKit = Loadable({
  loader: () => import('./select-user-kit'),
  loading: Loading
})
const BindUserKit = Loadable({
  loader: () => import('./bind-user-kit'),
  loading: Loading
})
const ProtocolKit = Loadable({
  loader: () => import('./protocol-kit'),
  loading: Loading
})
const LandPage = Loadable({
  loader: () => import('./landPage'),
  loading: Loading
})
export default (
  <React.Fragment>
    <Route path='/guide' component={Guide} />
    <Route path='/demo' component={Demo} />
    <Route path='/binding' component={Binding} />
    <Route path='/bindOnly' component={BindOnly} />
    <Route path='/bindNFrenid' component={BindNFrenid} />
    <Route path='/binding-success' component={Success} />
    <Route path='/bind-user' component={BindUser} />
    <Route path='/protocol' component={Protocol} />
    <Route path='/protocol-privacy' component={Privacy} />
    <Route path='/aboutAndall' component={aboutAndall} />
    <Route path='/protocol-buy' component={Buy} />
    <Route path='/select-user' component={SelectUser} />
    <Route path='/authorization' component={Authorization} />
    <Route path='/common-problem' component={CommonProblem} />
    <Route path='/select-user-kit' component={SelectUserKit} />
    <Route path='/bind-user-kit' component={BindUserKit} />
    <Route path='/protocol-kit' component={ProtocolKit} />
    <Route path='/land-page' component={LandPage} />
  </React.Fragment>
)
