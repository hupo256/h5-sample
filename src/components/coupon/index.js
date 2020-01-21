import React from 'react'
import propTypes from 'prop-types'
import styles from './coupon'
import expired from '@static/coupon-expired.png'
import used from '@static/coupon-used.png'

class Coupon extends React.Component {
  static propTypes = {
    list: propTypes.array.isRequired,
    onSelect: propTypes.func
  }

  render () {
    const { list, onSelect } = this.props
    return (
      <div className='bg pt10'>
        <ul>
          {
            list.map((item, i) => (
              <li
                className={`mt12 ${styles.list} ${item.couponStatus !== 1 ? styles.grren : ''}`}
                key={i}
                onClick={() => {
                  onSelect && onSelect(item)
                }}
              >
                <div className={`flex ${styles.content}`}>
                  <div className={styles.money}>
                    <span>{item.ruleType === 'ZK' ? `${item.discountValue * 10}折` : item.discountValue}</span>
                    {item.ruleType === 'DK' && '元' }
                    <p>
                      {
                        item.limitAmount ? `满${item.limitAmount}元可用` : '无金额门槛'
                      }
                    </p>
                  </div>
                  <div className={`item ${styles.text}`}>
                    <span className='nowrap'>{item.ruleName}</span>
                    <p className='nowrap'>开始时间：{item.validTime}</p>
                    <p className='nowrap'>结束时间：{item.invalidTime}</p>
                  </div>
                </div>
                <div className={styles.couponStatus}>
                  {
                    item.couponStatus === 3 ? <span className={styles.expired}>
                      <img src={expired} alt='' />
                    </span> : null
                  }
                  {
                    item.couponStatus === 2 ? <span className={styles.used}>
                      <img src={used} alt='' />
                    </span> : null
                  }
                </div>
                <div className={styles.foot}>
                  {
                    item.ruleNameList && item.ruleNameList.length > 0 ? item.ruleNameList.map((item, index) => {
                      return <p key={`limt${index}`}>限{item}</p>
                    }) : <p>全品类可用</p>
                  }
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default Coupon
