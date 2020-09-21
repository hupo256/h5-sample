import React from 'react'
import { Page ,NavigationBar} from '@src/components'
import { ua, fun } from '@src/common/app'
import images from '../images'
import healthyApi from '@src/common/api/healthyApi'
import styles from './hasWrite.scss'
import { doneListView, doneListGoto } from '../buried-point'
const { getParams } = fun

class HasWrite extends React.Component {
  state = {
    loading:false,
    tabs:['健康测评', '报告准不准'],
    activeKey:0,
    list1:[],
    list2:[],
    records:[],
    firstFlag:true,
    nodata1:false,
    nodata2:false,
    fixTopHeight:""
  }

  componentDidMount () {
    this.init()
    if(ua.isAndall()){
      let statusBarHeight = window.localStorage.getItem('statusBarHeight') 
      this.setState({
        statusBarHeight:statusBarHeight+'px'
      })
    }
  }
  init=() => {
    healthyApi.completedEvaluationList({
      linkManId: +getParams().linkManId || 2531344900800512,
    }).then(({ data }) => {
      if (data) {
        doneListView({
          sample_linkmanid:getParams().linkManId,
          page_code:'health_test'
        })
        console.log(data)
        this.setState({
          list1:data.linkManTraitEvaluationDtos,
          records: data.linkManTraitEvaluationDtos,
          nodata1: !data.linkManTraitEvaluationDtos || !data.linkManTraitEvaluationDtos.length
        })
      }
    })
  }
  goCheckout=(isUnLockFlag, productCode, qnaireId, traitId, traitCode, traitName, redLightType) => {
    doneListGoto({
      sample_linkmanid:getParams().linkManId,
      page_code:'health_test',
      trait_code:traitCode,
      trait_name:traitName,
      unlock_status:isUnLockFlag,
      trait_type:redLightType === 'L' ? 'red' : redLightType === 'M' ? 'normal' : redLightType === 'H' ? 'good' : '',
    })
    //this.props.history.push(`/healthy/checkout?linkManId=${getParams().linkManId}&isUnLockFlag=${isUnLockFlag}&productCode=${productCode}&qnaireId=${qnaireId}&traitId=${traitId}&evaPageType=FILLED`)
    let url = window.location.origin + `/mkt/healthy/checkout?linkManId=${getParams().linkManId}&isUnLockFlag=${isUnLockFlag}&productCode=${productCode}&qnaireId=${qnaireId}&traitId=${traitId}&evaPageType=FILLED`  
    if(ua.isAndall()){
      location.href = `andall://andall.com/inner_webview?url=${url}`
    }else{
      this.props.history.push(`/healthy/checkout?hideTitleBar=1&linkManId=${getParams().linkManId}&isUnLockFlag=${isUnLockFlag}&productCode=${productCode}&qnaireId=${qnaireId}&traitId=${traitId}&evaPageType=FILLED`)
    } 
  }
  goReportDetail=(id, code, traitId, barCode, reportType, exampleFlag, traitCode, traitName, redLightType) => {
    doneListGoto({
      sample_linkmanid:getParams().linkManId,
      page_code:'trait_accuracy_feedback',
      trait_code:traitCode,
      trait_name:traitName,
      unlock_status:1,
      trait_type:redLightType === 'L' ? 'red' : redLightType === 'M' ? 'normal' : redLightType === 'H' ? 'good' : '',
    })
    let url = `${location.origin}/mkt/report4_2?linkManId=${getParams().linkManId}&id=${id}&code=${code}&traitId=${traitId}&barCode=${barCode}&reportType=${reportType}&exampleFlag=${exampleFlag}`
    location.href = ua.isAndall() ? `andall://andall.com/report_detail?url=${url}` : url
  }
  changeTabs=(index) => {
    let { firstFlag, list1, list2 } = this.state
    this.setState({
      activeKey:index,
      records:[]
    }, () => {
      doneListView({
        sample_linkmanid:getParams().linkManId,
        page_code:index === 0 ? 'health_test' : 'trait_accuracy_feedback'
      })
      if (index === 1 && firstFlag) {
        healthyApi.accuracyFeedbackList({
          linkManId: +getParams().linkManId || 2531344900800512,
        }).then(({ data }) => {
          if (data) {
            console.log(data)
            this.setState({
              list2:data,
              records: data,
              firstFlag:false,
              nodata2:data.length === 0
            })
          }
        })
      } else {
        this.setState({
          records: index === 0 ? list1 : list2
        })
      }
    })
  }
  // 去填写
  goAssessment=() => {
    this.props.history.push(`/healthy/assessment?hideTitleBar=1`+ getParams().linkManId)
  }
  // 去反馈
  goReportList=() => {
    location.href = 'andall://andall.com/report_tab?linkManId=' + getParams().linkManId
  }
  goBack=()=>{
    //window.history.go(-1)
    this.props.history.push(`/healthy/assessment?hideTitleBar=1`+ getParams().linkManId)
  }

