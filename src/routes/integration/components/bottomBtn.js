import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../integration.scss'

class BottomBtn extends Component {
  static propTypes = {
    name:propTypes.string,
    cancelThis:propTypes.func,
    confirmThis:propTypes.func,
    disabled:propTypes.bool,
    type:propTypes.number
  }

  render () {
    const { name, cancelThis, confirmThis, disabled, type } = this.props
    return (
      <div className={styles.bottomBtn}>
        {
          type === 2
            ? <div className={styles.twoBtn}>
              <button onClick={cancelThis}>取消订单</button>
              <button onClick={confirmThis}>立即付款</button>
            </div>
            : <div className={styles.oneBtn}>
              <button className={disabled ? styles.btn1 : ''} onClick={confirmThis} disabled={disabled}>{name}</button>
            </div>
        }

      </div>
    )
  }
}
export default BottomBtn
