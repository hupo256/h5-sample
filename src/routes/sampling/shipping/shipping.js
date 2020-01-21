import React from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import { Page, Form } from '@src/components'
import { fun, reg, point } from '@src/common/app'
import styles from '../sampling'
import img from '@static/hj.png'
const { getSetssion } = fun
const { allPointTrack } = point
class Shipping extends React.Component {
  state = {
    formData:{}
  }
  // 埋点记录去回寄样本
  trackPointSampleSendBackInput (formData) {
    const arrBarCode = getSetssion('samplingBarCode')
    let { name, adders = [], mobile } = formData
    const [provinces, city, area] = adders
    // 同时回寄多个barcode 埋入多条记录
    for (let barCode of arrBarCode) {
      let obj = {
        eventName:'sample_sendback_input',
        pointParams:{
          sample_barcode:barCode,
          sample_send_name:name.substr(0, 1) + '**',
          sample_send_phone:mobile.substr(0, 3) + '*****' + mobile.substr(8, 3),
          sample_send_address:provinces + city.split('-')[1] + area.split('-')[1] + '******'
        }
      }
      allPointTrack(obj)
    }
  }
  componentDidMount () {
  }
  // 获取表单
  onChange = (val, name) => {
    const { formData } = this.state
    formData[name] = val
    this.setState({ formData })
  }
  // 跳转
  handleSubmit = () => {
    const { formData } = this.state
    const obj = getSetssion('sampling')
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
    const [provinces, city, area] = adders
    const [time, hours] = preReturnTime
    const newtime = time + ' ' + hours.split('-')[0] + ':00'
    this.props.history.push({
      pathname:'/return',
      state:{
        addr:{
          ...formData,
          name,
          addressDetail,
          provinces,
          city:city.split('-')[1],
          area:area.split('-')[1],
          adders:''
        },
        collectorIds:obj,
        preReturnTime:newtime,
        hoursList:time + ' ' + hours
      }
    })
  }

  render () {
    return (
      <Page title='填写寄件信息'>
        <div className='pd55'>
          <img src={img} />
          <div className={styles.shippingBox}>

            <h2>寄件人信息</h2>
            <div className={styles.shippingFrom}>
              <Form onChange={this.onChange} type={1} />
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
        </div>
      </Page>
    )
  }
}
Shipping.propTypes = {
  history:PropTypes.object.isRequired
}
export default Shipping
