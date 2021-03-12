import React from 'react'
import PropTypes from 'prop-types'
import point from '@src/common/utils/point'
import fun from '@src/common/utils/index'
import ua from '@src/common/utils/ua'
import Page from '@src/components/page'
import styles from '../sampling'
import sficon from '@static/sampling/sficon.png'
import Points from '@src/components/points'
import oku from '@src/common/api/oneKeyUnlockApi'
import BannerRun from '@src/components/bannerRun'
const { getSetssion } = fun
const { allPointTrack } = point
class Reserve extends React.Component {
  state = {
    shipping: { addr: {} },
    exampleReportFlag: 0
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
    andall.invoke('closeWebViewFlag', {})
    const { location } = this.props
    getSetssion('medical') && this.setState({ type: true })
    location.state &&
      this.setState({
        shipping: location.state,
        unLockProductNames: location.state.unLockProductNames,
        linkManID:location.state.linkManId,
        exampleReportFlag: location.state.exampleReportFlag
      }, () => {
        let obj = {
          eventName: 'return_order_confirm_page_view',
          pointParams: {}
        }
        allPointTrack(obj)
        this.trackPointSampleSendBackComplete(this.state.shipping.addr)
      })
  }

  goExzport = () => {
    const { exampleReportFlag } = this.state
    if (!exampleReportFlag) {
      andall.invoke('back')
      return
    }
    let obj = {
      eventName: 'return_order_confirm_page_goto',
      pointParams: {
        viewtype:'show_report_sample'
      }
    }
    allPointTrack(obj)
    location.href = `andall://andall.com/inner_webview?url=${window.location.origin}/mkt/reportExample`
    // window.location.href = `${origin}/mkt/members?viewType=sendback_complete&hideTitleBar=1`
    // window.location.href = `${window.location.origin}/mkt/members?viewType=sendback_complete`
  }

  goOneKeyUnlock = () => {
    const { linkManID } = this.state
    let obj = {
      eventName: 'return_order_confirm_page_goto',
      pointParams: {
        viewtype:'view_all_detail'
      }
    }
    allPointTrack(obj)
    location.replace(`${origin}/mkt/oneKeyUnlock?linkManId=${linkManID}`)
  }

  goUnlockOrder = () => {
    const { linkManID } = this.state
    oku.categoryList({ linkManId:linkManID }).then(res => {
      let saveProductList = []
      let saveList = []
      for (let item in res.data.productCategoryList) {
        const list = res.data.productCategoryList[item].productList
        const listLen = list.length
        for (let i = 0; i < listLen; i++) {
          if (list[i].reportStatus === '0') {
            saveList.push({ productId:list[i].productId, productNum:1 })
          }
        }
        saveProductList = saveProductList.concat(res.data.productCategoryList[item].productList)
      }
      let setParams = {
        linkManId:linkManID,
        productList:saveList,
        activeCode:'YJJS001',
        actualType: 2
      }
      let obj = {
        eventName: 'return_order_confirm_page_goto',
        pointParams: {
          viewtype:'unlock_all_products'
        }
      }
      allPointTrack(obj)
      if (ua.isAndall()) {
        setTimeout(() => {
          andall.invoke('confirmOrder', setParams)
        }, 200)
      }
    })
  }

  render() {
    const { exampleReportFlag, unLockProductNames } = this.state
    const { location } = this.props
    const integral = location.state ? location.state.point : null
    return (
      <Page title='预约成功'>
        <div className={'white ' + styles.return}>
          <img width='110' src={sficon} />
          <h3>
            <span>预约成功</span>
            {integral && <div className={styles.points}>
              <Points value={+integral} />
            </div>
            }
          </h3>
          <p className={styles.returnDes}>顺丰快递将在您预约时间内与您联系</p>
          <div className={styles.link}>
            <span className={styles.btn} onClick={this.goExzport}>{!exampleReportFlag ? '返回' : '查看示例报告'}</span>
          </div>

          {
            unLockProductNames && unLockProductNames.length > 0 &&
            <div className={styles.prodbox}>
              <h3><span>待解锁产品</span></h3>
              <ul>
                {unLockProductNames.map((item, index) =>
                  <li key={index}>{item}</li>
                )}
              </ul>
              <div className={styles.jumpbox}>
                <span onClick={() => this.goOneKeyUnlock()}>了解一键解锁内容</span>
                <span onClick={() => this.goUnlockOrder()}>一键全解锁</span>
              </div>
            </div>
          }

          {/* {shipping && shipping.bannerResp && shipping.bannerResp.length > 0 && */}
          {/*  <BannerRun banArr={shipping.bannerResp} /> */}
          {/* } */}
        </div>
      </Page>
    )
  }
}
Reserve.propTypes = {
  location: PropTypes.object
}
export default Reserve
