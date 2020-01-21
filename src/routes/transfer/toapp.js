import React from 'react'
import { Page } from '@src/components'
import andall from '@src/common/utils/andall-sdk'
import {fun, ua } from '@src/common/app'

const { getParams, parseQuery } = fun

class Toapp extends React.Component {
  state = {
    isAndall: ua.isAndall(),
  }

  componentDidMount () {
    this.getUrl()
  }

  getUrl = () => {
    const {isAndall} = this.state
    const {protocol} = window.location
    const urlPara = getParams()
    const { productType, id, seriesIds, vipId, toUrl } = urlPara
    const paras = { productType }
    let nextUrl = ''
    if(+productType === 1 ) {
      Object.assign(paras, {productId: vipId})
    }else if(+productType === 2 ){
      Object.assign(paras, {productId: id})
    }else if(+productType === 3 ) {
      Object.assign(paras, {productId: seriesIds})
    }

    urlPara.toUrl = 0;
    nextUrl = `${protocol}//${toUrl}?${parseQuery(urlPara)}`
    console.log(nextUrl)

    // isAndall && andall.invoke('goProductDetail', paras)
    // isAndall || (window.location.href = nextUrl)

    if(isAndall){
      andall.invoke('goProductDetail', paras)
      setTimeout(() => {
        this.props.history.go(-1);
      }, 100)
    }

    if(!isAndall){
      window.history.replaceState({page: 'toapp'}, '', nextUrl);
      window.location.reload();
    }
  }

  render () {
    return <Page title='正在为您跳转...'></Page>
  }
}

export default Toapp
