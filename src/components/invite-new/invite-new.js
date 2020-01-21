import React, { Component } from 'react'
import propTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styles from './invite-new.scss'
import inviteOrder from '@static/paysuccess/invite-order.png'

class InviteNew extends Component {
  static propTypes = {
    viewtype: propTypes.number
  }
  render () {
    const { viewtype } = this.props
    return (
      <Link className={styles.inviteImg} to={`/fxz-mobile?viewtype=${viewtype}`}>
        <img src={inviteOrder} alt='' />
      </Link>
    )
  }
}

export default InviteNew
