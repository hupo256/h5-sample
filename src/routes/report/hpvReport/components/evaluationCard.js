import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../hpvReport.scss'
import { fun, ua } from '@src/common/app'
import images from '../images'
import { HpvReportDetailQnaireGoto } from '../buried-point'
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
      HpvReportDetailQnaireGoto({
        sample_linkmanid: +localStorage.linkManId,
        sample_barcode:getParams().barCode,
        report_code:localStorage.productCode,
        page_code:'hpv_report_detail_result_page',
        qnaire_code:qnaireCode,
        qnaire_status:0,
        report_result:localStorage.reprotResult === '阴性' ? 0 : 1
      })
      let url = `${window.location.origin}/mkt/questionnaire/basequestion-new?qnaireCode=${qnaireCode}&linkManId=${+localStorage.linkManId}&barCode=${getParams().barCode}&reportId=${reportId}&hpvReport=1`
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
        <div className={styles.question}>
          <div className={styles.desc}>
            <div>
              <div className={styles.circle} />
              <p>
                <span className={styles.import}>安我临床检测中心</span>
                <span>特别定制了一份专业测评，帮你精准定位生活中的</span>
                <span className={styles.import}>高危潜在风险</span>
                <span>。</span>
              </p>
            </div>
            <div>
              <div className={styles.circle} />
              <p>
                <span>请认真填写测评，获取</span>
                <span className={styles.import}>定制化专家建议</span>
              </p>
            </div>
            <div>
              <div className={styles.circle} />
              <p>
                <span>问卷共</span>
                <span className={styles.import}>14题</span>
                <span>，预计耗时</span>
                <span className={styles.import}>3分钟</span>
              </p>
            </div>
          </div>
          <img src={images.advise1} className={styles.img2} />
          <div className={`${styles.startBtn} ${data.isAnswer === 2 ? styles.startBtn2 : ''}`} onClick={() => this.startBtn(data.isAnswer, data.reportId, data.qnaireCode)}>
            {data.isAnswer === 0 ? '开始测评' : data.isAnswer === 1 ? '继续测评' : data.isAnswer === 2 ? '请在最新的报告中填写' : ''}
          </div>
          <p className={styles.evaluationtips}>* 当有更新的报告生成时，此测评不可修改</p>
        </div>
      </div>
    )
  }
}

export default EvaluationCard
