import React from 'react'
import Check from '@src/components/check'
import { Toast } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import propTypes from 'prop-types'
import { fun, filter, images } from '@src/common/app'
import { Modal } from '@src/components'
import styles from '../sampling'
import andall from '@src/common/utils/andall-sdk'
const { setSetssion } = fun

const { investCodeMap } = filter

class List extends React.Component {
  static propTypes = {
    handelChange: propTypes.func,
    history: propTypes.object,
    serGender: propTypes.object,
    btnStatus: propTypes.object,
    show: propTypes.bool,
    list: propTypes.array.isRequired,
    getUserStatus: propTypes.func.isRequired,
    handleConfirmGender: propTypes.func.isRequired,
    onGetUserCommitRecord: propTypes.func.isRequired,
    linkMan: propTypes.object,
    trackPointSample: propTypes.func,
  }
  state = {
    visible: false,
    showBCTips: false,
    item: {},
    list: []
  }
  // 存储跳转需要参数
  handleJumt = item => {
    // 移除示例报告标识
    window.localStorage.removeItem('reportCategory')
    const {
      colId, btnStatus, jumpUrl, orderId, barcode, isResample, waitingFlag, collectorBtnText, statusDesc, collectorType
    } = item
    const { history, trackPointSample } = this.props
    const collectorTypeValue = collectorType === 0 ? '实体barcode' : '虚拟barcode'
    if (+waitingFlag === 1) {
      Toast.info('报告正在升级中，敬请期待，给你带来的不便敬请谅解')
      return
    }
    // btnStatus 1绑定 2   3完成
    if (+btnStatus === 1 || collectorBtnText === '回寄') {
      setSetssion('sampling', [colId])
      setSetssion('samplingBarCode', [barcode])

      this.setState({
        item,
        showBCTips: true
      })
      trackPointSample(barcode, statusDesc, 'to_send', collectorTypeValue)
      // history.push('/shipping')
      return
    }

    if (+btnStatus === 2 || collectorBtnText === '样本状态') {
      setSetssion('samplingError', { orderId, collectorId: colId })
      trackPointSample(barcode, statusDesc, 'to_detail', collectorTypeValue)
      if (isResample === 0) {
        history.push({
          pathname: '/sampling-status',
          search: `barCode=${item.barcode}`
        })
      } else {
        history.push({
          pathname: '/sampling-status-error',
          search: `type=${isResample}`
        })
      }
      return
    }
    if (+btnStatus === 3) {
      trackPointSample(barcode, statusDesc, 'to_report', collectorTypeValue)
      window.location.href = jumpUrl
    }
  }

  // 转换跳转的报告url
  setReportLinkUrl = (params = {}) => {
    const { h5ShowType = 1 } = params
    const { linkMan } = this.props
    const { linkManId, userName } = linkMan
    let url = ''
    if (+h5ShowType === 3 || +h5ShowType === 4) {
      andall.invoke('goReportTab', { linkManId : linkManId + '', userName })
    } else {
      andall.invoke('goReportTab', { linkManId : linkManId + '', userName })
    }

    return url
  }

  handleJumitAall = () => {
    const { list } = this.props
    const arry = []
    list.map(item => {
      const { checked, colId } = item
      checked && arry.push(colId)
    })
    if (!arry.length) {
      Toast.info('请选择要回寄的采样器')
      return
    }
    setSetssion('sampling', arry)
    this.props.history.push('/shipping')
  }
  // 弹窗
  handleToggle = () => {
    const { visible } = this.state
    this.setState({
      visible: !visible
    })
  }

