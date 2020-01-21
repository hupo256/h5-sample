import React from 'react'
import propTypes from 'prop-types'
import styles from './growp.scss'
import { images } from '@src/common/app'
class GrowthProposals extends React.Component {
  state = {
  }
  componentDidMount () {
  }
  render () {
    const { growthObj } = this.props
    const { title, values, hasMask } = growthObj || {}
    return (
      <div className={`${hasMask ? styles.growthCont : styles.growthCont1}`}>
        <p className={styles.growthTitle}>
          <em />
          <span>{title}</span>
        </p>
        {
          values && values.length
            ? values.map((item, index) => {
              return <div
                key={index}
                className={styles.growthTextItem}
              >
                <em>{index < 9 ? `0${index + 1}` : index + 1}</em>
                <span className={styles.growthText} dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            })
            : ''
        }
        {
          hasMask ? <div className={styles.growthMask} /> : ''
        }
      </div>
    )
  }
}
GrowthProposals.propTypes = {
  growthObj: propTypes.object,
}
export default GrowthProposals
