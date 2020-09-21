import React, { useState, useEffect, useRef } from 'react'
import andall from '@src/common/utils/andall-sdk'
import Page from '@src/components/page/index'
import fun from '@src/common/utils/index'
import ua from '@src/common/utils/ua'
import NavigationBar from './componets/navigationBar/index'



const { isTheAppVersion, getParams } = fun
const { isIos, isAndall } = ua

export default function Members({ history }) {
  const [qrcode, setqrcode] = useState(false)
  const base64Img = useRef()


  useEffect(() => {
    setInitial()
  }, [])

  function goBack() {
    if(isAndall()){
      andall.invoke('back')
    }
    else{
      window.history.go(-1)
    }
    
    
  }
  function setInitial() {
    
    
  }
  
  return (
    <Page title='安我会员'>
      <NavigationBar title="安我会员" type="black" back={()=>{goBack()}}></NavigationBar>
      <div>1111</div>
    </Page>
  )
}