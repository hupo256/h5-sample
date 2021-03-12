import React, { Component } from 'react'
import propTypes from 'prop-types'

import styles from './brand.scss'

export default class MemberBrand extends Component {
  static propTypes = {
    data: propTypes.object
  }

  render () {
    const { data } = this.props
    const { vipName, cardNum } = data

    return (
      <div className={`${styles.memberBrand}`}>
        <div className={`${styles.brandCon}`}>
          <h3 className={`mb4 ${styles.brandTitle}`}>
            <span className={`${styles.text}`}>{vipName}</span>
          </h3>
          <p className={`${styles.brandDesc}`}>全面覆盖孩子成长的{cardNum}个问题</p>
        </div>
        <div className={`${styles.btnWrap}`}>
          <a className={`${styles.btn}`}>立即开启</a>
        </div>
      </div>
    )
  }
}
