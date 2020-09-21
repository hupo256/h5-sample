import React from 'react'
import { Toast } from 'antd-mobile'
import html2canvas from 'html2canvas'
import Page from '@src/components/page/index'
import Modal from '@src/components/modal/index'
import images from './componets/images'
import {vipManageView, vipManageGoto,} from './componets/BuriedPoint'
import styles from './members'

class Renewal extends React.Component {
  state = {
    logList: [],
    closeRene: false,
  }

  componentDidMount() {
    vipManageView()

  }

  runState = (name) => {
    this.setState({
      [name]: !this.state[name],
    })
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
      // setmoreImg(canvas.toDataURL('image/jpeg'))
      // setTimeout(() => {
        andall.invoke('saveWebImage', {
          source: canvas.toDataURL('image/jpeg'),
        })
      // },300)
    })

    const pointConfig = {
      Btn_name: 'save_image',
      user_state,
    }
    vipPageGoto(pointConfig)
  }

  render() {
    const { closeRene } = this.state
    return (
      <Page title='购买记录'>
        <div className={styles.renewalBox}>
          <button onClick={() => this.runState('closeRene')}>click me</button>

          <Modal
            handleToggle={() => { this.runState('closeRene') }}
            // visible={true}
            visible={closeRene}
            >
            <div className={styles.modalCon} >
              <h3>您确认要取消自动续费吗？</h3>
              <img src={images.qrcodeimg} alt="" ref='myPoster' />
              <button onClick={this.handleHtml2Canvas} className={styles.btn}>保存二维码</button>
              <div className={styles.popTips}>
                <p>1.保存二维码到手机，打开微信扫一扫</p>
                <p>2.点击扫码界面右下方，从手机相册中扫码二维码图片</p>
              </div>

            </div>
          </Modal>
        </div>
      </Page>
    )
  }
}

export default Renewal
