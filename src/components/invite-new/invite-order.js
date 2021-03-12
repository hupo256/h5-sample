import React, { Component } from 'react'
import PropTypes from 'prop-types'
import inviteBtn from '@static/paysuccess/invite-btn.png'
import styles from './invite-new.scss'
import UA from '@src/common/utils/ua'
const { isWechat } = UA

class InviteOrder extends Component {
  goInvite = () => {
    const { popData } = this.props
    // 判断是否为微信，对url进行处理
    const inWechat = isWechat()
    let url = ''
    if (inWechat) {
      url = popData.jumpUrl.split('?url=')[1]
    }

    setTimeout(() => {
      window.location.href = url
    }, 200)
  }
  render () {
    const { changeInvite,popData } = this.props
    return (
      <div className={styles.successModel}>
        <div className={styles.successInvite}>
          <img src={inviteBtn} onClick={this.goInvite} />
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
