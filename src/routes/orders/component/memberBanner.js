import React, { Component } from 'react'

import propTypes from 'prop-types'

import styles from './member.scss'

export default class SubmitBanner extends Component {
  static propTypes = {
    data: propTypes.object
  }

  state = {}

  render () {
    const { data = {} } = this.props
    const { vipBanner = '' } = data

    return (
      <div className={`${styles.submitBanner}`}>
        <img src={vipBanner} />
        {/* <div className={`imgCenter ${styles.detailBtn} ${styles.posiRight}`}>
          <Link to='/landmember?viewtype=6'>
            <span className={`${styles.text}`}>查看详情</span>
          </Link>
        </div> */}
      </div>
    )
  }
}
