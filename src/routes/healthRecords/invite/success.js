import React from 'react'
import Page from '@src/components/page'
import styles from './invite.scss'
import images from '../images'
import { fun } from '@src/common/app'
import { invitationCompletePageView, invitationCompletePageGoto } from '../buried-point'
const { getParams } = fun
class Success extends React.Component {
  state = {
    relationship:'',
  }
  componentDidMount () {
    invitationCompletePageView()
  }
  downLoadBtn=() => {
    invitationCompletePageGoto({ viewtype:'download_app' })
    location.href = window.location.origin + '/download-app'
  }
  render () {
    return (
      <Page title='提交成功'>
        <div className={styles.success} id='top'>
          <img src={images.success} />
          <h5>您已接受{localStorage.startUserName}的邀请</h5>
          <p>下载安我生活并用手机号码{getParams().mobile}登录，就可以参加家庭成员了</p>
          <div onClick={this.downLoadBtn}>立即下载安我生活APP</div>
        </div>
      </Page>
    )
  }
}

export default Success
