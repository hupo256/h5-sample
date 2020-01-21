import React, { Component } from 'react'
import Page from '@src/components/page'
import images from '@src/common/utils/images'
import styles from './yunchan.scss'
const { lego } = images

class Succeed extends Component {
  render () {
    return (
      <Page title='页面已经失效'>
        <div className={styles.yunchTimeOut}>
          <img src={`${lego}timeout.png`} />
        </div>
      </Page>
    )
  }
}
export default Succeed
