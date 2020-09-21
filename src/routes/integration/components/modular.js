import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../integration.scss'

class Modular extends Component {
  static propTypes = {
    showFlag:propTypes.number,
    title:propTypes.string,
    btnName:propTypes.string,
    goThisPage:propTypes.func
  }

  render () {
    const { showFlag, title, btnName, goThisPage } = this.props
    return (
      <div className={styles.tasks}>
        <div className={styles.title}>
          <p>{title}</p>
          {showFlag > 0 && <span onClick={goThisPage}>{btnName}</span>}
        </div>
      </div>
    )
  }
}
export default Modular
