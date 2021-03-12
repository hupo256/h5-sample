import React from 'react'
import propTypes from 'prop-types'
import styles from '../order'
class Info extends React.Component {
  static propTypes = {
    details: propTypes.object.isRequired
  }
  state = {
    list: [1, 2, 3]
  }
  render () {
    const { details } = this.props
    return (
      <div className={`fz14 ${styles.box}`}>
        <div className='white mb10'>
          <h5 className='fz15'>结算</h5>
          <ul className={styles.info}>
            <li className='flex'>
              <label>商品金额</label>
              <span className='item'>￥{details.originalAmount}</span>
            </li>
            <li className='flex'>
              <label>优惠</label>
              <span className='item red'>-￥{details.couponAmount}</span>
            </li>
            <li className='flex'>
              <label>实付款</label>
              <span className='item blue'>￥{details.paymentAmount}</span>
            </li>
          </ul>
        </div>
        <div className={`white ${styles.time}`}>
          <p>订单号：{details.orderNo}</p>
          <p>创建时间：{details.createTime}</p>
          <p>付款时间：{details.paymentTime}</p>
        </div>
      </div>
    )
  }
}

export default Info
