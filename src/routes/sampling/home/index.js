import React from 'react'
import { withRouter } from 'react-router-dom'
import propTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import fun from '@src/common/utils'
import ua from '@src/common/utils/ua'
import filter from '@src/common/utils/filter'
import point from '@src/common/utils/point'
import questionnaireApi from '@src/common/api/questionnaireApi'
import samplingApi from '@src/common/api/samplingApi'
import homeApi from '@src/common/api/homeApi'
import { observer, inject } from 'mobx-react'

import List from './list'
import styles from '../sampling'
import andall from '@src/common/utils/andall-sdk'
import Page from '@src/components/page'
import NoData from '@src/components/nodata'
import Modal from '@src/components/modal'
import integrationApi from '@src/common/api/integrationApi'
const { setSetssion, setSession, getSetssion, getParams, touchTheTimePosition, isTheAppVersion } = fun
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
    oneKeyReturn: false,
    isAndall: ua.isAndall(),
    pointTip: '',
    APPVersion: '1.6.9'
  }

  // 表型问卷，获取最后提交记录
  onGetUserCommitRecord = (params) => {
    const { reportId = '', type = '', barcode = '', prodName = '', h5ShowType = 1 } = params
    const { user: { data: { linkMan = {} } } } = this.props
    const { linkManId, userName } = linkMan
    questionnaireApi.getUserLastCommitRecord({ reportId: reportId, qnaireCode: type })
      .then(res => {
        const { code, data } = res
        const { finishStatus, rejectQuestionnaire } = data
        if (code) return

        let _link = this.setReportLinkUrl(params)

        if (finishStatus === 1 || (rejectQuestionnaire && rejectQuestionnaire.reachMaxCount)) {
          andall.invoke('goReportTab', { linkManId: linkManId + '', userName })
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
          andall.invoke('goReportTab', { linkManId: linkManId + '', userName })
        } else {
          andall.invoke('goReportTab', { linkManId: linkManId + '', userName })
        }
      })
  }
  // 埋点记录访问采样器列表页
  trackPointSampleListview() {
    let obj = {
      eventName: 'sample_list_view',
      pointParams: {
        view_type: getParams().viewtype
      }
    }
    allPointTrack(obj)
  }
  // 埋点记录去回寄样本
  trackPointSampleSendBack(barCode, statusDesc, btnName, type) {
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

  componentDidMount() {
    const { user } = this.props
    window.sessionStorage.setItem('reportCategory', '')
    getSetssion('medical') && this.setState({ type: true })
    this.validBindUserGender(getParams().barCode)
    samplingApi.getCollectorListKit(
      { updateColStatus: getParams().updateColStatus ? getParams().updateColStatus : '' }
    ).then(res => {
      this.setState({ noData: true })
      const { data } = res
      data && this.setState({ list: data })
    })

    this.trackPointSampleListview()
    this.getPointTip()
  }

  //  积分提示
  getPointTip = () => {
    integrationApi.getPointTip({ position: 7, noloading: 1 }).then(res => {
      this.setState({ pointTip: res.data && res.data.tip })
    })
  }
  // 判断barCode对应的报告性别是否一致
  validBindUserGender = barCode => {
    return barCode && samplingApi.validBindUserGender({ barCode }).then(res => {
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
    const colIds = []
    const arrBarCode = []
    const types = []

    if (touchTheTimePosition()) {
      this.setState({ oneKeyReturn: true })
      return
    }

    list.map(item => {
      const { checked, colId, barcode, type } = item
      if (checked) {
        types.push(type)
        colIds.push(colId)
        arrBarCode.push(barcode)
      }
    })
    if (!colIds.length) {
      Toast.info('请选择要回寄的采样器')
      return
    }

    this.setState({ arrBarCode })
    setSetssion('kitType', types)
    setSetssion('sampling', colIds)
    setSetssion('samplingBarCode', arrBarCode)
  }

  // 获取检测者有没有报告
  getUserStatus = id => {
    return samplingApi.getLinkManIsHasReport({ id }).then(res => res)
  }
  // 性别确认
  handleConfirmGender = barCode => {
    return samplingApi.confirmGender({ barCode }).then(res => res)
  }
  // 创建用户
  handleAdd = barCode => {
    return samplingApi.listAdd({ barCode }).then(res => res)
  }

  // 保留最后一次切换用户
  saveLastUserLindManId = (obj = {}) => {
    const { linkManId = '', userName = '' } = obj
    const { user: { upLindManId, data: { linkMan = {} } } } = this.props
    if (+linkMan.linkManId === +obj.linkManId) {
      andall.invoke('goReportTab', { linkManId: linkManId + '', userName })
    } else {
      homeApi.saveLastUserLindManId({ linkManId }).then(res => {
        if (!res.code) {
          upLindManId({ linkManId, userName })
          Toast.success(`已为您切换成${userName}`, 1.5, () => {
            andall.invoke('goReportTab', { linkManId: linkManId + '', userName })
          })
        }
      })
    }
  }

  // 切换检测者
  saveLastUserLindManIdAPI = (params) => {
    return homeApi.saveLastUserLindManId(params)
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

  modalToggle = (name) => {
    this.setState({
      [name]: !this.state[name]
    })
  }

  toLink = () => {
    const { type } = this.state
    if (type) {
      this.props.history.push(`/medical`)
    } else {
      const nextUrl = isTheAppVersion('1.7.1') ? 'andall://andall.com/bind_view' : `${origin}/mkt/binding`
      window.location.href = nextUrl
    }
  }

  gotoShiping = (code) => {
    const nextUrl = `/sampling/shipping?barcode=${code}`
    this.props.history.push(nextUrl)
  }

  // btnStatus  1,"去回寄"  2,"看详情"  3,"看报告"  4,"无需回寄"
  // btnDesc
  render() {
    const { list, noData, type, visible, serGender = {}, arrBarCode, oneKeyReturn } = this.state
    const { user: { data, upLindManId } } = this.props
    const btnStatus = list.find(item => +item.btnStatus === 1)
    console.log(btnStatus)

    // list.forEach(li => {
    //   li.btnStatus = 1
    //   li.btnDesc = '去回寄'
    //   li.selectable = 1
    //   li.type = 'HPV_BIND'
    // })
    return (
      <Page title='采样器'>
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
                  handleJumitAall={this.handleJumitAall}
                />
              </div>
            ) : noData && <NoData title='您尚未绑定采样器'
              children={
                <div>
                  <a onClick={() => this.toLink()}>
                    <button className={styles.bindingBtn}>{type ? '随便逛逛' : '绑定采样器'}</button>
                  </a>
                </div>
              }
            />
          }

          {btnStatus && 
            <div className={`foot ${type ? styles.medicalBom : ''}`}>
              {this.state.pointTip && <div className={`${styles.integration}`}>{this.state.pointTip}</div>}
              <div className={`${styles.boxwd}`}>
                <button onClick={this.handleJumitAall} className={`btn ${styles.fixed}`}>一键回寄</button>
              </div>
            </div>
          }

          {arrBarCode.length > 0 &&
            <div className={styles.pupopbox}>
              <div className={styles.pupcon}>
                <h3>- 温馨提示 -</h3>
                <p>请回寄以下采样器</p>
                <div className={styles.barListBox}>
                  {arrBarCode.map(code => {
                    return <p key={code} className={styles.f16c}>{code}</p>
                  })}
                </div>
                {arrBarCode.length > 6 && <span className={styles.boxMask} />}

                <p>以确保检测成功</p>
                <a onClick={() => { this.gotoShiping(arrBarCode[0]) }}>
                  我知道了
              </a>
              </div>
            </div>
          }
          {<Modal
            handleToggle={() => { this.modalToggle('oneKeyReturn') }}
            type
            visible={oneKeyReturn}>
            <div className={styles.scanModal}>
              <h3>暂停回寄服务通知</h3>

              <p>感谢您对安我的支持与信任！<br />
              尊敬的客户祝您春节快乐，由于受到近期新型冠状病毒感染的肺炎疫情影响,为了最大程度的保证公众健康安全，我们将暂停「回寄」功能，恢复时间待定。<br />
              在此期间请勿自行邮寄样本，以免包裹长时间无人处理，造成遗失等问题。<br />
              如您已采集完成唾液样本，也无需担心，我们的采样器可以在室温下稳定保存您的样本一个月以上。<br />
              恢复时间和其他问题，可以在【安我AndAll】公众号或者【安我生活】App上联系在线客服，我们将竭诚为您提供服务。<br />
              最后，感谢您的理解及为对抗疫情做出的支持，祝您和家人平安健康，新年快乐。</p>

              <button onClick={() => { this.modalToggle('oneKeyReturn') }}
                className={`btn mt30 ${styles.foot}`}>我知道了</button>
            </div>
          </Modal>}
        </div>
      </Page>
    )
  }
}
export default withRouter(SampleList)
