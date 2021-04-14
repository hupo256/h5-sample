import React from 'react'
import Page from '@src/components/page/index'
// import Loadable from '@src/components/loading/index'

const ShowTex = Loadable(() => import('./showTex'))

// const RemoteSlides = Loadable(() => import('app1/Slides'))
// const SayHi = Loadable(() => import('fdTest/sayHi'))
// const SayHi = React.lazy(() => import('fdTest/sayHi'))

export default function App() {
  return (
    <Page title={`webpack5`}>
      <h2 style={{ textAlign: 'center' }}>App 3, Slides, Remote NewsList</h2>
      {/* <RemoteSlides /> */}
      <ShowTex />
      {/* <SayHi /> */}
    </Page>
  )
}

// export default App
