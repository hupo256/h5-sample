import React from 'react'
import PropTypes from 'prop-types'
import { Toast, Picker } from 'antd-mobile'
import Page from '@src/components/page'
import ua from '@src/common/utils/ua'
import fun from '@src/common/utils'
import reg from '@src/common/utils/regExp'
import samplingApi from '@src/common/api/samplingApi'
import addressData from '@src/assets/json/city.json'
import point from '@src/common/utils/point'
import styles from '../sampling'
import images from '../images'
const { isIos } = ua
const { getSetssion, fixScroll, isPoneAvailable, setSession, getSession, getParams } = fun
const { allPointTrack } = point
let addersList = []

class Shipping extends React.Component {
  state = {
    formData: {},
    show: false,
    visible: false,
    timeList: [],
    preReturnTime: ''
  }
  // 埋点记录去回寄样本
  trackPointSampleSendBackInput(formData) {
    const arrBarCode = getSetssion('samplingBarCode')
    let { name, adders = [], mobile } = formData
    const [provinces, city, area] = adders
    // 同时回寄多个barcode 埋入多条记录
    for (let barCode of arrBarCode) {
      let obj = {
        eventName: 'sample_sendback_input',
        pointParams: {
          sample_barcode: barCode,
          sample_send_name: name.substr(0, 1) + '**',
          sample_send_phone: mobile.substr(0, 3) + '*****' + mobile.substr(8, 3),
          sample_send_address: provinces + city + area + '******'
        }
      }
      allPointTrack(obj)
    }
  }

  componentDidMount() {
    this.formatData()
    let formData = getSession('formData')
    if (!formData) {  // session里没有就找API拿
      const params = {barCode: getParams().barcode}
      samplingApi.getCollectorHjAddress(params).then(res => {
        const {code, data} = res
        if(code) return
        const {name, mobile, addressDetail, provinces, city, area} = data
        const adders = [provinces, city, area] 
        formData = {name, mobile, addressDetail, adders}
        this.setState({ formData })
      })
      return
    }
    this.setState({ formData })
  }

  handleSubmit = () => {
    const { formData } = this.state
    const cids = getSetssion('sampling')
    let { name, adders = [], mobile, addressDetail, preReturnTime } = formData
    name && (name = name.replace(reg.space, ''))
    addressDetail && (addressDetail = addressDetail.replace(reg.space, ''))

    if (!name) {
      Toast.info('请填写寄件人')
      return
    }
    if (!reg.phone.test(mobile)) {
      Toast.info('请填写正确手机号')
      return
    }
    if (!adders.length) {
      Toast.info('请选择地区')
      return
    }
    if (!addressDetail) {
      Toast.info('请填写详细地址')
      return
    }
    if (!preReturnTime) {
      Toast.info('请选择预约时间')
      return
    }
    this.trackPointSampleSendBackInput(formData)
    setSession('formData', formData)

    const [provinces, city, area] = adders
    const [time, hours] = preReturnTime
    const newtime = time + ' ' + hours.split('-')[0] + ':00'
    this.props.history.push({
      pathname: '/sampling/return',
      state: {
        addr: {
          ...formData,
          name,addressDetail,provinces, city, area,adders: ''
        },
        collectorIds: cids,
        preReturnTime: newtime,
        hoursList: time + ' ' + hours
      }
    })
  }

  // 显示隐藏省市区
  handleToggle = (name = 'visible') => {
    const bool = this.state[name]
    if (name === 'show') {
      this.getDayList(3)
      return
    }
    this.setState({ [name]: !bool })
  }

