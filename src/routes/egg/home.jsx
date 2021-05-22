import React from 'react'
import Page from '@src/components/page/index'
import Loadable from '@src/components/loading/index'

const ShowTex = Loadable(() => import('./showTex'))
const RemoteSlides = Loadable(() => import('app1/Slides'))
const SayHi = Loadable(() => import('fdTest/sayHi'))

export default function App() {
  return (
    <Page title={`webpack5`}>
      <h2>App 3, WWEE </h2>
      <SayHi />
      <ShowTex />
      <RemoteSlides />
    </Page>
  )
}
