import React from 'react'
import { Page } from '@src/components'
import { Toast } from 'antd-mobile'
import styles from '../login'
import MobileForm from '../components/mobileForm'


class MobileLogin extends React.Component {
  state = {

  }
  componentDidMount() {
  }

  render() {
    return (
      <Page title='手机手机号'>
        <div>
            <div className={styles.mobileTitle}>请输入手机号登录/注册</div>
            <MobileForm />
        </div>
      </Page>
    )
  }
}

export default MobileLogin