  getReportStatus = item => {
    const { getUserStatus, history } = this.props
    const { linkManId, barcode } = item
    getUserStatus(linkManId).then(res => {
      const { data, code } = res
      if (!code) {
        this.setState({ item })
        data
          ? history.push(`/select-user?barcode=${barcode}`)
          : this.handleToggle()
      }
    })
  }
  // 性别确认
  handleConfirmGender = barCode => {
    const {
      list,
      handleConfirmGender,
      history,
      onGetUserCommitRecord,
      linkMan
    } = this.props
    const report = list.find(item => item.barcode === barCode)
    const {
      type,
      productType,
      linkManId,
      relationId,
      h5Url,
      h5ShowType
    } = report

    handleConfirmGender(barCode).then(res => {
      if (!res.code) {
        if (!relationId) {
          history.push(`/bind-user?barcode=${barCode}&linkManId=${linkManId}`)
          return
        }
        if (+productType === 2) {
          andall.invoke('goReportTab', { linkManId : linkManId + '', userName: linkMan.userName })
          return
        }
        if (h5ShowType) {
          setSetssion('relationIds', { linkManId, relationId })
          let index = investCodeMap.findIndex(item => {
            return item === type
          })

          if (index !== -1) {
            onGetUserCommitRecord(report)
          } else {
            window.location.href = this.setReportLinkUrl(report)
          }
          return
        }
        if (type === 'PDRM' || type === 'CARM' || type === 'CDRM') {
          report.reportPdfUrl
            ? (window.location.href = report.reportPdfUrl)
            : Toast.info('您的基因检测报告PDF文件正在努力生成中，请稍后...')
          return
        }
        window.location.href = h5Url
      }
    })
  }

  // 修改性别
  handleEditInfo = barCode => {
    const { list } = this.props
    const item = list.find(item => item.barcode === barCode)
    this.setState({ item })
    this.handleToggle()
  }

  // set跳转路径
  setJumpLink = (item, type) => {
    let invesIndex = investCodeMap.findIndex(code => {
      return code === type
    })
    // 判断该报告是否需要跳转到调查问券
    // if (invesIndex !== -1) {
    //   this.props.onGetUserCommitRecord(item)
    // } else {
    window.location.href = this.setReportLinkUrl(item)
    // }
  }
  handleSetUserPhoto = (value) => {
    if (value === 1) {
      return images.boyBinding
    } else if (value === 2) {
      return images.girlBinding
    } else if (value === 3) {
      return images.man
    } else if (value === 4) {
      return images.women
    }
  }
  handleChangeUser = () => {
    const { item } = this.state
    const { barcode, type } = item
    if (type) {
      this.props.history.push(`/select-user-kit?barcode=${barcode}&type=${type}`)
    } else {
      this.props.history.push(`/select-user?barcode=${barcode}`)
    }
  }
  handleChangePeople = () => {
    const { item } = this.state
    const { linkManId, barcode, type } = item
    if (type) {
      this.props.history.push(`/bind-user-kit?id=${linkManId}&barcode=${barcode}&type=${type}`)
    } else {
      this.props.history.push(`/bind-user?id=${linkManId}&barcode=${barcode}`)
    }
  }
  componentDidMount() {
    const { list } = this.props
    let _list = []
    list.forEach((el, i) => {
      if (el.productName.length > 15) {
        el.isMore = true
      }
      _list.push(el)
    })
    this.setState({
      list: _list
    })
  }

