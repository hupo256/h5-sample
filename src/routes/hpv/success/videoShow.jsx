import React from 'react'
import ua from '@src/common/utils/ua'
import fun from '@src/common/utils'
import { AppBindFinishPageView,
  AppBindFinishPageGoto,
  ReferencevideoPageView,
  ReferencevideoPageGoto, } from './BuriedPoint'
import images from './images'
import styles from './success'

const { getSetssion, getParams } = fun
const bgArr = [images.videobg1, images.videobg2, images.videobg3, images.videobg4, images.videobg5]

class VideoShow extends React.Component {
  state = {
    videoRun: false,
    videoRun2: false,
    videoType: 1, // 1 宝宝， 2成人， 3小安， 4 hpv  5 乳腺癌
  }

  componentDidMount() {
    const { from } = this.props
    const num = this.checkVideoType()
    let viewtype = 'gene'
    num === 3 && (viewtype = 'shit')
    num === 4 && (viewtype = 'HPV')
    num === 5 && (viewtype = 'BREAST_CANCER_BIND')

    from ? AppBindFinishPageView({ viewtype }) : ReferencevideoPageView({ viewtype })
  }

  toSend = () => {
    const { from } = this.props
    const bcode = getParams().barcode || getSetssion('barcode')
    from ? AppBindFinishPageGoto({ viewtype: 'send_fight_now' }) : ReferencevideoPageGoto({ viewtype: 'send_now' })
    setTimeout(() => {
      const nextUrl = `/mkt/sampling/shipping?barcode=${bcode}`
      window.location.href = window.location.origin + nextUrl
    }, 200)
  }

  togoHome = () => {
    AppBindFinishPageGoto({ viewtype: 'send_later' })
    ua.isAndall() && andall.invoke('goHome')
  }

  toVideoRun = (video2) => {
    const { from } = this.props
    const vd = document.getElementById('videoDom')
    const vd2 = document.getElementById('videoDom2')
    if (video2) {
      vd.pause()
      vd2.play()
    } else {
      vd.play()
      vd2 && vd2.pause()
    }
    this.setState({
      videoRun: !video2,
      videoRun2: video2
    })

    const { videoType } = this.state
    let viewtype = video2 ? 'gene_baby' : 'gene_adult'
    videoType === 3 && (viewtype = 'shit')
    videoType === 4 && (viewtype = 'HPV')
    videoType === 5 && (viewtype = 'BREAST_CANCER_BIND')
    from ? AppBindFinishPageGoto({ viewtype: 'video_view' }) : ReferencevideoPageGoto({ viewtype })
  }

  checkVideoType = () => {
    const type = getParams().type || getSetssion('kitType')
    const relationId = getSetssion('relationId')
    let videoType = 0
    if (type === 'INTESTINE_BIND') {
      videoType = 3
    } else if (type === 'HPV_BIND') {
      videoType = 4
    } else if (type === 'BREAST_CANCER_BIND') {
      videoType = 5
    } else {
      videoType = +relationId === 3 ? 1 : 2
    }
    this.setState({ videoType })

    return videoType
  }

  render() {
    const { from } = this.props
    const type = getParams().type
    const isGeng = type === 'gene'
    let { videoRun, videoRun2, videoType } = this.state
    // videoType = !from && isGeng && 2
    if (!from && isGeng) videoType = 2
    let theImg = bgArr[videoType - 1]

    return (
      <div className={styles.shadowbox}>
        <div
          onClick={() => this.toVideoRun()}
          className={`${styles.videoBox} ${videoRun ? styles.noBg : ''}`}
          style={{ backgroundImage: videoRun ? 'none' : `url(${theImg})` }}
        >
          <video id='videoDom' controls src={`//static.andall.com/shop/video/caiyang${videoType}.mp4`} />
        </div>

        {!from && isGeng &&
          <div
            onClick={() => this.toVideoRun(true)}
            className={`${styles.videoBox} ${videoRun2 ? styles.noBg : ''}`}
            style={{ backgroundImage: `url(${bgArr[0]})` }}
          >
            <video id='videoDom2' controls src={`//static.andall.com/shop/video/caiyang1.mp4`} />
          </div>
        }

        <div className={styles.instruc}>
          <p>如因特殊情况取消了上门取件，你可自行拨打顺丰热线95338再次预约顺丰上门取件，以“到付”的方式将样本回寄安我基因检测中心。</p>
          <p>我们的地址是：安我收录中心（张敏，18817701211），上海市浦东新区赵高公路1628号安我顺丰中心。</p>
        </div>

        <button onClick={this.toSend} className={styles.btn}>预约顺丰快递免费上门取件</button>
        {from && <button onClick={this.togoHome} className={`${styles.btn} ${styles.grayBtn}`}>稍后回寄</button>}
      </div>
    )
  }
}

export default VideoShow
