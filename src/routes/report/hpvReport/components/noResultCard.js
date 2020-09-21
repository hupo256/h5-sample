import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../hpvReport.scss'
import { fun, ua } from '@src/common/app'
import images from '../images'
import { HpvReportDetailQnaireGoto } from '../buried-point'
const { getParams } = fun

class NoResultCard extends Component {
    static propTypes = {
      cepingObj: propTypes.object,
    }
    componentDidMount() {
      console.log(this.props.cepingObj)
    }
      startBtn=(isAnswer) => {
        const { cepingObj } = this.props
        if (getParams().shareToken) {
          return
        }
        let url = `${window.location.origin}/mkt/questionnaire/basequestion-new?qnaireCode=${cepingObj.qnaireCode}&linkManId=${+localStorage.linkManId}&barCode=${getParams().barCode}&reportId=${cepingObj.reportId}&hpvReport=1`
        if (isAnswer !== 2) {
          HpvReportDetailQnaireGoto({
            sample_linkmanid: +localStorage.linkManId,
            sample_barcode:getParams().barCode,
            report_code:localStorage.productCode,
            page_code:'hpv_report_detail_science_page',
            qnaire_code:cepingObj.qnaireCode,
            qnaire_status:0,
            report_result:localStorage.reprotResult === '阴性' ? 0 : 1
          })
          if (ua.isAndall()) {
            location.href = `andall://andall.com/inner_webview?url=${url}`
          } else {
            location.href = url
          }
        }
      }
      render() {
        const { cepingObj } = this.props
        return (
          <div className={styles.noResultCard}>
            <img src={images.noResult} />
            <div className={styles.desc}>
              <div>
                <span>研究表明，除性生活外，HPV病毒的感染与许多生活因素相关，如：</span>
                <span className={styles.import}>免疫力低、接触不洁的公共用品及母婴传播</span>
                <span>等。</span>
              </div>
              <div>
                <span>完成测评，发现生活中潜在的高危风险因素，获取</span>
                <span className={styles.import}>定制化专家建议</span>
                <span>。</span>
              </div>
              <div>
                <span>问卷共</span>
                <span className={styles.import}>14题</span>
                <span>，预计耗时</span>
                <span className={styles.import}>3分钟</span>
                <span>。</span>
              </div>
              <div className={`${styles.startBtn} ${styles.top42} ${cepingObj.isAnswer === 2 ? styles.startBtn2 : ''}`} onClick={() => this.startBtn(cepingObj.isAnswer)}>
                {cepingObj.isAnswer === 0 ? '开始测评' : cepingObj.isAnswer === 1 ? '继续测评' : cepingObj.isAnswer === 2 ? '请在最新的报告中填写' : ''}
              </div>
              <p className={styles.evaluationtips}>* 当有更新的报告生成时，此测评不可修改</p>
            </div>
          </div>
        )
      }
}

export default NoResultCard
