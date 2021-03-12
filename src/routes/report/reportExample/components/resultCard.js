import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../../hpvReport/hpvReport.scss'

import images from '../../hpvReport/images'

class ResultCard extends Component {
  static propTypes = {
    userName: propTypes.string.isRequired,
    data:propTypes.object,
  }
  state = {
  }
  componentDidMount() {

  }
  render() {
    const { userName, data } = this.props

    return (
      <div className={styles.resultsCard}>
        <div className={styles.card}>
          <p>「小安」本次HPV检测的结果为</p>
          <img src={images.cardImg} />
          <span>{data.result}</span>
          <img src={images.cardImg2} />
        </div>
        <div className={styles.desc}>
          <p>{data.description}</p>
        </div>
      </div >
    )
  }
}

export default ResultCard
