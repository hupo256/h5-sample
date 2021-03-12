import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../../hpvReport/hpvReport.scss'
import CardTitle from '../../hpvReport/components/cardTitle.js'

import { fun } from '@src/common/app'
class AdviseCard extends Component {
  static propTypes = {
    data:propTypes.object,
  }
  state = {
  }
  componentDidMount() {

  }
  render() {
    const { data } = this.props
    return (
      <div className={styles.padding15}>
        <CardTitle title={data.head} />
        <div className={`${styles.adviseCard} ${styles.square} `}>
          {
            data.doctorAdList.map((item, index) => (
              <div key={index}>
                <div className={styles.advise}>
                  <span>0{index + 1}</span>
                  <p>{item}</p>
                </div>
              </div>

            ))
          }
        </div >
      </div>
    )
  }
}

export default AdviseCard
