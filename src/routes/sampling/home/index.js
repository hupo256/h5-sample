import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import propTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import { API, fun, point, filter } from '@src/common/app'
import { observer, inject } from 'mobx-react'

import List from './list'
import styles from '../sampling'
import andall from '@src/common/utils/andall-sdk'
import { Page, NoData } from '@src/components'
import { MyLoader } from '@src/components/contentLoader'
const { setSetssion, getSetssion, getParams } = fun
const { allPointTrack } = point
const { reportLinkMap } = filter

@inject('user')
@observer
class SampleList extends React.Component {
  static propTypes = {
    history: propTypes.object,
  }
  state = {
    list: [],
    noData: false,
    serGender: {},
    arrBarCode: [],
    loading: true,
  }

  /* 表型问卷，获取最后提交记录
    finishStatus:1用户完成问卷,0未完成,-1用户未做过
  */
  onGetUserCommitRecord = (params) => {
    const { reportId = '', type = '', barcode = '', prodName = '', h5ShowType = 1 } = params
    const { user: { data: { linkMan = {} } } } = this.props
    const { linkManId, userName } = linkMan
    API.getUserLastCommitRecord({ reportId: reportId, qnaireCode: type })
      .then(res => {
        const { code, data } = res
        const { finishStatus, rejectQuestionnaire } = data
        if (code) return

        let _link = this.setReportLinkUrl(params)

        if (finishStatus === 1 || (rejectQuestionnaire && rejectQuestionnaire.reachMaxCount)) {
          andall.invoke('goReportTab', { linkManId : linkManId + '', userName })
          return
        }

        setSetssion('QUESTIONNIRE_KEY', {
          reportType: _link,
          reportId,
          productCode: type,
          type: 1,
          barcode,
          productName: prodName,
          h5ShowType: h5ShowType
        })

        if (finishStatus === -1) {
          andall.invoke('goReportTab', { linkManId : linkManId + '', userName })
        } else {
          andall.invoke('goReportTab', { linkManId : linkManId + '', userName })
        }
      })
  }
  // 埋点记录访问采样器列表页
  trackPointSampleListview () {
    let obj = {
      eventName: 'sample_list_view',
      pointParams: {
        view_type: getParams().viewtype
      }
    }
    allPointTrack(obj)
  }
  // 埋点记录去回寄样本
  trackPointSampleSendBack (barCode, statusDesc, btnName, type) {
    let obj = {
      eventName: 'barcode_list_goto',
      pointParams: {
        barcode_id: barCode,
        barcode_status: statusDesc,
        Btn_name: btnName,
        barcode_type: type
      }
    }
    allPointTrack(obj)
  }
  componentDidMount () {
    const { user } = this.props
    window.sessionStorage.setItem('reportCategory', '')
    getSetssion('medical') && this.setState({ type: true })
    this.validBindUserGender(getParams().barCode)
    API.getCollectorListKit({noloading: 1}).then(res => {
      this.setState({ noData: true })
      const { data } = res
      data && this.setState({ 
        list: data,
        loading: false, 
      })
    })
    user.getFxzUserStatus()
    this.trackPointSampleListview()
  }

  // 判断barCode对应的报告性别是否一致
  validBindUserGender = barCode => {
    return barCode && API.validBindUserGender({ barCode }).then(res => {
      const { checkFlag, checkBindUserInfoDto } = res.data
      if (!checkFlag) {
        this.setState({
          serGender: checkBindUserInfoDto,
          visible: true
        })
      }
    })
  }

  // 变更选中状态
  handelChange = (check, i) => {
    const { list } = this.state
    list[i].checked = !!check
    this.setState({ list })
  }
  handleJumitAall = () => {
    const { list } = this.state
    const arry = []
    const arrBarCode = []
    list.map(item => {
      const { checked, colId, barcode } = item
      // checked && arry.push(colId)
      if (checked) {
        arry.push(colId)
        arrBarCode.push(barcode)
      }
    })
    if (!arry.length) {
      Toast.info('请选择要回寄的采样器')
      return
    }

    this.setState({ arrBarCode })
    setSetssion('sampling', arry)
    setSetssion('samplingBarCode', arrBarCode)
  }

