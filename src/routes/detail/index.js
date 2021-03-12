import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import Loading from '@src/components/loading'
import { KeepAlive } from 'react-keep-alive'
const PersonalHomepage = Loadable({
  loader: () => import('./personal-homepage'),
  loading: Loading
})
const ArticleDetail = Loadable({
  loader: () => import('./article-detail'),
  loading: Loading
})
const ExpertHomepage = Loadable({
  loader: () => import('./expert-homepage'),
  loading: Loading
})

export default (
  <React.Fragment>
    {/* <Route path='/personal-homepage' component={PersonalHomepage} /> */}

    <Route path='/news/personal-homepage' render={props => (
      <KeepAlive key='personalHomepage'>
        <div><PersonalHomepage {...props} /></div>
      </KeepAlive>
    )} />

    <Route path='/news/article-detail-index' component={ArticleDetail} />
    <Route path='/news/expert-homepage' component={ExpertHomepage} />
  </React.Fragment>
)
