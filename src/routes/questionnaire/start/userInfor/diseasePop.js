import React, { useState, useEffect } from 'react'
import radio1 from '@static/healthRecords/radio1.png'
import radio2 from '@static/healthRecords/radio2.png'
import questionnaireApi from '@src/common/api/questionnaireApi'
import styles from './disease'
import { fun } from '@src/common/app'
const { getParams } = fun

export default function diseasePop({hidePicker, data, handleSaveBtn ,list}) {
  const optionList = [{
    id: 1, name: '是'
  }, {
    id: 2, name: '否'
  }, {
    id: 0, name: '不清楚'
  }]
  const [sickList, setsickList] = useState([])

  useEffect(() => {
    const{relationId,sex}=data;
    console.log(list)
    if(!!list&&list.length>0){
      setsickList(list)
    }
    else{
      const paraObj = {
        linkManId: getParams().linkManId,
        relationId,
        sex
      }
      getSickList(paraObj)
    }
    
  }, [])

  function getSickList(config) {
    const { relationId, sex, linkManId } = config
    questionnaireApi.getSickList({ relationId, sex, linkManId }).then(res => {
      const { code, data } = res
      if (code) return
      setsickList(data.sickList)
    })
  }

  function chooseThis(index, i) {
    sickList[index].selectFlag = i
    setsickList([].concat(sickList))
  }

  function isChooseOver(){
    const len = sickList.filter(item => item.selectFlag > -1).length
    return !(len === sickList.length)
  }

  function collectInfor() {
    let sickName = ''
    const disease = sickList.filter(item => item.selectFlag === 1)
    if (disease.length) {
      disease.map(item => {
        sickName += item.sickName + '、'
      })
      sickName = sickName.substr(0, sickName.length - 1)
    } else {
      sickName = '无'
    }
    handleSaveBtn(sickList,sickName)
    hidePicker()
  }

  return (
    <div className={styles.diseasePicker}>
      <div className={styles.question}>
        <p className={styles.top}>
          <span onClick={() => hidePicker()}>取消</span>
          <span>请问你是否有以下特殊情况？</span>
        </p>
        <div className={styles.subject}>
          {sickList.map((item, index) => {
            return <div key={index}>
              <div className={styles.title}>
                <i>*</i>
                <span>{index < 9 ? '0' + (index + 1) : index + 1}.</span>
                <span>{item.sickName}</span>
              </div>
              <div className={styles.options}>
                {optionList.map((v, i) => (
                  <div key={i} onClick={() => chooseThis(index, v.id)}>
                    <img src={item.selectFlag === v.id ? radio1 : radio2} />
                    <span>{v.name}</span>
                  </div>
                ))}
              </div>
            </div>
          })}
        </div>
        <div className={styles.saveBtn}>
          <button disabled={isChooseOver()} onClick={() => collectInfor()}>确认</button>
        </div>
      </div>
    </div>
  )
}
