import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../../hpvReport/hpvReport.scss'
import CardTitle from '../../hpvReport/components/cardTitle.js'
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
          </div>
        </div>
      )
    }
}

export default ImmunityCard
