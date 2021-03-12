import React from 'react'
import { Page } from '@src/components'
import styles from './index.scss'
import img1 from '@static/meadjohnson.png'
import andall from "@src/common/utils/andall-sdk";
import UA from "@src/common/utils/ua";
const { isAndall } = UA

export default class meadjohnson extends React.Component {
  state = {
    updataVersionVisible:false
  }
  componentDidMount() {
    if (isAndall()) {
      const version = andall.info.version.replace(/\./g, '')
      if (+version <= 172) {
        this.setState({
          updataVersionVisible:true
        })
      } else {
        window.location.href = 'andall://andall.com/open_wechat_mini?miniId=gh_a191ca703b5f&pagePath=/pages/momborui/index?ncid=202006031&channel=MPopoc_momborui_202006031'
        setTimeout(() => {
          andall.invoke('back')
        }, 500)
      }
    }
  }

  goBack = () => {
    andall.invoke('back')
  }

  render() {
    const { updataVersionVisible } = this.state
    return (
      <Page title='美赞臣'>
        <div className={styles.ImgWrap}>
          <img src={img1} />
        </div>
        {updataVersionVisible &&
        <div className={styles.pupopbox}>
          <div className={styles.pupcon}>
            <p>为保证您的体验，请将App更新至最新版本，再参与此活动哦~</p>
            <div onClick={() => { this.goBack() }} className={styles.btn}>我知道了</div>
          </div>
        </div>
        }
      </Page>
    )
  }
}
