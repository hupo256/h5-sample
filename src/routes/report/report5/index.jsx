import React from 'react'
import Page from '@src/components/page'
import { API, fun, ua } from '@src/common/app'
import top from '@static/report4_2/top.png'
// import images from '@src/common/utils/images'
// const { report4_2 } = images
import { observer, inject } from 'mobx-react'

import andall from '@src/common/utils/andall-sdk'
import {
  reportDetailResultPageView,
  reportScenarioPageView,
  shareLinkGoto
} from './BuriedPoint'
import { CardLoader } from '@src/components/contentLoader'
import ResultCard from './components/resultCard.jsx'
import RichText from './components/richText.jsx'
import CrowdCard from './components/crowdCard.jsx'
import Influence from './components/influenceCard.jsx'
import Evaluation from './components/evaluationCard'
import Commodity from './components/commodityCard.jsx'
import Article from './components/articleCard'
import Consult from './components/consultCard.jsx'
import FeedBack from './components/feedbackCard'
import UlCard from './components/ulCard'
import Drawer from './components/drawerCard'
import Rebate from './components/rebateCard.jsx'
import Banner from './components/bannerCard.jsx'
import Unlock from './components/unlockCard'
import Collect from './components/collectCard'
import ShareBanner from '../reportShare/components/shareBanner/index.jsx'
import LoginCover from '@src/components/acitvityMould/loginCover'

