import React from 'react'
import PropTypes from 'prop-types'
import fun from '@src/common/utils'
import point from '@src/common/utils/point'
import samplingApi from '@src/common/api/samplingApi'
import Page from '@src/components/page'
import toedit from '@static/sampling/toedit.png'
import sficon from '@static/sampling/sficon.png'
import styles from '../sampling'
const { getSetssion } = fun
const { allPointTrack } = point

class Return extends React.Component {
  state = {
    shipping: { addr: {} }
  }
  // 埋点记录确认回寄信息
  trackPointSampleSendBackConfirm() {
    const arrBarCode = getSetssion('samplingBarCode')
    for (let barcode of arrBarCode) {
      let obj = {
        eventName: 'sample_sendback_confirm',
        pointParams: {
          sample_barcode: barcode
        }
      }
      allPointTrack(obj)
    }
  }
  componentDidMount() {
    const { location } = this.props
    location.state && this.setState({ shipping: location.state })
  }
  // 提交
  handleSubmit = () => {
    const { shipping } = this.state
    console.log({...shipping, loadingTit: '提交中...' })
    // return
    samplingApi.returnCollectorOper({...shipping, loadingTit: '提交中...' }).then(res => {
      const { code, msg, data } = res
      code && 
        window._paq.push([
          'trackEvent','sampling_submit','sampling_submit_comfirm_click', `collectorIds=${shipping.collectorIds},msg=${msg}`
        ])
      code || this.props.history.push({
        pathname: '/sampling/reserve',
        state: { ...shipping, ...data}
      })
    })
  }

  toEditAddr = () => {
    this.props.history.push('/sampling/shipping')
  }

  render() {
    const { addr, hoursList } = this.state.shipping
    const { provinces, city, mobile, area, addressDetail, name } = addr
    const addrTex = `${provinces || ''}${city || ''}${area || ''}${addressDetail || ''}`
    return (
      <Page title='预约回寄'>
        <div className={'white ' + styles.return}>
          <img width='110' src={sficon} />
          <h3>我们将为您预约回寄</h3>

          <div className={styles.pickup}>
            <h3><span>取件信息</span> <img onClick={this.toEditAddr} src={toedit} /></h3>
            <p><b>详细地址</b> <span>{addrTex}</span></p>
            <p><b>寄件人</b> <span>{name}</span></p>
            <p><b>联系电话</b> <span>{mobile}</span></p>
            <p><b>预约时间</b> <span>{hoursList}</span></p>
          </div>

          <div className={styles.link}>
            <a className={styles.btn} onClick={this.handleSubmit}>确认预约</a>
          </div>
        </div>
      </Page>
    )
  }
}

Return.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object
}
export default Return
