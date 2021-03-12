import React from 'react'
import Routes from './index'
import '../assets/css/app'

/**
 * 异常捕获
 */
const handleListenerError = erro => {
  const { message, filename, lineno, colno, type } = erro
  window._paq.push([
    'trackEvent',
    'front-error',
    'error',
    `message=${message},filename=${filename},lineno=${lineno},colno=${colno},type=${type}`
  ])
}
window.addEventListener('error', handleListenerError, true)

export default class App extends React.Component {
  render () {
    return <Routes />
  }
}
