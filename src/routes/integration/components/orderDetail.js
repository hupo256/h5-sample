import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../integration.scss'

class OrderDetail extends Component {
  static propTypes = {
    details:propTypes.object,
  }

  render () {
    const { details } = this.props
    return (
      <div className={`${styles.payDeatil}`}>
        <div className={styles.point}>
          <label>订单号</label>
          <span>{details.orderId}</span>
        </div>
        <div className={styles.money}>
          <label>创建时间</label>
          <span>{details.orderTime}</span>
        </div>
        {
          details.status !== 1
            ? <div className={styles.money}>
              <label>{details.status === 3 ? '取消时间' : '付款时间'}</label>
              <span>{details.status === 3 ? details.cancelTime : details.payTime}</span>
            </div>
            : ''
        }
      </div>

    )
  }
}
export default OrderDetail
