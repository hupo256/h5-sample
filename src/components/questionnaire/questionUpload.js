import React from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import wx from 'weixin-js-sdk'
import { Toast } from 'antd-mobile'
import { API, fun, ua } from '@src/common/app'
import styles from './questionnaire.scss'
const { fixScroll } = fun
const { isIos } = ua
// import { b64Data } from './b64'
class QuestionUpload extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      defaultCount:3,
      inputValue:'',
      imgList:[]
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      defaultCount:3,
      inputValue:'',
      imgList:[]
    })
  }
  // 选择图片
  chooseImage = () => {
    const { defaultCount, imgList } = this.state
    let count = defaultCount - imgList.length
    wx.chooseImage({
      count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:(res) => {
        const { localIds } = res
        //  'localIds':['wxLocalResource://imageid123456789987654321', 'wxLocalResource://imageid987654321123456789']
        this.setState({
          imgList:imgList.concat(localIds)
        })
      }
    })
  }

  // 预览图片
  previewImage = (current) => {
    const { imgList } = this.state
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }

  // 删除图片
  removeImage = i => {
    let { imgList } = this.state
    imgList.splice(i, 1)
    this.setState({
      imgList:imgList
    })
  }

  compressionImage = (base64Data, uploadImg) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const image = new Image()
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = function () {
      let imageWidth = image.width
      let imageHeight = image.height
      canvas.setAttribute('width', imageWidth)
      canvas.setAttribute('height', imageHeight)
      ctx.clearRect(0, 0, imageWidth, imageHeight)
      ctx.drawImage(image, 0, 0, imageWidth, imageHeight)
      canvas.toBlob(function (blob) {
        uploadImg(blob)
      }, 'image/png', 0.1)
    }
    image.src = base64Data
  }
  onSure = () => {
    const { imgList, inputValue } = this.state
    const { onPicUpload, answerObj } = this.props
    if (!imgList.length && inputValue === '') {
      Toast.info('请上传图片或者输入内容')
      return
    }
    if (inputValue !== '' && !imgList.length) {
      onPicUpload(answerObj.quesId, [], this.state.inputValue, answerObj.answerResps)
    } else {
      const reg = /(http:|https:)\/\/.*?(gif|png|jpg)/gi
      let localId = imgList.filter(item => !reg.test(item))
      const len = localId.length
      if (!len) return
      let num = 0
      const imgBase64List = []
      const getLocalImgData = () => {
        if (len > num) {
          wx.getLocalImgData({
            localId: localId[num], // 图片的localID
            success: function (res) {
              const { localData } = res
              imgBase64List.push(localData)
              ++num
              getLocalImgData()
            }
          })
        } else {
          this.getOssTokenAndUpload(imgBase64List)
        }
      }
      getLocalImgData()
    }
  }
  // 获取oss签名，并保存
  getOssTokenAndUpload (imgBase64List) {
    const { onPicUpload, answerObj } = this.props
    // 获取签名
    Toast.loading('正在上传...', 0)
    API.getOssToken({ noloading:1 }).then(res => {
      const { code, data } = res
      if (code) return
      let excuteCount = 0
      // Convert it to a blob to upload
      const imageNameList = []
      const len = imgBase64List.length
      const upLoadImage = () => {
        if (len > excuteCount) {
          let data64 = imgBase64List[excuteCount]
          if (data64.indexOf('base64,') > -1) {
            if (data64.indexOf('jgp') > -1) {
              data64 = data64.replace('jgp', 'png')
            }
          } else {
            data64 = 'data:image/png;base64,' + data64
          }
          const ossUpload = (blob) => {
            let chunkBlob = blob// new Blob([pureBase64], { 'type':'image/png' })
            let formData = new FormData()
            const uuid = () => {
              return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                let r = Math.random() * 16 | 0
                let v = c === 'x' ? r : (r & 0x3 | 0x8)
                return v.toString(16)
              })
            }
            const imgName = `${answerObj.quesId}-${uuid()}.png`
            formData.append('name', imgName)
            formData.append('key', data.dir + imgName)
            formData.append('policy', data.policy)
            formData.append('OSSAccessKeyId', data.accessid)
            formData.append('success_action_status', '200') // 让服务端返回200,不然，默认会返回204
            formData.append('callback', data.callback)
            formData.append('signature', data.signature)
            formData.append('file', chunkBlob)
            let host = data.host
            let config = {
              headers: {
                'Content-Type': 'multipart/form-data;boundary=ZnGpDtePMx0KrHh'
              }
            }
            // 本地协议和oss协议要保持一致
            axios.post(host, formData, config).then(res => {
              ++excuteCount
              imageNameList.push(imgName)
              if (excuteCount === len) {
                Toast.hide()
                onPicUpload(answerObj.quesId, imageNameList, this.state.inputValue, answerObj.answerResps)
              }
              upLoadImage()
            }).catch(err => {
              console.log(err)
            })
          }
          this.compressionImage(data64, ossUpload)
        } else {
          Toast.hide()
        }
      }
      upLoadImage()
    })
  }
  onChange =(e) => {
    let target = e.target
    if (!target.value) {
      target.style.height = '28px'
    }
    target.style.height = target.scrollTop + target.scrollHeight + 'px'
    this.setState({
      inputValue: e.target.value
    })
  }
  render () {
    let top = 0
    const { answerObj } = this.props
    const { imgList, defaultCount } = this.state
    return (
      <div className={styles.questionContent}>
        <div className={styles.qLogoDiv}>
          <img className={styles.qLogo} src={answerObj.quesPicUrl} />
        </div>
        <div className={styles.qTitle}>
          {answerObj.questionOrder}.{answerObj.quesName} {answerObj.quesDesc}
          {/* <p>{answerObj.quesDesc}</p> */}
        </div>
        <div className={styles.qAnswerUpload}>
          {imgList.length ? (
            imgList.map((item, i) => (
              <div key={i} className={styles.qUploadItem}>
                <div className={styles.qUploadDelete}
                  onClick={() => { this.removeImage(i) }} />
                <img className={styles.qUploadItem}
                  onClick={() => { this.previewImage(item) }}
                  src={item} />
              </div>
            ))) : ''
          }
          {
            imgList.length >= defaultCount ? ''
              : <div className={`imgCenter ${styles.qUploadBtn}`}
                onClick={this.chooseImage} >
                <div className={styles.BtnDiv} />
              </div>
          }
        </div>
        <div>
          <div className={styles.qAnswerOtherInput}>
            {/* <input placeholder='请在这里输入诊断结果...' onChange={this.onChange} /> */}
            <textarea maxLength='100' placeholder='请在这里输入诊断结果...'
              value={this.state.inputValue}
              onFocus={() => {
                if (isIos()) { top = fixScroll().top }
              }}
              onBlur={() => {
                isIos() && window.scrollBy(0, top)
              }}
              onChange={this.onChange} />
          </div>
          <p className={`${styles.qSureBtn}`} onClick={this.onSure} >确定</p>
        </div>
      </div>
    )
  }
}
QuestionUpload.propTypes = {
  answerObj:PropTypes.object,
  onPicUpload:PropTypes.func,
}
export default QuestionUpload
