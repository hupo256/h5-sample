import React from 'react'
import Page from '@src/components/page'
import fun from '@src/common/utils/index'
import img1 from '@static/bindOnly/tipIcon.png'
const { setSession } = fun
import styles from './foronly'
import {
  trackPointBindAdultTipsView,
  trackPointBindAdultGoto,
  trackPointBindAdultNewGoto,
} from '../buried-point'

class BindOnly extends React.Component {
  componentDidMount() {
    trackPointBindAdultTipsView()
  }

  gotoNFriend = () => {
    trackPointBindAdultNewGoto()
    this.props.history.push(`/binding/bindNFrenid`)
  }

  gotoBinding = () => {
    trackPointBindAdultGoto()
    const { search } = window.location
    this.props.history.push(`/binding${search}&form=bindOnly`)
  }

  render() {
    return (
      <Page title='绑定采样器'>
        <div className={styles.onlybox}>
          <div className={styles.tipbox}>
            <img className={styles.tipimg} src={img1} />
            <div className={styles.tipcon}>
              <p>- 重要提示 -</p>
              <p>为保障用户隐私安全，<br />该账户下只可绑定本人及3名宝宝检测者。</p>
              <p className={styles.fcc}>（如超出数量限制，则由其他账户绑定新采样器）</p>
            </div>

            <div className={styles.btnbox}>
              {/* <h3>是否为本账户绑定新采样器？</h3> */}
              <button onClick={this.gotoBinding}>绑给已有检测者</button>
              <p className={styles.fcc}>*一经绑定，无法解绑</p>
              <button onClick={this.gotoNFriend}>用新账户绑定</button>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

export default BindOnly
