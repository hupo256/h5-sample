import React from 'react'
import PropTypes from 'prop-types'
import styles from './points.scss'
import fun from '@src/common/utils'
const { isTheAppVersion } = fun
// import points2 from '@static/integration/points2.png'
// import add from '@static/integration/add.png'

class NoData extends React.Component {
  static propTypes = {
    value: PropTypes.number,
    color: PropTypes.bool,
  }
  render () {
    const { value, color } = this.props
    return (
      // <div className={styles.thisPoints}>
      //   <span>+{value}积分</span>
      // </div>
      isTheAppVersion('1.6.9')
        ? <div className={color ? styles.thisPointsTwo : styles.thisPoints}>
          {color
            ? <div>
              <span>+</span>
              <span className={styles.bonus_color}>{value}积分</span>
            </div>
            : <span>+{value}积分</span>
          }
        </div>
        : ''
    )
  }
}

export default NoData
