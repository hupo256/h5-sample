import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../../hpvReport/hpvReport.scss'
import CardTitle from '../../hpvReport/components/cardTitle.js'

import images from '../../hpvReport/images'

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
            <div className={styles.readCard} style={{margin:"10px"}} >
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
