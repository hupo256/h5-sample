import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../style.scss'
import CardTitle from './cardTitle.js'

import images from '../images'
import { fun } from '@src/common/app'
const { getParams } = fun
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
                {
                  index === 2
                    ? <a className={styles.concat} href={`${getParams().shareToken ? '##' : 'tel:400-682-2288'}`}>
                      <img src={images.phone} />
                      <span>致电客服，查询接种地点</span>
                    </a>
                    : ''
                }
              </div>

            ))
          }
        </div >
      </div>
    )
  }
}

export default AdviseCard
