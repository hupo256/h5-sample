import React, {Component, Fragment} from 'react'
import Page from '@src/components/page'
import styles from './reportExample.scss'

import Header from './components/header'
import Thought from './components/thought'
import {API, fun, ua} from '@src/common/app'
import images from '../report4_2/images'
import andall from '@src/common/utils/andall-sdk'
import {
  sampleReportDetailResultPageView,
  sampleReportDetailSciencePageView,
} from './BuriedPoint'
import {CardLoader} from '@src/components/contentLoader'
import ResultCard from '../report4_2/components/resultCard.jsx'
import RichText from '../report4_2/components/richText.jsx'
import CrowdCard from '../report4_2/components/crowdCard.jsx'
import Influence from '../report4_2/components/influenceCard.jsx'
import Evaluation from '../report4_2/components/evaluationCard'
import Commodity from '../report4_2/components/commodityCard.jsx'
import Article from '../report4_2/components/articleCard'
import Consult from '../report4_2/components/consultCard.jsx'
import FeedBack from '../report4_2/components/feedbackCard'
import UlCard from '../report4_2/components/ulCard'
import Drawer from '../report4_2/components/drawerCard'
import Rebate from '../report4_2/components/rebateCard.jsx'
import Banner from '../report4_2/components/bannerCard.jsx'
import Unlock from '../report4_2/components/unlockCard'

const {getParams} = fun
import {observer, inject} from 'mobx-react'

