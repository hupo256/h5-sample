import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'
import { KeepAlive } from 'react-keep-alive'

const IntegrationHome = Loadable(() => import('./integrationHome'))
const Finished = Loadable(() => import('./integrationHome/finished'))
const Movement = Loadable(() => import('./movement'))
const Rules = Loadable(() => import('./rules'))
const Details = Loadable(() => import('./details'))
const Lottery = Loadable(() => import('./lottery'))
const Gifts = Loadable(() => import('./gifts'))
const Receive = Loadable(() => import('./receive'))
const ReceiveSuccess = Loadable(() => import('./receiveSuccess'))
const BindUserKit = Loadable(() => import('./bindUserKit'))
const Exchange = Loadable(() => import('./exchange'))
const ExchangeRecords = Loadable(() => import('./exchange/records'))
const ExchangeDetail = Loadable(() => import('./exchange/details'))
const ExchangeConfirm = Loadable(() => import('./exchange/confirm'))
const ExchangeSuccess = Loadable(() => import('./exchange/success'))
const Orders = Loadable(() => import('./orders'))
const Recharge = Loadable(() => import('./recharge'))
const RechargeSuccess = Loadable(() => import('./recharge/success'))
const RechargeStart = Loadable(() => import('./recharge/start'))
const RechargeDetails = Loadable(() => import('./recharge/details'))
const Propaganda = Loadable(() => import('./propaganda'))

export default (
  <React.Fragment>
    {/* <Route exact path='/integration/home' component={IntegrationHome} /> */}
    <Route path='/integration/home' render={props => (
      <KeepAlive key='integrationHome'>
        <div><IntegrationHome {...props} /></div>
      </KeepAlive>
    )} />
    <Route exact path='/integration/finished' component={Finished} />
    <Route exact path='/integration/movement' component={Movement} />
    <Route exact path='/integration/rules' component={Rules} />
    <Route exact path='/integration/details' component={Details} />
    <Route exact path='/integration/lottery' component={Lottery} />
    <Route exact path='/integration/gifts' component={Gifts} />
    <Route exact path='/integration/receive' component={Receive} />
    <Route exact path='/integration/receiveSuccess' component={ReceiveSuccess} />
    <Route exact path='/integration/bindUserKit' component={BindUserKit} />
    <Route exact path='/integration/exchange' component={Exchange} />
    <Route exact path='/integration/exchange/records' component={ExchangeRecords} />
    <Route exact path='/integration/exchange/details' component={ExchangeDetail} />
    <Route exact path='/integration/exchange/confirm' component={ExchangeConfirm} />
    <Route exact path='/integration/exchange/success' component={ExchangeSuccess} />
    <Route exact path='/integration/orders' component={Orders} />
    <Route exact path='/integration/recharge' component={Recharge} />
    <Route exact path='/integration/recharge/success' component={RechargeSuccess} />
    <Route exact path='/integration/recharge/start' component={RechargeStart} />
    <Route exact path='/integration/recharge/details' component={RechargeDetails} />
    <Route exact path='/integration/propaganda' component={Propaganda} />

  </React.Fragment>

)