  // 获取检测者有没有报告
  getUserStatus = id => {
    return API.getLinkManIsHasReport({ id }).then(res => res)
  }
  // 性别确认
  handleConfirmGender = barCode => {
    return API.confirmGender({ barCode }).then(res => res)
  }
  // 创建用户
  handleAdd = barCode => {
    return API.listAdd({ barCode }).then(res => res)
  }

  /**
   * 保留最后一次切换用户
   */
  saveLastUserLindManId = (obj = {}) => {
    const { linkManId = '', userName = '' } = obj
    const { user:{ upLindManId, data:{ linkMan = {} } } } = this.props
    if (+linkMan.linkManId === +obj.linkManId) {
      andall.invoke('goReportTab', { linkManId : linkManId + '', userName })
    } else {
      API.saveLastUserLindManId({ linkManId }).then(res => {
        if (!res.code) {
          upLindManId({ linkManId, userName })
          Toast.success(`已为您切换成${userName}`, 1.5, () => {
            andall.invoke('goReportTab', { linkManId : linkManId + '', userName })
          })
        }
      })
    }
  }

  // 切换检测者
  saveLastUserLindManIdAPI = (params) => {
    return API.saveLastUserLindManId(params)
  }

  // 转换跳转的报告url
  setReportLinkUrl = (params = {}) => {
    const { h5ShowType = 1, barcode = '', h5ShowTypeSeriesId = '', type = '',
      reportId = '', productId = '' } = params
    let url = ''

    if (+h5ShowType === 3) {
      url = `/card-cover?seriesIds=${h5ShowTypeSeriesId}&barCode=${barcode}&originalProductId=${productId}`
    } else {
      url = `${reportLinkMap[type]}?id=${reportId}&barCode=${barcode}&viewtype=2`
    }

    return url
  }

  render () {
    const { list, noData, type, visible, serGender = {}, arrBarCode, loading } = this.state
    const { user:{ data, upLindManId } } = this.props
    const showStatus = list.find(item => +item.showStatus === 1)
    // console.log(showStatus)
    const btnStatus = list.find(item => +item.btnStatus === 1)
    return (
      <Page title='采样器'>
        {loading ? <MyLoader /> : 
        <div>
          {
            list.length ? (
              <div>
                <List
                  list={list}
                  show={visible}
                  btnStatus={btnStatus}
                  serGender={serGender}
                  saveLastUserLindManId={this.saveLastUserLindManId}
                  saveLastUserLindManIdAPI={this.saveLastUserLindManIdAPI}
                  onGetUserCommitRecord={(params) => this.onGetUserCommitRecord(params)}
                  handleConfirmGender={this.handleConfirmGender}
                  validBindUserGender={this.validBindUserGender}
                  handelChange={this.handelChange}
                  getUserStatus={this.getUserStatus}
                  linkMan={data.linkMan}
                  upLindManId={upLindManId}
                  trackPointSample={this.trackPointSampleSendBack}
                />
              </div>
            ) : noData && <NoData title='您尚未绑定采样器'
              children={
                <div>
                  <Link to={type ? '/medical' : '/binding?from=samplelist'}>
                    <button className={styles.bindingBtn}>{type ? '随便逛逛' : '绑定采样器'}</button>
                  </Link>
                </div>
              }
            />
          }
          <div className={`${btnStatus ? styles.fixedBttom : ' foot'} ${type ? styles.medicalBom : ''}`}>
            {btnStatus
              ? <div className={`border ${styles.boxwd}`}>
                <button
                  onClick={this.handleJumitAall} className={`btn ${styles.fixed}`}>
                  一键回寄</button>
              </div>
              : ''}
          </div>

          {arrBarCode.length > 0 &&
          <div className={styles.pupopbox}>
            <div className={styles.pupcon}>
              <h3>- 温馨提示 -</h3>
              <p>请回寄以下采样器</p>
              <div className={styles.barListBox}>
                {arrBarCode.map((code, ind) => {
                  return <p key={code} className={styles.f16c}>{code}</p>
                })}
              </div>
              {arrBarCode.length > 6 && <span className={styles.boxMask} />}

              <p>以确保检测成功</p>
              <a onClick={() => { this.props.history.push('/shipping') }}>
                我知道了
              </a>
            </div>
          </div>
          }
        </div>}
      </Page>
    )
  }
}
export default withRouter(SampleList)
