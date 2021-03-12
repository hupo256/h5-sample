import React from 'react'
import PropTypes from 'prop-types'
import Page from '@src/components/page'
import Modal from '@src/components/modal'
import fun from '@src/common/utils'
import ua from '@src/common/utils/ua'
import questionnaireApi from '@src/common/api/questionnaireApi'
import styles from '../questionnaire'
import { qnaireBeginPageView, qnaireBeginPageGoto, } from '../BuriedPoint'
import { Toast } from 'antd-mobile'
import AgreementTpl from '../agreement/agreement'
import { getPointTip, touchLastCommitRecord, queryQuestionInfo } from '../componets/tools'
import upIcon from '@static/up_icon.png'
import downIcon from '@static/down_icon.png'
import andall from '@src/common/utils/andall-sdk'
import Points from '@src/components/points/index'

const { getParams, getSetssion, setSetssion } = fun
import {
  qnaireCoverView,
  qnaireCoverGoto
} from '../BuriedPoint'
class QuestionStart extends React.PureComponent {
  state = {
    agreementVisible: false,
    confirmVisible: false,
    isCheck: true,
    reasonFlag: false, // 是否展示拒绝原因
    questionDetail: {},
    reasonDetail: {}, // 拒绝原因
    reasonId: null, // 当前选中原因的id
    remarkList: [], // 过敏源的列表
    remarkActive: '', // 选中的其他过敏原
    qnaireId: null,
    baseInfoFlag: '',
    pointValue: '',
  }

  componentDidMount() {
    this.initFun()

    // 开始埋点
    const { qnaireCode, linkManId } = getParams()
    qnaireCoverView({ 
      qnaire_code:qnaireCode,
      sample_linkmanid:linkManId
    })
   
  }

  initFun = () => {
    // console.log(getParams())
    // const { qnaireCode, linkManId } = getParams()
    +getParams().writeChannel !== 3 && getPointTip(d => this.setState({ pointValue: d }))
    queryQuestionInfo(d => this.setState({ questionDetail: d }))
    touchLastCommitRecord(d => this.setState({ baseInfoFlag: d }))
  }

  // 选择原因
  chooceReason = (item) => {
    let remarkList = []
    if (item.remark) {
      remarkList = item.remark.split(',')
    }
    this.setState({
      reasonId: item.answerId,
      remarkList
    })
  }
  // 选择其他过敏原
  remarkItemChange = (val) => {
    this.setState({
      remarkActive: val
    })
  }
  // 其他过敏原输入
  onTextareaChange = (e) => {
    this.setState({
      remarkActive: e.target.value
    })
  }
  // 查看协议
  viewAgreement = () => {
    this.setState({
      agreementVisible: !this.state.agreementVisible
    })
    const { qnaireCode, linkManId } = getParams()
    qnaireCoverGoto({
      qnaire_code:qnaireCode,
      sample_linkmanid:linkManId,
      Btn_name: '2'
    })
  }
  // 不想参与
  doNotThink = () => {
    let qnaireCode = getParams().qnaireCode ? getParams().qnaireCode : (getSetssion('QUESTIONNIRE_KEY') ? getSetssion('QUESTIONNIRE_KEY').productCode : '')
    questionnaireApi.getQuestionList({ qnaireCode: `${qnaireCode}-REJECT` }).then(res => {
      if (res) {
        const { data } = res
        const reasonDetail = data.qnaireQuesAnswerResps[0]
        if (!reasonDetail) {
          const { qnaireCode, linkManId } = getParams()
          qnaireCoverGoto({
            qnaire_code:qnaireCode,
            sample_linkmanid:linkManId,
            Btn_name:'0'
          })
          ua.isAndall()
            ? andall.invoke('back')
            : window.history.go(-1)
          return
        }
        this.setState({
          // confirmVisible: !this.state.confirmVisible,
          reasonFlag: false
        })
      }
    })

    const { linkManId } = getParams()
    const pointCofing = {
      Btn_name: 'reject',
      sample_linkmanid: linkManId,
      qnaire_code: qnaireCode,
    }
    qnaireBeginPageGoto(pointCofing)
  }
  // 参与问卷
  joinQa = () => {
    const { baseInfoFlag, isCheck } = this.state
    if (!isCheck) {
      Toast.info('请先同意《授权同意书》', 1)
    }
    const { qnaireCode, linkManId } = getParams()
    const pointCofing = {
      Btn_name: 'begin',
      sample_linkmanid: linkManId,
      qnaire_code: qnaireCode,
    }
    qnaireBeginPageGoto(pointCofing)

    qnaireCoverGoto({
      qnaire_code:qnaireCode,
      sample_linkmanid:linkManId,
      Btn_name:'1'
    })

    const { history, location } = this.props
    // 跳转到问题
    if (isCheck) {
      const nextUrl = baseInfoFlag === 1 ? '/questionnaire/user-infor' : '/questionnaire/basequestion-new'
      // history.push(`/questionnaire/basequestion-new${location.search}`)
      history.push(`${nextUrl}${location.search}`)
    }
  }

