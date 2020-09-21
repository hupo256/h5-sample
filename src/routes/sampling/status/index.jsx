import React from 'react'
import { API, fun, filter, point } from '@src/common/app'
import samplingApi from '@src/common/api/samplingApi'
import Page from '@src/components/page'
import Info from './info'
import styles from "@src/routes/sampling/sampling";
const { getParams } = fun
const { samplingNewStatus } = filter
const { allPointTrack } = point
class Status extends React.Component {
  state = {
    noData:false,
    status:[],
    data: {},
    isX:false,
    isGen:false
  }
  baseData = [
    { barCode: '26174152GR8HQ5', code: 'MCDD', audlt:0 },
    { barCode: '26174137SXP2IZ', code: 'MCDE', audlt:0 },
    { barCode: '26174109I9WO70', code: 'MCDF', audlt:0 },
    { barCode: '161525492KQLVG', code: 'CNN', audlt:0 },
    { barCode: '161525498R3M5D', code: 'CAS', audlt:0 },
    { barCode: '1615254951OKJ8', code: 'KCEA', audlt:0 },
    { barCode: 'AA190721660AB5', code: 'CHT', audlt:0 },
    { barCode: '17123217NP9AST', code: 'MCDB', audlt:1 },
    { barCode: '17123217R8XYL0', code: 'MCDC', audlt:1 },
    { barCode: '17123217HD5FB8', code: 'MCDA', audlt:1 },
    { barCode: '2310234152JCUQ', code: 'ACPB', audlt:1 },
    { barCode: '121016283OR9VA', code: 'ACSA', audlt:1 },
    { barCode: '192056353SH9GT', code: 'ACDA', audlt:1 },
    { barCode: '110915017ZNUGQ', code: 'LASB', audlt:1 },
    { barCode: '02143459UZ01Y6', code: 'ACPA', audlt:1 }
  ]
  // 埋点记录查看样本状态
  trackPointSampleStatusView () {
    let obj = {
      eventName:'sample_status_view',
      pointParams:{
        sample_barcode:getParams().barCode
      }
    }
    allPointTrack(obj)
  }
  componentDidMount () {
    const obj = getParams()
    samplingApi.listReportStatusInfoByBarCode(obj).then(res => {
      this.judgeIsIPhone()
      const { code, data } = res
      if (!code) {
        const status = ['', '', '', '', '', '', '', '', '', '', '']
        this.setState({ order: obj.barCode, data })
        const { reportStatusInfoRespList = [] } = data || {}
        reportStatusInfoRespList.map((item, index) => {
          //if (item.labStage === '报告生成') return false
          samplingNewStatus.map((items, i) => {
            if (item.labStage === items.name) {
              item['indexFlag'] = i
              status[i] = item
            }
          })
        })
        this.setState({ status, data },
          () => {
            // 加载页面完成触发
            this.trackPointSampleStatusView()
            this.countCode(data.productCode,data)
          })
      }
    })
  }

  judgeIsIPhone = () => {
    const userA = window.navigator.userAgent
    const isIPhone = /iPhone/.exec(userA)
    if (isIPhone) {
      if ((window.screen.width === 414 && window.screen.height === 896) || (window.screen.width === 375 && window.screen.height === 812)) {
        this.setState({
          isX:true
        })
      }
    }
  }
  countCode = (productCode,data) => {
    const len = this.baseData.length
    const prodArrary = productCode.split(',')
    let saveBarCode = []
    for (let i = 0; i < len; i++) {
      for (let y = 0; y < prodArrary.length; y++) {
        if (prodArrary[y] === this.baseData[i].code) {
          saveBarCode.push(this.baseData[i].barCode)
        }
      }
    }
    this.barCode = saveBarCode.length === 1 ? saveBarCode[0] : null
    console.log(this.barCode)
    this.setState({
      btnVisible:true,
      audlt: data.relationId !== '3',
      isGen:productCode.indexOf('KCG') < 0
    })
  }
  goExample = () => {
    let obj = {
      eventName:'sample_status_goto',
      pointParams:{
        button_name:'example_report'
      }
    }
    allPointTrack(obj)
    location.href = `andall://andall.com/inner_webview?url=${window.location.origin}/mkt/reportExample`
  }
  goBuyPage = () => {
    const { data, audlt } = this.state
    const { sex } = data
    let obj = {
      eventName:'sample_status_goto',
      pointParams:{
        button_name:audlt ? (sex === 'female' ? 'woman_299' : 'man_299') : 'baby_299'
      }
    }
    allPointTrack(obj)
    if (!audlt) {
      location.href = 'andall://andall.com/inner_webview?url=http://wechatshop.dnatime.com/mkt/unlockLand?activeCode=SPTS_Baby__reportlist_399&viewType=sample'
    } else {
      if (sex === 'female') {
        location.href = 'andall://andall.com/inner_webview?url=http://wechatshop.dnatime.com/mkt/unlockLand?activeCode=SPTS_Women__reportlist_399&viewType=sample'
      } else {
        location.href = 'andall://andall.com/inner_webview?url=http://wechatshop.dnatime.com/mkt/unlockLand?activeCode=SPTS_Men__reportlist_399&viewType=sample'
      }
    }
  }
  render () {
    const { order, status, data, isX, audlt, btnVisible, isGen } = this.state
    return (
      <Page title='样本状态'>
        <Info order={order} status={status} data={data} />
        {btnVisible &&
          <div className={styles.bottomBtn}>
            <div className={styles.botWrap}>
              {isGen &&
                <div>
                  <div className={styles.botLeft} onClick={() => this.goExample()}>查看示例报告</div>
                  <div className={styles.botRight} onClick={() => this.goBuyPage()}>{audlt?'解锁更多健康风险报告':'揭秘宝宝成长过程中的200+问题'}</div>
                </div>
              }
              {!isGen &&
                <div className={styles.botBig} onClick={() => this.goBuyPage()}>{audlt?'解锁更多健康风险报告':'揭秘宝宝成长过程中的200+问题'}</div>
              }
            </div>
            {isX && <div className={styles.btnZW}></div>}
          </div>
        }
        <div className={styles.commZW} style={{ height:`${isX ? '90px' : '60px'}` }}></div>
      </Page>
    )
  }
}

export default Status
