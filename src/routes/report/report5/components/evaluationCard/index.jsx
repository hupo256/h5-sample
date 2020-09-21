import React, { Component } from 'react'

import { API, fun } from '@src/common/app'
import { observer, inject } from 'mobx-react'
import {
  reportQuestionnaireSubmitClick,
  recomQuestGoto
} from '../../BuriedPoint'
import styles from './evaluationCard.scss'
import images from '../../images'
import Points from '@src/components/points'
import PointsToast from '@src/components/pointsToast'
import integrationApi from '@src/common/api/integrationApi'
const { getParams } = fun

@inject('user')
@observer
class evaluationCard extends Component {
  static propTypes = {

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
    pointB:''
  }
  componentDidMount() {
    const { questionnaireInfo } = this.props.data
    if (questionnaireInfo.verdict || questionnaireInfo.answerExplainResps) {
      this.setState({
        verdict: questionnaireInfo.verdict,
        init: false,
        allowChoose: false,
        answerExplainResps: questionnaireInfo.answerExplainResps
      })
    }
    if (questionnaireInfo.qnaireQuesAnswerResps[0] && questionnaireInfo.qnaireQuesAnswerResps[0].questionType == '2') {
      this.setState({ singleElec: true })
    }
    if (questionnaireInfo.userAnswerResps && questionnaireInfo.userAnswerResps[0]) {
      let tempArr = []
      questionnaireInfo.qnaireQuesAnswerResps[0].answerResps.forEach(el => {
        tempArr.push(el.id)
      })
      console.log(tempArr)
      let idArr = []
      let indexArr = []
      questionnaireInfo.userAnswerResps.forEach(el => {
        indexArr[tempArr.indexOf(el.answerId)] = true
        idArr[tempArr.indexOf(el.answerId)] = el.answerId
      })
      this.initAnswer(idArr, indexArr)
    }
    // 报告内现状测评访问埋点
    const obj = getParams()
    const name = localStorage.getItem('traitName')
    recomQuestGoto({
      trait_code: obj.traitId,
      trait_name: name,
      report_code: obj.code,
      report_type: obj.reportType,
      sample_linkmanid: obj.linkManId,
      sample_barcode: obj.barCode,
    })
    this.getPointTip()
  }
//  积分提示
getPointTip=() => {
  integrationApi.getPointTip({
    position:2,
    barCode:getParams().barCode,
    traitId:getParams().traitId,
    noloading:1
  }).then(res => {
    this.setState({ pointA:res.data ? res.data.point : '' })
  })
}
  submit = (qnaireId, questionId, uniqueCode) => {
    const { user: { data: { linkMan = {} } }, conclusion } = this.props
    const { linkManId } = linkMan
    const { answerIdList } = this.state
    const arr = answerIdList.filter(function (el) {
      return el !== null
    })
    // 问卷点击埋点
    const obj = getParams()
    const name = localStorage.getItem('traitName')
    reportQuestionnaireSubmitClick({
      trait_code: obj.traitId,
      trait_name: name,
      report_code: obj.code,
      report_type: obj.reportType,
      sample_linkmanid: obj.linkManId,
      sample_barcode: obj.barCode,
    })
    // console.log({
    //   uniqueCode,
    //   linkManId: obj.linkManId,
    //   qnaireId,
    //   microQnaireAnswerReqList: [{
    //     answerIdList: arr,
    //     userAnswerValue: '',
    //     questionId
    //   }]
    // })
    if (!arr[0]) {
      return
    }
    API.microqnaireSubmitAnswer({
      uniqueCode,
      linkManId: obj.linkManId || linkManId,
      qnaireId,
      conclusion,
      microQnaireAnswerReqList: [{
        answerIdList: arr,
        userAnswerValue: '',
        questionId,
      }],
      writeChannel:2, // 送积分
      noloading:1,
      barCode:getParams().barCode,
      traitId:getParams().traitId,
      productCode:getParams().code
    }).then(res => {
      console.log(res.data.pointValue)
      this.setState({
        ...res.data,
        pointB:res.data.pointValue ? res.data.pointValue : '',
        pointAFlag:false
      })
    })
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
  initAnswer = (id, index) => {
    const { allowChoose } = this.state
    if (!allowChoose) {
      return
    }
    this.setState({
      indexArr: index,
      answerIdList: id
    })
  }
  // 互斥是否选中过
  mutexDone = false
  changeAnswer = (id, index, mutexFlag) => {
    if (this.props.isAuthority === 2) {
      return
    }
    const { answerIdList, indexArr, allowChoose, singleElec } = this.state
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
      if ((mutexFlag == 0) && arr[index]) {
        // 互斥选项已选
        arr[index] = true
        answerArr[index] = id
      } else {
        if (this.mutexDone) {
          arr = []
          answerArr = []
          this.mutexDone = false
        }
        if (mutexFlag == 0) {
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
    // console.log({
    //   arr,
    //   answerArr
    // })
    this.setState({
      indexArr: arr,
      answerIdList: answerArr
    })
  }
  reSubmit = () => {
    if (this.props.isAuthority === 2) {
      return
    }
    this.setState({
      init: true,
      indexArr: [],
      allowChoose: true,
      answerIdList: []
    })
  }
  render() {
    const { data, username } = this.props
    const { init, indexArr, verdict, singleElec, answerExplainResps } = this.state
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
        <div className={styles.evaluation}>
          <div>
            <img src={data.moduleIconUrl} alt='' />
            <div>{data.title && data.title.replace(/\$name/g, username)}</div>
          </div>
          <div />
          <div className={styles.normalText}
            dangerouslySetInnerHTML={{
              __html: data.questionnaireInfo.questionaireDesc && data.questionnaireInfo.questionaireDesc.replace(/\$name/g, username)
            }} />
          {
            data.questionnaireInfo.qnaireQuesAnswerResps.slice(0, 1).map((item, index) => {
              return (
                <div key={index}>
                  <div>
                    <div>{item.questionName && item.questionName.replace(/\$name/g, username)}</div>
                  </div>
                  {item.answerResps.map((item1, index1) => {
                    return (
                      <div className={styles.checkBox} key={index1}
                        onClick={() => { this.changeAnswer(item1.id, index1, item1.mutexFlag) }}
                      >
                        <div className={singleElec ? styles.singleElec : ''}>
                          <div style={indexArr[index1] ? null : { visibility: 'hidden' }} />
                        </div>
                        <div>{item1.answerDesc && item1.answerDesc.replace(/\$name/g, username)}</div>
                      </div>
                    )
                  })}
                  <div style={{ position:'relative' }}>
                    {
                      this.state.pointA && this.state.pointAFlag
                        ? <div className={styles.integration}>
                          <Points value={this.state.pointA} />
                        </div>
                        : ''
                    }
                    { init
                      ? <div className={styles.submitBtn}
                        onClick={() => this.submit(data.questionnaireInfo.questionnaireId, item.id, data.questionnaireInfo.questionnaireCode)}>
                          提交
                      </div>
                      : <div className={styles.submitAgain}
                        onClick={() => this.reSubmit()}>
                          再测一次
                      </div> }
                  </div>
                </div>
              )
            })
          }
          {
            !init && (verdict || answerExplainFlag) && <div className={styles.conclusion}>
              <div />
              <div>
                <p />
                <div>结论</div>
                <p />
              </div>
              <p>{verdict && verdict.replace(/\$name/g, username)}</p>
              {
                answerExplainResps && answerExplainResps.map((item, index) => {
                  return (
                    <p key={index}>{item.answerExplain && item.answerExplain.replace(/\$name/g, username)}</p>
                  )
                })
              }
              <img src={images.key} alt='' />
            </div>
          }
          {
            this.state.pointB
              ? <PointsToast value={this.state.pointB} />
              : ''
          }
        </div>

      </div>
    )
  }
}

export default evaluationCard