  handleOpen = (i, flag) => {
    const { list } = this.state
    const _list = []
    list.forEach((el, ind) => {
      if (i === ind) {
        el.isOpen = flag === 'up'
      }
      _list.push(el)
    })
    this.setState({
      list: _list
    })
  }
  handleSetContent = (productName, i, item) => {
    if (productName.length > 15) {
      return (
        <i className={styles.name}>
          <span className={`${styles.itemspan} ${item.isOpen ? '' : styles.lineWord}`}>{productName}</span>
          {
            item.isOpen
              ? <img onClick={() => this.handleOpen(i, 'down')} src={images.iconUp} alt='' />
              : <img onClick={() => this.handleOpen(i, 'up')} src={images.iconDown} alt='' />
          }
        </i>
      )
    } else {
      return (
        <i className={styles.name}>
          <span className={styles.itemspan}>{productName}</span>
        </i>
      )
    }
  }
  handleSetClassName = (item) => {
    if (+item.btnStatus === 4) {
      return `${styles.btn} ${styles.btnDisable}`
    } else if (+item.btnStatus === 3 || +item.btnStatus === 1) {
      return `${styles.btn} ${styles.blue}`
    } else {
      return `${styles.btn} ${styles.borderBlack1}`
    }
  }
  render() {
    const { handelChange, show, serGender, btnStatus } = this.props
    const { visible, item, showBCTips, list } = this.state
    const { linkManId, barcode } = item
    return (
      <div style={{ paddingBottom: btnStatus ? 135 : 75 }}>
        <ul className={styles.ul}>
          {list &&
            list.map((item, i) => (
              <li className={`white border flex sampling ${styles.list} 
              ${+item.btnStatus === 4 || +item.btnStatus === 2 || +item.btnStatus === 3 ? styles.radioHide : ''}
              `} key={i}>
                <Check
                  value='1'
                  type='checkbox'
                  name={`shop${i}`}
                  disabled={!item.selectable}
                  id={`shop${i}`}
                  onChange={e => {
                    handelChange(e, i)
                  }}
                  checked={item.checked}
                  className={styles.checkTop}
                />
                <div className={`${styles.listImg}`}>
                  <img src={this.handleSetUserPhoto(item.headType)} alt={item.prodName} />
                </div>
                <div className={`item ${styles.content}`}>
                  <p>
                    <span className='nowrap'>
                      <label onClick={() => { (item.editable) && this.getReportStatus(item) }}>
                        {item.userName}
                        {(!item.editable || (item.type && item.type === 'INTESTINE_BIND')) ? '' : <b /> }
                      </label>
                    </span>
                  </p>
                  <p className={styles.itemProductName}>
                    <i className={styles.name1}>商品名称：</i>
                    {
                      this.handleSetContent(item.productName, i, item)
                    }
                  </p>
                  <div className={styles.itemCont}>
                    <div>
                      <p className='nowrap'>采样器ID：{item.barcode}</p>
                      <p>采样器状态：{item.statusDesc}</p>
                    </div>
                    <div
                      onClick={() => { this.handleJumt(item) }}
                      className={this.handleSetClassName(item)}
                    >
                      {+item.btnStatus === 5 ? item.collectorBtnText : item.btnDesc}
                    </div>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        <Modal
          type
          handleToggle={() => { this.handleToggle() }}
          visible={visible}
          style={{ zIndex: 9999 }}
        >
          <div className={styles.edituser}>
            <p>选择修改类型</p>
            <span onClick={this.handleChangeUser} className={`btn ${styles.btn}`}>
              更换检测人
            </span>
            <span onClick={this.handleChangePeople} className={`btn ${styles.btn}`}>
              修改当前检测人信息
            </span>
          </div>
        </Modal>

        <Modal
          visible={show}
          style={{
            top: '50%',
            overflowY: 'hidden',
            transform: 'translateY(-50%)',
            WebkitTransition: 'translateY(-50%)'
          }}
        >
          <div className={styles.userInfo}>
            <p>产品名称：{serGender.productName}</p>
            <p>样本号：{serGender.barCode}</p>
            <h2>检测人信息</h2>
            <p>关系：{serGender.relationName}</p>
            <p>姓名：{serGender.userName} </p>
            <p>性别：{serGender.sex === 'female' ? '女' : '男'}</p>
            <p>生日：{serGender.birthday}</p>
            <span>
              请务必确认样本的检测人信息正确，如信息错误，报告部分内容将无法正确展示。
            </span>
            <div className={`flex ${styles.btns}`}>
              <div
                onClick={() => {
                  this.handleEditInfo(serGender.barCode)
                }}
                className='redBtn item'
              >
                修改
              </div>
              <b />
              <div
                onClick={() => {
                  this.handleConfirmGender(serGender.barCode)
                }}
                className='redBtn item'
              >
                确认
              </div>
            </div>
          </div>
        </Modal>

        {showBCTips && <div className={styles.pupopbox}>
          <div className={styles.pupcon}>
            <h3>- 温馨提示 -</h3>
            <p>请回寄以下采样器</p>
            <div className={styles.barListBox}>
              {[barcode].map(code => <p key={code} className={styles.f16c}>{code}</p>)}
            </div>
            {[barcode].length > 6 && <span className={styles.boxMask} />}

            <p>以确保检测成功</p>
            <a onClick={() => { this.props.history.push('/shipping') }}>
              我知道了
            </a>
          </div>
        </div>}
      </div>
    )
  }
}
export default withRouter(List)
