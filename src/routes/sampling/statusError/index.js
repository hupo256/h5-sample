import React from 'react'
import { API, fun } from '@src/common/app'
import { Page, Modal } from '@src/components'
import styles from './error'
import { Toast, Picker } from 'antd-mobile'
import addressData from '@src/assets/json/city.json'
const { getSetssion, getParams } = fun

let addersList = []
class Status extends React.Component {
  state = {
    noData:false,
    data:{},
    info: null, // 1，显示3个按钮，4，显示修改信息，2，信息正确,3,放弃重新采样
    abandonModal: false,
    name: '',
    mobile: '',
    addressDetail: '',
    cityVisible: false, // 城市选择器是否显示
    cityValue: [] // 默认显示的省市
  }
  componentDidMount () {
    this.formatData()
    const { type } = getParams()
    this.setState({
      info: +type,
    })
    this.getSampleExceptionInfo()
  }

  getSampleExceptionInfo = (num) => {
    const { type } = getParams()
    const obj = getSetssion('samplingError')
    API.getSampleExceptionInfo(obj).then(res => {
      const { code, data } = res
      if (!code) {
        const { name, mobile, addressDetail, provinces, city, area, orderType } = data
        const cityValue = [provinces, city, area]
        this.setState({
          data,
          name,
          mobile,
          addressDetail: `${addressDetail}`,
          cityValue
        })
        if (!num && +type !== 2 && +orderType !== 1 && +orderType !== 2 && +orderType !== 3) {
          this.setState({
            info: 4,
            name: '',
            mobile: '',
            addressDetail: '',
            cityValue: []
          })
        }
        if (num === 2) {
          this.setState({
            info: 2
          })
        } else if (num === 3) {
          this.setState({
            info: 3
          })
        }
      }
    })
  }
  handleChangeInfo = (type) => {
    if (type === 'abandon') { // 放弃重新采样
      this.setState({
        abandonModal: true
      })
    } else if (type === 4) { // 修改信息
      this.setState({
        info: type
      })
    } else if (type === 3) { // 信息正确
      this.handleSubmit(1)
    }
  }
  handleToggle = () => {
    this.setState({
      abandonModal: false
    })
  }
  handleCancle = () => {
    const { data = {} } = this.state
    const { sampleExcepitonResp = {} } = data
    const parmas = {
      barCode: sampleExcepitonResp.barCode.split(','),
      orderId: getSetssion('samplingError').orderId
    }
    API.cancelRepeatSample(parmas).then(res => {
      const { code } = res
      if (!code) {
        // 确认放弃
        this.getSampleExceptionInfo(3)
        this.setState({
          abandonModal: false
        })
      }
    })
  }
  handleSubmit = (type) => {
    const { data = {} } = this.state
    const { sampleExcepitonResp = {} } = data
    const { name, mobile, addressDetail, provinces, city, area } = data
    const parmas = {
      addressDetail,
      barCode: sampleExcepitonResp.barCode.split(','),
      mobile,
      name,
      orderId: getSetssion('samplingError').orderId
    }
    if (type === 1) { // 信息正确
      parmas['provinces'] = provinces
      parmas['city'] = city
      parmas['area'] = area
    } else if (type === 2) { // 信息修改提交
      const { name, mobile, addressDetail, cityValue } = this.state
      if (name === '' || mobile === '' || addressDetail === '') {
        // Toast
        Toast.info('请完善相关信息')
        return false
      } else {
        parmas['name'] = name
        parmas['mobile'] = mobile
        parmas['addressDetail'] = addressDetail
        parmas['provinces'] = cityValue[0]
        parmas['city'] = cityValue[1]
        parmas['area'] = cityValue[2]
      }
    }
    API.repeatSample(parmas).then(res => {
      const { code } = res
      if (!code) {
        this.getSampleExceptionInfo(2)
      }
    })
  }
  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    })
  }
  handleMobileChange = (e) => {
    this.setState({
      mobile: e.target.value
    })
  }
  handleAddressChange = (e) => {
    this.setState({
      addressDetail: e.target.value
    })
  }
  handleSetContent = (obj = {}) => {
    if (obj.status === 'DFH') {
      return `发货时间：预计${this.handleGetDate()}发货`
    } else if (obj.status === 'YQS') {
      return `签收时间：${obj.receiveTime ? obj.receiveTime : ''}`
    } else {
      return `发货时间：${obj.sendTime ? obj.sendTime : ''}`
    }
  }
  handleGetDate = () => {
    let day = new Date()
    day.setTime(day.getTime() + 24 * 60 * 60 * 1000)
    return `${day.getFullYear()}年${day.getMonth() + 1}月${day.getDate()}日`
  }
  // 省市区三级联动数据包装
  formatData = () => {
    const adders = []
    for (let province in addressData) {
      const label = addressData[province].name
      const city = addressData[province].city
      const children = []
      for (let n = 0, len = city.length; n < len; n++) {
        const cityList = {
          label:city[n].name,
          value:`${city[n].name}`,
          children:[]
        }
        if (city[n].area && city[n].area.length) {
          for (let i = 0, lens = city[n].area.length; i < lens; i++) {
            cityList.children.push({
              label: city[n].area[i],
              value:`${city[n].area[i]}`,
            })
          }
        }
        children.push(cityList)
      }
      const data = {
        label,
        value:label,
        children
      }
      adders.push(data)
    }
    addersList = adders
  }
  // 显示隐藏省市区
  handleToggleCity = () => {
    const { cityVisible } = this.state
    this.setState({ cityVisible: !cityVisible })
  }
  // 显示省市区
  handleChangeCity = () => {
    this.setState({ cityVisible: true })
  }
  render () {
    const { data = {}, cityVisible, cityValue } = this.state
    const { sampleExcepitonResp = {}, tradeInvoiceResp = {} } = data
    const { info, abandonModal, name, mobile, addressDetail } = this.state
    return (
      <Page title='样本状态'>
        <div className={styles.boxs}>
          <div className={styles.title}>样本信息</div>
          <div className={styles.samplingInfo}>
            <p className={styles.info}>样本号：{sampleExcepitonResp.barCode}</p>
            <p className={styles.info}>检测人：{sampleExcepitonResp.linkManName}</p>
            <p className={styles.error}>样本状态：{sampleExcepitonResp.labStage}</p>
          </div>
          <div className={styles.title}>异常样本处理</div>
          {
            info === 1 ? <div className={styles.samplingError}>
              <p className={styles.error}>样本无法进行检测，需要重新采集唾液样本，请确认如下收件信息。（仅免费提供一次重新采样）</p>
              <p className={styles.info}>收件人：{data.name}</p>
              <p className={styles.info}>联系方式：{data.mobile}</p>
              <p className={styles.info}>地址：
                {`${data.provinces}${data.city}${data.area ? data.area : ''}${data.addressDetail}`}
              </p>
              <div className={styles.btns}>
                <p className={styles.first}>
                  <span onClick={() => this.handleChangeInfo(3)}>信息正确</span>
                  <span onClick={() => this.handleChangeInfo(4)}>修改信息</span>
                </p>
                <p className={styles.second}>
                  <span onClick={() => this.handleChangeInfo('abandon')}>放弃重新采样</span>
                </p>
              </div>
            </div> : null
          }
          {
            info === 4 ? <div className={styles.samplingError}>
              <p className={styles.error}>样本无法进行检测，需要重新采集唾液样本，请确认如下收件信息。（仅免费提供一次重新采样）</p>
              <p className={styles.modify}>
                <span>收件人</span>
                <input onChange={this.handleNameChange} defaultValue={name} />
              </p>
              <p className={styles.modify}>
                <span>联系方式</span>
                <input maxLength='11' onChange={this.handleMobileChange} defaultValue={mobile} />
              </p>
              <p className={styles.modify}>
                <span>所在区域</span>
                <input
                  onClick={() => this.handleChangeCity()}
                  readOnly
                  value={cityValue.join('')} />
              </p>
              <p className={styles.modify}>
                <span>地址</span>
                <input
                  onChange={this.handleAddressChange}
                  defaultValue={addressDetail} />
              </p>
              <div className={styles.submitBtn}>
                <span onClick={() => this.handleSubmit(2)}>提交</span>
              </div>
            </div> : null
          }
          {
            info === 2 ? <div className={styles.samplingError}>
              <p className={styles.error}>重新采样信息</p>
              <p className={styles.info}>收件人：{tradeInvoiceResp.name}</p>
              <p className={styles.info}>联系方式：{tradeInvoiceResp.mobile}</p>
              <p className={styles.info}>地址：
                {`
                ${
      tradeInvoiceResp.provinces ? tradeInvoiceResp.provinces : ''
      }${
        tradeInvoiceResp.city ? tradeInvoiceResp.city : ''
      }${
        tradeInvoiceResp.area ? tradeInvoiceResp.area : ''
      }${tradeInvoiceResp.addressDetail}
                `}</p>
              <div className={styles.confirm}>
                <p className={styles.conInfo}>重新采样单号：{tradeInvoiceResp.invoiceNo}</p>
                <p className={styles.conInfo}>订单状态：{tradeInvoiceResp.statusName}</p>
                <p className={styles.conInfo}>{this.handleSetContent(tradeInvoiceResp)}</p>
              </div>
            </div> : null
          }
          { info === 3 && data.productName &&
            <div className={styles.samplingError}>
              <p className={styles.info}>你已确认放弃重新采样，基于该样本的<span className={styles.error}>{data.productName}</span>将无法生成基因检测报告。</p>
              <p className={styles.info}>确认时间：{tradeInvoiceResp && tradeInvoiceResp.giveupResampleTime}</p>
              <p className={styles.info}>客服电话：400-682-2288</p>
            </div> 
          }

          { info === 3 && !data.productName &&
            <div className={styles.samplingError}>
              <p className={styles.error}>客户放弃重新采样</p>
              <p className={styles.info}>确认时间：{tradeInvoiceResp && tradeInvoiceResp.giveupResampleTime}</p>
            </div>
          }
          <Modal
            visible={abandonModal}
            type={false}
            handleToggle={() => { this.handleToggle() }}
          >
            <div className={styles.modalTxt}>
              {data.productName ? 
                <p className={styles.modalTitle}>确认放弃采样后，视为客户主动放弃检测，并无法再次申请采样。且基于该样本的<span className={styles.error}>{data.productName}</span>等将无法生成基因检测报告。</p> :
                <p className={styles.modalTitle}>确认放弃采样后，视为客户主动放弃检测，并无法再次申请采样。</p>
              }
              <div className={styles.modalBtns}>
                <span onClick={this.handleToggle}>取消</span>
                <span onClick={this.handleCancle} className={styles.cancle}>确定放弃</span>
              </div>
            </div>
          </Modal>

          <Picker
            data={addersList}
            visible={cityVisible}
            title='选择地区'
            onOk={() => { this.handleToggleCity() }}
            onDismiss={() => { this.handleToggleCity() }}
            extra='请选择(可选)'
            value={cityValue}
            onChange={cityValue => {
              this.setState({ cityValue })
            }}
          />
        </div>
      </Page>
    )
  }
}

export default Status
