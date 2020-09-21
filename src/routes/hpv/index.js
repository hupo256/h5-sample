import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const Binding = Loadable(() => import('./binding/binding'))
const BindOnly = Loadable(() => import('./binding/bindOnly'))
const BindNFrenid = Loadable(() => import('./binding/bindNFrenid'))
const Success = Loadable(() => import('./success'))
const Buy = Loadable(() => import('./protocol-kit/buy'))
const Privacy = Loadable(() => import('./protocol-kit/privacy'))
const aboutAndall = Loadable(() => import('./protocol-kit/aboutAndall'))
const Authorization = Loadable(() => import('./authorization'))
const Guide = Loadable(() => import('./guide'))
const CommonProblem = Loadable(() => import('./commonProblem'))
const SelectUserKit = Loadable(() => import('./select-user-kit'))
const BindUserKit = Loadable(() => import('./bind-user-kit'))
const ProtocolKit = Loadable(() => import('./protocol-kit'))
const Question = Loadable(() => import('./question'))
const BindingVideos = Loadable(() => import('./success/videos'))

export default (
  <React.Fragment>
    <Route exact path='/binding' component={Binding} />
    <Route exact path='/binding/guide' component={Guide} />
    <Route exact path='/binding/bindOnly' component={BindOnly} />
    <Route exact path='/binding/bindNFrenid' component={BindNFrenid} />
    <Route exact path='/binding/binding-success' component={Success} />
    <Route exact path='/binding/bind-user' component={BindUserKit} />
    <Route exact path='/binding/protocol' component={ProtocolKit} />
    <Route exact path='/binding/protocol-privacy' component={Privacy} />
    <Route exact path='/binding/aboutAndall' component={aboutAndall} />
    <Route exact path='/binding/protocol-buy' component={Buy} />
    <Route exact path='/binding/select-user' component={SelectUserKit} />
    <Route exact path='/binding/authorization' component={Authorization} />
    <Route exact path='/binding/common-problem' component={CommonProblem} />
    <Route exact path='/binding/select-user-kit' component={SelectUserKit} />
    <Route exact path='/binding/bind-user-kit' component={BindUserKit} />
    <Route exact path='/binding/protocol-kit' component={ProtocolKit} />
    <Route exact path='/binding/question' component={Question} />
    <Route exact path='/binding/binding-videos' component={BindingVideos} />
  </React.Fragment>
)
