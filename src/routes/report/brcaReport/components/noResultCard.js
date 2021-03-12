import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../style.scss'
import { fun, ua } from '@src/common/app'
import images from '../images'
//import { HpvReportDetailQnaireGoto } from '../buried-point'
const { getParams } = fun

class NoResultCard extends Component {
    static propTypes = {
      cepingObj: propTypes.object,
    }
    componentDidMount() {
      const { cepingObj } = this.props
      console.log(cepingObj)
    }
      startBtn=() => {
   
        const { cepingObj } = this.props
        console.log(cepingObj)
        
        if (getParams().shareToken) {
          return
        }
       
        let url = `${window.location.origin}/mkt/questionnaire/basequestion-new?qnaireCode=${cepingObj.qnaCode}&linkManId=${cepingObj.linkManId}&barCode=${getParams().barCode}&brcaReport=1`
        // if (isAnswer !== 2) {
        //   HpvReportDetailQnaireGoto({
        //     sample_linkmanid: +localStorage.linkManId,
        //     sample_barcode:getParams().barCode,
        //     report_code:localStorage.productCode,
        //     page_code:'hpv_report_detail_science_page',
        //     qnaire_code:cepingObj.qnaireCode,
        //     qnaire_status:0,
        //     report_result:localStorage.reprotResult === '阴性' ? 0 : 1
        //   })
          if (ua.isAndall()) {
            location.href = `andall://andall.com/inner_webview?url=${url}`
          } else {
            location.href = url
          }
        //}
      }
      render() {
        const { cepingObj } = this.props
        return (
          <div className={styles.noResultCard}>
            <img src={images.noResultImg} />
            <div className={styles.desc}>
              <div>
                <span>根据((2015年中国癌症统计》报道，乳腺癌在中国女性癌症发病率中占首位，约占</span>
                <span className={styles.import}>每年新发癌症的15％，约有5％～7％的乳腺癌以及10％的卵巢癌有遗传倾向</span>
                <span>。</span>
              </div>
              <div>
                <span>为了更好地了解</span>
                <span className={styles.import}>风险状况</span>
                <span>，请认真完成测评，</span>
                <span className={styles.import}>获取更详细的专家建议</span>
                <span>，助你掌控未知风险。</span>
              </div>
              <div>
                <span>问卷共13题，预计耗时</span>
                <span className={styles.import}>2分钟</span>
                <span>。</span>
              </div>
              
            </div>
            <div className={styles.btnCon}>
              {/* <div className={`${styles.startBtn} ${styles.top42} ${cepingObj.isAnswer === 2 ? styles.startBtn2 : ''}`} onClick={() => this.startBtn(cepingObj.isAnswer)}>
                {cepingObj.isAnswer === 0 ? '开始测评' : cepingObj.isAnswer === 1 ? '继续测评' : cepingObj.isAnswer === 2 ? '请在最新的报告中填写' : ''}
              </div> */}
              <div className={`${styles.startBtn} ${styles.top42} `} onClick={() => this.startBtn()}>
                开始测评
              </div>
              {/* <p className={styles.evaluationtips}>* 当有更新的报告生成时，此测评不可修改</p> */}
            </div>  
          </div>
        )
      }
}

export default NoResultCard
