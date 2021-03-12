import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { point } from '@src/common/app'
import styles from './redpaper'
const { allPointTrack } = point
export default class RedPaper extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  // 埋点记录展示新人红包
  trackPointRedShow () {
    let obj = {
      eventName:'redpacket_newuser_show',
      pointParams:{ coupon_id:'', coupon_name:'' }
    }
    allPointTrack(obj)
  }
  componentDidMount = () => {
    this.trackPointRedShow()
    /** piwik start **/
    window._paq.push(['trackEvent', 'mall_homepage', 'redpacket_popup_show'])
    /** piwik end **/
  }

  // 打开红包
  handleOpenRedPaper = (e) => {
    e.stopPropagation()
    this.props.onConfirm()
  }

  // 关闭弹窗
  handleCloseModal = () => {
    this.props.onCancel()
  }

  render () {
    return (
      <div>
        <div className={styles.mask} />
        <div className={`${styles.redWrap}`}>
          <div className={styles.paperClose} onClick={() => { this.handleCloseModal() }} />
          <div className={styles.redPaper}>
            <div className={styles.redBtn} onClick={(e) => { this.handleOpenRedPaper(e) }} />
          </div>
        </div>
      </div>
    )
  }
}

RedPaper.propTypes = {
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func
}
