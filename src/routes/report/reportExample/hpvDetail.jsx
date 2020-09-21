import React from 'react'
import Page from '@src/components/page'
import { fun, ua, API } from '@src/common/app'
import hpvReportApi from '@src/common/api/hpvReportApi'
import images from '../hpvReport/images'
import { observer, inject } from 'mobx-react'
import { HpvCardLoader } from '@src/components/contentLoader'
import andall from '@src/common/utils/andall-sdk'
import ResultCard from './components/resultCard'
import PartCard from './components/partCard'
import AdviseCard from './components/adviseCard'
import EvaluationCard from '../hpvReport/components/evaluationCard'
import QuestionCard from '../hpvReport/components/questionCard'
import BookCard from '../hpvReport/components/bookCard'
import ReviewCard from './components/reviewCard.js'
import NoResultCard from '../hpvReport/components/noResultCard.js'
import ReadCard from './components/readCard'
import YourOnlyCard from '../hpvReport/components/yourOnlyCard'
import ImmunityCard from './components/immunityCard'
import FeedBack from '../hpvReport/components/feedbackCard'
import ShareBanner from '../reportShare/components/shareBanner/index.jsx'

import PointsToast from '@src/components/pointsToast'

import styles from '../hpvReport/hpvReport.scss'
import Header from "@src/routes/report/reportExample/components/header";
import msg2 from "@static/reportEg/msg2.png";
import {backToSampleReportListGoto, HPVReportSampleView } from './BuriedPoint';

const { getParams } = fun
@inject('hpvReport')
@observer

