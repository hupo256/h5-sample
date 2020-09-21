import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../hpvReport.scss'
import CardTitle from './cardTitle.js'

class BookCard extends Component {
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
            <CardTitle title={data.title} />
            <div className={`${styles.square} ${styles.reviewCard}`} >
              {
                data.text
                  ? data.text.split('<br/>').map((item, index) => (
                    <div className={styles.circleList} key={index}>
                      <div className={styles.circle} />
                      <p dangerouslySetInnerHTML={{ __html:item }} />
                    </div>
                  ))
                  : ''
              }
            </div>
          </div>
        )
      }
}

export default BookCard
