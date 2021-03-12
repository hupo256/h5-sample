import React, { Component } from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import ModuleDetail from '../components/module-detail'
import { Icon } from 'antd-mobile'
import styles from './detail.scss'
import { API, fun } from '@src/common/app'
import images from '@src/common/utils/images'

import detail_back from '@static/changdao_report/detail_back.png'
import PointsToast from '@src/components/pointsToast'
const { changdao_report } = images
const { getParams, scrollTo } = fun
class ReportDetail extends Component {
  state = {
    dataInfo: null, // 报告详情
    data:{},
    backTopIcon: false,
    pointValue:''
  }

  componentDidMount () {
    this.handleGetReportDetail()
  }
  // 获取报告详情
  handleGetReportDetail = () => {
    const { barCode } = getParams()
    const params = {
      barCode:barCode || 2,
    }
    API.getIntestinalDetail(params).then(res => {
      if (res) {
        const { data, code } = res
        const { dataInfo } = data
        if (!code) {
          this.setState({
            data,
            dataInfo,
            pointValue:data.pointStatusTipResp ? data.pointStatusTipResp.point : ''
          })
        }
      }
    })
  }

  receive=() => {
    this.setState({
      couponVis: true,
    })
  }
  render () {
    let { dataInfo, data, } = this.state
    return <Page title={'报告详情页'}>
      <React.Fragment>
        {
          dataInfo
            ? <div className={styles.detailCont}>
              <img src={detail_back} />
              <ModuleDetail data={data} />
              {
                this.state.pointValue
                  ? <div>
                    <PointsToast value={this.state.pointValue} />
                  </div>
                  : ''
              }
            </div> : ''
          // <div className={styles.loading}>
          //   <span><Icon type='loading' /></span>
          //   正在努力加载...
          // </div>
        }

      </React.Fragment>

    </Page>
  }
}
ReportDetail.propTypes = {
  history: propTypes.object,
}

export default ReportDetail