  // 预约时间包装
  getDayList = (n) => {
    const { show } = this.state
    const date = new Date()
    const curTime = date.getTime()
    const hours = date.getHours() + 1
    const dayList = []
    const bool = hours >= 17
    // 获取时间段
    let hoursList = []
    for (let i = 10; i < 17; i++) {
      const nowTime = i + ':00-' + (i + 1) + ':00'
      hoursList.push({ value: nowTime, label: nowTime, bool: hours > i })
    }
    // 获取天数
    for (let i = bool ? 1 : 0; i < (bool ? n + 1 : n); i++) {
      let date = curTime + (i * 3600 * 24 * 1000)
      date = new Date(date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const time = `${year}-${month}-${day}`
      dayList.push({
        value: time,
        label: time,
        children: !bool && !i ? hoursList.filter(item => !item.bool) : hoursList
      })
    }
    this.setState({
      timeList: dayList,
      show: !show
    })
  }

  // 省市区三级联动数据包装
  formatData = () => {
    const arr = []
    for (let province in addressData) {
      const label = addressData[province].name
      const city = addressData[province].city
      const children = []
      for (let n = 0, len = city.length; n < len; n++) {
        const cityList = {
          label: city[n].name,
          value: `${city[n].name}`,
          children: []
        }
        if (city[n].area && city[n].area.length) {
          for (let i = 0, lens = city[n].area.length; i < lens; i++) {
            cityList.children.push({
              label: city[n].area[i],
              value: `${city[n].area[i]}`,
            })
          }
        }
        children.push(cityList)
      }
      const data = {
        label,
        value: label,
        children
      }
      arr.push(data)
    }
    addersList = arr
  }

  formBlur = (value) => {
    const isPhone = isPoneAvailable(+value);
    if (!isPhone) {
      Toast.fail('电话号码不符合规范', 2);
      this.setState({ phoneNum: false })
    } else {
      this.setState({ phoneNum: true })
    }
  }

  // 获取表单
  onChange = (val, name) => {
    console.log(val)
    const { formData } = this.state
    formData[name] = val
    this.setState({ formData })
  }

  render() {
    const { formData, visible, show, timeList } = this.state
    const { adders = [], preReturnTime = '', addressDetail = '', mobile = '', name = '' } = formData
    const [province, city, area=''] = adders
    const type = 1
    const label = type ? '寄件人' : '收件人'
    return (
      <Page title='填写寄件信息'>
        <div className='pd55'>
          <img src={images.hjImg} />
          <div className={styles.shippingBox}>
            <h2>寄件人信息</h2>
            <div className={styles.shippingFrom}>
              <ul className={`white from`}>
                <li className='border flex'>
                  <label>{label}</label>
                  <div className='item'>
                    <input
                      placeholder={`请填写${label}姓名`}
                      onChange={e => {
                        this.onChange(e.target.value, 'name')
                      }}
                      onBlur={() => { isIos() && window.scrollBy(0, fixScroll().top) }}
                      value={name}
                    />
                  </div>
                </li>
                <li className='border flex'>
                  <label>联系电话</label>
                  <div className='item'>
                    <input type='tel'
                      placeholder={`请填写${label}手机号`}
                      onBlur={(e) => {
                        isIos() && window.scrollBy(0, fixScroll().top)
                        this.formBlur(e.target.value, 'mobile')
                      }}
                      onChange={e => { this.onChange(e.target.value, 'mobile') }}
                      value={mobile}
                    />
                  </div>
                </li>
                <li className='border flex jt'>
                  <label>所在地区</label>
                  <span className='item'
                    onClick={() => {
                      isIos() && window.scrollBy(0, fixScroll().top)
                      this.handleToggle()
                    }}
                    style={{ color: !province ? '#ccc' : '#333' }}>
                    {province ? `${province || ''} ${city || ''} ${area || ''}` : '请选择'}
                  </span>
                </li>
                <li className='border flex textarea'>
                  <label>详细地址</label>
                  <div className='item'>
                    <textarea rows="3" placeholder='请输入详细地址'
                      onBlur={() => { isIos() && window.scrollBy(0, fixScroll().top) }}
                      onChange={e => { this.onChange(e.target.value, 'addressDetail') }}
                      value={addressDetail}
                    />
                  </div>
                </li>
                {
                  type ? (
                    <li className='border flex jt'>
                      <label>预约时间</label>
                      <span className='item'
                        onClick={() => { this.handleToggle('show') }}
                        style={{ color: !preReturnTime ? '#ccc' : '#333' }}>
                        {preReturnTime ? ` ${preReturnTime[0]} ${preReturnTime[1]}` : '请选择'}
                      </span>
                    </li>
                  ) : ''
                }
              </ul>
            </div>
            <h2>收件人信息</h2>
            <div className={styles.receivingInfo}>
              <p>收件人：安我收录中心</p>
              <p>电话：17887914326</p>
              <p>地址：上海市浦东新区赵高公路1628号安我顺丰中心</p>
            </div>
          </div>
          <div className='foot'>
            <button onClick={this.handleSubmit} className={'btn ' + styles.foot}>提交</button>
          </div>

          <Picker
            data={addersList}
            visible={visible}
            title='选择地区'
            onOk={() => { this.handleToggle() }}
            onDismiss={() => { this.handleToggle() }}
            extra='请选择(可选)'
            value={adders}
            onChange={val => {
              this.onChange(val, 'adders')
            }}
          />

          <Picker
            data={timeList}
            visible={show}
            cols={2}
            title='选择预约时间'
            onOk={() => { this.handleToggle('show') }}
            onDismiss={() => { this.handleToggle('show') }}
            extra='请选择(可选)'
            value={preReturnTime}
            onChange={preReturnTime => {
              this.onChange(preReturnTime, 'preReturnTime')
            }}
          />
        </div>
      </Page>
    )
  }
}
Shipping.propTypes = {
  history: PropTypes.object.isRequired
}
export default Shipping
