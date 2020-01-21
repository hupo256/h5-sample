import React from 'react'
import { Page } from '@src/components'
import styles from '../binding'
class Guide extends React.Component {
  // 暂停视频
  hadleStop = (show) => {
    const el = document.getElementById(show)
    const bool = this.state[show]
    if (show === 'adult') {
      document.getElementById('children').pause()
      this.setState({ children: true })
    }
    if (show === 'children') {
      document.getElementById('adult').pause()
      this.setState({ adult: true })
    }
    if (!show) {
      document.getElementById('adult').pause()
      document.getElementById('children').pause()
      this.setState({ adult: true, children: true })
      return
    }
    bool ? el.play() : el.pause()
    this.setState({
      [show]: !bool
    })
  }
  render () {
    return (
      <Page title='放轻松，其实很简单'>
        <div className={styles.guide}>
          <div className={styles.guideVideo} onClick={() => { this.hadleStop('children') }}>
            <video id='children'
              controls src='//static01-source.dnatime.com/video/children.mp4' />
          </div>
          <div className={styles.guideTitle}>绑定采集器</div>
          <div className={styles.guideDetail}>
            感谢您购买安我基因产品。如果您已有安我的采集器，请根据向导完成绑定，绑定完成后在“报告”中查看您的基因检测报告。
            您可通过扫描采集器上的条形码绑定，或通过手动输入对应编号进行绑定。
          </div>
          <div className={styles.guideBtn}>开始扫码采集</div>
        </div>
      </Page>

    )
  }
}

export default Guide