  render () {
    const { tabs, activeKey, records, nodata1, nodata2 ,statusBarHeight} = this.state
    return (
      <Page title='已填写'>
        <NavigationBar title="已填写" type="black" background="#ffffff" back={()=>{this.goBack()}}></NavigationBar>
        <div className={styles.lists} id='lists'>
          <div className={`${styles.tabs} ${styles.fixTop}`} id='tabs' style={{top: `calc(44px + ${statusBarHeight})`}}>
            {
              tabs.map((item, index) => (
                <label key={index} className={`${activeKey === index ? styles.active : ''}`} onClick={() => this.changeTabs(index)}>
                  <span>{item}</span>
                  {
                    activeKey === index
                      ? <span className={styles.borderBottom}>&nbsp;</span>
                      : ''
                  }
                </label>
              ))
            }
          </div>
          <div className={styles.top60}>
            {
              activeKey === 0
                ? !nodata1
                  ? records.map((item, index) => (
                    <div className={styles.records} key={index}>
                      {
                        <div className={`${index === records.length - 1 ? styles.noborder : ''}`}
                          onClick={() => this.goCheckout(item.isUnLockFlag, item.productCode, item.qnaireId, item.traitId, item.traitCode, item.traitName, item.redLightType)}>
                          <div className={styles.left}>
                            <h5>{item.qnaireTitle}</h5>
                            <p className={styles.from}>「{item.productName}」-{item.traitName}</p>
                            {
                              item.isUnLockFlag === 1
                                ? <span className={`${item.redLightType === 'L' ? styles.status1 : item.redLightType === 'M' ? styles.status2 : styles.status3}`}>
                                  {item.redLightType === 'L' ? '红点' : item.redLightType === 'M' ? '正常' : '亮点'}
                                </span>
                                : <span className={styles.lock}><img src={item.isUnLockFlag === 2 ? images.locking : images.lock} />{item.isUnLockFlag === 2 ? '解锁中' : '待解锁'}</span>
                            }
                          </div>
                          <div className={styles.date}>
                            {item.commitTime}
                            <img src={images.right} />
                          </div>
                        </div>
                      }
                    </div>
                  ))
                  : <div className={styles.nodata}>
                    <img src={images.nodata2} />
                    <p>让关爱健康成为习惯，</p>
                    <p>从填写第一个健康测评开始。</p>
                    <div className={styles.writeBtn} onClick={this.goAssessment}>去填写</div>
                  </div>
                : !nodata2
                  ? records.map((item, index) => (
                    <div className={styles.records} key={index}>
                      {
                        <div className={`${index === records.length - 1 ? styles.noborder : ''}`}
                          onClick={() => this.goReportDetail(item.id, item.code, item.traitId, item.barCode, item.reportType, item.exampleFlag, item.traitCode, item.traitName, item.redLightType)}>
                          <div className={styles.left}>
                            <h5>{item.traitName}</h5>
                            <div className={styles.answers}>
                            已选：{item.linkManFeedBackValue === 'Y' ? '准确' : item.linkManFeedBackValue === 'N' ? '不准确' : '不确定'} {item.percenterValue} 的选择
                            </div>
                            <p className={styles.from} style={{ textIndent:0 }}>来自「{item.productName}」</p>
                          </div>
                          <div className={styles.right}>
                            {
                              <span className={`${item.redLightType === 'L' ? styles.status1 : item.redLightType === 'M' ? styles.status2 : styles.status3}`}>
                                {item.redLightType === 'L' ? '红点' : item.redLightType === 'M' ? '正常' : '亮点'}
                              </span>
                            }
                            <div className={styles.date2}>
                              {item.feedBackTime}
                            </div>
                            <div className={styles.goDetail}>详情<img src={images.right} /></div>
                          </div>
                        </div>
                      }
                    </div>
                  ))
                  : <div className={styles.nodata}>
                    <img src={images.nodata1} />
                    <p>真实表现和基因结果的差距有多大？</p>
                    <p>动动手指见分晓！</p>
                    <div className={styles.writeBtn} onClick={this.goReportList}>去反馈</div>
                  </div>
            }
          </div>
        </div>
      </Page>
    )
  }
}

export default HasWrite
