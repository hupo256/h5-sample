import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { API, point, fun } from '@src/common/app'
import { Page } from '@src/components'
import styles from '../sampling'
const { getSetssion } = fun
const { allPointTrack } = point
class Return extends React.Component {
  state = {
    shipping:{ addr:{} }
  }
  // 埋点记录确认回寄信息
  trackPointSampleSendBackConfirm () {
    const arrBarCode = getSetssion('samplingBarCode')
    for (let barcode of arrBarCode) {
      let obj = {
        eventName:'sample_sendback_confirm',
        pointParams:{
          sample_barcode:barcode
        }
      }
      allPointTrack(obj)
    }
  }
  componentDidMount () {
    const { location } = this.props
    location.state && this.setState({ shipping:location.state })
  }
  // 提交
  handleSubmit = () => {
    const { shipping } = this.state
    API.returnCollectorOper({ ...shipping, loadingTit:'提交中...' }).then(res => {
      const { code, msg, data } = res
      if (code) {
        window._paq.push([
          'trackEvent',
          'sampling_submit',
          'sampling_submit_comfirm_click',
          `collectorIds=${shipping.collectorIds},msg=${msg}`
        ])
      }
      code || this.props.history.push({
        pathname:'/reserve',
        state:{...shipping, ...data}
      })
    })
  }
  render () {
    const { addr, hoursList } = this.state.shipping
    const { provinces, city, mobile, area, addressDetail, name } = addr
    return (
      <Page title='预约回寄'>
        <div className='bg p20'>
          <div className={'white ' + styles.return}>
            <div className={'iconfont ' + styles.icon}>&#xe607;</div>
            <h2>我们将为您预约回寄</h2>
            <div className={styles.pickup}>
              <span>取件信息</span>
              <div className='flex' style={{ marginBottom:0 }}>
                <label>地址：</label>
                <p className='item'>{`${provinces || ''}${city || ''}${area || ''}${addressDetail || ''}`}</p>
              </div>
              <p>姓名：{name}</p>
              <p>电话：{mobile}</p>
              <p>时间：{hoursList}</p>
            </div>
            <div className={'flex ' + styles.link}>
              <Link className='item blue' to='/shipping'>修改地址</Link>
              <a className='item blue' onClick={this.handleSubmit}>确认预约</a>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}

Return.propTypes = {
  history:PropTypes.object,
  location:PropTypes.object
}
export default Return
