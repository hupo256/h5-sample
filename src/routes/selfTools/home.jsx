import React, { useState, useEffect } from 'react'
import activeApi from '@src/common/api/activeApi'
import Page from '@src/components/page'
import {toolListView, toolListGoto} from './BuriedPoint'
import styles from './tools'

export default function UserInfor({history}) {
  const [toolList, settoolList] = useState([])
  useEffect(() => {
    activeApi.indexToolList().then(res => {
      console.log(res)
      const {code, data} = res
      if(code) return
      settoolList(data)
    })
    toolListView()
  }, [])

  function gotoTool(tit, url){
    toolListGoto({tool_name: tit, url})
    window.location.href = url
  }

  return (
    <Page title='自测工具'>
      <div className={styles.selfbox}>
        {toolList.length > 0 && toolList.map((subTool, index) => {
            const {toolName, minitoolInfoRespList} = subTool
            return <div key={index}>
              <h3>{toolName}</h3>
              <ul>
                {minitoolInfoRespList.length>0 && minitoolInfoRespList.map((item,ind) => {
                  const {toolName, iconPic, toolUrl} = item
                  return <li key={ind} onClick={() => gotoTool(toolName, toolUrl)}>
                    <img src={iconPic} />
                    <span>{toolName}</span>
                  </li>
                })}
              </ul>
            </div>
          })
        }
      </div>
    </Page >
  )
}