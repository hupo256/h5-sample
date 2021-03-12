import React from 'react'
import propTypes from 'prop-types'
import html2canvas from 'html2canvas'
import { API } from '@src/common/app'
import { Case } from '@src/components/case/Case'
import styles from './lovers.scss'
import loversCodeBg from '@static/yunchan-lego/loversCodeBg.png'
import close from '@static/yunchan-lego/close.png'
class LoversCode extends React.Component {
  state = {
    QRcode: '',
    base64: ''
  }
  static propTypes = {
    // cancleFn: propTypes.func,
    // linkManId: propTypes.string.isRequired
  }
  componentDidMount() {
    console.log(this.props)
    this.handleHtml2Canvas()
  }
  
  handleHtml2Canvas = () => {
    let myPoster = this.refs.myPoster
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
      this.setState({ base64: canvas.toDataURL('image/jpeg') })
      setTimeout(() => {
        andall.invoke('share', {
          type: 'image',
          title: '', // 微信标题
          text: '', // 微博标题
          image: canvas.toDataURL('image/jpeg'),
          bgColor: 'ffffff',
          opacity: '0'
        })
      }, 100)
    })
  }

  cancleFn = () => {
    this.setState({
      base64: 'asdsf'
    })
  }
  render() {
    // const { cancleFn } = this.props
    const { QRcode, base64 } = this.state
    return (
      <div className={styles.loversCode}>
        <Case when={!!base64}>
          <img className={styles.loversCont} src={base64} />
        </Case>
        <Case when={!base64}>
          <div className={styles.loversCont} ref='myPoster'>
            <img className={styles.loversCodeBg} src={loversCodeBg} alt='' />
            <div className={styles.detail}>
              <p className={styles.title}>分享二维码邀请我的ta</p>
              <p className={styles.subTitle}>生成我们的蜜侣基因检测报告</p>
              <p className={styles.desc1}>长按保存或转发二维码图片</p>
              <img className={styles.code} src={QRcode} alt='' />
              <div className={styles.desc2}>
                <p>仅能与一人匹配</p>
                <p>感情中切莫贪心</p>
              </div>
            </div>
          </div>
        </Case>
        <img onClick={this.cancleFn} className={styles.close} src={close} alt='' />
      </div>
    )
  }
}

export default LoversCode
