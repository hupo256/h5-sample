import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './doctorCard'

export default class DoctorCard extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const { detailInfo } = this.props
    return (
      <div className={styles.card}>
        <p className={styles.cardTitle}>{detailInfo.title}</p>
        <div className={styles.cardCon}>
          <div className={styles.avator}>
            <img src={detailInfo.img} />
          </div>
          <div className={`item ${styles.doctorInfo}`}>
            <p className={styles.name}>{detailInfo.name}</p>
            <p className={`pt5 ${styles.txt}`}>{detailInfo.adders}</p>
          </div>
          <a className={styles.doctorTel} href={`tel:${detailInfo.tel}`} />
        </div>
      </div>
    )
  }
}

DoctorCard.propTypes = {
  detailInfo: PropTypes.object
}
