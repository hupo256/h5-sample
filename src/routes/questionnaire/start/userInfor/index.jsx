import React, { useState, useEffect, useRef } from 'react'
import fun from '@src/common/utils/index'
import ua from '@src/common/utils/ua'
import questionnaireApi from '@src/common/api/questionnaireApi'
import Page from '@src/components/page'
import toright from '@static/bindSuccess/toright.png'
import DiseasePop from './diseasePop'
import formDom from './json/formDom'
import fData from './json/formData'
import styles from './userInfor'

import {
  qnaireBasicInfoView,
  qnaireBasicInfoStartGoto
} from '../../BuriedPoint'


const { getParams, fixScroll } = fun
const { isIos } = ua

export default function UserInfor({history}) {
  const [pickerPop, setpickerPop] = useState('')
  const [relationId, setrelationId] = useState('1')
  const [formList, setformList] = useState([])
  const [formData, setformData] = useState({})
  const [inputFocus, setinputFocus] = useState('')
  const [sickList, setSickList] = useState([])
  const [list,setList]= useState([])
  const dates = getDates()

  useEffect(() => {
    getQestions()
  }, [])

  function getQestions() {
    // const data = fData.result
    // setformData(data)
    // setrelationId(data.relationId)
    // setformList(getFormList(data))
    // return

    // const paramConfig= {
    //   linkManId: getParams().linkManId || 2822639035662336,
    // }
    // questionnaireApi.getLinkManInfo(paramConfig).then(res => {
    //   const { code, data } = res
    //   if (code) return
    //   setformData(data)
    //   setrelationId(data.relationId)
    //   setformList(getFormList(data))
    // })
    
    const paramConfig= {
        id: getParams().linkManId || 2822639035662336,
    }

    questionnaireApi.selectById(paramConfig).then(res=>{
      const { code, data } = res
      if (code) return
      setformData(data)
      setrelationId(data.relationId)
      setformList(getFormList(data))

      qnaireBasicInfoView({ 
        qnaire_code:getParams().qnaireCode,
        sample_linkmanid:getParams().linkManId,
      })
    })
   

    // getSickList()
  }

  function getFormList(man) {
    return formDom.map(item => {
      const { name, itemKey } = item
      let val = man[itemKey]
      let edit = 0
      if (itemKey === 'relationId') val = val === '1' ? '成人' : '宝宝'
      if (itemKey === 'sex') val = val === 'male' ? '男' : '女'
      if (itemKey === 'sickNames') edit= !!val ? 0:1
      if (itemKey === 'weight'||itemKey === 'height') edit=1 
      return { val, name, edit, itemKey }
    })
  }

  function gotoQestions() {
    
    const { id, userId } = formData
    let paramsObj = { id, userId }
    formList.forEach(item => {
      const { itemKey, val, edit } = item
      
      if(edit) {
        (paramsObj[itemKey] = val)
        if(sickList&&sickList.length>0){
          paramsObj['personalSickList'] = sickList?sickList:[]
        }    
      } 
    })
    delete paramsObj.sickNames

  

    questionnaireApi.updateLinkManInfo(paramsObj).then(res => {
      const { code, data } = res
      if (code) return
      console.log(data)
      qnaireBasicInfoStartGoto({ 
        qnaire_code:getParams().qnaireCode,
        sample_linkmanid:getParams().linkManId
      })
      history.push(`/questionnaire/basequestion-new${location.search}`)
    })
  }

  function isLeapYear(first, end) {
    let length = 0
    for (let i = first; i < end; i++) {
      if ((i % 4 == 0 && i % 100 != 0) || (i % 400 == 0)) length++
    }
    return length
  }

  function getDates() {
    const date = new Date()
    const leapYear1 = isLeapYear(date.getFullYear() - 18, date.getFullYear())// 闰年个数 -18-now
    const leapYear2 = isLeapYear(date.getFullYear() - 150, date.getFullYear())// 闰年个数 -150-now
    const during = 18 * 365 * 24 * 60 * 60 * 1000 + (leapYear1 * 24 * 60 * 60 * 1000)
    const duringEnd = 18 * 365 * 24 * 60 * 60 * 1000 + (leapYear1 * 24 * 60 * 60 * 1000)
    const duringStart = 150 * 365 * 24 * 60 * 60 * 1000 + (leapYear2 * 24 * 60 * 60 * 1000)
    const currentDate = new Date(date.getTime() - during)// 当前日期-18周岁
    const preDate = new Date(date.getTime() - duringStart)// 当前日期-150周岁
    const nextDate = new Date(date.getTime() - duringEnd)// 当前日期-18周岁
    return { currentDate, preDate, nextDate }
  }

  function bluerHandle(){
   
    setinputFocus(false)
    isIos() && window.scrollBy(0, fixScroll().top)
  }

  function inputChange(dom, key) {
    let val = dom.currentTarget.value
    val.replace(/[^\d.]/g,""); //先把非数字的都替换掉，除了数字和. 
    val.replace(/^\./g,""); //必须保证第一个为数字而不是. 
    val.replace(/\.{2,}/g,"."); //保证只有出现一个.而没有多个. 
    val = Math.round(+val*Math.pow(10, 2))/Math.pow(10, 2)  //最多两位小数
    if(val > 240) val = 240
    const temArr = formList.map(item => {
      const { itemKey } = item
      if (itemKey === key) item.val = `${val}`
      return item
    })
    setformList(temArr)
  }

  function touchVal(val, key){
    if(key === 'sickNames') return val
    return val ? `${val}`.replace(/[^\d.]/g,'') : ''
  }

  function onFocus(key,edit)  {
    if(key === 'sickNames') {
      document.activeElement.blur();
      setpickerPop('disease')
    }
    else{
      setinputFocus(key)
    }
    
  }

  function hidePicker(){
    setpickerPop('')
  }

  function handleSaveBtn(sickList,sickName){
    setSickList(sickList)
    setList(sickList)
    
    formList.map(item => {
      const{itemKey}=item     
      if (itemKey === 'sickNames') {
        item.val = sickName
      }    
    })
  }

  return (
    <Page title='基础信息'>
      <div className={styles.collectbox}>
        <h3>确认基础测评信息</h3>
        <p className={styles.titips}>
          基础信息直接影响最终的测评结果，如有缺失请补全，如有不符请修改。
        </p>

        <ul className={styles.formBox}>
          {formList.length > 0 && formList.map((item, index) => {
            const { name, val, edit, itemKey } = item
            return <li key={index}>
              <b>{name}</b>
              {!edit ?
                <span className={(itemKey==='sickNames')?`${styles.formVal}`:''}>{val}</span> :
                <span className={`${styles[itemKey]} ${(val || inputFocus===itemKey) ? '' : styles.noval}`}>
                  <input
                    placeholder={`${inputFocus===itemKey ? '' : '请先填写'}`}
                    type='text'
                    value={touchVal(val, itemKey)}
                    onFocus={() => onFocus(itemKey,edit)}
                    onBlur={() => bluerHandle()}
                    onChange={e => { inputChange(e, itemKey)}}
                    // className={(itemKey==='sickNames'&& val!=="" )?`${styles.disabled}`:''}
                  /> 
                  <img src={toright} />
                </span>
              }
            </li>
          })}
        </ul>

        <button 
          onClick={gotoQestions}
          disabled={formList.some(item => !item.val)}
        >
          确认无误，开始答题
        </button>

        {pickerPop === 'disease' &&
          <DiseasePop list={list} data={formData} hidePicker={hidePicker} handleSaveBtn={handleSaveBtn}/>
        }
      </div>
    </Page >
  )
}