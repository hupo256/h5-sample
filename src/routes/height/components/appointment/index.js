import React from 'react'
import propTypes from 'prop-types'
import { Icon, Toast, Picker } from 'antd-mobile'
import { API, images, fun, ua } from '@src/common/app'
import styles from './appointment.scss'
import {
  trackPointToolHeightPageBtnClick
} from '../../buried-point'
const { getDayListExport } = fun
const { isAndall, isIos } = ua

class Appointment extends React.Component {
  state = {
    isOrder: false,
    isAgree: false,
    isGray: false,
    pickerPop: false,
    linkmanObj: {},
    bomb: {
      orderSuccessBomb: false
    },
    timeList:getDayListExport(3),
  }
  componentDidMount () {
  }
  componentWillReceiveProps (nextprops) {
    const { linkmanObj } = this.state
    const _linkmanObj = nextprops.linkmanObj
    if (linkmanObj === _linkmanObj) return
    this.setState({
      linkmanObj
    }, () => {
      this.handleQueryAppointment()
    })
  }
  // 获取预约信息
  handleQueryAppointment = () => {
    const { linkmanObj } = this.props
    const { linkmanId } = linkmanObj
    const params = {
      linkmanId
    }
    API.selectExpertAppointment(params).then(({ data }) => {
      const { endTime, startTime } = data
      if (startTime) {
        let dateTime = new Date()
        let Time = new Date(endTime + ':00')
        let isGray = false
        if (dateTime - Time <= 0) {
          isGray = true
        }
        this.setState({
          orderTime: startTime + '-' + endTime.split(' ')[1],
          isGray,
          isOrder: true
        })
      }
    })
  }
  // 显示预约时间的框
  handleShowPicker = () => {
    this.setState({
      pickerPop: true
    })
  }
  // 选择预约时间的确认事件
  pickerOk = (e) => {
    this.setState({
      orderTime: e.join(' '),
      pickerPop: false
    })
  }
  // 隐藏预约时间的框
  hidePicker = () => {
    this.setState({ pickerPop: false })
  }
  // 预约专家
  handleOrderExport = () => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: 'appointment_expert',
      os_version: version
    })
    return Toast.info('感谢您的支持，预约名额已满，请等待下次开放预约，谢谢。')
    const { orderTime, isGray, isOrder, bomb, isAgree } = this.state
    const { linkmanObj } = this.props
    const { linkmanId, linkmanName } = linkmanObj
    if (isGray || isOrder || !isAgree) return
    if (!orderTime) return Toast.info('请选择预约时间！')
    const startTime = `${orderTime.split(' ')[0]} ${orderTime.split(' ')[1].split('-')[0]}`
    const endTime = `${orderTime.split(' ')[0]} ${orderTime.split(' ')[1].split('-')[1]}`
    const params = {
      linkmanId,
      startTime,
      endTime,
      linkmanName
    }
    API.insertExpertAppointment(params).then(({ code }) => {
      if (!code) {
        this.setState({
          bomb: {
            ...bomb,
            orderSuccessBomb: true
          }
        })
        this.setState({
          isGray: true,
          isOrder: true
        })
      }
    })
  }
  // 点击授权
  handleAgreeFun = () => {
    const { isAgree } = this.state
    this.setState({
      isAgree: !isAgree
    })
  }
  handleHideOrderBomb = () => {
    const { bomb } = this.state
    this.setState({
      bomb: {
        ...bomb,
        orderSuccessBomb: false
      }
    })
  }
  render () {
    const { isOrder, orderTime, isAgree, isGray, timeList, pickerPop, bomb } = this.state
    return (
      <div className={styles.appointmentCont}>
        {
          isOrder
            ? <div className={styles.orderTime}>已预约时间<span>{orderTime}</span></div>
            : <div className={styles.orderTime} onClick={this.handleShowPicker}>
                预约时间
              {
                orderTime ? <span>{orderTime}</span> : ''
              }
              <Icon className={styles.downIcon} type={'down'} size='xs' />
            </div>
        }
        {
          isOrder ? <p className={styles.orderDesc}>安我育儿专家会在这个时间联系您，请保持电话畅通</p>
            : <p className={styles.shouquan} onClick={this.handleAgreeFun}>
              <span className={`${styles.radio} ${isAgree ? styles.active : ''}`} >
                <em />
              </span>
                  同意授权报告给专家查看</p>
        }
        {
          isOrder ? ''
            : <span className={`${styles.orderBtn} ${isGray || !isAgree || !orderTime ? styles.isGray : ''}`} onClick={this.handleOrderExport}>立即预约</span>
        }
        <Picker
          data={timeList}
          visible={pickerPop}
          cols={2}
          onOk={(e) => {
            this.pickerOk(e)
          }}
          onDismiss={this.hidePicker}
          extra='请选择(可选)'
        />
        {
          bomb.orderSuccessBomb
            ? <div className={styles.bombCont}>
              <div className={styles.mask} />
              <div className={styles.orderContBomb}>
                <img src={images.iconSuccess} alt='' />
                <p className={styles.title}>预约成功</p>
                <p className={styles.time}>预约时间：{orderTime}</p>
                <span className={styles.knowBtn} onClick={this.handleHideOrderBomb}>我知道了</span>
              </div>
            </div>
            : ''
        }
      </div>
    )
  }
}
Appointment.propTypes = {
  linkmanObj: propTypes.object,
}
export default Appointment