class hpvDetail extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    isAndall: ua.isAndall(),
    scienceList: [],
    resultList: [],
    tabIndex: 0,
    linkManId:'',
    userName: '',
    userAge:'',
    userId: '',
    headImgType: null,
    haveSubmit: false,
    showTop: false,
    loading: true,
    hideUnlock: false,
    conclusion: '',
    previewPoint:'', // 浏览报告得积分
    QRlist: null,
    posetInfo: null,
    mobile: '',
    loginVisible: false,
    modalFlag:false,
    isAnswer:0, // 0未测评
    qnaireStatus:0, // 0未完成 1已完成
    cepingObj:{},
    productId:'',
    linkMans: [{
      id: 2809923446588416,
      relationId: "3",
      userName: "小小安",
      sex: "male",
      status: 0,
    }, {
      id: 2654676667973632,
      relationId: "1",
      userName: "小安",
      sex: "female",
      status: 0,
    }],
  }

  curLinkMan = {
    id: 2654676667973632,
    relationId: "1",
    userName: "小安",
    sex: "female",
    status: 0,
  }

  componentDidMount() {
    const { isPreviewFlag, code, expirationDateTime, id, priviewTraitConclusion, traitId } = getParams()
    HPVReportSampleView({})
    if (isPreviewFlag === 'true') {
      // 报告预览
      const params = {
        code,
        expirationDateTime: decodeURIComponent(expirationDateTime),
        id: +id,
        priviewTraitConclusion: decodeURIComponent(priviewTraitConclusion),
        traitId: +traitId
      }
      this.handleQueryReportDetail(params)
      function onBridgeReady() {
        WeixinJSBridge.call('hideOptionMenu')
      }
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
        }
      } else {
        onBridgeReady()
      }
    } else {
      this.getHPVDetail()
      // this.versionCtrl()
      // this.getUserInfor()
      this.listenTab()
      this.listenScroll()
    }
  }
  handleQueryReportDetail = (params) => {
    API.previewRestructureReportDetail(params).then(res => {
      this.pageInit(res)
    })
    const { user: { getLastUserLindManId } } = this.props
    getLastUserLindManId()
  }
  toggleMask = (name) => {
    const bool = this.state[name]
    this.setState({
      [name]: !bool
    })
  }
  changeMobile = (num) => {
    this.setState({
      mobile: num
    })
  }
  // 设置登陆标示
  setLoginFlag = bool => {

  }

  // 获取页面详情配置
  getHPVDetail = () => {
    const obj = getParams()
    this.setState({
      tabIndex: getParams().closeWebViewFlag ? 1 : 0
    })

    hpvReportApi.getHPVDetail({
      ...obj,
    }).then(res => {
      console.log(res)
      this.pageInit(res)
    })
  }
  // 获取用户信息
  getUserInfor = () => {
    const infoPara = { noloading: 1 }
    ua.isAndall() && Object.assign(infoPara, { clientType: 'app' })
    API.myInfo(infoPara).then(res => {
      // console.log(res)
      const { code, data } = res
      if (!code) this.setState({ ...res.data })
      if (!data.mobileNo) {
        this.setState({
          loginVisible: true
        })
      }
    })
  }
  // 根据版本控制推荐模块
  versionCtrl = () => {
    let version = andall.info.version || '1.6.0'
    // console.log(version.split('.').join(''));
    const versionStr = version.split('.').join('')
    if (versionStr < 165) {
      this.setState({
        hideUnlock: true
      })
    }
  }
  // 页面初始化
  pageInit = (res) => {
    const { isAndall, resultList, scienceList, } = this.state
    if (res.data) {
      console.log(res.data.conclusionList.filter(item => item.moduleType === 4511))
      let _arr = res.data.scienceList.filter(item => item.moduleType === 4514)
      localStorage.setItem('linkManId', res.data.linkManId)
      localStorage.setItem('productCode', res.data.code)
      localStorage.setItem('userName', res.data.userName)
      localStorage.setItem('userAge', res.data.age)
      localStorage.setItem('reprotResult', res.data.conclusionList ? res.data.conclusionList.filter(item => item.moduleType === 4511)[0].data.result : '')
      this.setState({
        ...res.data,
        linkManId:res.data.linkManId,
        previewPoint:res.data.pointStatusTipResp ? res.data.pointStatusTipResp.point : '',
        productCode:res.data.code,
        QRlist: res.data.reportQrcodeConfigReqList,
        userName: isAndall ? res.data.userName : this.desensitization(res.data.userName, 0, -1),
        resultList:[resultList, ...res.data.conclusionList],
        scienceList:[scienceList, ...res.data.scienceList],
        isAnswer:_arr.length ? _arr[0].data.isAnswer : 999,
        qnaireStatus:_arr.length ? 0 : 1,
        cepingObj:_arr.length ? _arr[0].data : {},
        loading: false,
      })
    }
    if (isAndall) {
      andall.invoke('setReportDetailData', { res }, res => {
      })
      if (getParams().questionFinished) {
        this.setState({ tabIndex:1 })
        andall.invoke('changeReportTab', { index: 1 })
        this.state.scienceList.filter(item => item.moduleType === 4518)[0].data.hpvAdviceDtos.map((item, index) => {
          if (document.getElementById(`list${index + 1}`).clientHeight > 440) {
            item.showMoreFlag = true
          }
        })
      }
    }
  }
  // 脱敏方法
  desensitization = (str, beginLen, endLen) => {
    const len = str.length === 1 ? 2 : str.length
    const firstStr = str.substr(0, beginLen)
    const lastStr = str.substr(endLen)
    const middleStr = str.substring(beginLen, len - Math.abs(endLen)).replace(/[\s\S]/ig, '*')
    const tempStr = firstStr + middleStr + lastStr
    return tempStr
  }
  // 监听app原声导航条
  listenTab = () => {
    andall.on('reportDetailChangeIndex', res => {
      const { index } = res
      const { tabIndex, scienceList, isAndall } = this.state
      this.setState({
        tabIndex: index
      }, () => {
        // if (index === 1 && scienceList.filter(item => item.moduleType === 4518).length) {
        //   scienceList.filter(item => item.moduleType === 4518)[0].data.hpvAdviceDtos.map((item, index) => {
        //     if (document.getElementById(`list${index + 1}`).clientHeight > 440) {
        //       item.showMoreFlag = true
        //     }
        //   })
        // }
        if (this.state.tabIndex !== index) {
          document.documentElement.scrollTop
            ? document.documentElement.scrollTop = 0
            : document.body.scrollTop = 0
        }

        // 专家建议
      })
    })
  }
  // 导航条切换
  reportDetailChangeIndex = index => {
    const { scienceList, isAndall, tabIndex } = this.state
    this.setState({
      tabIndex: index
    }, () => {
      if (index === 1 && scienceList.filter(item => item.moduleType === 4518).length) {
        scienceList.filter(item => item.moduleType === 4518)[0].data.hpvAdviceDtos.map((item, index) => {
          if (document.getElementById(`list${index + 1}`).clientHeight > 440) {
            item.showMoreFlag = true
          }
        })
      }
    })
  }
  // 提交反馈控制
  handleSubmit = () => {
    if (getParams().shareToken) {
      return
    }
    this.setState({
      haveSubmit: true,
    })
  }
  // 返回顶部
  backTop = () => {
    document.getElementById('top').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
  // 监听滑动
  listenScroll = () => {
    document.body.onscroll = e => {
      if (e.target.documentElement.scrollTop) {
        if (e.target.documentElement.scrollTop > 667) {
          this.setState({
            showTop: true
          })
        } else {
          this.setState({
            showTop: false
          })
        }
      } else {
        if (e.target.body.scrollTop > 667) {
          this.setState({
            showTop: true
          })
        } else {
          this.setState({
            showTop: false
          })
        }
      }
    }
  }
  // 传递结论
  handleConclusion = (conclusion) => {
    this.setState({
      conclusion
    })
  }

  setCurLinkMan = () => {
    const { linkManId } = getParams()
    const { linkMans } = this.state
    if (linkMans[1].id == linkManId) {
      this.setState({
        curLinkMan: linkMans[1]
      })
    } else {
      this.setState({
        curLinkMan: linkMans[0]
      })
    }
  }
  setNoScroll = (bool) => {
    this.setState({
      noScroll: bool
    })
  }
  goIndex = () => {

    const params = {
      sample_linkman:'小安',
      relation_id: '1',
      report_code:'HPV',
      page_code:'sample_report_hpv_detail'
    }
    backToSampleReportListGoto(params)
    window.location.href = window.location.origin + `/mkt/reportExample?linkManId=2286223641214976`
  }
  render() {
    const { hpvReport: { data:{ noscroll } } } = this.props
    const { tabIndex, scienceList, resultList,
      userName, userId, headImgType, haveSubmit,
      isAndall, showTop, loading, isAnswer, QRlist, productId, isLatestReport, linkMans } = this.state
    const { isPreviewFlag } = getParams()
    return (
      <Page title='报告详情'>
        <Header title={`「小安」的HPV报告`}
          shareInfo={{
            shareUrl: window.location.href,
            title: '「小安」的HPV报告',
            subTitle: '用于宫颈癌风险筛查',
            headImg: 'https://images.dnatime.com/shop/product/ac5d2c01-1e02-4c25-b794-b06ec81f4ad8.JPG'
          }}
          page_code='sample_report_hpv_detail'
          code='HPV'
          noScroll={this.setNoScroll}
          curLinkMan={this.curLinkMan}
          linkMans={linkMans}
          setCurLinkMan={this.setCurLinkMan} />
        <div id='top'>
          {
            this.state.previewPoint ? <PointsToast value={this.state.previewPoint} /> : ''
          }
          <div className={styles.tabs}>
            <div onClick={() => this.reportDetailChangeIndex(0)}>
              <div className={styles.title}
                style={!tabIndex ? { color: '#6567E5' } : null}>检测结果</div>
              <div className={!tabIndex ? styles.underline : null} />
            </div>
            <div onClick={() => this.reportDetailChangeIndex(1)}>
              <div className={styles.title}
                style={tabIndex ? { color: '#6567E5' } : null}>专家建议</div>
              <div className={tabIndex ? styles.underline : null} />
            </div>
          </div>
          {
            loading ? <HpvCardLoader /> : (
              <div className={`${styles.hpvReport} ${noscroll && styles.noscroll}`}>
                {/* <div className={`${styles.hpvReport} ${noscroll && styles.noscroll}`}> */}
                <div style={!tabIndex ? null : { display: 'none' }}>

                  {
                    resultList.length ? resultList.map((item, index) => {
                      switch (item.moduleType) {
                      case 4511:
                      // 检测结果
                        return <ResultCard key={index} userName={userName} data={item.data} />
                      case 4512:
                      // 分型结果
                        return <PartCard key={index} data={item.data} />
                      case 4513:
                      // 就医建议
                        return <AdviseCard key={index} data={item.data} />
                      case 4514:
                      // 专业测评
                        return <EvaluationCard key={index} data={item.data} />
                      case 4515:
                      // 大家都在问
                        return <QuestionCard key={index} data={item.data} />
                      case 4516:
                      // 定期复查
                        return <ReviewCard key={index} data={item.data} productId={productId} />
                      case 3201:
                      // 科学文献
                        return <BookCard key={index} data={item.data} />
                      }
                    }) : ''
                  }
                  <div className={styles.whiteBlock} />
                </div>
                <div style={!tabIndex ? { display: 'none' } : null}>
                  {/* 专家解读 */}
                  {isAnswer !== 999 ? <NoResultCard cepingObj={this.state.cepingObj} />
                    : scienceList.length && scienceList.map((item, index) => {
                      switch (item.moduleType) {
                      case 4517:
                      // 测评结果
                        return <ReadCard key={index} userName={userName} data={item.data} />
                      case 4518:
                      // 专家建议
                        return <YourOnlyCard key={index} data={item.data} isLatestReport={isLatestReport} />
                      case 3201:
                      // 专家建议
                        return <ImmunityCard key={index} data={item.data} />
                      }
                    })
                  }
                  <div className={styles.whiteBlock} />
                </div>
              </div>)}
          {
            !isAndall && <div className={styles.top}
              onClick={this.backTop}
              style={showTop ? null : { display: 'none' }}>
              <img src={images.top} alt='' />
            </div>
          }
          {
            !isAndall && QRlist && <ShareBanner QRlist={QRlist} />
          }
          <div className={styles.egFloat2}
               onClick={() => this.goIndex()}>
            <img src={msg2} alt="" />
            <p>更多报告</p>
          </div>
        </div>
      </Page>
    )
  }
}

export default hpvDetail
