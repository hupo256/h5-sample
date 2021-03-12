import React, { Component } from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './list.scss'
import { fun, ua } from '@src/common/app'
import { Icon } from 'antd-mobile'
import hpvReportApi from '@src/common/api/hpvReportApi'
import hpvList from '@static/HpvReport/hpvList.png'
import andall from '@src/common/utils/andall-sdk'
import { trackPointReportHpvListView, trackPointReportHpvListBuyGoto, trackPointReportHpvListReportGoto } from './buried-point'
import UpdataVersion from '@src/components/updataVersion'
const { getParams } = fun
class HpvReportList extends Component {
  state = {
    title:'',
    dataInfo:[],
    linkManId: getParams().linkManId,
    reportName:'',
    productId:''
  }

  componentDidMount () {
    this.getReportIndex()
  }
  toBuy=() => {
    const { productId, reportName } = this.state
    trackPointReportHpvListBuyGoto({
      sample_linkmanid: getParams().linkManId,
      report_code:getParams().productCode,
      report_name:reportName
    })
    andall.invoke('goProductDetail', { productId:productId, newProductDetailType: 3 })
  }
  getReportIndex = () => {
    const { linkManId, productCode } = getParams()
    let param = {
      linkManId,
      productCode
    }
    hpvReportApi.getHPVList(param).then(res => {
      const { code, data } = res
      if (!code) {
        const { title, dataInfo, productId } = data
        this.setState({
          title,
          dataInfo,
          productId,
          reportName:dataInfo.length ? dataInfo[1].data.intestinalYearsDtoList[0].hpvDtos[0].reportName : ''
        }, () => {
          trackPointReportHpvListView({
            sample_linkmanid: getParams().linkManId,
            report_code:getParams().productCode,
            report_name:this.state.reportName
          })
          console.log(dataInfo)
        })
      }
    })
  }
  toDetail=(item, index1, index2) => {
    const { reportName, dataInfo } = this.state
    console.log(item, index1, index2)
    if (item.reportLookStatus === 0) {
      item.reportLookStatus = 1
      this.setState({ dataInfo })
    }
    trackPointReportHpvListReportGoto({
      sample_linkmanid: getParams().linkManId,
      sample_barcode:item.barcode,
      report_code:getParams().productCode,
      report_name:reportName,
      read_status:item.reportLookStatus, // 1已查看 0未查看
      report_status:index1 === 0 && index2 === 0 ? 'latest' : 'previous', // latest最新  previous历史
    })
    if (ua.isAndall()) {
      let url = `${window.location.origin}/mkt/hpvReport/hpvDetail?barCode=${item.barcode}&linkManId=${getParams().linkManId}&reportType=0`
      window.location.href = `andall://andall.com/report_detail?url=${url}`
    } else {
      this.props.history.push(`/hpvReport/hpvDetail?barCode=${item.barcode}&linkManId=${getParams().linkManId}&productCode=${getParams().productCode}&reportType=0`)
    }
  }
 

  render () {
    const { title, dataInfo } = this.state
    const dataList = dataInfo && dataInfo.length && dataInfo[1].data
    const { intestinalYearsDtoList } = dataList && dataList

    return (
      <Page title={title || '遗传性乳腺癌&卵巢癌基因检测'}>
        {
          <UpdataVersion
            value={'为保证最好的报告体验，请将APP更新至最新版本后重新进入哦。'}
            version={171}
          />
        }
        <div className={`${styles.listCont} ${andall.info.version && +andall.info.version.replace(/\./g, '') < 171 ? styles.noscroll : ''}`}>
          <div className={styles.top}>
            <div className={styles.tips} onClick={() => this.toBuy()}>
              <div className={styles.left}>
                <img src={hpvList} />
                <div>
                  <p>医生建议3-6个月进行一次HPV分型检测</p>
                  <p>点击再次购买HPV采样器</p>
                </div>
              </div>
              <Icon className={styles.icon} type='right' />
            </div>
          </div>
          
          {
            intestinalYearsDtoList && intestinalYearsDtoList.length
              ? <div className={styles.ctn}>
                <div className={styles.list}>
                  <div className={'white ' + styles.logisticsStatus}>
                    {

                      intestinalYearsDtoList.map((item1, index1) => (
                        <ul key={index1}>
                          <li style={{ height:'30px' }} data-text={item1.year} />
                          {
                            item1.hpvDtos && item1.hpvDtos.length &&
                              item1.hpvDtos.map((item2, index2) => (
                                <li key={index2} className={item2.reportLookStatus === 0 ? styles.isNew : item2.result === 1 ? styles.isRed : ''}>
                                  <div className={styles.my_ctn}>
                                    <div className={styles.my_left}>
                                      <label>检测结果：</label><span className={`${item2.result === 1 ? styles.red : ''}`}>{item2.result === 1 ? '阳性' : '阴性'}</span>
                                      <p>采样时间{item2.month}</p>
                                    </div>
                                    <div className={styles.check_btn} onClick={() => this.toDetail(item2, index1, index2)}>查看报告</div>
                                  </div>
                                </li>
                              ))
                          }
                        </ul>
                      ))
                    }
                  </div>
                </div>
              </div>
              : ''
          }
        </div>
      </Page>
    )
  }
}
HpvReportList.propTypes = {
  history: propTypes.object,
}

export default HpvReportList
