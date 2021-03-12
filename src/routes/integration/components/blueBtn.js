import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../integration.scss'

class BlueBtn extends Component {
  static propTypes = {
    name:propTypes.string,
    confirmThis:propTypes.func,
    type:propTypes.number
  }

  render () {
    const { name, confirmThis, type } = this.props
    return (
      <div onClick={confirmThis}
        className={`${styles.blueBtn} ${type === 2 && styles.greenBtn}`}
      >{name}</div>
    )
  }
}
export default BlueBtn
