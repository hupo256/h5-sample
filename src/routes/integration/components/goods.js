import React, { Component } from 'react'
import propTypes from 'prop-types'
import images from '../images'
import styles from '../integration.scss'

class Gooods extends Component {
  static propTypes = {
    details:propTypes.object,
  }

  render () {
    const { details } = this.props
    return (
      <div className={styles.goodsSquare}>
        {/* <div className={styles.leftImg} style={{ background:`url(${details.bigImgUrl}) center no-repeat`, }}> */}
        <img src={details.bigImgUrl} className={styles.leftImg} />
        <div>
          <p>{details.name}</p>
          <div className={styles.amounts}>
            <img src={images.points} />
            <span>{details.point}</span>
            {details.amount ? <span><label>+</label>{details.amount}<label>元</label></span> : ''}
            <span className={styles.marketPrices}>¥{details.marketPrices}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default Gooods
