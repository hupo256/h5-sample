import React, { useState, useEffect } from 'react';
import Page from '@src/components/page/index'
import fun from '@src/common/utils/index'
import images from './componets/images'
import styles from './institute'
import {chooseLinkmanNamePageView, chooseLinkmanNamePageGoto,} from './componets/BuriedPoint'
import { gotoQuestions } from './componets/tools'
const { getSetssion, getParams } = fun

export default function Counter({ location }) {
  const { linkManInfoResps=[],  qnaireCode} = getSetssion('currItem')
  const [manState, setManState] = useState(0)

  useEffect(() => {
    chechOnlyMan()
  }, [])

  function chechOnlyMan() {
    const arr = linkManInfoResps.filter(rol => rol.writeFlag)
    if (arr.length === 1) setManState(arr[0].linkManId)

    chooseLinkmanNamePageView({view_type: getParams().viewType,})
  }

  function touchQuestion(id, rewrite){
    setManState(id)
    rewrite && gotoQuestions(id, qnaireCode, true, -1)
  }

  function gotoQuestion() {
    const pointConfig = {
      sample_linkmanid: manState,
      Btn_name: 'confirm',
    }
    chooseLinkmanNamePageGoto(pointConfig)
    gotoQuestions(manState, qnaireCode, false, -1)
  }

  return (
    <Page title='选择检测人'>
      <div className={styles.tuouchRole}>
        <h3>您正在为哪位宝宝填写问卷？</h3>

        {linkManInfoResps.length > 0 &&
          <ul className={styles.papersList}>
            {linkManInfoResps.map((item, index) => {
              const { gender, linkManName, linkManId, writeFlag } = item
              let checkImg = manState === linkManId ? images.checked : images.checker
              return <li key={index} onClick={() => touchQuestion(linkManId, !writeFlag)}>
                <div className={styles.licon}>
                  <img src={images[`manicon${gender === 'female' ? 2 : 1}`]} />
                  <p>{linkManName}</p>
                </div>
                {writeFlag ? <img src={checkImg} /> : <span>重新填写</span>}
              </li>
            })}
          </ul>
        }

        <div className={`foot ${styles.footerBox}`}>
          <button disabled={!manState} onClick={() => gotoQuestion()}>确认</button>
        </div>
      </div>
    </Page>
  )
}