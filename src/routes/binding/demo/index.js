import React from 'react'
import { Page } from '@src/components'
import styles from './demo.scss'
import images from '@src/common/utils/images'
import andall from '@src/common/utils/andall-sdk'
console.log(images)
class CouponList extends React.Component {
  getMobile() {
    andall.invoke('getMobile', { params: 'getMobile' }, function (response) {
      console.log('h5调用原生getMobile方法回调返回参数', response, 222)
    })
  }
  scanQRCode() {
    andall.invoke('scanQRCode', { params: 'scanQRCode' }, function (response) {
      console.log('h5调用原生scanQRCode方法回调返回参数', response)
    })
  }
  share() {
    andall.invoke('share', {
      'type': 'link',
      'title': '微信链接分享测试',
      'text': '内容内容',
      'url': 'https://www.andall.com/images/anwoCode.jpg',
      'thumbImage': 'https://www.andall.com/images/anwoCode.jpg',
      'image': 'https://www.andall.com/images/anwoCode.jpg'
    })
  }
  login() {
    andall.invoke('login')
  }
  token() {
    andall.invoke('token', {}, function (res) {
      console.log('js获取token信息', res)
      localStorage.setItem('token', res.result.token)
    })
  }
  render() {
    return (
      <Page title='h5 原生交互demo'>
        <div className={styles.demo}>
          <div onClick={this.getMobile}>h5调用原生getMobile方法</div>
          <div onClick={this.scanQRCode}>h5调用原生scanQRCode方法</div>
          <div onClick={this.share}>h5调用原生share分享方法</div>
          <div onClick={this.login}>h5调用原生登录分享方法</div>
          <div onClick={this.token}>h5获取token信息</div>
          <div>
            <img src={images.saleBind} alt='' />
            <img src={images.demo} alt='' />
          </div>
          <div className={styles.demoBg} />
          <div className={styles.demoBg1} />
        </div>
      </Page>
    )
  }
}

export default CouponList
