import React from 'react'
import axios from 'axios'
import { DatePickerView, Toast, ImagePicker } from 'antd-mobile'
import Page from '@src/components/page/index'
import Form from './componets/Form/index'
import fun from '@src/common/utils/index'
import ua from '@src/common/utils/ua'
import activeApi from '@src/common/api/activeApi'
import questionnaireApi from '@src/common/api/questionnaireApi'
import { ZlAddresseeView, ZlAddresseeConfirmGoto,} from './componets/BuriedPoint';
import styles from './edit'
const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)
const { getParams, fmtDate, isPoneAvailable } = fun

export default class EditOrder extends React.Component {
  state = {
    files:[],
    dateArr: [],
    expectDate: now,
    imageNameList: [],
    orderAddress: {},
    phoneNum: false,
  }
  componentDidMount () {
    console.log(this.props)
    // const { activeData } = this.state
    const { state } = this.props.location
    const productId = state ? state.productId : ''
    ZlAddresseeView({product_id: productId})
    this.getMaxDate()
  }

  b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    var byteCharacters = atob(b64Data.substring(b64Data.indexOf(',') + 1));
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  };

  // 获取oss签名，并保存
  getOssTokenAndUpload  = (imgBase64List) => {
    // 获取签名
    Toast.loading('识别中...', 5)
    questionnaireApi.getOssToken({ noloading:1 }).then(res => {
      const { code, data } = res
      if (code) return
      let excuteCount = 0
      // Convert it to a blob to upload
      const imageNameList = []
      const len = imgBase64List.length
      const upLoadImage = () => {
        if (len > excuteCount) {
          let data64 = imgBase64List[excuteCount].url
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
            const imgName = `yanchan-${uuid()}.png`
            formData.append('name', imgName)
            formData.append('key', data.dir + imgName)
            formData.append('policy', data.policy)
            formData.append('OSSAccessKeyId', data.accessid)
            formData.append('success_action_status', '200') // 让服务端返回200,不然，默认会返回204
            formData.append('callback', data.callback)
            formData.append('signature', data.signature)
            formData.append('file', chunkBlob)
            let host = data.host
            let config = {headers: {'Content-Type': 'multipart/form-data;boundary=ZnGpDtePMx0KrHh'}}
            // 本地协议和oss协议要保持一致
            axios.post(host, formData, config).then(res => {
              ++excuteCount
              imageNameList.push(data.dir + imgName)
              if (excuteCount === len) {
                this.setState({imageNameList})
                Toast.hide()
              }
              upLoadImage()
            }).catch(err => {
              console.log(err)
            })
          }
          ossUpload(this.b64toBlob(data64));
        } else {
          Toast.hide()
        }
      }
      upLoadImage()
    })
  }

  imgChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({files});

    this.getOssTokenAndUpload(files)
  }

  formChange = (value, key) => {
    console.log(value, key)
    const { orderAddress } = this.state;
    let addersObj = {[key]: value};
    if(key === 'adders') {
      addersObj = {
        area: value[2].split('-')[1],
        city: value[1].split('-')[1],
        provinces: value[0]
      }
    }
    if(key === 'mobile'){
      const isPhone = isPoneAvailable(+value);
      isPhone && this.setState({phoneNum: true})
    }
    Object.assign(orderAddress, addersObj);
    this.setState({orderAddress});
  }

  formBlur = (value, key) => {
    const isPhone = isPoneAvailable(+value);
    if(!isPhone){
      Toast.fail('电话号码不符合规范', 2);
      this.setState({phoneNum: false})
    }else{
      this.setState({phoneNum: true})
    }
  }

  clumChange = (date) => {
    this.setState({
      expectDate: date
    });
  }

  toOrder = () => {
    const { activCode, productId } = this.props.location.state
    const { expectDate, imageNameList, orderAddress } = this.state
    // const { activCode, productId } = activeData
    console.log(activCode, productId)
    const paras = {
      orderAddress,
      channelCode: 'DJJL5C',
      expectDate: fmtDate(expectDate),
      picUrls: imageNameList.join(','),
      productId: +getParams().productId || 2537011363102720,
      clientType: ua.isAndall() ? 'APP' : 'WeChat',
      activCode,
    }

    activeApi.activOrderSubmit(paras).then(rs => {
      const {code, data, msg} = rs
      console.log(rs);
      if(code) {
        Toast.fail(msg, 4);
        return
      }

      ZlAddresseeConfirmGoto({order_id: data, product_id: productId})
      this.props.history.push({
        pathname:'/yunchan-succeed',
        state:{ activCode, orderId: data }
      })
    });
  }

  addMonth = (date, offset) => {
    if (date instanceof Date && !isNaN(offset)) {
        let givenMonth = date.getMonth();
        let newMonth = givenMonth + offset;
        date.setMonth(newMonth);
        return date;
    }
    throw Error('argument type error');
  }

  getMaxDate = () => {
    this.setState({
      maxDate: this.addMonth(new Date(), 10)
    })
  }

  render () {
    const { expectDate, orderAddress, files, phoneNum, maxDate } = this.state
    const { state } = this.props.location
    const showGestationFlag = state ? state.showGestationFlag : 2
    return (
      <Page title='孕妈基因检测0元领'>
        <div className={styles.editOrder}>
          <div className={styles.edittop}>
            <div className={styles.formtit}></div>
            <div className={styles.inforBox}>
              { showGestationFlag === 2 && 
                <React.Fragment>
                <div className={styles.dateBox}>
                  <h3>请如实填写预产期</h3>
                  <DatePickerView
                    mode='date'
                    title='选择日期'
                    minDate={now}
                    maxDate={maxDate}
                    value={expectDate}
                    onChange={this.clumChange}
                  />
                </div>

                <div className={styles.upImgBox}>
                  <h3>拍照上传孕妇建档手册</h3>
                  <p className={styles.fccc}>“末次月经”和“孕产期”信息需清晰可见,以保证正确识别</p>
                  <div className={styles.upBox}>
                    <ImagePicker
                      files={files}
                      onChange={this.imgChange}
                      onImageClick={(index, fs) => console.log(index, fs)}
                      selectable={files.length < 2}
                      multiple={false}
                    />
                  </div>
                </div>
                </React.Fragment>
              }
              
              <div className={styles.editaddress}>
                <h3>填写收货地址</h3>
                <Form onChange={this.formChange} onBlur={this.formBlur} type={0}/>
              </div>
            </div>  
          </div>

          <div className='foot'>
            {showGestationFlag === 2 ?
              (<button 
                disabled={!(files.length > 0 
                  && orderAddress.addressDetail 
                  && orderAddress.name 
                  && orderAddress.city 
                  && phoneNum)} 
                className={`pinkBtn ${styles.foot}`}
                onClick={this.toOrder} 
              > 确认领取</button>) : 
              (<button 
                disabled={!(orderAddress.addressDetail 
                  && orderAddress.name 
                  && orderAddress.city 
                  && phoneNum)} 
                className={`pinkBtn ${styles.foot}`}
                onClick={this.toOrder} 
              > 确认领取</button>)
            }
          </div>
        </div>
      </Page>
    )
  }
}

