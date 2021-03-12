import React from 'react'
import Page from '@src/components/page'
import VideoShow from './VideoShow'
import styles from './success'

class Success extends React.Component {
  render() {
    return (
      <Page title='采样指导视频'>
        <div className={styles.guidebox}>
          <VideoShow />
        </div>
      </Page>
    )
  }
}

export default Success
