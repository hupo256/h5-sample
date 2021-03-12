import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../newDetails/detail'
import CardTitle from './cardTitle.js'

class DescribeCard extends Component {
  static propTypes = {
    title: propTypes.string,
    data:propTypes.object
  }
  render() {
    const { title, data } = this.props
    return (
      <div className={styles.floraCard}>
        <CardTitle title={title} />
        <div className={`${styles.square} ${styles.analysis}`}>
          {data.analysis.split('</br>').map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
      </div >
    )
  }
}

export default DescribeCard