@inject('springFission')
@observer
export default class ReportList extends Component {
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
    shareInfo: {title: ''},
    code: null,
    noScroll: false,
    linkMans: [{
      id: 1347,
      relationId: "3",
      userName: "小小安",
      sex: "male",
      status: 0,
    }, {
      id: 2286223641214976,
      relationId: "1",
      userName: "小安",
      sex: "female",
      status: 0,
    }],
    curLinkMan: {
      id: 1347,
      relationId: "3",
      userName: "小小安",
      sex: "male",
      status: 0,
    }
  }

  componentDidMount() {
    console.log(getParams())
    this.upgradeReportDetail()
    this.versionCtrl()
    this.getUserInfor()
    this.listenTab()
    this.listenScroll()
    console.log(document.documentElement.scrollTop);
    document.documentElement.scrollTop = 0
  }

  setCurLinkMan = () => {
    const {linkManId} = getParams()
    const {linkMans} = this.state
    if (linkMans[1].id == linkManId) {
      this.setState({
        curLinkMan: linkMans[1],
        userName:'小安'
      })
    } else {
      this.setState({
        curLinkMan: linkMans[0],
        userName:'小小安'
      })
    }
  }
  // 获取页面详情配置
  upgradeReportDetail = () => {
    const obj = getParams()
    if (window.location.href.split('code').length > 2) {
      const codeSource = window.location.href.split('code')
      obj.code = codeSource[1].substring(1,codeSource[1].indexOf('&'))
    }
    if (obj.shareType) {
      this.setState({
        tabIndex: +obj.shareType === 20 ? 1 : 0
      })
    }
    console.log()
    API.reportDetail({
      ...obj,
      nomsg: true
    }).then(res => {
      this.pageInit(res)
    })
    const {code} = obj
    const {springFission: {data: {example}, setExample}} = this.props
    if (example[code] == 'firstEnter') {
      let tempObj = example
      tempObj[code] = 'secondEnter'
      setExample(tempObj)
    }

  }
  // 获取用户信息
  getUserInfor = () => {
    const infoPara = {noloading: 1, nomsg: true}
    ua.isAndall() && Object.assign(infoPara, {clientType: 'app'})
    API.myInfo(infoPara).then(res => {
      console.log(res)
      const {code, data} = res
      if (!code) this.setState({...res.data})
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
    const {isAndall} = this.state
    console.log(res)
    if (res.data) {
      this.setState({...res.data, loading: false})
      let tempObj = {moduleType: '1'}
      res.data.conclusionList.forEach(element => {
        if (+element.moduleType === 2301) {
          tempObj.firstArea = element.data
          const tempArr = element.data.conclusion && element.data.conclusion.split('的')
          localStorage.setItem('traitName', tempArr[1])
        } else if (+element.moduleType === 2401) {
          tempObj.secondArea = element.data
        } else if (+element.moduleType === 3001) {
          tempObj.thirdArea = null
        }
      })
      const resultList = [tempObj, ...res.data.conclusionList]
      // console.log(resultList);
      this.setState({resultList, loading: false, traitName:res.data.traitName})

      const obj = getParams()
      const name = localStorage.getItem('traitName')
      // 结果页埋点
      sampleReportDetailResultPageView({
        trait_code: obj.traitId,
        trait_name: name,
        report_code: obj.code,
        report_type: obj.reportType,
        sample_linkman: res.data.userName,
        relation_id: res.data.userName == "小小安" ? '3' : '1'
      })
    }
    if (isAndall) {
      andall.invoke('setReportDetailData', {res}, res => {
        console.log(res)
      })
    }
  }
  // 监听app原声导航条
  listenTab = () => {
    andall.on('reportDetailChangeIndex', res => {
      const {index} = res
      const {tabIndex, userName} = this.state
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
      // 科学页埋点
      if (index == 0) {
        sampleReportDetailResultPageView({
          trait_code: obj.traitId,
          trait_name: name,
          report_code: obj.code,
          report_type: obj.reportType,
          sample_linkman: userName,
          sample_barcode: userName == "小小安" ? '3' : '1',
        })
      }
      // 结果页埋点
      if (index == 1) {
        sampleReportDetailSciencePageView({
          trait_code: obj.traitId,
          trait_name: name,
          report_code: obj.code,
          report_type: obj.reportType,
          sample_linkman: userName,
          sample_barcode: userName == "小小安" ? '3' : '1',
        })
      }
    })
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
  setNoScroll = (bool) => {
    this.setState({
      noScroll: bool
    })
  }

  render() {
    const {
      tabIndex, scienceList, resultList,
      userName, userId, headImgType, haveSubmit,
      isAndall, showTop, loading, hideUnlock, conclusion,
      shareInfo, code, curLinkMan, linkMans,traitName
    } = this.state
    return (
      <Page title={shareInfo.title} class={styles.page}>
        <div style={{overflow: 'scroll', height: '100vh'}}>
          {shareInfo.image && <Header title={`「${userName}」的${traitName}报告`}
                                shareInfo={{
                                  shareUrl: window.location.href,
                                  title: shareInfo.title,
                                  subTitle: shareInfo.text,
                                  headImg: shareInfo.image
                                }}
                                page_code={tabIndex ? 'sample_report_detail_science_page' : 'sample_report_detail_result_page'}
                                code={code}
                                noScroll={this.setNoScroll}
                                curLinkMan={curLinkMan}
                                linkMans={linkMans}
                                setCurLinkMan={this.setCurLinkMan}/>
          }
          <div id='top'>
            {/* tab */}
            <div className={styles.tabs}>
              <div onClick={() => this.setState({tabIndex: 0})}>
                <div className={styles.title}
                     style={!tabIndex ? {color: '#6567E5'} : null}>检测结果
                </div>
                <div className={!tabIndex ? styles.underline : null}/>
              </div>
              <div onClick={() => this.setState({tabIndex: 1})}>
                <div className={styles.title}
                     style={tabIndex ? {color: '#6567E5'} : null}>科学细节
                </div>
                <div className={tabIndex ? styles.underline : null}/>
              </div>
            </div>
            {/* 页面 */}
            {loading ? <CardLoader/> : (
              <div>
                <div style={!tabIndex ? null : {display: 'none'}}>
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
                            headUrl={headImgType}
                            submitConclusion={this.handleConclusion}/>
                        case 2500:
                          // 人群分布
                          return !tabIndex && <CrowdCard key={'echart1'} data={item.data} index={'echart1'}/>
                        case 3801:
                          // 影响比例
                          return <Influence key={index} data={item.data}
                                            username={userName}/>
                        case 2501:
                          // 专家信息
                          return <RichText key={index} data={item.data}/>
                        case 2201:
                          // 商品推荐
                          return <Commodity key={index} data={item.data}/>
                        case 2207:
                          // 推荐文章
                          return <Article key={index} data={item.data}/>
                        // case 2601:
                        //   // 咨询专家
                        //   return <Consult key={index} data={item.data}/>
                        case 3701:
                          // 富文本1
                          return <RichText key={index} data={item.data}
                                           username={userName}/>
                        case 3702:
                          // 富文本2
                          return <RichText key={index} data={item.data}
                                           username={userName}/>
                        case 4203:
                          // 反馈
                          return <FeedBack
                            key={index}
                            data={item.data}
                            userId={userId}
                            haveSubmit={haveSubmit}
                            handleSubmit={this.handleSubmit}/>
                        // case 4101:
                        //     // 问卷
                        //     return <Evaluation key={index} data={item.data}
                        //         username={userName}
                        //         conclusion={conclusion} />
                        case 3301:
                          // 反卡
                          return <Rebate key={index} data={item.data}/>
                        case 3302:
                          // 提现
                          return <Rebate key={index} data={item.data}/>
                        case 4201:
                          // 图表柱状
                          return <RichText key={index} data={item.data}/>
                        case 1101:
                          // banner1
                          return <Banner key={index} data={item.dataList}/>
                        case 1102:
                          // banner2
                          return <Banner key={index} data={item.dataList}/>
                        // case 4303:
                        //     // 推荐解锁
                        //     return !hideUnlock && <Unlock key={index} data={item.data} />
                        default:
                          return null
                      }
                    })
                  }
                  {/* 检测结果 */}
                  <div className={styles.whiteBlock}/>
                </div>
                <div style={!tabIndex ? {display: 'none'} : null}>
                  {/* <div>页面二{tabIndex}</div> */}
                  {/* 科学细节 */}
                  {
                    scienceList[0] && scienceList.map((item, index) => {
                      switch (item.moduleType) {
                        case 2500:
                          // 人群分布
                          return tabIndex && <CrowdCard key={'echart2'} data={item.data} index={'echart2'}/>
                        case 3801:
                          // 影响比例
                          return <Influence key={index} data={item.data}
                                            username={userName}/>
                        case 2501:
                          // 专家信息
                          return <RichText key={index} data={item.data}/>
                        case 2201:
                          // 商品推荐
                          return <Commodity key={index} data={item.data}/>
                        case 2207:
                          // 推荐文章
                          return <Article key={index} data={item.data}/>
                        case 2601:
                          // 咨询专家
                          return <Consult key={index} data={item.data}/>
                        case 3701:
                          // 富文本1
                          return <RichText key={index} data={item.data}
                                           username={userName}/>
                        case 3702:
                          // 富文本2
                          return <RichText key={index} data={item.data}
                                           username={userName}/>
                        case 4203:
                          // 反馈
                          return <FeedBack key={index} data={item.data} userId={userId} haveSubmit={haveSubmit}/>
                        case 4101:
                          // 问卷
                          return <Evaluation key={index} data={item.data}
                                             username={userName}/>
                        case 3301:
                          // 反卡
                          return <Rebate key={index} data={item.data}/>
                        case 3302:
                          // 提现
                          return <Rebate key={index} data={item.data}/>
                        case 4201:
                          // 图表柱状
                          return <RichText key={index} data={item.data}/>
                        case 1101:
                          // banner1
                          return <Banner key={index} data={item.dataList}/>
                        case 1102:
                          // banner2
                          return <Banner key={index} data={item.dataList}/>
                        case 2801:
                          // 科学文献
                          return <UlCard key={index} data={item.data}/>
                        case 4204:
                          // 更新日志
                          return <UlCard key={index} data={item.data}/>
                        case 2901:
                          // 基因位点
                          return <Drawer key={index} data={item.data}/>
                        case 3501:
                          // 检测限制
                          return <UlCard key={index} data={item.data}/>

                        default:
                          return null
                      }
                    })
                  }
                  <div className={styles.whiteBlock}/>
                </div>
              </div>)}
            {
              !isAndall && <div className={styles.top}
                                onClick={this.backTop}
                                style={showTop ? null : {display: 'none'}}>
                <img src={images.top} alt=''/>
              </div>
            }
          </div>
          {code && <Thought code={code} userName={userName}
                            page_code={tabIndex ? 'sample_report_detail_science_page' : 'sample_report_detail_result_page'}
                            noScroll={this.setNoScroll}/>}
        </div>
      </Page>
    )
  }
}
