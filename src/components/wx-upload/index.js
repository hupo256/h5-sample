import React from 'react'
import PropTypes from 'prop-types'
import wx from 'weixin-js-sdk'
// import { Toast } from 'antd-mobile'
/**
 * @param {Function} upload - 上传接口函数
 * @param {Function} onChange - 触发更新
 * @param {String} ImgList - 的组件注销后Url不显示
 * @param {bool} auto - 手动上传还是自动触发上传，默认手动
 * @param {string} quality - 图片压缩比例
 * @class WxUpload
 * @extends {React.Component}
 */

class WxUpload extends React.Component {
  state = {
    localId: ''
  }

  // 选择图片
  chooseImage = () => {
    const { count = 9, auto, onChange, imgList } = this.props
    const _this = this
    wx.chooseImage({
      count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const { localIds } = res
        const list = [...imgList, ...localIds]
        onChange(list)
        auto && _this.uploadImage()
      }
    })
  }

  // 上传图片
  uploadImage = () => {
    const { imgList } = this.props
    const reg = /(http:|https:)\/\/.*?(gif|png|jpg)/gi
    let localId = imgList.filter(item => !reg.test(item))
    const len = localId.length
    if (!len.length) {
      return
    }
    let num = 0
    const imgBase64List = []
    const getLocalImgData = () => {
      if (len >= num) {
        wx.getLocalImgData({
          localId: imgList[num], // 图片的localID
          success: function (res) {
            const { localData } = res
            imgBase64List.push(localData)
            num++
            getLocalImgData()
          }
        })
      } else {

      }
    }
    getLocalImgData()
  }

  // base64转换、压缩
  compressionImage = (list) => {
    const { quality, imgageType } = this.props
    const newImageList = []
    for (let n = 0; n < list.length; n++) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const image = new Image()
      image.src = list[n]
      image.onload = function () {
        let imageWidth = image.width
        let imageHeight = image.height
        canvas.setAttribute('width', imageWidth)
        canvas.setAttribute('height', imageHeight)
        ctx.clearRect(0, 0, imageWidth, imageHeight)
        ctx.drawImage(image, 0, 0, imageWidth, imageHeight)
        canvas.toBlob(function (blob) {
          newImageList.push(blob)
        }, imgageType || 'image/jpeg', quality)
      }
    }
  }

  // 预览图片
  previewImage = (current) => {
    const { imgList } = this.props
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }

  // 删除图片
  removeImage = i => {
    let { imgList } = this.props
    imgList.splice(i, 1)
    this.props.onChange(imgList)
  }

  render () {
    const { imgList } = this.props
    return (
      <div className='upload'>
        <button onClick={this.chooseImage}>选择图片</button>
        <ul>
          {
            imgList.length ? (
              imgList.map((item, i) => (
                <li
                  className='imgCenter'
                  key={i}
                  onClick={() => {
                    this.previewImage(item)
                  }}>
                  <span onClick={() => { this.removeImage(i) }} />
                  <img src={item} />
                </li>
              ))) : ''
          }
        </ul>
        <div onClick={this.uploadImage}>
          <button>上传</button>
        </div>
      </div>
    )
  }
}

WxUpload.propTypes = {
  // upload: PropTypes.func.isRequired,
  quality: PropTypes.string,
  imgageType: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  count: PropTypes.number,
  auto: PropTypes.bool,
  imgList: PropTypes.array.isRequired
}

export default WxUpload
