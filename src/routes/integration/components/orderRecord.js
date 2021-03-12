import React, { Component } from 'react'
import propTypes from 'prop-types'
import Goods from '../components/goods'
import styles from '../integration.scss'

class OrderRecord extends Component {
    state={
      thistimer:''
    }
  static propTypes = {
    details:propTypes.object,
    goOrders:propTypes.func,
    payAgain:propTypes.func,
    cancelThisBtn:propTypes.func,
    cancelSelf:propTypes.func,
  }
  componentDidMount () {
    const { details } = this.props

    if (details.status === 1) {
      this.setState({
        thistimer:this.countdown(this.props.details.orderEndTime.replace(/\-/g, '/'))
      })
      this.beginTimer = setInterval(() => {
        this.setState({ thistimer: this.countdown(details.orderEndTime.replace(/\-/g, '/')) })
        if (this.countdown(details.orderEndTime.replace(/\-/g, '/')) === '00:00') {
          this.props.cancelSelf(details.orderId)
          return clearInterval(this.beginTimer)
        }
      }, 1000)
    }
  }
  componentWillUnmount() {
    clearInterval(this.beginTimer)
  }

  countdown=(timer) => {
    let nowDate = new Date()
    let nowDateChuo = Date.parse(nowDate) // 转化成时间戳
    let midAutumn = new Date(timer)
    let midAutumneChuo = Date.parse(midAutumn)
    let date3 = midAutumneChuo - nowDateChuo

    var days = Math.floor(date3 / (24 * 3600 * 1000))
    var leave1 = date3 % (24 * 3600 * 1000)
    var hours = Math.floor(leave1 / (3600 * 1000))
    var leave2 = leave1 % (3600 * 1000)
    var minutes = Math.floor(leave2 / (60 * 1000))
    var leave3 = leave2 % (60 * 1000)
    var seconds = Math.round(leave3 / 1000)
    if (hours < 10) hours = '0' + hours
    if (minutes < 10) minutes = '0' + minutes
    if (seconds < 10) seconds = '0' + seconds
    return minutes + ':' + seconds
  }
  render () {
    const { details, goOrders, cancelThisBtn, payAgain } = this.props
    return (
      <div className={styles.records}>
        <div className={styles.top}>
          {/* 订单状态：1-待支付，2-已支付，3-已取消，4-已退款 */}
          <p>{
            details.status === 1
              ? <span style={{ color:'#6567e5' }}>{`待付款：${this.state.thistimer}`}</span>
              : details.status === 2
                ? details.type === 1
                  ? details.expressStatus === 1 ? '待发货' : details.expressStatus === 2 ? '已发货' : '发货已取消'
                  : '已完成'
                : details.status === 3
                  ? '已取消'
                  : details.status === 4
                    ? '已退款' : ''}</p>
          <div onClick={goOrders}>查看详情</div>
        </div>
        <Goods details={details} />
        {
          details.status === 1
            ? <div className={styles.bottom}>
              <p onClick={cancelThisBtn}>取消订单</p>
              <p onClick={payAgain}>立即付款</p>
            </div>
            : ''
        }
      </div>
    )
  }
}
export default OrderRecord
