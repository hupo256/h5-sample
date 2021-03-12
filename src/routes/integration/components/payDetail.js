import React, { Component } from 'react'
import propTypes from 'prop-types'
import images from '../images'
import styles from '../integration.scss'

class PayDetail extends Component {
  static propTypes = {
    details:propTypes.object,
  }

  render () {
    const { details } = this.props
    return (
      <div>
        <div className={`${styles.payDeatil}`}>
          <div className={styles.money}>
            <label>支付现金</label>
            <span>{`¥ ${details.amount}${String(details.amount).indexOf('.') === -1 ? '.00' : ''}`}</span>
          </div>
          <div className={styles.point}>
            <label>使用积分</label>
            <p><img src={images.points} /><span>{details.point}</span></p>
          </div>
        </div>
      </div>

    )
  }
}
export default PayDetail
