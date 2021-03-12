import React, { Component } from 'react'
import propTypes from 'prop-types'

import styles from './member.scss'

export default class MemberList extends Component {
  static propTypes = {
    data: propTypes.object
  }

  render () {
    const { data = {} } = this.props
    const { productPrice = '', originPrice = '' } = data

    return (
      <div>
        <ul className={`fz14 ${styles.memberList}`}>
          <li className={`flex ${styles.border1px}`}>
            <label>全解锁价格</label>
            <div className={`${styles.info}`}>
              <span className={`${styles.price} mr8`}>￥{originPrice}</span>
              <span className={`${styles.memPrice}`}>￥{productPrice}</span>
            </div>
          </li>
        </ul>
      </div>
    )
  }
}
