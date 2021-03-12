import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../newDetails/detail'

class ResultCard extends Component {
  static propTypes = {
    userName: propTypes.string.isRequired,
    data:propTypes.object,
  }
  state = {
  }
  componentDidMount() {
    this.refs.point.style.marginLeft = this.props.data.score + '%'
  }
  render() {
    const { userName, data } = this.props
    return (
      <div className={styles.resultsCard}>
        <div className={`${styles.head} ${data.score < 30 ? styles.head1 : data.score >= 30 && data.score < 60 ? styles.head2 : data.score >= 60 && data.score <= 80 ? styles.head3 : styles.head4}`}>
          <p>「{userName}」肠道菌群状态处于</p>
          <span>{data.conclusion}</span>
        </div>
        <div className={styles.bottom}>
          <div className={styles.ranges}>
            <span />
            <span />
            <span />
            <span />
            <span ref='point' className={`${styles.point} ${data.score < 30 ? styles.color1 : data.score >= 30 && data.score < 60 ? styles.color2 : data.score >= 60 && data.score <= 80 ? styles.color3 : styles.color4}`} />
          </div>
          <div className={styles.desc}>
            <p>严重失衡</p>
            <p>健康</p>
          </div>
        </div>
      </div >
    )
  }
}

export default ResultCard