  // 勾选授权同意书 btnRightActive
  agreementCheck = () => {
    this.setState({ isCheck: !this.state.isCheck })
  }

  // 狠心拒绝-调后台接口展示拒绝原因
  backToDetectionsList = () => {
    let qnaireCode = getParams().qnaireCode ? getParams().qnaireCode : (getSetssion('QUESTIONNIRE_KEY') ? getSetssion('QUESTIONNIRE_KEY').productCode : '')
    questionnaireApi.getQuestionList({ qnaireCode: `${qnaireCode}-REJECT` }).then(res => {
      if (res) {
        const { data } = res
        const reasonDetail = data.qnaireQuesAnswerResps[0]
        if (!reasonDetail) {
          ua.isAndall()
            ? andall.invoke('back')
            : window.history.go(-1)
          return
        }
        this.setState({
          reasonDetail,
          reasonFlag: true,
          qnaireId: data.questionnaireId
        })
      }
    })
  }
  // 提交拒绝答案
  handleConfirm = () => {
    const { reasonId, reasonDetail, remarkActive, qnaireId } = this.state
    const { linkManId, reportId } = getParams()
    if (!reasonId) {
      Toast.info('请选择拒绝原因')
      return false
    }
    let params = {
      reportId: reportId || '',
      qnaireId,
      preQuesId: -1,
      finishStatus: 1,
      quesId: reasonDetail.quesId,
      userAnswerValue: reasonId,
      userAnswerValueExtra: remarkActive
    }
    if (getSetssion('toolsType') === '20') {
      Object.assign(params, { linkManId: +linkManId || '' })
    }
    questionnaireApi.saveQuestionAnswer(params).then(res => {
      if (!res.code) {
        if (getSetssion('questionnaireCode') === 'HEIGHTQ') {
          const heightPage = window.location.origin + '/height/height-index'
          ua.isAndall() && andall.invoke('openNewWindow', { url: '/height/height-index' })
          ua.isAndall() || (window.location.href = heightPage)
        } else {
          // 提交成功通知原生
          ua.isAndall()
            ? andall.invoke('back')
            : window.history.go(-1)
        }
      }
    })
  }

