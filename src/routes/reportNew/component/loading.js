import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../report.scss'
import classNames from "classnames";

export default class Loading extends Component {
  static propTypes = {
    data: propTypes.object,
    direction: propTypes.string
  }
 

  render () {
    const { data = {},direction } = this.props
    const { title } = data

    return (
      <div className={classNames({
        [styles.loading_panel]: true,
        [styles.loading_up]:
        direction=="up"
      })}>
        <div className={styles.loading_txt}>下拉可查看上一项
        </div>  
        <h1 className={styles.loading_title}>{title}</h1>
      </div>
    )
  }
}
