import React, { useState, useEffect } from 'react';
import Page from '@src/components/page/index'
import ua from '@src/common/utils/ua'
import fun from '@src/common/utils/index'
import { InstituteTon } from '@src/components/contentLoader';
import images from './componets/images'
import memberApi from '@src/common/api/memberApi'
import { institutePageView, institutePageGoto } from './componets/BuriedPoint'
import { gotoQuestions } from './componets/tools'
import styles from './institute'
const { setSetssion, getParams } = fun

export default function Inst({ history }) {
  const [loading, setLoading] = useState(true)
  const [explains, setexplains] = useState({})
  const [tipsInfor, settipsInfor] = useState({})
  const [skipFlag, setskipFlag] = useState(false)
  const [userId, setuserId] = useState('')
  const [researchQnaireResq, setresearchQnaireResq] = useState([])

  function gotoRol(had, item, num) {
    touchPointInBtn(num)
    // if (had) return
    const { qnaireCode, recommend } = item
    setSetssion('recommend', recommend) //存起来给问卷成功页用
    if (skipFlag) {
      gotoQuestions(-1, qnaireCode, had, 0)
    } else {
      setSetssion('currItem', item) //存起来后面用
      history.push(`/institute/touchrole?viewType=institute_page`)
    }
  }

  function touchPointInBtn(num, bname) {
    const Btn_name = bname ? bname : 'take_part_in'
    let question_name = ''
    switch (num) {
      case 0:
        question_name = 'autism'
        break
      case 1:
        question_name = 'iss'
        break
      case 2:
        question_name = 'allergy'
        break
      case 3:
        question_name = 'asthma'
        break
    }
    institutePageGoto({ Btn_name, question_name })
  }

  useEffect(() => {
    touchPageData()

    andall.on('onVisibleChanged', (res) => {
      res.visibility && touchPageData()
    })
  }, [])

  function touchPageData() {
    const infoPara = { noloading: 1 }
    ua.isAndall() && Object.assign(infoPara, { clientType: 'app' })
    memberApi.myInfo(infoPara).then(res => {
      const { code, data } = res
      if (code) return
      setuserId(data.userId)
      memberApi.getResearchPageInfo({ userId: data.userId, noloading: 1 }).then(re => {
        const { code, data } = re
        if (code) return
        const { explains, tips, skipFlag, researchQnaireResq = [] } = data
        setexplains(explains)
        settipsInfor(tips)
        setskipFlag(skipFlag)
        setresearchQnaireResq(researchQnaireResq)
        setLoading(false)
      })
    })

    institutePageView({ view_type: getParams().viewType })  // 埋点
  }

  function gotoexperts() {
    touchPointInBtn(-1, 'cooperate_experts')
    history.push(`/institute/experts`)
  }

  function gotoArtList(item, num) {
    touchPointInBtn(num, 'know_more')
    item['q_name'] = num
    item['userId'] = userId
    item['skipFlag'] = skipFlag
    setSetssion('paramItem', item) //存起来后面用
    history.push(`/institute/prod-articles?viewType=institute_page`)
  }

  function gotoexperts() {
    touchPointInBtn(-1, 'cooperate_experts')
    history.push(`/institute/experts`)
  }

  return (
    <Page title='研究院'>
      {loading ? <InstituteTon /> :
        <div className={styles.instituteBox}>
          {explains && <div className={styles.instit}>
            <h2>{explains.question}</h2>
            <div className={styles.toptips}>
              <p>{explains.answer}</p>
              <img src={images.titlebg} alt="" />
            </div>
          </div>}

          <div className={styles.expertsbox} onClick={gotoexperts}>
            <img src={images.banners} alt="" />
          </div>

          {tipsInfor && <p className={styles.listit}>
            <img src={images.titips} alt="" />
            参与以下任意研究可获得<span>{tipsInfor.docs || 50}</span>积分
          </p>}

          {researchQnaireResq && researchQnaireResq.length > 0 &&
            <ul className={styles.papersList}>
              {researchQnaireResq.map((item, index) => {
                const { imageUrl, title, partake, fallinFlag, descResearch } = item
                return <li key={index}>
                  <div className={styles.prodtit}>
                    <span>{`${descResearch || 'descResearch'}`}</span>
                    <span onClick={() => gotoArtList(item, index)}>了解更多</span>
                  </div>
                  <div className={styles.prodcon}>
                    <div className={styles.licon}>
                      <img src={imageUrl || images.height} />
                      <div className={styles.titbox}>
                        <h3>{title}</h3>
                        <p><u>{partake}</u><span>人参与</span></p>
                      </div>
                    </div>
                    <button onClick={() => gotoRol(!fallinFlag, item, index)}>
                      {'参与'}
                    </button>
                    {/* <button disabled={!fallinFlag} onClick={() => gotoRol(!fallinFlag, item, index)}>
                      {!fallinFlag ? '已参与' : '参与'}
                    </button> */}
                  </div>
                </li>
              })}
            </ul>
          }

          <p className={styles.more}>——————— 更多研究敬请期待 ———————</p>
        </div>
      }
    </Page>
  )
}