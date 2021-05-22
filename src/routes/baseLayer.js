import React, { useState, useEffect } from 'react'
import fun from '@src/common/utils'

const { urlParamHash, setStorage } = fun

export default function BaseLayer(props) {
  const [bool, setbool] = useState(false)
  useEffect(() => {
    init()
    setbool(true)
  }, [])

  // 获取初始化数据
  function init() {
    const { appId = '' } = urlParamHash()
    if (appId) {
      setStorage('appId', appId)
      setbool(true)
    }
  }

  return <React.Fragment>{bool ? props.children : ''}</React.Fragment>
}
