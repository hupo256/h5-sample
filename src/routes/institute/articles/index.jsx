import React, { useState, useEffect, useRef } from 'react';
import Page from '@src/components/page/index'
import fun from '@src/common/utils/index'
import images from '../componets/images'
import memberApi from '@src/common/api/memberApi'
import { subjectPageView, subjectPageGoto } from '../componets/BuriedPoint'
import { gotoQuestions } from '../componets/tools'
import styles from './articles'
const { getSetssion, getParams, setSetssion } = fun
let artlist = []
let total = 0

export default function Counter({ history }) {
  const [item, setitem] = useState({})
  const [loading, setloading] = useState(false)
  let [pNum, setpNum] = useState(1)
  const { imageUrl, title, partake, fallinFlag, nameResearch } = item
  const paramItem = getSetssion('paramItem')
  const userbox = useRef()

  useEffect(() => {
    touchPageData() 
    userbox.current.addEventListener("scroll", myWheel, false)

    andall.on('onVisibleChanged', (res) => {
      res.visibility && window.location.reload()
    })
  }, [])

  function touchPageData(){
    artlist = []
    getList()

    const pointCofig = {
      view_type: getParams().viewType,
      question_name: touchQname(paramItem.q_name)
    }
    subjectPageView(pointCofig)
  }

  function myWheel(e) {
    if (loading) return
    if (total <= artlist.length) return
    const { clientHeight, scrollTop, scrollHeight } = e.target
    if (clientHeight + scrollTop > scrollHeight - 2) {
      setloading(true)
      setpNum(pNum++)
      getList()
    }
  }

  function getList() {
    // alert(pNum)
    const infoPara = { 
      articleIds: paramItem.article,
      userId: paramItem.userId,
      code: paramItem.qnaireCode,   
      categoryId: 3110085415829504,
      pageNumber: pNum,
      pageSize: 10
    }
    memberApi.getArticleInfo(infoPara).then(res => {
      const {code, data} = res
      if(code) return
      const {articleInfo, researchInfo} = data
      artlist = artlist.concat(articleInfo.data)
      total = articleInfo.total
      setitem(researchInfo)
      setloading(false)
    })
  }

  function gotoRol(had, item, num) {
    touchPointInBtn(num)
    // if (had) return
    const { qnaireCode, recommend } = item
    setSetssion('recommend', recommend) // 存起来给问卷成功页用
    if (paramItem.skipFlag) {
      gotoQuestions(-1, qnaireCode, had, 0)
    } else {
      setSetssion('currItem', item) // 存起来后面用
      history.push(`/institute/touchrole?viewType=subject_page`)
    }
  }
 
  function touchPointInBtn(num) {
    const Btn_name = 'take_part_in'
    const question_name = touchQname(num)
    subjectPageGoto({ Btn_name, question_name, article_id:'' })
  }

  function touchQname(n) {
    let tex = ''
    switch (n) {
      case 0:
        tex = 'autism'
        break
      case 1:
        tex = 'iss'
        break
      case 2:
        tex = 'allergy'
        break
      case 3:
        tex = 'asthma'
        break
    }
    return tex
  }

  function openArticle(id){
    subjectPageGoto({ Btn_name:'', question_name:'', article_id:id })

    const url = `${origin}/mkt/news/article-detail-index?type=1&id=${id}`
    setTimeout(() => {
      window.location.href = url
    }, 200)
  }

  return (
    <Page title={nameResearch || ''}>
      <div className={styles.articleout} ref={userbox}>
      {imageUrl && <div className={styles.articlebox}>
        {/* <h3>参与问卷</h3> */}
        <div className={styles.prodcon}>
          <div className={styles.licon}>
            <img src={imageUrl} />
            <div className={styles.titbox}>
              <h3>{title}</h3>
              <p><u>{partake}</u><span>人参与</span></p>
            </div>
          </div>
          <button onClick={() => gotoRol(!fallinFlag, item, paramItem.q_name)}>
            {'参与'}
          </button>
        </div>

        <h3>精选文章</h3>
        {artlist.length > 0 && <ul>
          {artlist.map((item, index) => {
            const {title, displayTags, coverImgUrl, expertInfo, id} = item
            const tags = displayTags.split(',').slice(0, 2)
            if(!title) return
            return <li key={index} onClick={() => openArticle(id)}>
              <div className={styles.titbox}>
                <h3>{title}</h3>
                {expertInfo ? <p className={styles.expertbox}>
                  <img src={expertInfo.headImg || ''} alt=""/>
                  <span>{expertInfo.name || ''}</span>
                  <span>{expertInfo.desc || ''}</span>
                </p> :
                <p>
                  {tags.length > 0 && tags.map((tag, ind) => 
                    <span key={ind}>{tag}</span>
                  )}
                </p>
                }
              </div>
              <img src={coverImgUrl || images.allergy} alt=""/>
            </li>
          })}
        </ul>}

        <p className={styles.more}>——————— 我是有底线的 ———————</p>
      </div>}
      </div>
    </Page>
  )
}