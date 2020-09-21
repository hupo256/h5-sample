import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const ChooseOne = Loadable(() => import('./chooseOne'))
const Family = Loadable(() => import('./family'))
const BindUserKit = Loadable(() => import('./bindUserKit'))
const Information = Loadable(() => import('./information'))
const MyInfo = Loadable(() => import('./myInfo'))
const MyInfoOther = Loadable(() => import('./myInfo/other'))
const Authorization = Loadable(() => import('./authorization'))
const Invite = Loadable(() => import('./invite'))
const CodeInvite = Loadable(() => import('./invite/codeInvite'))
const Verification = Loadable(() => import('./invite/verification'))
const Info = Loadable(() => import('./invite/info'))
const Other = Loadable(() => import('./invite/other'))
const Success = Loadable(() => import('./invite/success'))
const Disease = Loadable(() => import('./disease'))
const DiseaseRecords = Loadable(() => import('./diseaseRecords'))
const Question = Loadable(() => import('./question'))

export default (
  <React.Fragment>
    <Route exact path='/healthRecords/chooseOne' component={ChooseOne} />
    <Route exact path='/healthRecords/family' component={Family} />
    <Route exact path='/healthRecords/bindUserKit' component={BindUserKit} />
    <Route exact path='/healthRecords/information' component={Information} />
    <Route exact path='/healthRecords/myInfo' component={MyInfo} />
    <Route exact path='/healthRecords/myInfo/other' component={MyInfoOther} />
    <Route exact path='/healthRecords/authorization' component={Authorization} />
    <Route exact path='/healthRecords/invite' component={Invite} />
    <Route exact path='/healthRecords/invite/codeInvite' component={CodeInvite} />
    <Route exact path='/healthRecords/invite/verification' component={Verification} />
    <Route exact path='/healthRecords/invite/info' component={Info} />
    <Route exact path='/healthRecords/invite/other' component={Other} />
    <Route exact path='/healthRecords/invite/success' component={Success} />
    <Route exact path='/healthRecords/disease' component={Disease} />
    <Route exact path='/healthRecords/diseaseRecords' component={DiseaseRecords} />
    <Route exact path='/healthRecords/question' component={Question} />
  </React.Fragment>
)
