import React from 'react'
import Page from '@src/components/page/index'
// import Loadable from '@src/components/loading/index'

// const ShowTex = Loadable(() => import('./showTex'))
// const SayHi = Loadable(() => import('fdTest/sayHi'))
import BreadBar from '@src/components/breadBar'
import ShowTex from './showTex'
import SayHi from 'fdTest/sayHi'

export default function App() {
  return (
    <Page title={`webpack5`}>
      <h2>App,QQWW 223344</h2>
      <SayHi />
      <BreadBar />
      <ShowTex />
    </Page>
  )
}