  render() {
    const { agreementVisible, confirmVisible, isCheck, reasonFlag,
      questionDetail, reasonDetail, reasonId, remarkList, remarkActive, pointValue } = this.state
    const { writeChannel, rewrite } = getParams()
    return (
      <Page title='表型问卷'>
        <div
          className={styles.questionStartOut}
          style={{ background: `${questionDetail.questionnaireColor}` }}
        >
          <div className={styles.questionImgBox}>
            <img className={styles.questionBg} src={questionDetail.questionnairePicUrl} />
            <div className={styles.questionBox}>
              <div className={styles.questionBtn} onClick={this.joinQa} />
              {
                (pointValue && writeChannel && !rewrite)
                  ? <div className={styles.pointsIndex}>
                    <Points value={+pointValue} />
                  </div>
                  : ''
              }
              <div className={styles.startAgreement}>
                <div className={styles.noThinkJoin} onClick={this.backToDetectionsList}><u>暂不参与</u></div>
                {/* <div className={styles.noThinkJoin} onClick={this.doNotThink}><u>暂不参与</u></div> */}
                <div className={styles.checkbox}>
                  <input type='checkbox' id='agreement' checked={isCheck} onChange={this.agreementCheck} />
                  <label htmlFor='agreement' />
                  <a onClick={this.viewAgreement}>授权同意书</a>
                </div>
              </div>
            </div>
          </div>

          <Modal
            visible={agreementVisible}
            type
            handleToggle={this.viewAgreement}
          >
            <div className={styles.agreementOut}>
              <div className={styles.agreementTitle}>安我生活基因检测个人隐私政策</div>
              <div className={styles.agreementBody}>
                <AgreementTpl />
              </div>
            </div>
          </Modal>

          <Modal
            visible={reasonFlag}
            handleToggle={this.doNotThink}
          >
            <div>
              {/* {!reasonFlag
                ? <div>
                  <div className={styles.noThinkTitle}>
                    <p>{questionDetail.rejectQuestionnaireDesc}</p>
                  </div>
                  <div className={styles.noThinkImgOut}>
                    <div className={styles.noThinkImg} />
                  </div>
                  <div className={styles.btns}>
                    <div className={styles.noThinkGoOn} onClick={this.doNotThink}>继续参与</div>
                    {
                      !reasonFlag
                        ? <div className={styles.noThinkExit} onClick={() => { this.backToDetectionsList() }}>狠心拒绝</div>
                        : <div className={styles.noThinkExitNo}>狠心拒绝</div>
                    }
                  </div>
                </div> : null
              } */}
              {
                reasonFlag ? <div className={styles.reasonLists}>
                  <p className={styles.title}>{reasonDetail.quesName}</p>
                  {
                    reasonDetail.answerResps && reasonDetail.answerResps.length > 0
                      ? <div className={styles.resons}>
                        {
                          reasonDetail.answerResps.map((item, index) => {
                            return (
                              <div key={index} className={styles.reasonItem}>
                                <div className={styles.reasonTitle} onClick={() => this.chooceReason(item)}>
                                  <span className={
                                    `${styles.circle} ${reasonId === item.answerId ? styles.active : ''}`}
                                  />
                                  <span className={styles.retitle}>{item.answerDesc}</span>
                                  {
                                    item.remark && item.remark !== ''
                                      ? <span>
                                        <img className={styles.upIcon}
                                          src={reasonId === item.answerId ? downIcon : upIcon} />
                                      </span>
                                      : null
                                  }
                                </div>
                                {
                                  reasonId === item.answerId && remarkList && remarkList.length > 0
                                    ? <div className={styles.remarkList}>
                                      {
                                        remarkList.map((el, ind) => {
                                          return (
                                            <span
                                              key={ind}
                                              onClick={() => this.remarkItemChange(el)}
                                              className={
                                                `${styles.remarkItem} ${remarkActive === el ? styles.active : ''}`}
                                            >{el}</span>
                                          )
                                        })
                                      }
                                      <textarea className={styles.textarea}
                                        style={{ display: 'block' }}
                                        maxLength='100'
                                        placeholder='填写其他过敏原'
                                        value={this.state.inputValue}
                                        onChange={this.onTextareaChange} />
                                    </div>
                                    : null
                                }
                              </div>
                            )
                          })
                        }
                      </div>
                      : null
                  }
                  <span className={styles.confirmBtn} onClick={() => this.handleConfirm()}>确定</span>
                </div> : null
              }
            </div>
          </Modal>
        </div>
      </Page>
    )
  }
}
QuestionStart.propTypes = {
  history: PropTypes.object
}
export default QuestionStart
