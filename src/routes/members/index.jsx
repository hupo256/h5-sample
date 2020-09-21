import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const Members = Loadable(() => import('./home'))
const Copyimg = Loadable(() => import('./copyimg'))
const Pay = Loadable(() => import('./pay'))
const Renewal = Loadable(() => import('./renewal'))
const Success = Loadable(() => import('./success'))
const Service = Loadable(() => import('./componets/protocol/service'))
const Buy = Loadable(() => import('./componets/protocol/buy'))
const RecordList= Loadable(() => import('./recordList'))
const Header= Loadable(() => import('./header'))

export default (
  <React.Fragment>
    <Route exact path='/members' component={Members} />
    <Route path='/members/copyimg' component={Copyimg} />
    <Route path='/members/members-pay' component={Pay} />
    <Route path='/members/members-renewal' component={Renewal} />
    <Route path='/members/members-success' component={Success} />
    <Route path='/members/agreement-service' component={Service} />
    <Route path='/members/agreement-buy' component={Buy} />
    <Route path='/members/record-list' component={RecordList} />
    <Route path='/members/header' component={Header} />
  </React.Fragment>
)
