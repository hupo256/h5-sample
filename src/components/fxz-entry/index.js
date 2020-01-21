import React from 'react'
import { Link } from 'react-router-dom'
import propTypes from 'prop-types'
import FxzBanner from '@static/fxz-banner.png'
import FxzVip from '@static/vip-banner.png'
import FxzIcon from '@static/fxz-icon.png'
import styles from './style.scss'

class FxzEntry extends React.Component {
  static propTypes = {
    viewtype: propTypes.number
  }

  render () {
    const { viewtype } = this.props
    return (
      <div className={styles.audit}>
        <Link to={`/landmember?viewtype=${viewtype}`}><img src={FxzVip} /></Link>
        <Link to={`/fxz-mobile?viewtype=${viewtype}`}><img src={FxzBanner} /></Link>
        <Link to='/fxz-mobile' className={styles.flexd}><img src={FxzIcon} /></Link>
      </div>
    )
  }
}

export default FxzEntry
