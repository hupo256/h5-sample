import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../hpvReport.scss'
import CardTitle from './cardTitle.js'

import images from '../images'

class ReadCard extends Component {
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
            <p className={styles.resultDate}>测评日期：{data.time}</p>
            <div className={styles.readCard} >
              {
                data.hpvCatalogResultDto.length
                  ? data.hpvCatalogResultDto.map((item, index) => (
                    <div className={`${styles.card} ${index === 1 ? styles.card2 : ''}`} key={index}>
                      <div>{item.title}</div>
                      <p>{item.result}</p>
                      <img src={index === 0 ? images.read1 : images.read2} />
                    </div>
                  ))
                  : ''
              }
            </div>
          </div>
        )
      }
}

export default ReadCard
