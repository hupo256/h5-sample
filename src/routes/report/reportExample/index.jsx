import React, {Component, Fragment} from 'react'
import Page from '@src/components/page'
import LoginCover from '@src/components/acitvityMould/loginCover'

import styles from './reportExample.scss'
import {observer, inject} from 'mobx-react'
import {API, fun, ua} from '@src/common/app'

const {getParams} = fun
import icon from '@static/Qicon.png'
import closeMask from '@static/nInM/closeMask.png'
import green from '@static/reportEg/green.png'
import red from '@static/reportEg/red.png'
import hpv from '@static/reportEg/hpv.jpg'
import anLogo from '@static/reportEg/anLogo.jpg'
import {
  sampleReportListPageView,
  sampleReportUnlockPopWinView,
  pageModuleClick,
  sampleReportPageButtonGoto,
  reportExampleGoto
} from './BuriedPoint'

import Header from './components/header'

@inject('springFission')
@observer
class Example extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataInfo: [],
      loginFlag: false,
      second: 5,
      showUnlock: false,
      showClose: false,
      mobile: '',
      loginVisible: false,
      noScroll: false,
      isBangs: false,
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
      },
      bottomInfo: {
        "3": {
          "code": "ACC",
          'url': `${window.location.origin}/mkt/unlockLand?activeCode=SPTS_BBJS299_SLBG_0402&viewType=SLBG`,
          "traidNum": "全项",
          "title": "如何科学育儿快人一步？",
          "content": "儿童基因权威检测",
          "desc": "找出宝贝的先天优势，刻不容缓！",
          "button": "立即检测"
        },
        "1": {
          "code": "ACC",
          'url': `${window.location.origin}/mkt/unlockLand?activeCode=SPTS_Women_299_SLBG_0421&viewType=SLBG`,
          "traidNum": "全项",
          "title": "测一测我的风险有哪些",
          "content": "基因检测 ",
          "desc": " 疾病、运动瘦身、免疫力、营养睡眠等",
          "button": "立即检测"
        }
      }
    }
  }

  timer = null

  componentDidMount() {
    this.getUserReports()
    this.setCurLinkMan()
    this.judgeIsIPhone()
    this.handleBangsByHistory()
    const {linkManId} = getParams()
    const {springFission: {data: {example}, setExample}} = this.props
    const {curLinkMan} = this.state
    if (example['AAC'] == 0) {
      this.setState({
        showUnlock: true
      })
      this.setNoScroll(true)
      sampleReportUnlockPopWinView({
        sample_linkman: curLinkMan.userName,
        relation_id: curLinkMan.relationId,
        report_code: 'AAC',
        page_code: 'sample_report_list'
      })
      this.timer = setInterval(() => {
        const {second} = this.state
        if (second > 1) {
          this.setState({
            second: second - 1
          })
        } else {
          clearInterval(this.timer)
          this.setState({
            showClose: true
          })
        }
      }, 1000);
      let tempObj = example
      tempObj['AAC'] += 1
      setExample(tempObj)
    } else if (!example['AAC']) {
      let tempObj = example
      tempObj['AAC'] = 0
      setExample(tempObj)
    } else {
      let tempObj = example
      tempObj['AAC'] += 1
      setExample(tempObj)
    }
    // console.log(document.documentElement.scrollTop);
    document.documentElement.scrollTop = 0
  }

  // 获取报告列表
  getUserReports = () => {
    const {linkManId} = getParams()
    const {curLinkMan} = this.state
    sampleReportListPageView({
      sample_linkman: curLinkMan.userName,
      relation_id: curLinkMan.relationId
    })
    API.getUserReports({
      linkManId: linkManId == 2286223641214976 ? 2286223641214976 : 1347
    }).then(res => {
      this.setState({
        dataInfo: res.data.dataInfo
      })
    })
  }
  // 设置当前绑定人
  setCurLinkMan = () => {
    const {linkManId} = getParams()
    const {linkMans} = this.state
    this.handleBangsByHistory()
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
  // 转跳报告首页
  checkReportIndex = el => {
    const {history} = this.props
    const {loginFlag,curLinkMan} = this.state
    if (loginFlag) {
      this.toLogin()
    } else {
      history.push(`/reportExample/list?barCode=${el.barCode}&code=${el.code}&reportType=${el.reportType}&linkManId=${curLinkMan.id}`)
      pageModuleClick({
        page_code: 'sample_report_list',
        module_code: '1301',
        module_content_type: el.code
      })
    }
  }
  goHpvDetail = () => {
    const {history} = this.props
    const {loginFlag} = this.state
    if (loginFlag) {
      this.toLogin()
    } else {
      const testUrl = `${origin}/mkt/reportExample/hpvDetail?barCode=AA2005D5C059D2&shareToken=655e0cbf5a2acd2384dbc274732287de959d4771506026920c1d28d188cb61feb5134fed6fc37fae20f83655e1f378b9e81348c3fe0de30c3769f1bb678f5849657d822a99f5abbb`
      const preUrl = `${origin}/mkt/reportExample/hpvDetail?barCode=AA2005D5C059D2&shareToken=655e0cbf5a2acd2384dbc274732287de959d4771506026920c1d28d188cb61feb5134fed6fc37fae20f83655e1f378b9e81348c3fe0de30c3769f1bb678f5849657d822a99f5abbb`
      location.href = (location.host.indexOf('wechatshop') === 0) ? preUrl : testUrl
      reportExampleGoto({
        viewtype: 'sample_report_hpv_goto',
      })
    }
  }
  goAnDetail = () => {
    const {history} = this.props
    const {loginFlag} = this.state
    if (loginFlag) {
      this.toLogin()
    } else {
      const testUrl = `${origin}/mkt/reportExample/anDetail?barCode=AA19051ADD9793&shareToken=655e0cbf5a2acd2384dbc274732287de959d4771506026920c1d28d188cb61feb5134fed6fc37faea3d6819ac20cfd70c5551926f2003328&from=groupmessage`
      const preUrl = `${origin}/mkt/reportExample/anDetail?barCode=AA19051ADD9793&shareToken=655e0cbf5a2acd2384dbc274732287de959d4771506026920c1d28d188cb61feb5134fed6fc37faea3d6819ac20cfd70c5551926f2003328&from=groupmessage`
      location.href = (location.host.indexOf('wechatshop') === 0) ? preUrl : testUrl
      reportExampleGoto({
        viewtype: 'sample_report_an_goto',
      })
    }
  }
  // 转跳红亮点页
  checkHighlight = el => {
    const {history} = this.props
    const {loginFlag} = this.state
    if (loginFlag) {
      this.toLogin()
    } else {
      history.push(`/reportExample/highLight?type=${el.type}&linkManId=${el.linkManId}&productCategory=${el.productCategory}&status=${el.status}&id=${el.id || 0}`)
      pageModuleClick({
        page_code: 'sample_report_list',
        module_code: '1201',
        module_content_type: el.type == "H" ? 'good_trait' : 'red_trait'
      })
    }
  }
  // 转跳解锁落地页
  toUnlock = url => {
    const {loginFlag, curLinkMan} = this.state
    if (loginFlag) {
      this.toLogin()
    } else {
      if (ua.isAndall()) {
        location.href = `andall://andall.com/inner_webview?url=${url}`
      } else {
        location.href = url
      }
    }
    sampleReportPageButtonGoto({
      Btn_name: 'buy',
      page_code: 'sample_report_list',
      sample_linkman: curLinkMan.userName,
      relation_id: curLinkMan.relationId,
      report_code: 'AAC'
    })
  }
  // 设置登陆标示
  setLoginFlag = bool => {
    this.setState({
      loginFlag: bool
    })
  }
  // 转跳登陆
  toLogin = () => {
    // const { linkManId } = getParams()
    // if (ua.isAndall()) {
    //     andall.invoke('login', {}, (res) => {
    //         window.localStorage.setItem('token', res.result.token)
    //         window.location.reload()
    //     })
    // } else {
    //     const { origin, } = location
    //     window.location.href = `${origin}/login?url=/mkt/reportExample/?linkManId=${linkManId || 2809923446588416}`
    // }
    this.setState({
      loginVisible: true,
    })
    this.setNoScroll(true)
  }

  modalToggle = (name) => {
    const bool = this.state[name]
    this.setState({
      [name]: !bool
    })
    this.setNoScroll(!bool)
  }
  toggleMask = (name) => {
    const bool = this.state[name]
    this.setState({
      [name]: !bool
    })
    this.setNoScroll(!bool)
  }
  changeMobile = (num) => {
    this.setState({
      mobile: num
    })
  }
  setNoScroll = (bool) => {
    this.setState({
      noScroll: bool
    })
  }
  judgeIsIPhone = () => {
    const userA = window.navigator.userAgent
    const isIPhone = /iPhone/.exec(userA)
    // console.log(window.screen);
    if (isIPhone) {
      if ((window.screen.width == 414 && window.screen.height == 896) || (window.screen.width == 375 && window.screen.height == 812)) {
        this.setState({
          isBangs: true
        })
      }
    }
  }
  handleBangsByHistory = () => {
    if (history.length > 1) {
      this.setState({
        isBangs: false
      })
    }
  }

  render() {
    const {
      dataInfo, second, showUnlock, showClose,
      loginVisible, noScroll, isBangs, bottomInfo,
      curLinkMan, linkMans
    } = this.state
    return (
      <Page title={'小安示例报告'} class={styles.page}>
        <div style={noScroll ? {overflow: '', height: '100vh'} : {}}>
          <Header {...this.props}
            getReports={this.getUserReports}
            setLoginFlag={this.setLoginFlag}
            page_code={'sample_report_list'}
            code={'AAC'}
            noScroll={this.setNoScroll}
            curLinkMan={curLinkMan}
            linkMans={linkMans}
            setCurLinkMan={this.setCurLinkMan} />
          {
            dataInfo && dataInfo.map((item, index) => {
              switch (item.moduleType) {
              // 红亮点
              case 1201:
                return (
                  <div className={styles.point} key={index}>
                    {
                      item.dataList.map((item, index) => {
                        return (
                          <div className={item.type == 'H' ? styles.highlight : styles.redlight} key={index} onClick={() => this.checkHighlight(item)}>
                            <div style={{backgroundImage: `url(${item.type == 'H' ? green : red})`}}>
                              <p>{item.name}</p>
                              <p>{item.num}</p>
                              <p>{item.describe}</p>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                )
                // 报告列表
              case 1304:
                return (
                  <div key={index}>
                    <div className={styles.report}
                         key={index} style={{ display:`${curLinkMan.relationId !== '3' ? 'flex' : 'none'}`}}>
                      <img src="http://dnatime-prod.oss-cn-hangzhou.aliyuncs.com/misc/hpv.png" alt="" />
                      <div>
                        <p>安我HPV分型检测</p>
                        <div className={styles.describe}>用于宫颈癌风险筛查</div>
                        <div className={styles.btn}
                             onClick={() => this.goHpvDetail()}>查看示例报告</div>
                      </div>
                    </div>
                    <div className={styles.report}
                         key={index} style={{ display:`${curLinkMan.relationId !== '1' ? 'flex' : 'none'}`}}>
                      <img src="http://dnatime-prod.oss-cn-hangzhou.aliyuncs.com/misc/anxiaoruan.png" alt="" />
                      <div>
                        <p>安小软肠道菌群检测</p>
                        <div className={styles.describe}>宝宝的「黄金软便」养成计划</div>
                        <div className={styles.btn}
                             onClick={() => this.goAnDetail()}>查看示例报告</div>
                      </div>
                    </div>
                    {
                      item.data.dataList.map((item1, index) => {
                        return(
                          item1.reportList.map((items, index) => {
                            return (
                              <div className={styles.report} key={index}>
                                <img src={items.pictureUrl} alt=""/>
                                <div>
                                  <p>{items.name}</p>
                                  <div className={styles.describe}>{items.describe}</div>
                                  <div className={styles.btn} onClick={() => this.checkReportIndex(items)}>查看示例报告
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )
                      })
                    }

                  </div>
                )
              default:
                return null;
              }
            })
          }
          <div className={isBangs ? styles.homeBottom : styles.homeBottomIsBang}>
            <div
              onClick={() => this.toUnlock(bottomInfo[curLinkMan.relationId].url)}>{bottomInfo[curLinkMan.relationId].title}</div>
          </div>
          {
            showUnlock && <section className={styles.unlockBox}>
              <div>
                <div>
                  <div><img src={icon} alt=""/>{bottomInfo[curLinkMan.relationId].title}</div>
                  {
                    showClose ? <div onClick={() => this.modalToggle('showUnlock')}>关闭弹框</div>
                      : <div onClick={() => this.modalToggle('showUnlock')}>关闭弹框 {second}s</div>
                  }
                </div>
                <span></span>
                <p><span>{bottomInfo[curLinkMan.relationId].traidNum}</span>{bottomInfo[curLinkMan.relationId].content}
                </p>
                <p>{bottomInfo[curLinkMan.relationId].desc}</p>
                <div
                  onClick={() => this.toUnlock(bottomInfo[curLinkMan.relationId].url)}>{bottomInfo[curLinkMan.relationId].button}</div>
              </div>
            </section>
          }
          <div className={styles.block}></div>
          {/* 手机登录弹窗 */}
          <LoginCover visible={loginVisible} setVisible={this.toggleMask} changeMobile={this.changeMobile} setLoginFlag={this.setLoginFlag}/>
        </div>
      </Page>
    )
  }
}

export default Example
