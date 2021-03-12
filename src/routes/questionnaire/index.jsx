import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'

const QuestionStart = Loadable(() => import('./start'))
const UserInfor = Loadable(() => import('./start/userInfor/index'))
const BaseQuestion = Loadable(() => import('./question/base'))
const QuestionEnd1 = Loadable(() => import('./end-new'))

export default (
  <React.Fragment>
    <Route exact path='/questionnaire' component={QuestionStart} />
    <Route path='/questionnaire/user-infor' component={UserInfor} />
    <Route path='/questionnaire/basequestion-new' component={BaseQuestion} />
    <Route path='/questionnaire/qsend' component={QuestionEnd1} />
  </React.Fragment>
)