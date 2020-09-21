import React, { Component } from 'react'

import { Page } from '@src/components'
import Banner from '../component/memberBanner'
import LinkMan from '../component/linkMan'

import styles from '../order.scss'

class MemberSubmit extends Component {
  state = {}

  render () {
    return (
      <div>
        <Page title='开通会员'>
          <div>
            <Banner />
          </div>
          <div className={`${styles.linkBlock}`}>
            <LinkMan />
          </div>
          <div>声明</div>

          <div>会员协议</div>
        </Page>
      </div>
    )
  }
}

export default MemberSubmit
