import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import images from '../images'
import { MyLoader } from '../MyLoader'
import ShowModal from '../components/showModal'
import Points from '@src/components/points'
import PointsToast from '@src/components/pointsToast'
import Modular from '../components/modular'
import Product from '../components/product'
import { ua, fun } from '@src/common/app'
import integrationApi from '@src/common/api/integrationApi'
import styles from './home'
import andall from '@src/common/utils/andall-sdk'
import valueFlash from '@src/common/utils/valueFlash'
import { trackPointPointsPageView, trackPointMyPointsGoto } from '../buried-point'
import html2canvas from 'html2canvas'

const { getParams } = fun
const { isAndall } = ua

class IntegrationHome extends React.Component {
  state = {
    userState:'', // 用户状态
    remainPoint:'', // 用户积分
    daySteps:400, //  今日步数
    hasDuihuan:false, // 是否已兑换
    loading:true,
    modalFlag:false,
    hasReport:true, // 有无报告
    reportModal:false,
    hasCollector:true, // 有无采样器
    collectorModal:false,
    hasWaitBackColl:true, // 有无可回寄的采样器
    waitBackCollModal:false,
    hasAnswered:false, // true 已答题
    answerFlag:0, // 0 未回答  1正确  2错误
    answerDesc:'', // 选择的答案
    upOrDown:false, // 收起展开
    bindingWechat:'', // 绑定微信抖音送积分
    bindingDouyin:'',
    waitTipPoint:'',
    thisIndex:'', // 任务模块index
    taskModalFlag:false, // 任务模态框
    taskModalType:'', // 类型  5微信公众号 6微信小助手  7评论抖音  8关注抖音
  }

  componentDidMount () {
    if (getParams().closeWebViewFlag) {
      andall.invoke('closeWebViewFlag', {})
    }
    this.getPointHomeInfo()
  }

