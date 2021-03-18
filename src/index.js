import React from 'react'
import ReactDOM from 'react-dom'
import App from './routes/app'
import { Provider as MobxProvider } from 'mobx-react'
import { Provider as KeepAliveProvider } from 'react-keep-alive'
import mobxStore from './stores'

ReactDOM.render(
  <MobxProvider {...mobxStore}>
    <KeepAliveProvider include={['personalHomepage', 'yinyangs', 'myAccount']}>
      <App />
    </KeepAliveProvider>
  </MobxProvider>,
  document.getElementById('root'),
)
