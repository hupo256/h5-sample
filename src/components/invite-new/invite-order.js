import React, { Component } from 'react'
import PropTypes from 'prop-types'
import inviteBtn from '@static/paysuccess/invite-btn.png'
import styles from './invite-new.scss'

class InviteOrder extends Component {
  render () {
    const { goInvite, changeInvite } = this.props
    return (
      <div className={styles.successModel}>
        <div className={styles.successInvite}>
          <img src={inviteBtn} onClick={goInvite} />
          <p className={styles.closeInvite} onClick={changeInvite} />
        </div>
      </div>
    )
  }
}
InviteOrder.propTypes = {
  goInvite: PropTypes.func.isRequired,
  changeInvite: PropTypes.func.isRequired
}
export default InviteOrder
