import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../hpvReport.scss'

import images from '../images'

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
          <p>「{userName.length > 4 ? userName.slice(0, 4) + '...' : userName}」本次HPV检测的结果为</p>
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
