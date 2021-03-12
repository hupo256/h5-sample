import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './invite.scss'
import images from '../images'
import { fun } from '@src/common/app'
import andall from '@src/common/utils/andall-sdk'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
import { myInvitationPageView, myInvitationPageGoto } from '../buried-point'
const { getParams } = fun
class Invite extends React.Component {
  componentDidMount () {
    myInvitationPageView()
  }
  inviteBtn=(type) => {
    myInvitationPageGoto({ viewtype:type === 1 ? 'wechat' : 'scan_qrcode' })
    if (type === 2) {
      this.props.history.push(`/healthRecords/invite/codeInvite?type=${type}&id=${getParams().id}`)
    } else {
      healthRecordsApi.getShareData({
        shareType:1,
        friendRelationId:+getParams().id
      }).then(res => {
        if (res) {
          console.log(res.data)
          andall.invoke('shareToWechat', {
            type: 'link',
            title:res.data.title,
            text:res.data.desc,
            url: res.data.shareUrl,
            thumbImage:res.data.imgUrl,
            image:res.data.imgUrl,
          })
        }
      })
    }
  }
  render () {
    return (
      <Page title='邀请亲友'>
        <div className={styles.invite}>
          <p>接受邀请的亲友能查看你分享给他的检测报告，你也能查看该亲友分享给你的报告。</p>
          <div onClick={() => this.inviteBtn(1)}>
            <img src={images.wechat} />
            <span>微信邀请</span>
          </div>
          <div onClick={() => this.inviteBtn(2)}>
            <img src={images.code} />
            <span>扫码邀请</span>
          </div>
        </div>
      </Page>
    )
  }
}
Invite.propTypes = {
  history: propTypes.object,
}
export default Invite
