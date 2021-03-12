import React, { Component } from 'react'
import propTypes from 'prop-types'
import { fun, ua } from '@src/common/app'
import styles from './evaluationCard.scss'
import images from '../../images'
import healthyApi from '@src/common/api/healthyApi'
import Points from '@src/components/points'
import PointsToast from '@src/components/pointsToast'
import integrationApi from '@src/common/api/integrationApi'
import { healthTestDetailGoto } from '../../buried-point'
const { getParams } = fun

class evaluationCard extends Component {
  static propTypes = {
    data:propTypes.object,
  }
  state = {
    init: true,
    answerIdList: [],
    indexArr: [],
    verdict: '',
    allowChoose: true,
    singleElec: false,
    answerReqList: [],
    answerExplainResps: [],
    pointA:'',
    pointAFlag:true,
    pointB:'',
    fillType:false, // 未选择
    reSubmitFlag:'',
  }

  componentDidMount() {
    this.initInfo(this.props.data.questionnaireInfo)
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState({
        fillType:false,
        init:true,
      })
      this.initInfo(nextProps.data.questionnaireInfo)
    }
  }

  // 初始化题目信息
  initInfo=(questionnaireInfo) => {
    if (this.state.reSubmitFlag) { return }
    console.log(questionnaireInfo)
    this.getPointTip()
    this.setState({
      verdict: questionnaireInfo.verdict,
      init: !(questionnaireInfo.verdict || questionnaireInfo.answerExplainResps),
      allowChoose:!(questionnaireInfo.verdict || questionnaireInfo.answerExplainResps),
      answerExplainResps: questionnaireInfo.answerExplainResps,
      singleElec: !!(questionnaireInfo.qnaireQuesAnswerResps[0] && questionnaireInfo.qnaireQuesAnswerResps[0].questionType === '2')
    })
    if (questionnaireInfo.userAnswerResps && questionnaireInfo.userAnswerResps[0]) {
      let tempArr = []
      questionnaireInfo.qnaireQuesAnswerResps[0].answerResps.forEach(el => {
        tempArr.push(el.id)
      })
      let idArr = []
      let indexArr = []
      questionnaireInfo.userAnswerResps.forEach(el => {
        indexArr[tempArr.indexOf(el.answerId)] = true
        idArr[tempArr.indexOf(el.answerId)] = el.answerId
      })
      console.log(indexArr)
      this.setState({
        indexArr,
        answerIdList: idArr
      })
    } else {
      this.setState({
        indexArr:[],
        answerIdList: []
      })
    }
  }
