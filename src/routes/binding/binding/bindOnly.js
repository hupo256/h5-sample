import React from 'react'
import { Page } from '@src/components'
import img1 from '@static/bindOnly/tipIcon.png'
import { API, fun, point } from '@src/common/app'
import styles from './foronly'
// const { allPointTrack } = point
import {
  trackPointBindAdultTipsView,
  trackPointBindAdultGoto,
  trackPointBindAdultNewGoto,
} from '../buried-point'

const { getParams } = fun
class BindOnly extends React.Component {
  /**
   * 判断是否带有渠道信息
   * 有就请求授权接口，有授权信息就展示授权进度
   */
  componentDidMount() {
    trackPointBindAdultTipsView()
    API.myInfo({ noloading: 1, clientType: 'app' }).then(res => {
      const { code, data } = res
      if (!code) {
      }
    })
  }

  gotoNFriend = () => {
    trackPointBindAdultNewGoto()
    this.props.history.push(`/bindNFrenid`)
  }

  gotoBinding = () => {
    trackPointBindAdultGoto()
    const { barCode, type } = getParams()
    if (type) {
      this.props.history.push(`/binding?barCode=${barCode}&type=${type}`)
    } else {
      this.props.history.push(`/binding?barCode=${barCode}`)
    }
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
// BindOnly.propTypes = {
//   history: propTypes.object.isRequired
// }
export default BindOnly
