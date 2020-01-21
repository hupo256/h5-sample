import React from 'react'
import PropTypes from 'prop-types'
import { fun, point } from '@src/common/app'
import { Page } from '@src/components'
import styles from '../sampling'
import BannerRun from '../status/bannerRun'
import andall from '@src/common/utils/andall-sdk'
const { getSetssion } = fun
const { allPointTrack } = point
class Reserve extends React.Component {
  state = {
    shipping: { addr: {} }
  }
  // 埋点记录完成回寄
  trackPointSampleSendBackComplete(addr) {
    const arrBarCode = getSetssion('samplingBarCode')
    const { provinces, city, mobile, area, name } = addr
    // 同时回寄多个barcode 埋入多条记录
    for (let barCode of arrBarCode) {
      let obj = {
        eventName: 'sample_sendback_complete',
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
    const { location } = this.props
    getSetssion('medical') && this.setState({ type: true })
    location.state && this.setState({ shipping: location.state }, () => {
      this.trackPointSampleSendBackComplete(this.state.shipping.addr)
    })
  }
  
  goBack = () => {
    andall.invoke('goHome')
  }

  gotoDdPage = (url) => {
    window.location.href = url
  }
  render() {
    const { shipping } = this.state
    const { addr, hoursList } = shipping
    const { provinces, city, mobile, area, addressDetail, name } = addr
    return (
      <Page title='预约成功'>
        <div className='bg p20'>
          <div className={'fz14 white ' + styles.return}>
            <div className={'iconfont ' + styles.icon}>&#xe607;</div>
            <h2>预约成功</h2>
            <p className={styles.des}>顺丰快递将上门取件</p>
            <div className={styles.pickup}>
              <span>取件信息</span>
              <div className='flex' style={{ marginBottom: 0 }}>
                <label>地址：</label>
                <p className='item'>{`${provinces || ''}${city || ''}${area || ''}${addressDetail || ''}`}</p>
              </div>
              <p>姓名：{name}</p>
              <p>电话：{mobile}</p>
              <p>时间：{hoursList}</p>
            </div>
            <p className='mt10' />
            <div className={'flex ' + styles.link}>
              <span className='item blue' onClick={this.goBack}>前往首页</span>
            </div>
          </div>

          {shipping && shipping.bannerResp && shipping.bannerResp.length > 0 && 
            <BannerRun banArr={shipping.bannerResp} viewType="post_success_bottom" /> 
          }
        </div>
      </Page>
    )
  }
}
Reserve.propTypes = {
  location: PropTypes.object
}
export default Reserve
