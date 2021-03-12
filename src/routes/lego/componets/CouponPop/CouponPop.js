import React from 'react'
import { fun, ua } from '@src/common/app'
import PropTypes from 'prop-types'
import images from '../images'
import { ZlCouponView, ZlCouponGoto } from '../BuriedPoint';
import styles from './yunchan.scss'

const { getSetssion } = fun

export default class CouponPop extends React.Component {
  static propTypes = {
    closeMask: PropTypes.func.isRequired,
    discountValue: PropTypes.number,
    invalidTime: PropTypes.string
  }

  componentDidMount () {
    const { productId } = this.props
    ZlCouponView({product_id: productId})
  }

  toOriginalPrice = () => {
    const { productType, productId, activCode } = this.props
    const { origin } = location
    const { linkManId } = getSetssion('linkMan')
    ZlCouponGoto({product_id: productId})

    if(activCode === 'NSGEA' && !ua.isAndall()) {
      window.location.href = `${origin}/landmember?from=singlemessage&isappinstalled=0`
      return
    }

    ua.isAndall() ? 
      andall.invoke('goProductDetail', { productType, productId } ) :
      window.location.href = `${origin}/commodity?id=${productId}&linkManId=${linkManId}`
      // window.location.href = `${origin}/landmember?from=singlemessage&isappinstalled=0`
  }

  touchFontSize = (text) => {
    console.log(text)
    const len = `${text}`.length
    // console.log(text)
    console.log(len)
    switch(len){
      case 1:
      case 2:
      case 3:
        return 60
      case 4:
        return 55
      case 5:
        return 44
      case 6:
        return 38
      default:
        return 70;
    }
  }

  render () {
    const { discountValue, invalidTime, closeMask } = this.props
    const fsize = this.touchFontSize(discountValue)
    return (
      <div className={styles.couponPop} onClick={() => closeMask()}>
        <div>
          <img 
            onClick={this.toOriginalPrice}
            src={images.couponNumbg} 
            alt="couponNum"
          />
          <span className={styles.couponNum} style={{ fontSize: `${fsize}px` }}>{discountValue ? `￥${discountValue}` : '￥100'}</span>
          <span className={styles.couponDate}>{`有效期至 ${invalidTime ? invalidTime : '2020/09/09'}`}</span>
        </div>
      </div>
    )
  }
}

