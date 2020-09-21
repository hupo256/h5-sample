import React, { Component } from 'react'
import propTypes from 'prop-types'

import styles from '../skinBeauty.scss'

class ReportTab extends Component {
  static propTypes = {
    cur: propTypes.number,
    tabData: propTypes.array,
    onHandle: propTypes.func,
    type:propTypes.number
  }

  handleToggleTab = (i) => {
    const { cur } = this.props
    if (i !== cur) {
      this.props.onHandle(i)
    }
  }

  render () {
    const { cur, tabData, type } = this.props
    return (
      <div>
        {
          type === 1
            ? <ul className={styles.tabList}>
              {
                tabData.map((item, i) => (
                  <li className={styles.tabItem} key={i}>
                    <div className={`${styles.tabCon} ${cur === i ? styles.active : ''}`} onClick={() => this.handleToggleTab(i)}>
                      <span>{item.title}</span>
                    </div>
                  </li>
                ))
              }
            </ul>
            : <ul className={styles.tabList2}>
              {
                tabData.map((item, i) => (
                  <li className={styles.tabItem} key={i}>
                    <div className={`${styles.tabCon} ${cur === i ? styles.active : ''}`} onClick={() => this.handleToggleTab(i)}>
                      <span>{item.title}</span>
                    </div>
                  </li>
                ))
              }
            </ul>
        }

      </div>
    )
  }
}

export default ReportTab
