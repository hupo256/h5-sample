import React, { useState, useEffect } from 'react'
import { Page } from '@src/components'
import styles from './checkout.scss'
import images from '../images'
import healthyApi from '@src/common/api/healthyApi'
import Evaluation from '../components/evaluationCard'
import { fun, ua } from '@src/common/app'
import { healthTestDetailView, healthTestDetailGoto } from '../buried-point'
import puller from '@src/components/puller'
const { getParams } = fun
export default function CheckOut({ history }) {
  const [loading, setloading] = useState(true)
  const [describeHeight, setdescribeHeight] = useState('')
  const [visitFlag, setvisitFlag] = useState('')
  const [traitInfo, settraitInfo] = useState({})
  const [isUnLockFlag, setisUnLockFlag] = useState(+getParams().isUnLockFlag)
  const [preEvaluationDto, setpreEvaluationDto] = useState({})
  const [sufEvaluationDto, setsufEvaluationDto] = useState({})
  const [verdict, setverdict] = useState('')
  const [init, setinit] = useState(true)
  const [allowChoose, setallowChoose] = useState(true)
  const [answerExplainResps, setanswerExplainResps] = useState([])
  const [singleElec, setsingleElec] = useState(false)
  const [indexArr, setindexArr] = useState([])
  const [answerIdList, setanswerIdList] = useState([])
  const [fillType, setfillType] = useState(false)

  useEffect(() => {
    let obj = getParams()
    evaluationDetails(+obj.isUnLockFlag, obj.productCode, +obj.qnaireId, +obj.traitId)
  }, [])

  function evaluationDetails(isUnLockFlag, productCode, qnaireId, traitId, noloading) {
    healthyApi.evaluationDetails({
      isUnLockFlag,
      productCode,
      qnaireId,
      traitId,
      linkManId:+getParams().linkManId,
      evaPageType:getParams().evaPageType,
      noloading,
    }).then(({ data }) => {
      if (data) {
        healthTestDetailView({
          sample_linkmanid:+getParams().linkManId,
          trait_code:data.traitCode,
          trait_name:data.traitName,
          unlock_status:isUnLockFlag,
          trait_type:data.redLightType === 'L' ? 'red' : data.redLightType === 'M' ? 'normal' : data.redLightType === 'H' ? 'good' : '',
          submit_history:data.submitHistory,
          submit_status:localStorage.submitFlag === 'true' ? 0 : 1
        })
        console.log(data)
        setloading(false)
        settraitInfo(data)
        setvisitFlag(data.visitFlag)
        setpreEvaluationDto(data.preEvaluationDto ? data.preEvaluationDto : {})
        setsufEvaluationDto(data.sufEvaluationDto ? data.sufEvaluationDto : {})
        setdescribeHeight(document.getElementById('describe').offsetHeight >= 84)
        console.log(data.questionnaireInfo.verdict + '====')
        if (data.questionnaireInfo.verdict || data.questionnaireInfo.answerExplainResps) {
          setverdict(data.questionnaireInfo.verdict)
          setinit(false)
          setallowChoose(false)
          setanswerExplainResps(data.questionnaireInfo.answerExplainResps)
          console.log(data.questionnaireInfo.answerExplainResps)
          // localStorage.setItem('submitFlag', this.state.init)
        }
        if (data.questionnaireInfo.qnaireQuesAnswerResps[0] && data.questionnaireInfo.qnaireQuesAnswerResps[0].questionType === '2') {
          setsingleElec(true)
        }
        if (data.questionnaireInfo.userAnswerResps && data.questionnaireInfo.userAnswerResps[0]) {
          let tempArr = []
          data.questionnaireInfo.qnaireQuesAnswerResps[0].answerResps.forEach(el => {
            tempArr.push(el.id)
          })
          console.log(tempArr)
          let idArr = []
          let indexArr = []
          data.questionnaireInfo.userAnswerResps.forEach(el => {
            indexArr[tempArr.indexOf(el.answerId)] = true
            idArr[tempArr.indexOf(el.answerId)] = el.answerId
          })
          initAnswer(idArr, indexArr)
        }
      }
    })
  }
  function initAnswer (id, index) {
    console.log(index)
    if (!allowChoose) {
      return
    }
    setindexArr(index)
    setanswerIdList(id)
  }

  function getDom() {
    return <div>
      {
        visitFlag === 0
          ? <div className={styles.firstTime}>
            <img src={images.top} className={styles.top} />
            <img src={images.bottom} className={styles.bottom} />
            <p>页面顶部下拉或底部上拉释放，</p>
            <p>均可快捷进入其它测评哦～</p>
            <div onClick={closeBtn}>我知道了</div>
          </div>
          : ''
      }
      {
        !loading
          ? <div className={styles.checkout}>
            <div className={styles.header}>
              <div className={styles.left}>
                <img src={`${traitInfo.headImgType === 1 ? images.userImg1 : traitInfo.headImgType === 2 ? images.userImg2 : traitInfo.headImgType === 3 ? images.userImg3 : traitInfo.headImgType === 4 ? images.userImg4 : ''}`} />
                <span className={styles.bold}>{traitInfo.userName}</span>
                <span>{`${traitInfo.headImgType > 2 ? '（成人）' : '（儿童）'}`}</span>
              </div>
              <div className={styles.right} onClick={() => goPage(1)}>
                <span>全部测评</span>
                <img src={images.right} />
              </div>
            </div>
            <div className={styles.title}>{traitInfo.qnaireTitle}</div>
            {
              traitInfo.productName
                ? isUnLockFlag === 1
                  ? <div onClick={() => goPage(2)}
                    className={`${styles.status} ${traitInfo.redLightType === 'L' ? styles.red : traitInfo.redLightType === 'M' ? styles.middle : traitInfo.redLightType === 'H' ? styles.green : ''}`}>
                    <img src={traitInfo.redLightType === 'L' ? images.red : traitInfo.redLightType === 'M' ? images.middle : traitInfo.redLightType === 'H' ? images.green : ''} />
                    <span>「{traitInfo.productName}」-{traitInfo.traitName}</span>
                    <img src={images.right} />
                  </div>
                  : <div className={`${styles.status} ${styles.status2}`}>
                    <img src={isUnLockFlag === 2 ? images.locking : images.lock} />
                    <span>
                      「{traitInfo.productName}」-{traitInfo.traitName}
                    </span>
                    {
                      isUnLockFlag === 2
                        ? <div className={styles.locking}>解锁中...</div>
                        : traitInfo.isOnlyNonGeneFlag === 1
                          ? <div className={styles.goLock} onClick={() => goPage(4)}>去购买</div>
                          : <div className={styles.goLock} onClick={() => goPage(3)}>去解锁</div>
                    }
                  </div>
                : ''
            }
            {
              traitInfo.questionnaireInfo
                ? <div className={`${styles.describe} ${describeHeight ? styles.describe2 : ''}`} id='describe'>
                  <div dangerouslySetInnerHTML={{ __html: traitInfo.questionnaireInfo.questionaireDesc }} />
                </div> : ''
            }
          </div>
          : ''
      }
      {
        traitInfo.questionnaireInfo && <Evaluation
          data={traitInfo}
          isUnLockFlag={isUnLockFlag}
          answerExplainResps={answerExplainResps}
          verdict={verdict}
          init={init}
          allowChoose={allowChoose}
          singleElec={singleElec}
          fillType={fillType}
        />
      }
    </div>
  }
  function closeBtn() {
    setvisitFlag(1)
  }
  // 全部测评/去查看报告详情/去解锁/去购买
  function goPage(page) {
    healthTestDetailGoto({
      Btn_name:page === 1 ? 'health_test_go' : 'trait_card',
      sample_linkmanid:+getParams().linkManId,
      trait_code:traitInfo.traitCode,
      trait_name:traitInfo.traitName,
      unlock_status:isUnLockFlag,
      trait_type:traitInfo.redLightType === 'L' ? 'red' : traitInfo.redLightType === 'M' ? 'normal' : traitInfo.redLightType === 'H' ? 'good' : '',
      submit_history:traitInfo.submitHistory,
      submit_status:localStorage.submitFlag === 'true' ? 0 : 1
    })
    if (page === 4) {
      location.href = 'andall://andall.com/buy_tab'
    }
    if (page === 3) {
      location.href = `andall://andall.com/product_detail?productId=${traitInfo.productId}&newProductDetailType=5`
    }
    if (page === 1) {
      history.replace(`/healthy/assessment?linkManId=${getParams().linkManId}`)
    }
    if (page === 2) {
      let url = `${location.origin}/mkt/report4_2?linkManId=${getParams().linkManId}&id=${traitInfo.productId}&code=${traitInfo.productCode}&traitId=${traitInfo.traitId}&barCode=${traitInfo.barCode}&reportType=${traitInfo.reportType}&exampleFlag=${traitInfo.exampleFlag}`
      location.href = ua.isAndall() ? `andall://andall.com/report_detail?url=${url}` : url
    }
  }

  function callback(top) {
    setverdict('')
    setinit(true)
    setallowChoose(true)
    setanswerExplainResps([])
    setsingleElec(false)
    if (top) {
      setisUnLockFlag(preEvaluationDto.isUnLockFlag)
      evaluationDetails(preEvaluationDto.isUnLockFlag, preEvaluationDto.productCode, preEvaluationDto.qnaireId, preEvaluationDto.traitId, 1)
    } else {
      setisUnLockFlag(sufEvaluationDto.isUnLockFlag)
      evaluationDetails(sufEvaluationDto.isUnLockFlag, sufEvaluationDto.productCode, sufEvaluationDto.qnaireId, sufEvaluationDto.traitId, 1)
    }
  }
  return (
    <Page title='健康测评'>
      {
        preEvaluationDto
          ? puller({
            getDom,
            topTips:preEvaluationDto.qnaireTitle,
            botTips:sufEvaluationDto.qnaireTitle,
            callback
          })
          : getDom()
      }
    </Page>
  )
}
