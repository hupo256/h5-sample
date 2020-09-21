import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../style.scss'
import { fun, ua } from '@src/common/app'
import images from '../images'
//import { HpvReportDetailQnaireGoto } from '../buried-point'
import CardTitle from './cardTitle.js'
const { getParams } = fun

class EvaluationCard extends Component {
  static propTypes = {
    data:propTypes.object,
  }
  state = {
  }
  componentDidMount() {

  }
  startBtn=(isAnswer, reportId, qnaireCode) => {
    if (getParams().shareToken) {
      return
    }
    if (isAnswer !== 2) {
      // HpvReportDetailQnaireGoto({
      //   sample_linkmanid: +localStorage.linkManId,
      //   sample_barcode:getParams().barCode,
      //   report_code:localStorage.productCode,
      //   page_code:'hpv_report_detail_result_page',
      //   qnaire_code:qnaireCode,
      //   qnaire_status:0,
      //   report_result:localStorage.reprotResult === '阴性' ? 0 : 1
      // })
      let url = `${window.location.origin}/mkt/questionnaire/basequestion-new?qnaireCode=${qnaireCode}&linkManId=${getParams().linkManId}&barCode=${getParams().barCode}&brcaReport=1`
      if (ua.isAndall()) {
        location.href = `andall://andall.com/inner_webview?url=${url}`
      } else {
        location.href = url
      }
    }
  }
  render() {
    const { data } = this.props
    return (
      <div className={styles.padding15}>
        <CardTitle title={data.head} />
        <div className={styles.square}>  
          <img src={images.testBg} className={styles.testBg}/>        
          <div className={styles.question}>
            <div className={styles.desc}>
              <div>
                <div className={styles.circle} />
                <p>  
                  <span className={styles.import}>安我临床检测中心</span>
                  <span>特别定制了一份专业测评，帮你</span>
                  <span className={styles.import}>精准识别癌症</span>
                  <span>高危风险</span>
                </p>
              </div>
              <div>
                <div className={styles.circle} />
                <p>
                  <span>请认真填写测评，获取</span>
                  <span className={styles.import}>更详细的专家</span>
                  <span>建议，助你掌控未知风险</span>
                </p>
                <p>
                  <span>问卷</span>
                  <span className={styles.import}>共13题</span>
                  <span>，预计耗时</span>
                  <span className={styles.import}>2分钟</span>
                </p>
              </div>
              <div>
                <div className={styles.circle} />
                <p>
                  <span>*该风险测评是针对健康人群的疾病风险测试，不适用于已经患有癌症的女性朋友</span>
                </p>
              </div>
            </div>
            
            {/* <div className={`${styles.startBtn} ${data.isAnswer === 2 ? styles.startBtn2 : ''}`} onClick={() => this.startBtn(data.isAnswer, data.reportId, data.qnaireCode)}>
              {data.isAnswer === 0 ? '开始测评' : data.isAnswer === 1 ? '继续测评' : data.isAnswer === 2 ? '请在最新的报告中填写' : ''}
            </div> */}
            <div className={`${styles.startBtn}`} onClick={() => this.startBtn(data.isAnswer, data.reportId, data.qnaCode)}>
              开始测评
            </div>
            {/* <p className={styles.evaluationtips}>* 当有更新的报告生成时，此测评不可修改</p> */}
          </div>
        </div>  
      </div>
    )
  }
}

export default EvaluationCard