//  积分提示
getPointTip=() => {
  integrationApi.getPointTip({
    position:2,
    barCode:this.props.data.barCode,
    traitId:this.props.data.traitId,
    noloading:1
  }).then(res => {
    this.setState({ pointA:res.data ? res.data.point : '' }, () => {
      console.log(this.state.pointA, this.state.pointAFlag, this.state.init)
    })
  })
}
  submit = (qnaireId, questionId, uniqueCode) => {
    const { data, isUnLockFlag } = this.props
    const { answerIdList } = this.state
    const arr = answerIdList.filter(function (el) {
      return el !== null
    })
    if (!arr[0]) {
      return
    }
    healthyApi.commitEvaluation({
      productCode:data.productCode,
      isUnLockFlag,
      uniqueCode,
      linkManId:+getParams().linkManId,
      qnaireId,
      conclusion:data.traitConclusion,
      microQnaireAnswerReqList: [{
        answerIdList: arr,
        userAnswerValue: '',
        questionId,
      }],
      writeChannel:2, // 送积分
      noloading:1,
      barCode:data.barCode,
      traitId:data.traitId,
      submitHistory:data.submitHistory
    }).then(res => {
      healthTestDetailGoto({
        Btn_name:'submit',
        sample_linkmanid:+getParams().linkManId,
        trait_code:data.traitCode,
        trait_name:data.traitName,
        unlock_status:isUnLockFlag,
        trait_type:data.redLightType === 'L' ? 'red' : data.redLightType === 'M' ? 'normal' : data.redLightType === 'H' ? 'good' : '',
        submit_history:data.submitHistory,
        submit_status:0
      })
      this.setState({
        ...res.data,
        pointB:res.data.pointValue ? res.data.pointValue : '',
        pointAFlag:false,
        reSubmitFlag:false,
      })
      andall.invoke('refreshPage', { page:'home' } )
    })
    console.log(arr)
    if (!arr[0]) {
      return
    }
    this.setState({
      init: false,
      answerIdList: [],
      allowChoose: false
    })
    console.log(1)
  }
  // 互斥是否选中过
  mutexDone = false
  changeAnswer = (id, index, mutexFlag) => {
    const { answerIdList, indexArr, allowChoose, singleElec } = this.state
    console.log(allowChoose, singleElec)
    if (!allowChoose) {
      return
    }
    let arr
    let answerArr
    if (singleElec) {
      // 单选
      arr = []
      arr[index] = true
      answerArr = []
      answerArr[index] = id
    } else {
      // 多选
      arr = indexArr.slice()
      answerArr = answerIdList.slice()
      if ((mutexFlag === 0) && arr[index]) {
        // 互斥选项已选
        arr[index] = true
        answerArr[index] = id
      } else {
        if (this.mutexDone) {
          arr = []
          answerArr = []
          this.mutexDone = false
        }
        if (mutexFlag === 0) {
          arr = []
          answerArr = []
          this.mutexDone = true
        }
      }
      if (arr[index]) {
        arr[index] = !indexArr[index]
      } else {
        arr[index] = true
      }
      if (answerArr[index]) {
        answerArr[index] = null
      } else {
        answerArr[index] = id
      }
    }
    console.log({
      arr,
      answerArr
    })
    this.setState({
      indexArr: arr,
      answerIdList: answerArr,
      fillType:arr.length && arr.filter(item => item === true).length
    })
  }
  reSubmit = () => {
    let { data, isUnLockFlag } = this.props
    healthTestDetailGoto({
      Btn_name:'redo',
      sample_linkmanid:+getParams().linkManId,
      trait_code:data.traitCode,
      trait_name:data.traitName,
      unlock_status:isUnLockFlag,
      trait_type:data.redLightType === 'L' ? 'red' : data.redLightType === 'M' ? 'normal' : data.redLightType === 'H' ? 'good' : '',
      submit_history:data.submitHistory,
      submit_status:0
    })
    this.setState({
      init: true,
      indexArr: [],
      allowChoose: true,
      answerIdList: [],
      reSubmitFlag:true
    })
  }
  // 去查看/去解锁/去购买
  goPage=(page) => {
    let { data, isUnLockFlag } = this.props
    healthTestDetailGoto({
      Btn_name:'result_goto',
      sample_linkmanid:+getParams().linkManId,
      trait_code:data.traitCode,
      trait_name:data.traitName,
      unlock_status:isUnLockFlag,
      trait_type:data.redLightType === 'L' ? 'red' : data.redLightType === 'M' ? 'normal' : data.redLightType === 'H' ? 'good' : '',
      submit_history:data.submitHistory,
      submit_status:1
    })
    if (page === 4) {
      location.href = 'andall://andall.com/buy_tab'
    }
    if (page === 3) {
      location.href = `andall://andall.com/product_detail?productId=${data.productId}&newProductDetailType=5`
    }
    if (page === 2) {
      let url = `${window.location.origin}/mkt/report4_2?linkManId=${getParams().linkManId}&id=${data.productId}&code=${data.productCode}&traitId=${data.traitId}&barCode=${data.barCode}&reportType=${data.reportType}&exampleFlag=${data.exampleFlag}`
      location.href = ua.isAndall() ? `andall://andall.com/report_detail?url=${url}` : url
    }
  }

  render() {
    const { data, isUnLockFlag, } = this.props
    const { init, indexArr, singleElec, fillType, verdict, answerExplainResps } = this.state
    let answerExplainFlag = false
    if (answerExplainResps && answerExplainResps[0]) {
      answerExplainResps.forEach(el => {
        if (el.answerExplain) {
          answerExplainFlag = true
        }
      })
    }
    return (
      <div className={styles.card}>
        <div className={`${styles.evaluation}`}>
          <div className={styles.title}>
            <img src={images.ques3} />
            <span>{data.questionnaireInfo.qnaireQuesAnswerResps.slice(0, 1)[0].questionName}</span>
          </div>
          {
            data.questionnaireInfo.qnaireQuesAnswerResps.slice(0, 1).map((item, index) => {
              return (
                <div key={index} className={`${styles.thisQuestion}`}>
                  {item.answerResps.map((item1, index1) => {
                    return (
                      <div className={styles.checkBox} key={index1}
                        onClick={() => { this.changeAnswer(item1.id, index1, item1.mutexFlag) }}
                      >
                        {
                          singleElec
                            ? <img src={
                              !init
                                ? indexArr[index1] ? images.radio3 : images.radio1
                                : indexArr[index1] ? images.radio2 : images.radio1} />
                            : <img src={
                              !init
                                ? indexArr[index1] ? images.checkbox3 : images.checkbox1
                                : indexArr[index1] ? images.checkbox2 : images.checkbox1} />
                        }
                        <div className={styles.answerDesc}>{item1.answerDesc && item1.answerDesc.replace(/\$name/g, data.userName)}</div>
                      </div>
                    )
                  })}
                  <div style={{ position:'relative' }}>
                    {
                      this.state.pointA && this.state.pointAFlag && init
                        ? <div className={styles.integration}>
                          <Points value={this.state.pointA} />
                        </div>
                        : ''
                    }
                    { init
                      ? <div className={`${styles.submitBtn} ${!fillType ? styles.grey : ''}`}
                        onClick={() => this.submit(data.questionnaireInfo.questionnaireId, item.id, data.questionnaireInfo.questionnaireCode)}>
                          提交
                      </div>
                      : '' }

                  </div>
                  {
                    !init && (verdict || answerExplainFlag) && <div className={styles.conclusion}>
                      <img src={images.conclusion} />
                      <h5>结论：</h5>
                      <p>{verdict && verdict.replace(/\$name/g, data.userName).replace(/\$traitName/g, data.traitName)}</p>
                      {
                        answerExplainResps && answerExplainResps.map((item, index) => {
                          return (
                            <p key={index}>{item.answerExplain && item.answerExplain.replace(/\$name/g, data.userName)}</p>
                          )
                        })
                      }
                      {
                        isUnLockFlag === 1
                          ? <div className={styles.goLook}>
                            <p onClick={() => this.goPage(2)}>去查看</p>
                          </div>
                          : isUnLockFlag === 2
                            ? <div className={styles.goLook}>
                              <span>检测项解锁中，完成即可查看。</span>
                            </div>
                            : <div className={styles.goLook}>
                              <span>{data.isOnlyNonGeneFlag === 1 ? '购买基因检测后才能查看哦。' : '解锁检测项后即可查看。'}</span>
                              {
                                data.isOnlyNonGeneFlag === 1
                                  ? <p onClick={() => this.goPage(4)}>去购买</p>
                                  : <p onClick={() => this.goPage(3)}>去解锁</p>
                              }
                            </div>
                      }
                    </div>
                  }
                </div>
              )
            })
          }
          { !init ? <div className={styles.againBtn}>情况有改变？<span onClick={this.reSubmit}>点击这里，重新测评</span></div> : '' }
          { this.state.pointB ? <PointsToast value={this.state.pointB} /> : '' }
        </div>
        <div className={styles.whiteBlock} />
      </div>
    )
  }
}
export default evaluationCard
