import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styles from './nodata.scss'
import sampleNull from '@static/cjsample_null.png'

class NoData extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.element
  }
  render () {
    const { title, children } = this.props
    return (
      <div className={styles.noData}>
        <div className={styles.imgbox}>
          <img src={sampleNull} />
        </div>
        <p>{title}</p>
        <div className={styles.nobtn}>
          {children ||
          <Link to='/'>
            <button className={styles.goShoppingBtn}>随便逛逛</button>
          </Link>
          }
        </div>
      </div>
    )
  }
}

export default NoData
