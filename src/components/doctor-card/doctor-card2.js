import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './doctorCard.scss'

export default class DoctorCard extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { detailInfo } = this.props
    return (
      <div className={styles.card2}>
        <div className={styles.card2Con}>
          <div className={styles.card2Avator}>
            <img src={detailInfo.img} />
          </div>
          <div className={`item ${styles.doctor2Info}`}>
            <p className={styles.name}>{detailInfo.name}</p>
            <p className={`pt5 ${styles.txt}`}>{detailInfo.adders}</p>
          </div>
          <a className={styles.doctorTel2} href={`tel:${detailInfo.tel}`}>
            <span>立即预约</span>
            <i className={`iconfont ${styles.mobileIcon}`}>&#xe61c;</i>
          </a>
        </div>
      </div>
    )
  }
}

DoctorCard.propTypes = {
  detailInfo: PropTypes.object
}
