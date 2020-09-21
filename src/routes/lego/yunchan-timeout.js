import React, { Component } from 'react'
import Page from '@src/components/page'
import images from './componets/images'
import styles from './yunchan.scss'

class Succeed extends Component {
  gotoHome = () => {
    window.history.replaceState({}, '', `/mkt/lego${location.search}`);
    window.location.reload();
  }

  render () {
    return (
      <Page title='助力活动'>
        <div className={styles.yunchTimeOut} onClick={this.gotoHome}>
          <img src={images.timeout2} />
        </div>
      </Page>
    )
  }
}
export default Succeed