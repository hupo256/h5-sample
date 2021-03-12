import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const yunchanLego = Loadable(() => import('./home'))
const yunchanEdit = Loadable(() => import('./yunchan-edit'))
const yunchanSucceed = Loadable(() => import('./yunchan-succeed'))
const yunchanTimeOut = Loadable(() => import('./yunchan-timeout'))

export default (
  <React.Fragment>
    <Route exact path='/lego' component={yunchanLego} />
    <Route path='/lego/yunchan-edit' component={yunchanEdit} />
    <Route path='/lego/yunchan-succeed' component={yunchanSucceed} />
    <Route path='/lego/yunchan-timeout' component={yunchanTimeOut} />
  </React.Fragment>
)
