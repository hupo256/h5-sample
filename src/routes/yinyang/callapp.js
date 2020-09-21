import React from 'react'
import CallApp from 'callapp-lib'
import { ua } from '@src/common/app'
import { Page } from '@src/components'
import images from '@src/common/utils/images'
import styles from './yinyang'

const { shareRedPacker } = images

const options = {
  scheme: { protocol: 'andall' },
  intent: {
    package: 'com.taobao.mm',
    scheme: 'taobao'
  },
  // appstore: "https://itunes.apple.com/app/id1470582315",
  appstore: 'https://itunes.apple.com/app/id1470582315',
  yinyongbao:'https://a.app.qq.com/o/simple.jsp?pkgname=com.jxsw.andall',
  fallback: 'https://a.app.qq.com/o/simple.jsp?pkgname=com.jxsw.andall',
  timeout: 2000,
}

const callLib = new CallApp(options)

class LauchApp extends React.Component {
  state = {
    sharePop: false
  }

  toggleMask = (key) => {
    this.setState({
      [key]: !this.state[key]
    })
  }

  openApp = () => {
    if (ua.isWechat()) {
      this.setState({ sharePop: true })
    } else {
      callLib.open({
        path: 'andall.com/buy_tab'
      })
    }
  }

  render () {
    const { sharePop } = this.state
    return (
      <Page title='Call APP'>
        <div>
          <h3
            onClick={this.openApp}
            style={{ fontSize: '18px', textAlign: 'center', padding: '1rem' }}
          >
            Call APP
          </h3>
          <br />

          {/* 引导分享 */}
          {sharePop && <div className={styles.sharebox} onClick={() => this.toggleMask('sharePop')}>
            <img src={`${shareRedPacker}nfriend_share.png`} alt='nfriend_share' />
          </div>}
        </div>
      </Page>
    )
  }
}

export default LauchApp
