import React, { Component } from 'react'
import propTypes from 'prop-types'

import styles from './member.scss'
import person1 from '@static/app/person1.png'
import person2 from '@static/app/person2.png'
import person3 from '@static/app/person3.png'
import person4 from '@static/app/person4.png'

export default class LinkMan extends Component {
  static propTypes = {
    data: propTypes.object,
    linkManData: propTypes.object,
    onHandle: propTypes.func,
    canSwitch: propTypes.bool,
    userInfo: propTypes.object
  }

  state = {
  }

  componentDidMount () {
  }

  handleSwitch = () => {
    const { onHandle } = this.props

    if (onHandle) {
      this.props.onHandle()
    }
  }
  handleSetImage = (value) => {
    if (+value === 1) {
      return person4
    } else if (+value === 2) {
      return person3
    } else if (+value === 3) {
      return person1
    } else if (+value === 4) {
      return person2
    }
  }

  render () {
    const { canSwitch = false, data = {}, linkManData = {}, userInfo = {} } = this.props
    const { productName = '', seriesDesc = '' } = data
    const { userName, avator, headImgType } = linkManData

    return (
      <div className={`${styles.linkmanLand}`}>
        <div className={`${styles.brandCon}`}>
          <h3 className={`${styles.brandTitle}`}>
            <span>{productName}</span>
          </h3>
          <p>
            {seriesDesc}
          </p>
        </div>
        <div className={`${styles.headImg}`} onClick={() => this.handleSwitch()}
        >
          <div className={`${styles.avator} mb4`}>
            <img src={avator || this.handleSetImage(headImgType) || userInfo.headUrl} />
          </div>
          <div className={`${styles.name}`}>
            <span className={`${styles.userName}`}>{userName || userInfo.nickName}</span>
            {
              canSwitch
                ? <span className={`iconfont ${styles.switchIcon}`}>&#xe61a;</span>
                : null
            }

          </div>
        </div>
      </div>
    )
  }
}
