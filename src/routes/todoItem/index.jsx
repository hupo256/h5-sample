import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/index'

const Todo = Loadable(() => import('./home.tsx'))

export default (
  <>
    <Route exact path="/todo" component={Todo} />
  </>
)
