import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../style.scss'
import CardTitle from './cardTitle.js'
import { HpvDccv2Goto } from '../buried-point'
import { fun, ua } from '@src/common/app'
const { getParams } = fun
class ImmunityCard extends Component {
    static propTypes = {
      data:propTypes.object,
    }
    componentDidMount() {

    }
    goDo=() => {
      if (getParams().shareToken) {
        return
      }
      let url = `${window.location.origin}/mkt/mktlanding?kid=3045382715829248`
      if (ua.isAndall()) {
        location.href = `andall://andall.com/inner_webview?url=${url}`
      } else {
        location.href = url
      }
      HpvDccv2Goto({
        sample_linkmanid: +localStorage.linkManId,
        sample_barcode:getParams().barCode,
        report_code:localStorage.productCode,
        url:url,
        report_result:localStorage.reprotResult === '阴性' ? 0 : 1

      })
    }
    render() {
      const { data } = this.props
      return (
        <div className={styles.padding15}>
          <CardTitle title={'综合免疫力'} />
          <div className={`${styles.square} ${styles.immunityCard}`}>
            <p>为什么免疫力与基因相关</p>
            <span className={styles.border} />
            <div className={styles.text} dangerouslySetInnerHTML={{ __html:data.text }} />
            <div className={styles.startBtn} onClick={this.goDo}>立即检测</div>
          </div>
        </div>
      )
    }
}

export default ImmunityCard
