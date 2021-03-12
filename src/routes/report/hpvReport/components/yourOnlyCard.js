import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../hpvReport.scss'
import CardTitle from './cardTitle.js'
import hpvReportApi from '@src/common/api/hpvReportApi'
import { fun, ua } from '@src/common/app'
import { HpvReportDetailQnaireGoto } from '../buried-point'
import images from '../images'
const { getParams } = fun

class YourOnlyCard extends Component {
    static propTypes = {
      data:propTypes.object,
      isLatestReport:propTypes.number
    }
      state = {

      }
      componentDidMount() {
        const { data } = this.props
        console.log(data)
        if (data.hpvAdviceDtos.length) {
          data.hpvAdviceDtos.map((item, index) => {
            item.showMoreFlag = false
            item.tipsFlag = true
            console.log(document.getElementById(`list${index + 1}`).clientHeight)
            if (document.getElementById(`list${index + 1}`).clientHeight > 440) {
              item.showMoreFlag = true
            }
          })
        }
      }
      showAllOrOne=(item) => {
        const { list } = this.state
        item.tipsFlag = !item.tipsFlag
        this.setState({
          list
        })
      }
      againBtn=() => {
        const { data } = this.props
        if (getParams().shareToken) {
          return
        }
        HpvReportDetailQnaireGoto({
          sample_linkmanid: +localStorage.linkManId,
          sample_barcode:getParams().barCode,
          report_code:localStorage.productCode,
          page_code:'hpv_report_detail_science_page',
          qnaire_code:data.qnaireCode,
          qnaire_status:1,
          report_result:localStorage.reprotResult === '阴性' ? 0 : 1
        })
        hpvReportApi.setNewQnaireInfo({
          questionaireId:data.qnaireId,
          reportId:data.reportId,
        }).then(res => {
          if (res) {
            let url = `${window.location.origin}/mkt/questionnaire/basequestion-new?qnaireCode=${data.qnaireCode}&linkManId=${+localStorage.linkManId}&barCode=${getParams().barCode}&reportId=${data.reportId}&hpvReport=1`
            if (ua.isAndall()) {
              location.href = `andall://andall.com/inner_webview?url=${url}`
            } else {
              location.href = url
            }
          }
        })
      }
      render() {
        const { data, isLatestReport } = this.props
        return (
          <div className={`${styles.padding15} ${styles.yourOnlyCard}`}>
            <CardTitle title={'你的定制化专家建议'} />
            {
              data.hpvAdviceDtos.length
                ? data.hpvAdviceDtos.map((item, index) => (
                  <div id={`list${index + 1}`} className={`${styles.square} ${styles.list} ${item.head === '饮食营养' || item.head === '运动健身' || item.head === '个人卫生' ? styles.green
                    : item.head === '睡眠心理' || item.head === '其他' ? styles.blue : styles.pink}`} key={index}>
                    <div className={styles.title}>
                      <span>
                        {/* <label className={`${item.head === '其他' ? styles.others : ''}`}>&nbsp;</label> */}
                        {item.head}
                      </span>
                      <img src={item.head === '饮食营养' ? images.food : item.head === '睡眠心理' ? images.sleep : item.head === '伴侣沟通'
                        ? images.lover : item.head === '运动健身' ? images.sport : item.head === '个人卫生' ? images.clean : images.other} />
                    </div>
                    <div className={`${item.showMoreFlag && item.tipsFlag ? styles.maxH : ''}`}>
                      {
                        item.expertAdList.map((v, i) => (
                          <div className={styles.advise} key={i}>
                            <p />
                            <span>{v}</span>
                          </div>
                        ))
                      }
                    </div>
                    {
                      item.showMoreFlag
                        ? <div className={styles.center}><p className={`${styles.showMore} ${item.tipsFlag ? styles.down : styles.up}`} onClick={() => this.showAllOrOne(item)}>
                          <span>{item.tipsFlag ? '展开详情' : '点击收起'}</span>
                        </p>
                        </div>
                        : ''
                    }
                    {
                      item.showMoreFlag
                        ? item.tipsFlag ? <p className={styles.jianbian} /> : ''
                        : ''
                    }
                  </div>
                ))
                : ''
            }
            {
              isLatestReport === 1
                ? <p className={styles.againBtn} onClick={this.againBtn}>点击重新测评</p>
                : ''
            }

          </div>
        )
      }
}

export default YourOnlyCard
