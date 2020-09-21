import React from 'react'
import Page from '@src/components/page'
import styles from './invite.scss'
import { fun } from '@src/common/app'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
import QRCode from 'qrcode.react'
import html2canvas from 'html2canvas'
import andall from '@src/common/utils/andall-sdk'
const { getParams } = fun
class CodeInvite extends React.Component {
  state = {
    loading:false,
    relationship:'',
    inviteInfo:{},
    imgUrl:''
  }
  componentDidMount () {
    healthRecordsApi.getShareData({
      shareType:+getParams().type,
      friendRelationId:+getParams().id
    }).then(res => {
      if (res) {
        this.setState({
          inviteInfo:res.data,
        }, () => {
          this.handleHtml2Canvas()
          var canvas = document.getElementsByTagName('canvas')[0]
          var img = this.convertCanvasToImage(canvas)
          this.setState({ imgUrl:img.src }, () => {
            console.log(this.state.imgUrl)
          })
        })
      }
    })
  }
  shareCode=() => {
    setTimeout(() => {
      andall.invoke('share', {
        type: 'image',
        title: '', // 微信标题
        text: '', // 微博标题
        image: this.state.shareImage,
        bgColor: 'ffffff',
        opacity: '0'
      })
    }, 500)
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
      this.setState({ shareImage: canvas.toDataURL('image/jpeg') })
    })
  }
  convertCanvasToImage(canvas) {
    // 新建Image对象
    var image = new Image()
    // canvas.toDataURL 返回的是一串Base64编码的URL
    image.src = canvas.toDataURL('image/png')
    return image
  }
  downloadCode=() => {
    andall.invoke('saveWebImage', {
      source: this.state.shareImage
    })
  }
  render () {
    const { inviteInfo } = this.state
    return (
      <Page title='邀请亲友'>
        <div className={styles.codeInvite}>
          <div className={styles.info} ref='myPoster'>
            <h5>邀请<span>{inviteInfo.title}</span>加入家庭成员</h5>
            {
              inviteInfo.shareUrl
                ? <div>
                  <QRCode
                    id='qrid'
                    value={inviteInfo.shareUrl} // value参数为生成二维码的链接
                    size={200} // 二维码的宽高尺寸
                    fgColor='#000000' // 二维码的颜色
                  />
                </div>
                : ''
            }
            <p>邀请二维码</p>
          </div>
          <div className={styles.save}>
            <span onClick={this.downloadCode}>保存到相册</span>
            <label />
            <span onClick={this.shareCode}>分享二维码</span>
          </div>
        </div>
      </Page>
    )
  }
}

export default CodeInvite
