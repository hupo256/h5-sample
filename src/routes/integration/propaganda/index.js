import React from 'react'
import { Page } from '@src/components'
import images from '../images'
import styles from './index.scss'
import html2canvas from 'html2canvas'

class Propaganda extends React.Component {
  state = {
    loading:false,
    rules:{},
    taskRules:[],
  }
  componentDidMount () {

  }
  goBtn=() => {
    location.href = 'andall://andall.com/inner_webview?url=https://wechatshop.andall.com/mkt/meadjohnson'
  }
  saveWechat=() => {
    let myPoster = document.getElementById('wechatCode')
    let canvas = document.createElement('canvas')
    canvas.width = myPoster.offsetWidth * 3
    canvas.height = myPoster.offsetHeight * 3
    let opts = {
      scale: 3,
      canvas: canvas,
      width: myPoster.offsetWidth,
      height: myPoster.offsetHeight,
      useCORS: true
    }
    html2canvas(myPoster, opts).then(canvas => {
      andall.invoke('saveWebImage', {
        source: canvas.toDataURL('image/jpeg'),
      })
    })
  }
  render () {
    return (
      <Page title='安我携手美赞臣'>
        <div className={styles.propaganda}>
          <img src={images.propaganda1} className={styles.img1} />
          <div className={styles.box}>
            <img src={images.propaganda2} className={styles.img2} />
            <p onClick={this.goBtn}>点此注册美赞臣妈妈会</p>
            <img id='wechatCode' src={images.wechat2} className={styles.wechatCode} onClick={this.saveWechat} />
            <div className={styles.saveBtn} onClick={this.saveWechat} />
          </div>

        </div>
      </Page>
    )
  }
}

export default Propaganda