  getPointHomeInfo=() => {
    integrationApi.getPointHomeInfo({ noloading:1 }).then(res => {
      console.log(res)
      if (res) {
        let { tipFlag, everydayQuestionInfo, list, userPointResp, userStepInfo, waitTip, userId, exchangeProductInfo, hisTaskList } = res.data
        if (waitTip && waitTip.point) {
          this.setState({ waitTipPoint:waitTip.point })
        }
        //  0未登录    1已登陆-有报告 to 2已登陆-有检测无报告  3已登陆-无检测
        if (userId === null) {
          this.setState({ userState:0 })
        } else {
          if (list.length) {
            let _taskList = list[0].list[0]
            console.log('报告' + _taskList.hasReport, '采样器' + _taskList.hasCollector)
            this.setState({
              hasReport:_taskList.hasReport,
              hasCollector:_taskList.hasCollector,
              hasWaitBackColl:_taskList.hasWaitBackColl
            })
            if (_taskList.hasReport) {
              this.setState({ userState:1 })
            }
            if (!_taskList.hasReport && _taskList.hasCollector) {
              this.setState({ userState:2 })
            }
            if (!_taskList.hasCollector) {
              this.setState({ userState:3 })
            }
          }
        }
        // 每日一问
        if (everydayQuestionInfo) {
          let { replyId, rightAnswerId } = everydayQuestionInfo
          if (replyId === '' || replyId === null) {
            this.setState({ answerFlag:0 })
          } else if (replyId === rightAnswerId) {
            this.setState({
              answerFlag:1,
              hasAnswered:true
            })
          } else {
            this.setState({
              answerFlag:2,
              hasAnswered:true
            })
          }
        }
        this.setState({
          tipFlag,
          hisTaskList,
          everydayQuestionInfo,
          taskList:list,
          userPointResp,
          userStepInfo,
          waitTip,
          loading:false,
          remainPoint:userPointResp.remainPoint,
          productList:exchangeProductInfo && exchangeProductInfo.productList ? exchangeProductInfo.productList : []
        }, () => {
          if (getParams().notEnough) {
            window.scrollTo(0, document.getElementById('taskBox').offsetTop)
          }
          trackPointPointsPageView({
            view_type: getParams().source || '',
            user_state:this.state.userState,
            Btn_name:this.state.productList.length > 4 ? 'more' : 'exchange_record'
          })
          localStorage.setItem('productListLength', this.state.productList.length)
          document.getElementById('remainPoint') && valueFlash(document.getElementById('remainPoint'), userPointResp.remainPoint, 1)
        })
      }
    })
  }
  // 未登录
  goLogin=() => {
    andall.invoke('login', {}, (res) => {
      window.localStorage.setItem('token', res.result.token)
      window.location.reload()
    })
  }
  // 每日一问
  chooseBtn = (val, desc) => {
    let { userState } = this.state
    if (userState === 0 && isAndall()) {
      this.goLogin()
    } else {
      let { rightAnswerId, qnaireId, qnaireCode, questionId } = this.state.everydayQuestionInfo
      this.setState({
        answerFlag:val === rightAnswerId ? 1 : 2,
        answerDesc:desc,
        upOrDown:true
      })
      let params = {
        noloading:1,
        qnaireId:qnaireId,
        uniqueCode:qnaireCode,
        writeChannel:1,
        microQnaireAnswerReqList:[
          {
            questionId:questionId,
            answerIdList:[val]
          }
        ]
      }
      integrationApi.submitAnswer(params).then(res => {
        if (res) {
          console.log(res)
          let { remainPoint, answerFlag, userPointResp, everydayQuestionInfo } = this.state
          if (answerFlag === 1) {
            valueFlash(document.getElementById('remainPoint'), remainPoint + everydayQuestionInfo.pointValue, 1)
            valueFlash(document.getElementById('remainDeductFee'), Math.floor(Number(remainPoint + everydayQuestionInfo.pointValue) / userPointResp.exchangeRate * 100) / 100, 1)
          }
        }
      })
      trackPointMyPointsGoto({
        user_state:this.state.userState,
        Btn_name:'question_answer',
      })
    }
  }
  goRulePage=() => {
    this.props.history.push('/integration/rules')
  }
  goDetailPage=() => {
    let { userState } = this.state
    if (userState === 0 && isAndall()) {
      this.goLogin()
    } else {
      trackPointMyPointsGoto({
        user_state:this.state.userState,
        Btn_name:'points_detail',
      })
      setTimeout(() => {
        this.props.history.push('/integration/details')
      })
    }
  }
  btnsClick=(index, taskCode, jumpUrl, taskFinish, hasReport, hasCollector, hasWaitBackColl) => {
    event.preventDefault()
    let { userState, taskList } = this.state
    console.log(taskList, index, taskFinish, hasReport, hasCollector, hasWaitBackColl)
    this.setState({ thisIndex:index })
    if (userState === 0 && isAndall()) {
      this.goLogin()
    } else {
      if (taskCode === 'browser_report' && !hasReport) { // 无报告
        this.setState({ reportModal:true })
        console.log('无报告')
      } else if (taskCode === 'browser_report' && taskFinish) { // 报告已完成
        console.log('报告浏览已完成')
      } else if (taskCode === 'unlock_goods' && !hasCollector) { // 无采样器
        this.setState({ collectorModal:true })
      } else if (taskCode === 'write_big_questionnaire' && taskFinish) { // 填写问卷
        console.log('问卷已完成')
      } else if (taskCode === 'perfect_linkman' && taskFinish) { // 完善信息
        console.log('完善信息已完成')
      } else if (taskCode === 'pre_sample_back' && !hasWaitBackColl) {
        this.setState({ waitBackCollModal:true })
      } else if (taskCode === 'bind_third_wechat' && !taskFinish) {
        andall.invoke('bindThirdLogin', { bindType: 1 }, res => {
          if (res.tipResp.bindFlag === 1) {
            this.setState({ bindingWechat:res.tipResp.tip ? res.tipResp.tip.point : '' })
            taskList[index].list.filter(item => item.taskCode === 'bind_third_wechat')[0].taskFinish = true
            this.setState({ taskList })
          }
        })
        trackPointMyPointsGoto({
          user_state:this.state.userState,
          Btn_name:'task_bind_wechat'
        })
      } else if (taskCode === 'bind_third_douyin' && !taskFinish) { // 绑定抖音
        andall.invoke('bindThirdLogin', { bindType: 5 }, res => {
          if (res.tipResp.bindFlag === 1) {
            this.setState({ bindingDouyin:res.tipResp.tip ? res.tipResp.tip.point : '' })
            taskList[index].list.filter(item => item.taskCode === 'bind_third_douyin')[0].taskFinish = true
            this.setState({ taskList })
          }
        })
        trackPointMyPointsGoto({
          user_state:this.state.userState,
          Btn_name:'task_bind_tiktok'
        })
      } else if ((taskCode === 'subscribe_wechat' || taskCode === 'add_wechat_helper' || taskCode === 'comment_douyin' || taskCode === 'subscribe_douyin') && !taskFinish) {
        // 5添加微信公众号  6添加微信小助手  7评论抖音  8关注抖音
        // localStorage.setItem('saveImgTop', document.getElementById('integrationBox').offsetTop)
        localStorage.setItem('saveImgTop', document.body.scrollTop)
        this.setState({
          taskModalFlag:true,
          taskModalType:taskCode === 'subscribe_wechat' ? 5 : taskCode === 'add_wechat_helper' ? 6 : taskCode === 'comment_douyin' ? 7 : 8
        })
        window.scrollTo(0, 0)
        trackPointMyPointsGoto({
          user_state:this.state.userState,
          Btn_name:taskCode === 'subscribe_wechat' ? 'task_add_wechat_official' : taskCode === 'add_wechat_helper' ? 'task_add_wecaht_helper' : taskCode === 'comment_douyin' ? 'task_tiktok_comment' : 'task_tiktok_like'
        })
      } else {
        if (taskCode === 'bind_third_douyin' || taskCode === 'bind_third_wechat' || taskCode === 'subscribe_wechat' || taskCode === 'add_wechat_helper' || taskCode === 'comment_douyin' || taskCode === 'subscribe_douyin') {
          return
        }
        console.log(taskCode, jumpUrl, taskFinish, hasReport, hasCollector)
        trackPointMyPointsGoto({
          user_state:this.state.userState,
          Btn_name:taskCode === 'bind_complete' ? 'task_binding' : taskCode === 'pre_sample_back' ? 'task_send_back'
            : taskCode === 'browser_report' ? 'task_view_report' : taskCode === 'buy_goods' ? 'task_buy'
              : taskCode === 'unlock_goods' ? 'task_unlock' : taskCode === 'write_big_questionnaire' ? 'task_questionnaire'
                : taskCode === 'perfect_linkman' ? 'task_complete_info'
                  : '',
        })
        setTimeout(() => {
          window.location.href = taskCode === 'write_big_questionnaire' || taskCode === 'perfect_linkman' ? jumpUrl.split('?url=')[1] : jumpUrl
        })
      }
    }
  }
  modalToggle = (name) => {
    console.log(name, this.state[name])
    this.setState({ [name]: !this.state[name] })
    if (name === 'taskModalFlag') {
      window.scrollTo(0, localStorage.getItem('saveImgTop'))
    }
    if (name === 'modalFlag' && !this.state[name]) {
      console.log('点击抵扣点===')
      trackPointMyPointsGoto({
        user_state:this.state.userState,
        Btn_name:'how_to_deduct',
      })
    }
  }
  upDown=() => {
    let { upOrDown } = this.state
    this.setState({ upOrDown:!upOrDown })
  }
  // 去购买
  buyGoods=(type) => {
    event.preventDefault()
    trackPointMyPointsGoto({
      user_state:this.state.userState,
      Btn_name:type === 1 ? 'view_toast_buy' : 'unlock_toast_buy',
    })
    setTimeout(() => {
      window.location.href = 'andall://andall.com/buy_tab'
    })
  }
  // 去绑定
  goBinding=() => {
    event.preventDefault()
    const { taskList, thisIndex } = this.state
    trackPointMyPointsGoto({
      user_state:this.state.userState,
      Btn_name:'task_binding'
    })
    this.setState({ waitBackCollModal:false })
    let _url = taskList[thisIndex].list.filter(item => item.taskCode === 'bind_complete')[0].jumpUrl
    window.location.href = _url
  }
  // 抽奖/会员
  goPage=(type) => {
    let { userState } = this.state
    if (userState === 0 && isAndall()) {
      this.goLogin()
      return
    }
    trackPointMyPointsGoto({
      user_state:this.state.userState,
      Btn_name:type === 1 ? 'lucky_draw_banner' : 'vip_banner'
    })
    if (type === 1) {
      this.props.history.push('/integration/lottery?viewtype=my_points')
    } else {
      let url = `${location.origin}/mkt/members?hideTitleBar=1`
      location.href = ua.isAndall() ? `andall://andall.com/inner_webview?url=${url}` : url
    }
  }
  // 保存图片去关注
  saveWechat=(index) => {
    let myPoster = document.getElementById(`wechat${index}`)
    let canvas = document.createElement('canvas')
    canvas.width = myPoster.offsetWidth * 3
    canvas.height = myPoster.offsetHeight * 3
    let opts = {
      scale: 3,
      canvas: canvas,
      width: myPoster.offsetWidth,
      height: myPoster.offsetHeight,
      useCORS: true
    }
    html2canvas(myPoster, opts).then(canvas => {
      console.log(canvas.toDataURL('image/jpeg'))
      andall.invoke('saveWebImage', {
        source: canvas.toDataURL('image/jpeg'),
      })
    })
  }

