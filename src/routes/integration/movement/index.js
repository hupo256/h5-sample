import React from 'react'
import { Page } from '@src/components'
import images from '@src/common/utils/images'
import { MyLoader } from '@src/components/contentLoader'
import Match from '../components/match.js'

import styles from './movement'
const { integration } = images

class Movement extends React.Component {
  state = {
    loading:false,
    answerFlag:0, // 0 未回答 1正确  2错误
    daySteps:400, //  今日步数
    hasDuihuan:false, // 是否已兑换
  }
  componentDidMount () {
    this.chooseBtn()
  }
  chooseBtn = (val) => {
    if (val === 1) {
      this.setState({ answerFlag:1 })
    }
  }
  render () {
    const { loading } = this.state
    return (
      <Page title='安我运动'>
        {
          loading
            ? <MyLoader />
            : <div className={`${styles.movement}`}>
              <div className={styles.header}>
                <div className={styles.top}>
                  <span><img src={`${integration}goBack.png`} alt='' /></span>
                  <span>安我运动</span>
                  <span>规则</span>
                </div>
                <p className={styles.exchange}>
                  <span>积分兑换105积分</span>
                  <img src={`${integration}right3.png`} />
                </p>
                <div className={styles.exchangeCount}>
                  <Match matchValue={80} />
                  <div className={styles.exchangeBtn}>
                    兑换555积分
                  </div>
                  <p className={styles.today}>今日步数</p>
                  <p className={styles.todayCount}>8000</p>
                  <p className={styles.todayTips}>合理的运动会让您更健康明天继续哦</p>
                </div>
                <div className={styles.padding20}>
                  <div className={styles.moveItems}>
                    <div className={styles.item}>
                      <span className={styles.move1} />
                      <span className={styles.move2} />
                      <span className={styles.move2} />
                      <span className={styles.move2} />
                      <span className={styles.move2} />
                      <span className={styles.move2} />
                      <span className={styles.move4} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        }
      </Page>
    )
  }
}

export default Movement
