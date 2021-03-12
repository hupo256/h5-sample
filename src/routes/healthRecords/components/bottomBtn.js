import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../index.scss'
class BottomBtn extends Component {
  static propTypes = {
    handleSave: propTypes.func,
    text:propTypes.string,
    type:propTypes.number
  }
  render () {
    const { text, type, handleSave } = this.props
    return (
      <div className={`${styles.saveBtn} ${type === 1 ? styles.saveBtn1 : type === 2 ? styles.saveBtn2 : styles.saveBtn3}`} onClick={handleSave}>
        <p>{text}</p>
      </div>
    )
  }
}
export default BottomBtn