  goThisPage=() => {
    let { productList } = this.state
    trackPointMyPointsGoto({
      user_state:this.state.userState,
      Btn_name:productList.length > 4 ? 'more' : 'exchange_record'
    })
    this.props.history.push(`${productList.length > 4 ? `/integration/exchange` : '/integration/exchange/records'}`)
  }
  goExchange=(item) => {
    this.props.history.push(`/integration/exchange/details?goodsId=${item.id}&type=1`)
  }
  closeBox=() => {
    this.setState({ tipFlag:1 })
  }
  goFinish=() => {
    let { hisTaskList } = this.state
    this.props.history.push({
      pathname: `/integration/finished`,
      state: { list:hisTaskList }
    })
  }
  doSomething=() => {
    // window.location.href = 'snssdk1128://'
  }
  render () {
    const { loading, tipFlag, everydayQuestionInfo, taskList, userPointResp, answerFlag, modalFlag, hasReport, reportModal, hasCollector, collectorModal, upOrDown,
      hasAnswered, answerDesc, remainPoint, hasWaitBackColl, waitBackCollModal, waitTipPoint, productList, hisTaskList, taskModalFlag, taskModalType } = this.state
    return (
      <Page title='我的积分'>
        {
          loading
            ? <MyLoader />
            : <div className={`${styles.integration} ${taskModalFlag && styles.height100}`} id='integrationBox'>
              <div className={styles.header}>
                <div className={styles.rules} onClick={this.goRulePage}>积分规则</div>
                {tipFlag === 0 && <div className={styles.blackBox}>
                  <img src={images.close2} onClick={this.closeBox} />
                  <span>积分可在下单时</span><span style={{ color:'#FF7157' }}>作为现金直接抵扣</span><span>快来做任务获得积分吧～</span>
                </div>}
                <div className={styles.acount}>
                  <div className={styles.box}>
                    <span id='remainPoint'>{remainPoint}</span>
                    <p onClick={this.goDetailPage}>
                      <span>可用积分</span><img src={images.details} />
                    </p>
                  </div>
                  <div className={styles.box}>
                    <span id='remainDeductFee'>{userPointResp.remainDeductFee}</span>
                    <p onClick={() => this.modalToggle('modalFlag')}>
                      <span>可抵扣(元)</span><img src={images.dikou} />
                    </p>
                  </div>
                </div>
              </div>
              {
                modalFlag
                  ? <ShowModal
                    type={1}
                    handleToggle={() => this.modalToggle('modalFlag')}
                  />
                  : null
              }
              <div className={styles.padding20}>
                {/* <div className={styles.rules}>
                  <div className={styles.left}>
                    <img src={images.broad} />
                    <span>下单可用积分直接抵扣</span>
                  </div>
                  <div className={styles.right} onClick={this.goRulePage}>
                    <span>查看规则</span>
                    <img src={images.right} />
                  </div>
                </div> */}
                {/* <div className={styles.steps}>
                  <div className={styles.left}>
                    <div><img src={`${integration}person.png`} /></div>
                    <div className={styles.today}>
                      <p>今日步数</p>
                      <span>{daySteps}</span>
                    </div>
                  </div>
                  <div className={styles.right}>
                    <p className={styles.detail}>
                      <span>查看详情</span>
                      <img src={`${integration}right2.png`} />
                    </p>
                    <p className={`${styles.exchange} ${daySteps < 1000 ? styles.greyBtn : hasDuihuan ? styles.hasDown : ''}`}>
                      {daySteps === 0 ? '打开权限' : daySteps < 1000 ? '1000步起兑' : hasDuihuan ? `已兑换${daySteps}积分` : `兑换${daySteps}积分` }
                    </p>
                  </div>
                </div> */}
                <div className={styles.btnImg}>
                  <img src={images.integration3} onClick={() => this.goPage(1)} />
                  <img src={images.integration2} onClick={() => this.goPage(2)} />
                </div>
                {
                  everydayQuestionInfo
                    ? <div className={styles.dailyQuestion}>
                      <div className={styles.top}>
                        <div className={styles.left}>
                          <img src={images.dailyQuestion} />
                          <span>每日一问</span>
                        </div>
                        {
                          answerFlag === 0
                            ? <div className={styles.right}>
                              <Points value={everydayQuestionInfo.pointValue} />
                            </div>
                            : <div className={styles.hasAnswer}>
                              <span>已选：</span>
                              <span>
                                {
                                  everydayQuestionInfo.replyId
                                    ? everydayQuestionInfo.answerList.filter(item => item.answerId === everydayQuestionInfo.replyId)[0].answerDesc
                                    : answerDesc
                                }
                              </span>
                              {
                                everydayQuestionInfo.replyId
                                  ? <span className={styles.border}>&nbsp;</span>
                                  : ''
                              }
                              {
                                everydayQuestionInfo.replyId
                                  ? <span className={styles.purple}>{answerFlag === 1 ? '回答正确' : answerFlag === 2 ? '回答错误' : ''}</span>
                                  : ''
                              }
                              { everydayQuestionInfo.replyId
                                ? answerFlag === 1 ? <img src={images.answerTrue} /> : <img src={images.error} />
                                : ''
                              }
                            </div>
                        }
                      </div>
                      <div className={styles.question}>
                        {everydayQuestionInfo.questionName}
                      </div>
                      {
                        answerFlag === 0
                          ? <div className={styles.btns}>
                            {
                              everydayQuestionInfo.answerList.map((item, index) => (
                                <div className={`${index === 0 ? styles.yes : styles.no}`} key={index}>
                                  <span onClick={() => this.chooseBtn(item.answerId, item.answerDesc)}>{item.answerDesc}</span>
                                </div>
                              ))
                            }

                          </div>
                          : upOrDown
                            ? <div>
                              {
                                !everydayQuestionInfo.replyId
                                  ? <div className={`${styles.answer} ${answerFlag === 1 ? styles.greenBtn : styles.redBtn}`}>
                                    <span>{answerFlag === 1 ? '正确' : '错误'}</span>
                                  </div>
                                  : ''
                              }
                              <div className={styles.padding15}>
                                <div className={styles.analysis}>
                                  <p className={styles.head}>
                                    <span>&nbsp;</span>
                                    <span>答案分析</span>
                                  </p>
                                  <div className={styles.desc}>
                                    {everydayQuestionInfo.rightAnswerDesc}
                                  </div>
                                  <div className={styles.center}>
                                    <p className={`${styles.jiantou} ${styles.upBtn}`} onClick={this.upDown} >
                                      <span>收起</span><img src={images.up} />
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            : <div className={styles.center}>
                              <p className={`${styles.jiantou} ${styles.downBtn}`} onClick={this.upDown}>
                                <span>查看解析</span><img src={images.down} />
                              </p>
                            </div>
                      }
                      {
                        answerFlag === 1 && !hasAnswered
                          ? <PointsToast value={everydayQuestionInfo.pointValue} />
                          : ''
                      }
                      {
                        this.state.bindingWechat
                          ? <PointsToast value={this.state.bindingWechat} />
                          : ''
                      }
                      {
                        this.state.bindingDouyin
                          ? <PointsToast value={this.state.bindingDouyin} />
                          : ''
                      }
                      {
                        waitTipPoint
                          ? <PointsToast value={waitTipPoint} />
                          : ''
                      }
                    </div>
                    : ''
                }
                {
                  productList.length ? <Modular
                    showFlag={1}
                    title='积分换好礼'
                    btnName={productList.length > 4 ? '更多' : '兑换记录'}
                    goThisPage={() => this.goThisPage()}
                  /> : ''
                }
                {
                  productList.length ? <Product
                    type={1}
                    productList={productList.length > 4 ? productList.slice(0, 4) : productList}
                    goExchange={(item) => this.goExchange(item)}
                  />
                    : ''
                }
                <div id='taskBox'>
                  <Modular
                    showFlag={hisTaskList && hisTaskList.length}
                    title='积分任务'
                    btnName='历史记录'
                    goThisPage={this.goFinish}
                  />
                </div>
                {
                  taskList.map((v, i) => (
                    <div className={styles.tasks} key={i}>
                      <div className={styles.title}>{v.taskTitle}</div>
                      {
                        v.list.map((item, index) => (
                          <div className={styles.taskList} key={index}>
                            <div className={styles.left}>
                              <img src={item.icon} className={styles.leftImg} />
                              <div className={styles.desc}>
                                <p>{item.taskName}</p>
                                <div>
                                  {item.taskPoint > 0 ? <span>+{item.taskPoint}</span> : ''}
                                  {item.taskPoint > 0 ? <img src={images.points} /> : ''}
                                  <label>{item.taskDesc}</label>
                                </div>
                              </div>
                            </div>
                            <div className={`${styles.taskBtn} 
                          ${(item.taskCode === 'browser_report' && item.taskFinish) ||
                           (item.taskCode === 'write_big_questionnaire' && item.taskFinish) ||
                            (item.taskCode === 'perfect_linkman' && item.taskFinish) ||
                            (item.taskCode === 'bind_third_wechat' && item.taskFinish) ||
                            (item.taskCode === 'bind_third_douyin' && item.taskFinish) ||
                            (item.taskCode === 'subscribe_wechat' && item.taskFinish) ||
                            (item.taskCode === 'add_wechat_helper' && item.taskFinish) ||
                            (item.taskCode === 'comment_douyin' && item.taskFinish) ||
                            (item.taskCode === 'subscribe_douyin' && item.taskFinish)
                            ? styles.taskBtn2
                            : ''}`}
                            onClick={() => { this.btnsClick(i, item.taskCode, item.jumpUrl, item.taskFinish, item.hasReport, item.hasCollector, hasWaitBackColl) }}>
                              {
                                (item.taskCode === 'browser_report' && item.taskFinish) ||
                              (item.taskCode === 'write_big_questionnaire' && item.taskFinish) ||
                               (item.taskCode === 'perfect_linkman' && item.taskFinish) ||
                               (item.taskCode === 'bind_third_wechat' && item.taskFinish) ||
                               (item.taskCode === 'bind_third_douyin' && item.taskFinish) ||
                               (item.taskCode === 'subscribe_wechat' && item.taskFinish) ||
                               (item.taskCode === 'add_wechat_helper' && item.taskFinish) ||
                               (item.taskCode === 'comment_douyin' && item.taskFinish) ||
                               (item.taskCode === 'subscribe_douyin' && item.taskFinish)
                                  ? '已完成'
                                  : item.btnText
                              }
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ))
                }
                {
                  !hasReport && reportModal
                    ? <ShowModal
                      type={2}
                      handleToggle={() => this.modalToggle('reportModal')}
                      goBuy={() => this.buyGoods(1)}
                    />
                    : !hasCollector && collectorModal
                      ? <ShowModal
                        type={3}
                        handleToggle={() => this.modalToggle('collectorModal')}
                        goBuy={() => this.buyGoods(2)}
                      />
                      : !hasWaitBackColl && waitBackCollModal
                        ? <ShowModal
                          type={4}
                          handleToggle={() => this.modalToggle('waitBackCollModal')}
                          goBinding={() => this.goBinding()}
                        />
                        : null
                }
                {
                  taskModalFlag
                    ? <ShowModal
                      type={taskModalType}
                      handleToggle={() => this.modalToggle('taskModalFlag')}
                      saveImg={() => this.saveWechat(taskModalType === 5 ? 1 : 2)}
                      doSomething={() => this.doSomething()}
                    />
                    : ''
                }
              </div>
            </div>
        }
      </Page>
    )
  }
}
IntegrationHome.propTypes = {
  history: propTypes.object,
}
export default IntegrationHome
