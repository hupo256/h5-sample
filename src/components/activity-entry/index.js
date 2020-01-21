import React from 'react'
import propTypes from 'prop-types'
import styles from './activity.scss'
import { fun, point } from '@src/common/app'
import { Link } from 'react-router-dom'
const { getSetssion } = fun
const { allPointTrack } = point
class ActivityEntry extends React.Component {
  constructor () {
    super()
    this.cardLinkManId = getSetssion('cardLinkManId')
  }
  static propTypes = {
    isFixedTop: propTypes.bool.isRequired,
  }

  // 埋点记录合伙人入口
  trackPointActivityParthnerHomeView () {
    const { linkManId, userName } = getSetssion('cardLinkManId') || {}
    let obj = {
      eventName: 'activity_parthner_home_view',
      pointParams: {
        sample_linkmanid: linkManId,
        sample_linkman: userName,
        view_type: 'report_home'
      }
    }
    allPointTrack(obj)
  }

  newMethod () {
    return 'cardLinkManId'
  }

  render () {
    const { isFixedTop } = this.props
    return (
      <div id='activityEntry' className={`${styles.activityEntry} ${isFixedTop ? styles.isTop : ''}`}>
        <span className={styles.text}>成为安我推广大使，享现金礼包</span>
        <Link to='/fxz-mobile?viewtype=1' onClick={() => { this.trackPointActivityParthnerHomeView() }}><span className={styles.btn}>立即领取</span></Link>
      </div>
    )
  }
}

export default ActivityEntry
