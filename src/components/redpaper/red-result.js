import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './redpaper'

import { API, point } from '@src/common/app'
const { allPointTrack } = point
export default class RedResult extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: []
    }
  }
  // 埋点记录领取新人红包成功
  trackPointRedShow () {
    let obj = {
      eventName:'redpacket_newuser_get_complete',
      pointParams:{ coupon_id:'', coupon_name:'' }
    }
    allPointTrack(obj)
  }
  componentDidMount = () => {
    API.receiveCoupon({ noloading: 1 }).then(res => {
      const { code, data } = res
      if (!code && data) {
        this.setState({ list: data })
      }
    })

    const { checkMobileFlag } = this.props.detailInfo
    let pathStr = 'register'
    if (checkMobileFlag && checkMobileFlag === 2) {
      pathStr = 'direct'
    }

    /** piwik start **/
    window._paq.push(['trackEvent', 'mall_homepage', 'redpacket_success_get', `info_action_path=${pathStr}`])
    /** piwik end **/
    this.trackPointRedShow()
  }

  // 点击立即使用
  handleUseRedPaper = (e) => {
    e.stopPropagation()
    this.props.onConfirm()
  }

  // 点击关闭
  handleCloseModal = () => {
    this.props.onCancel()
  }

  render () {
    const { list } = this.state
    return (
      <div>
        <div className={styles.mask} />
        <div className={styles.middleWrap}>
          <div className={styles.redResultWrap}>
            <div className={styles.redResult}>
              <div className={styles.resultCon}>
                <span>新人专享</span>
                <span className={styles.coupon}>
                  {list[0] ? list[0].discountValue : 0}元
                </span>
                <span>优惠券</span>
              </div>
              <div className={`${styles.blockBtn} ${styles.resultBtn} ${styles.redBtn}`} onClick={(e) => { this.handleUseRedPaper(e) }}>
              立即使用
              </div>
              <div className={styles.closeWrap} onClick={() => { this.handleCloseModal() }} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

RedResult.propTypes = {
  detailInfo: PropTypes.object,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
}
