import React from 'react'
import Page from '@src/components/page'
import { fun, ua } from '@src/common/app'
import reportApi from '@src/common/api/reportApi'
import images from './components/imagesAn'
import { HpvCardLoader } from '@src/components/contentLoader'
import ResultCard from './components/resultCardAn'
import FloraCard from './components/floraCard'
import DescribeCard from './components/describeCard'
import CardTitle from './components/cardTitle'
import { Carousel } from 'antd-mobile'
import ShowOrHide from './components/showOrHide'
import PointsToast from '@src/components/pointsToast'
import andall from '@src/common/utils/andall-sdk'

import styles from './detailAn'
const { getParams } = fun

class report extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    loading: true,
    isAndall: ua.isAndall(),
    resultList: [],
    linkManId:'',
    userName: '',
    userAge:'',
    userId: '',
    reportCode:'',
    productName:'',
    previewPoint:'', // 浏览报告得积分
    isFixedTop:false,
    _top:0,
    tabs:['菌群改善', '健康风险', '科学细节'],
    activeTab:0,
    slideIndex:0,
    data: ['1', '2', '3'],
    tabOneObj:{},
    tabTwoObj:{},
    tabThreeObj:{},
    couponObj:{},
    haveBtn:'',
    couponVis:false,
    shareInfo:{}
  }

  componentDidMount() {
    this.getNewAnReportsDetail()
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
    window.addEventListener('scroll', this.onWindowScroll)
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onWindowScroll)
  }
  onWindowScroll = () => {
    let h = document.body.scrollTop || document.documentElement.scrollTop
    this.setState({
      isFixedTop:h > +localStorage._top
    })
  }
  getNewAnReportsDetail=() => {
    const { activeTab } = this.state
    reportApi.getIntestinalDetail({
      barCode:getParams().barCode,
      shareToken:getParams().shareToken ? getParams().shareToken : ''
    }).then(res => {
      const { code } = res
      if (!code) {
        this.setState({
          loading:false,
          userId:res.data.userId,
          userName:res.data.userName,
          linkManId:res.data.linkManId,
          reportCode:res.data.code,
          productName:res.data.productName,
          resultList:res.data.dataInfo,
          tabOneObj:res.data.dataInfo.filter(item => item.moduleType === 4503)[0].data,
          tabTwoObj:res.data.dataInfo.filter(item => item.moduleType === 4502)[0].data,
          tabThreeObj:res.data.dataInfo.filter(item => item.moduleType === 4520)[0].data,
          couponObj:res.data.dataInfo.filter(item => item.moduleType === 4508).length ? res.data.dataInfo.filter(item => item.moduleType === 4508)[0].data : {},
          shareInfo:res.data.shareInfo
        }, () => {
          document.body.scrollIntoView()
          localStorage.setItem('_top', document.getElementById('tabs') ? document.getElementById('tabs').offsetTop : 0)
        })
      }
    })
  }

  detectionDetail=() => {
    this.setState({ isFixedTop:false })
    let url = getParams().shareToken
      ? window.location.origin + '/mkt/anReports/detectionDetail?barCode=' + getParams().barCode + '&shareToken=' + getParams().shareToken
      : window.location.origin + '/mkt/anReports/detectionDetail?barCode=' + getParams().barCode
    location.href = ua.isAndall() ? `andall://andall.com/inner_webview?url=${url}` : url
  }
  goKeyDetail=() => {
    let url = window.location.origin + '/mkt/anReports/keyDetail'
    location.href = ua.isAndall() ? `andall://andall.com/inner_webview?url=${url}` : url
  }
  changeTab=(index) => {
    let { tabTwoObj, isFixedTop } = this.state
    this.setState({ activeTab:index }, () => {
      if (isFixedTop) {
        window.scrollTo(0, +localStorage._top)
      }
      if (index === 1) {
        tabTwoObj.riskItems.map((item, index) => {
          document.getElementById(`range${index + 1}`).style.width = item.value * 1.5 + 'px'
        })
      }
    })
  }
  receive=(item) => {
    const { userId, couponObj } = this.state
    if (item.isGet === 1 || !ua.isAndall()) return
    let params = {
      userId,
      couponId:item.couponId
    }
    reportApi.userRreceiveCoupon(params).then(res => {
      const { code } = res
      if (!code) {
        couponObj.isGet = 1
        this.setState({
          couponVis:true
        })
      }
    })
  }
  toBuy=() => {
    let url = window.location.origin + '/mkt/markting/land-page'
    location.href = `andall://andall.com/inner_webview?url=${url}`
  }
  closeModal=() => {
    this.setState({ couponVis: false })
  }
  shareBtn=() => {
    const { shareInfo } = this.state
    if (ua.isAndall()) {
      setTimeout(() => {
        andall.invoke('share', {
          type: 'link',
          title: shareInfo.title,
          text:shareInfo.text ? shareInfo.text : '',
          url: shareInfo.url,
          thumbImage: shareInfo.thumbImage,
          image:shareInfo.image,
        })
      }, 100)
    }
  }
  goProduct=(title, url) => {
    if (!ua.isAndall()) return
    location.href = `andall://andall.com/inner_webview?url=${url}`
  }
  render() {
    const { resultList, userName, loading, isFixedTop, tabs, activeTab, tabOneObj, tabTwoObj, tabThreeObj, couponObj, couponVis } = this.state
    return (
      <Page title='安小软肠道菌群检测'>
        <div id='top'>
          {this.state.previewPoint ? <PointsToast value={this.state.previewPoint} /> : ''}
          {
            loading ? <HpvCardLoader /> : (
              <div className={`${styles.newAnReportDetail}`}>
                {
                  ua.isAndall() && resultList.length
                    ? <div className={styles.shareBtn} onClick={this.shareBtn} >
                      <img src={images.share} />
                    </div>
                    : ''
                }
                <div>
                  {
                    resultList.length ? resultList.map((item, index) => {
                      switch (item.moduleType) {
                      case 4519:
                        return <ResultCard key={index} userName={userName} data={item.data} />
                      case 4504:
                        return <FloraCard key={index} title={'检测菌群'} data={item.data} detectionDetail={this.detectionDetail} />
                      case 4501:
                        return <DescribeCard key={index} title={'检测结果及问卷综合分析'} data={item.data} />
                      }
                    }) : ''
                  }
                  {
                    resultList.length
                      ? <div className={styles.tabCard}>
                        <div className={`${styles.tabs} ${isFixedTop ? styles.fixTop : ''}`} id='tabs'>
                          <div className={`${!isFixedTop ? styles.whiteBlock2 : ''}`} />
                          <div className={styles.thisTab}>
                            {
                              tabs.map((item, index) => (
                                <span key={index} className={`${index === activeTab ? styles.activeTab : ''}`} onClick={() => { this.changeTab(index) }}>
                                  {item}
                                </span>
                              ))
                            }
                          </div>
                          <div className={`${!isFixedTop ? styles.whiteBlock2 : ''}`} />
                        </div>
                        <div className={`${styles.tabOne} ${isFixedTop ? styles.padding80 : ''}`}>
                          {
                            activeTab !== 2
                              ? <div className={styles.desc} dangerouslySetInnerHTML={{ __html:activeTab === 0 ? tabOneObj.title : tabTwoObj.title }} />
                              : ''
                          }
                          {
                            activeTab === 0
                              ? <div>
                                {
                                  tabOneObj.feedWayDto
                                    ? <div>
                                      <CardTitle title={tabOneObj.feedWayDto.title} />
                                      <div className={`${styles.square} ${styles.feedAdvise}`}>
                                        {
                                          tabOneObj.feedWayDto.feedWay.map((item, index) => (
                                            <p key={index}>{index + 1}.{item}</p>
                                          ))
                                        }
                                      </div>
                                    </div>
                                    : ''
                                }
                                {
                                  tabOneObj.relief && tabOneObj.relief.map((item, index) => (
                                    <div key={index}>
                                      <CardTitle title={item.title} />
                                      <div className={`${styles.square} ${styles.feedAdvise}`}>
                                        <div dangerouslySetInnerHTML={{ __html:item.description }} />
                                      </div>
                                    </div>
                                  ))
                                }
                                <div>
                                  <CardTitle title={'你需要注意'} />
                                  <div className={`${styles.square} ${styles.needNotice}`}>
                                    <div className={styles.title}>
                                      <span>菌群与健康</span>
                                      <img src={images.notice} />
                                    </div>
                                    <div className={styles.advise}>
                                      <p /><span>正常情况下，有益菌产生大量抑菌物质，抑制有害菌的繁殖，减少肠道内的有害物质产生；</span>
                                    </div>
                                    <div className={styles.advise}>
                                      <p /><span>菌群紊乱时，有益菌数量减少，有害菌数量增加，肠道保护力降低，宝宝容易生病；</span>
                                    </div>
                                    <div className={styles.advise}>
                                      <p /><span>肠道菌群紊乱会加快过敏、湿疹、哮喘、自闭症、肥胖、发育不良等慢性疾病的发生发展；</span>
                                    </div>
                                    <div className={styles.advise}>
                                      <p /><span>宝宝的肠道菌群变化受很多人为因素影响，抓住这些关键期进行检测对宝宝肠道菌群的建立至关重要。</span>
                                    </div>
                                  </div>
                                </div>
                                <div className={`${styles.square} ${styles.needNotice} ${styles.top16}`}>
                                  <div className={styles.title}>
                                    <span>宝宝肠道菌群建立的关键期</span>
                                    <img src={images.time} />
                                  </div>
                                  <div className={styles.imgList}>
                                    <img src={images.key1} />
                                    <img src={images.key2} />
                                    <img src={images.key3} />
                                    <img src={images.key4} />
                                    <img src={images.key5} />
                                    <img src={images.key6} />
                                  </div>
                                  <div className={styles.detailsBtn} onClick={this.goKeyDetail}>
                                    <span>点击了解更多内容</span>
                                    <img src={images.right} />
                                  </div>
                                  <p>出生方式已经无法改变，但是抓住其他关键时间段，在行动前后了解宝宝肠道菌群变化，科学调理，有助于宝宝建立有益的肠道菌群，预防疾病的发生。</p>
                                </div>
                              </div>
                              : activeTab === 1
                                ? <div className={styles.tabTwo}>
                                  <div className={`${styles.square} ${styles.testItems}`}>
                                    <div className={styles.title}>
                                      <span>检测项目</span>
                                      <span>检测结果</span>
                                    </div>
                                    <div className={styles.result}>
                                      {
                                        tabTwoObj.riskItems && tabTwoObj.riskItems.map((item, index) => (
                                          <div key={index}>
                                            <span>{item.name}</span>
                                            <div className={styles.range}>
                                              <label id={`range${index + 1}`} className={`${item.riskLevel === 'M' ? styles.orange1 : item.name === '免疫力水平' ? item.riskLevel === 'H' ? styles.green1 : styles.red1 : item.riskLevel === 'H' ? styles.red1 : styles.green1}`} />
                                            </div>
                                            <span className={`${item.riskLevel === 'M' ? styles.orange2 : item.name === '免疫力水平' ? item.riskLevel === 'H' ? styles.green2 : styles.red2 : item.riskLevel === 'H' ? styles.red2 : styles.green2}`}>
                                              {item.riskLevel === 'H' ? '高' : item.riskLevel === 'L' ? '低' : '中等'}
                                            </span>
                                          </div>
                                        ))
                                      }
                                    </div>
                                  </div>
                                  <div>
                                    <CardTitle title={'评估结果分析'} />
                                    <div className={`${styles.resultAnalysis}`}>
                                      <ShowOrHide type={2} data={tabTwoObj.riskAssessmentResults} />
                                    </div>
                                    <div>
                                      <CardTitle title={'温馨提示'} />
                                      <div className={`${styles.square} ${styles.needNotice}`}>
                                        {
                                          tabTwoObj.warmTips.split('<br/>').map((v, i) => (
                                            <div className={`${styles.advise} ${i === 0 && styles.top0}`} key={i}>
                                              <p /><span>{v}</span>
                                            </div>
                                          ))
                                        }
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                : <div className={styles.tab3}>
                                  {
                                    tabThreeObj && tabThreeObj.scientificDetailsDtos.map((v, i) => (
                                      <div key={i}>
                                        <CardTitle title={v.objects.title} />
                                        <div className={`${styles.square} ${styles.floraKinds}`}>
                                          <div className={`${styles.words}`}>
                                            <div dangerouslySetInnerHTML={{ __html:v.objects.titleDoc }} className={`${v.objects.title === '肠道菌群检测技术' ? styles.knowledge : ''}`} />
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  }
                                </div>
                          }
                        </div>
                        {
                          couponVis
                            ? <div>
                              <div className={styles.mask} />
                              <div className={styles.couponModal}>
                                <img src={images.coupons} className={styles.topImg} />
                                <img src={images.close} onClick={() => { this.closeModal() }} className={styles.close} />
                                <p className={styles.name}>成功领取活动优惠</p>
                                <p className={styles.desc}>恭喜！你已成功领取安小软加购专用券！现在就去加购吧！</p>
                                <div className={styles.gohave} onClick={this.toBuy}>去加购</div>
                              </div>
                            </div>
                            : ''
                        }
                      </div >
                      : ''
                  }
                </div>

                <div className={styles.whiteBlock} />
              </div>)}
        </div>
      </Page>
    )
  }
}

export default report
