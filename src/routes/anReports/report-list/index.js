import React, { Component } from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './list.scss'
import { API, fun } from '@src/common/app'
import { Icon } from 'antd-mobile'
import images from '../images'
import {
  trackPointListView,
  trackPointBuyClick,
  trackPointReadClick
} from '../buried-point'

const { changdao_report } = images
const { getParams } = fun
class ReportList extends Component {
  state = {
    title:'',
    dataInfo:[],
    linkManId: getParams().linkManId
  }

  componentDidMount () {
    this.getReportIndex()
    // let linkMan = localStorage.getItem('linkMan')
    // linkMan = JSON.parse(linkMan)
    let param = {
      sample_linkmanid:this.state.linkManId || ''
    }
    trackPointListView(param)
  }
  toBuy=() => {
    const { dataInfo } = this.state
    const url = dataInfo && dataInfo.length && dataInfo[0].linkUrl
    if (url) {
      const { linkManId } = getParams()
      // let linkMan = localStorage.getItem('linkMan')
      // linkMan = JSON.parse(linkMan)
      let param = {
        sample_linkmanid:linkManId || ''
      }
      trackPointBuyClick(param)
      window.location.href = url
    }
  }
  getReportIndex = () => {
    const { linkManId } = getParams()
    let param = {
      'linkManId':linkManId || '2947163977943040'
    }
    API.getIntestinalList(param).then(res => {
      const { code, data } = res
      if (!code) {
        const { title, dataInfo } = data
        this.setState({
          title,
          dataInfo
        })
      }
    })
  }
  toDetail=(item) => {
    // let linkMan = localStorage.getItem('linkMan')
    // linkMan = JSON.parse(linkMan)
    let params = {
      report_code:item.reportCode,
      sample_linkmanid:this.state.linkManId || '',
      sample_barcode:item.barcode,
      read_status:item.reportLookStatus,
    }
    trackPointReadClick(params)
    this.props.history.push(`/anReports/newDetails?barCode=${item.barcode}`)
  }

  render () {
    const { title, dataInfo, data } = this.state
    const dataList = dataInfo && dataInfo.length && dataInfo[1].data
    const { intestinalYearsDtoList } = dataList && dataList

    return (
      <Page title={title || '安小软黄金便便养成计划'}>
        <div className={styles.listCont} >
          <img src={images.list2} className={styles.head} />
          <div className={styles.ctn}>

            <div className={styles.tips} onClick={() => this.toBuy()}>
              <div>
                <img src={images.list1} />
                <div>
                  <p>如已使用完所有采样器</p>
                  <p>可直接点击去购买</p>
                </div>
              </div>
              <div><Icon className={styles.icon} type='right' /></div>
            </div>

            <div className={styles.list}>
              {/* <div>报告列表</div> */}
              <div className={'white ' + styles.logisticsStatus}>
                <h5>{dataList && dataList.title || '报告列表'}</h5>
                {
                  intestinalYearsDtoList && intestinalYearsDtoList.length &&
                    intestinalYearsDtoList.map((item1, index1) => (
                      <ul key={index1}>
                        <li style={{ height:'30px' }} data-text={item1.year} />
                        {
                          item1.intestinalDtos && item1.intestinalDtos.length &&
                      item1.intestinalDtos.map((item2, index2) => (
                        <li key={index2} className={item2.reportLookStatus == 0 ? styles.isNew : ''}>
                          <div className={styles.my_ctn}>
                            <div className={styles.my_left}>
                              <span>采样时间</span>
                              <p>{item2.month}</p>
                            </div>
                            <div className={styles.check_btn} onClick={() => this.toDetail(item2)}>查看报告</div>
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
        </div>
      </Page>
    )
  }
}
ReportList.propTypes = {
  history: propTypes.object,
}

export default ReportList
