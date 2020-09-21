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
const Question = Loadable({
  loader: () => import('./question'),
  loading: Loading
})
export default (
  <React.Fragment>
    <Route exact path='/binding/guide' component={Guide} />
    <Route exact path='/binding' component={Binding} />
    <Route exact path='/binding/bindOnly' component={BindOnly} />
    <Route exact path='/binding/bindNFrenid' component={BindNFrenid} />
    <Route exact path='/binding/binding-success' component={Success} />
    <Route exact path='/binding/bind-user' component={BindUser} />
    <Route exact path='/binding/protocol' component={Protocol} />
    <Route exact path='/binding/protocol-privacy' component={Privacy} />
    <Route exact path='/binding/aboutAndall' component={aboutAndall} />
    <Route exact path='/binding/protocol-buy' component={Buy} />
    <Route exact path='/binding/select-user' component={SelectUser} />
    <Route exact path='/binding/authorization' component={Authorization} />
    <Route exact path='/binding/common-problem' component={CommonProblem} />
    <Route exact path='/binding/select-user-kit' component={SelectUserKit} />
    <Route exact path='/binding/bind-user-kit' component={BindUserKit} />
    <Route exact path='/binding/protocol-kit' component={ProtocolKit} />
    <Route exact path='/binding/question' component={Question} />
  </React.Fragment>
)
