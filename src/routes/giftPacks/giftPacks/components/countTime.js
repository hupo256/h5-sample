import React from 'react'
import styles from '../../giftPacks.scss'

class CountTime extends React.Component {
  render () {
    const { countTime = {days:0, hours:0, mins:0, secs:0 }} = this.props
    return (
      <div className={styles.timeWrap}>
        <div className={styles.timeLeft}>
          <div><p>限时秒杀</p><p>抢购中</p></div>
        </div>
        <div className={styles.timeRight}>
          <div>距离秒杀结束</div>
          <div className={styles.countTime}>
            <div>{countTime.days}</div>
            <p>天</p>
            <div>{countTime.hours}</div>
            <p>:</p>
            <div>{countTime.mins}</div>
            <p>:</p>
            <div>{countTime.secs}</div>
          </div>
        </div>
      </div>
    )
  }
}
export default CountTime