import styles from './style.scss'
import PointsToast from '@src/components/pointsToast'
import publicApi from '@src/common/api/publicApi'
import userApi from '@src/common/api/userApi'
const { getParams } = fun
@inject('user')
@observer
class report extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    isAndall: ua.isAndall(),
    scienceList: [],
    resultList: [],
    tabIndex: 0,
    userName: '',
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
    isShare:false,
    hasAnswer: false,
  }

  componentDidMount() {
    const { isPreviewFlag, code, expirationDateTime, id, priviewTraitConclusion, traitId } = getParams()
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
      if (!localStorage.getItem('token') && ua.isAndall()) {
        andall.invoke('token', {}, res => {
          res.result.token && localStorage.setItem('token', res.result.token)
          setTimeout(() => {
            this.upgradeReportDetail()
            this.versionCtrl()
            this.getUserInfor()
            this.listenTab()
            this.listenScroll()
          }, 300)
        })
      } else {
        this.upgradeReportDetail()
        this.versionCtrl()
        this.getUserInfor()
        this.listenTab()
        this.listenScroll()
      }
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
  upgradeReportDetail = () => {
    let obj = getParams()
    if (obj.shareType) {
      this.setState({
        tabIndex: +obj.shareType === 20 ? 1 : 0,
        isShare:true
      })
    }
    if (ua.isWechat() && obj.hasOwnProperty('state')) {
      const curUrl = window.location.href
      const code = curUrl.substring(curUrl.indexOf('code=') + 5, curUrl.indexOf('&linkManId'))
      obj.code = code
    }
    API.upgradeReportDetail({
      ...obj,
      noloading: 1
    }).then(res => {
      if (res.code === 100001) {
        if (!this.isReq && ua.isWechat()) {
          this.upgradeReportDetail()
          this.isReq = true
        }
      } else {
        this.pageInit(res)
      }
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
    const { isAndall } = this.state
    let saveModalName = ''
    // console.log(res)
    if (res.data) {
      this.setState({
        ...res.data,
        QRlist: res.data.reportQrcodeConfigReqList,
        userName: isAndall ? res.data.userName : this.desensitization(res.data.userName, 0, -1),
        loading: false,
        traitName:res.data.traitName
      }, () => {
        this.setState({ previewPoint:res.data.pointStatusTipResp ? res.data.pointStatusTipResp.point : '' })
      })
      let tempObj = { moduleType: '1' }
      res.data.conclusionList.forEach(element => {
        if (+element.moduleType === 2301) {
          tempObj.firstArea = element.data
          const tempArr = element.data.conclusion && element.data.conclusion.split('的')
          localStorage.setItem('traitName', tempArr[1] ? tempArr[1] : tempArr[0])
          saveModalName = tempArr[0].split('」')[0] + tempArr[1].split('|')[0] + tempArr[1].split('|')[1]
        } else if (+element.moduleType === 2401) {
          tempObj.secondArea = element.data
        } else if (+element.moduleType === 3001) {
          tempObj.thirdArea = element.data
        }
      })
      const resultList = [tempObj, ...res.data.conclusionList]

      this.setState({ resultList, loading: false, saveModalName })

      console.log(this.state.resultList)

      this.state.resultList.map(item => {
        if (item.moduleType == 1 && item.thirdArea) {
          this.setState({
            hasAnswer:!!item.thirdArea.likeFlag
          })
        }
      })

      const obj = getParams()
      const name = localStorage.getItem('traitName')
      // 结果页埋点
      reportDetailResultPageView({
        trait_code: obj.traitId,
        trait_name: name,
        report_code: obj.code,
        report_type: obj.reportType,
        sample_linkmanid: obj.linkManId,
        sample_barcode: obj.barCode,
      })
      !isAndall && shareLinkGoto({
        page_code: 'report_detail_result_page',
        sample_linkmanid: obj.linkManId,
        trait_code: obj.traitId,
        trait_name: res.data.posetInfo ? res.data.posetInfo.conclusion : '',
        report_code: obj.code,
        report_name: res.data.posetInfo ? res.data.posetInfo.productName : ''
      })
    }
    if (isAndall) {
      andall.invoke('setReportDetailData', { res }, res => {
        console.log(res)
      })
    }
  }
  // 脱敏方法
  desensitization = (str, beginLen, endLen) => {
    const len = str.length == 1 ? 2 : str.length
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
      const { tabIndex } = this.state
      this.setState({
        tabIndex: index
      })
      if (tabIndex !== index) {
        document.documentElement.scrollTop
          ? document.documentElement.scrollTop = 0
          : document.body.scrollTop = 0
      }
      const obj = getParams()
      const name = localStorage.getItem('traitName')
      // 结果页埋点
      if (index == 0) {
        reportDetailResultPageView({
          trait_code: obj.traitId,
          trait_name: name,
          report_code: obj.code,
          report_type: obj.reportType,
          sample_linkmanid: obj.linkManId,
          sample_barcode: obj.barCode,
        })
      }
      // 科学页埋点
      if (index == 1) {
        reportScenarioPageView({
          trait_code: obj.traitId,
          trait_name: name,
          report_code: obj.code,
          report_type: obj.reportType,
          sample_linkmanid: obj.linkManId,
          sample_barcode: obj.barCode,
        })
      }
    })
  }
  // 原生导航条切换
  reportDetailChangeIndex = index => {
    const obj = getParams()
    const { posetInfo, isAndall } = this.state
    this.setState({
      tabIndex: index
    })
    if (index == 0) {
      !isAndall && shareLinkGoto({
        page_code: 'report_detail_result_page',
        sample_linkmanid: obj.linkManId,
        trait_code: obj.traitId,
        trait_name: posetInfo.conclusion,
        report_code: obj.code,
        report_name: posetInfo.productName
      })
    } else {
      !isAndall && shareLinkGoto({
        page_code: 'report_detail_science_page',
        sample_linkmanid: obj.linkManId,
        trait_code: obj.traitId,
        trait_name: posetInfo.conclusion,
        report_code: obj.code,
        report_name: posetInfo.productName
      })
    }
  }
  // 提交反馈控制
  handleSubmit = () => {
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

  changePadding=() => {
    this.setState({
      hasAnswer: true
    })
  }

  render() {
    const { tabIndex, scienceList, resultList,
      userName, userId, headImgType, haveSubmit,traitName,
      isAndall, showTop, loading, hideUnlock, conclusion, QRlist,
      loginVisible, isX, showModal, thanksVisible, saveModalName, isShare, hasAnswer } = this.state
    const { isPreviewFlag } = getParams()
    return (
      <Page title='报告详情'>
        <div id='top'>
          {/* tab */}
          {
            !isAndall && <div className={styles.tabs}>
              <div onClick={() => this.reportDetailChangeIndex(0)}>
                <div className={styles.title}
                  style={!tabIndex ? { color: '#6567E5' } : null}>检测结果</div>
                <div className={!tabIndex ? styles.underline : null} />
              </div>
              <div onClick={() => this.reportDetailChangeIndex(1)}>
                <div className={styles.title}
                  style={tabIndex ? { color: '#6567E5' } : null}>科学细节</div>
                <div className={tabIndex ? styles.underline : null} />
              </div>
            </div>
          }
          {/* 页面 */}
          {loading ? <CardLoader /> : (
            <div className={!hasAnswer && +getParams().isAuthority !== 1 ? styles.innerPage : styles.outerPage}>
              <div style={!tabIndex ? null : { display: 'none' }}>
                {/* <div>页面一{tabIndex}</div> */}
                {
                  !!resultList[0] && resultList.map((item, index) => {
                    switch (item.moduleType) {
                    case '1':
                      // 结果结论
                      return <ResultCard
                        key={index}
                        first={item.firstArea}
                        second={item.secondArea}
                        third={item.thirdArea}
                        username={userName}
                        userId={userId}
                        saveModalName={saveModalName}
                        headUrl={headImgType}
                        showTop={showTop}
                        isShare={isShare}
                        traitName={traitName}
                        submitConclusion={this.handleConclusion}
                        method={this.changePadding}
                      />
                    case 2500:
                      // 人群分布
                      return !tabIndex && <CrowdCard key={'echart1'} data={item.data} index={'echart1'} />
                    case 3801:
                      // 影响比例
                      return <Influence key={index} data={item.data} isAuthority={item.isAuthority}
                        username={userName} />
                    case 2501:
                      // 专家信息
                      return <RichText key={index} data={item.data} />
                    case 2201:
                      // 商品推荐
                      return <Commodity key={index} data={item.data} />
                    case 2208:
                      // 渠道商品推荐
                      return <Commodity key={index} data={item.data} />
                    case 2207:
                      // 推荐文章
                      return <Article key={index} data={item.data} />
                    case 2601:
                      // 咨询专家
                      return <Consult key={index} data={item.data} />
                    case 3701:
                      // 富文本1
                      return <RichText key={index} data={item.data} isAuthority={item.isAuthority}
                        username={userName} />
                    case 3702:
                      // 富文本2
                      return <RichText key={index} data={item.data} isAuthority={item.isAuthority}
                        username={userName} />
                    case 3703:
                      // 渠道富文本
                      return <RichText key={index} data={item.data} isAuthority={item.isAuthority}
                        username={userName} />
                    case 4203:
                      // 反馈
                      return <FeedBack
                        key={index}
                        data={item.data}
                        userId={userId}
                        haveSubmit={haveSubmit}
                        handleSubmit={this.handleSubmit} />
                    case 4101:
                      // 问卷
                      return <Evaluation key={index} data={item.data} isAuthority={item.isAuthority}
                        username={userName}
                        conclusion={conclusion} />
                    case 3301:
                      // 反卡
                      return <Rebate key={index} data={item.data} />
                    case 3302:
                      // 提现
                      return <Rebate key={index} data={item.data} />
                    case 4201:
                      // 图表柱状
                      return <RichText key={index} data={item.data} />
                    case 1101:
                      // banner1
                      return <Banner key={index} data={item.dataList} />
                    case 1102:
                      // banner2
                      return <Banner key={index} data={item.dataList} />
                    case 1404:
                      // 表型收集
                      return isAndall && <Collect key={index} data={item.data} username={userName} />
                    case 1105:
                      // 渠道banner
                      return <Banner key={index} data={item.dataList} />
                    case 4303:
                      // 推荐解锁
                      return !hideUnlock && <Unlock key={index} data={item.data} />
                    default:
                      return null
                    }
                  })
                }
                {/* 检测结果 */}
                <div className={styles.whiteBlock} />
              </div>
              <div style={!tabIndex ? { display: 'none' } : null}>
                {/* <div>页面二{tabIndex}</div> */}
                {/* 科学细节 */}
                {
                  scienceList[0] && scienceList.map((item, index) => {
                    switch (item.moduleType) {
                    case 2500:
                      // 人群分布
                      return tabIndex && <CrowdCard key={'echart2'} data={item.data} index={'echart2'} />
                    case 3801:
                      // 影响比例
                      return <Influence key={index} data={item.data} isAuthority={item.isAuthority}
                        username={userName} />
                    case 2501:
                      // 专家信息
                      return <RichText key={index} data={item.data} />
                    case 2201:
                      // 商品推荐
                      return <Commodity key={index} data={item.data} />
                    case 2207:
                      // 推荐文章
                      return <Article key={index} data={item.data} />
                    case 2601:
                      // 咨询专家
                      return <Consult key={index} data={item.data} />
                    case 3701:
                      // 富文本1
                      return <RichText key={index} data={item.data} isAuthority={item.isAuthority}
                        username={userName} />
                    case 3702:
                      // 富文本2
                      return <RichText key={index} data={item.data} isAuthority={item.isAuthority}
                        username={userName} />
                    case 4203:
                      // 反馈
                      return <FeedBack key={index} data={item.data} userId={userId} haveSubmit={haveSubmit} />
                    case 4101:
                      // 问卷
                      return <Evaluation key={index} data={item.data} isAuthority={item.isAuthority}
                        username={userName} />
                    case 3301:
                      // 反卡
                      return <Rebate key={index} data={item.data} />
                    case 3302:
                      // 提现
                      return <Rebate key={index} data={item.data} />
                    case 4201:
                      // 图表柱状
                      return <RichText key={index} data={item.data} />
                    case 1101:
                      // banner1
                      return <Banner key={index} data={item.dataList} />
                    case 1102:
                      // banner2
                      return <Banner key={index} data={item.dataList} />
                    case 2801:
                      // 科学文献
                      return <UlCard key={index} data={item.data} />
                    case 4204:
                      // 更新日志
                      return <UlCard key={index} data={item.data} />
                    case 2901:
                      // 基因位点
                      return <Drawer key={index} data={item.data} />
                    case 3501:
                      // 检测限制
                      return <UlCard key={index} data={item.data} />

                    default:
                      return null
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
              <img src={top} alt='' />
            </div>
          }
          {
            this.state.previewPoint ? <PointsToast value={this.state.previewPoint} /> : ''
          }
          {
            !isAndall && QRlist && <ShareBanner QRlist={QRlist} />
          }
          {/* 手机登录弹窗 */}
          <LoginCover visible={loginVisible} setVisible={this.toggleMask}
            changeMobile={this.changeMobile} setLoginFlag={this.setLoginFlag}
            showClose={false} />
        </div>
      </Page>
    )
  }
}

export default report
