import React, { Component } from 'react'
import Page from '@src/components/page'
import images from '@src/common/utils/images'
import styles from './yunchan.scss'
const { lego } = images

class Succeed extends Component {
  gotoHome = () => {
    window.history.replaceState({}, '', `/mkt/lego${location.search}`);
    window.location.reload();
  }

  render () {
    return (
      <Page title='助力活动'>
        <div className={styles.yunchTimeOut} onClick={this.gotoHome}>
          <img src={`${lego}timeout2.png`} />
        </div>
      </Page>
    )
  }
}
export default Succeed