import React from 'react'
import Page from '@src/components/page'
import propTypes from 'prop-types'
import styles from './orders'
import integrationApi from '@src/common/api/integrationApi'
import { fun, ua } from '@src/common/app'
import images from '../images'
import PayDetail from '../components/payDetail'
import Goods from '../components/goods'
import Cards from '../components/cards'
import OrderDetail from '../components/orderDetail'
import BottomBtn from '../components/bottomBtn'
import PayNow from '../components/payNow'
import ClipboardJS from 'clipboard'
import { Toast } from 'antd-mobile'
import { exchangeRecordDetailPageView, exchangeRecordDetailPageGoto } from '../buried-point'

const { getParams } = fun
const { isAndall } = ua

class Orders extends React.Component {
  state = {
    loading:true,
    receiveList:[],
    details: {},
    active:'',
    payNowFlag:false,
  }

  componentDidMount () {
    this.getOrderDetail()
  }
  componentWillUnmount() {
    this.setState = () => false
  }
  getOrderDetail=() => {
    integrationApi.getOrderDetail(
      { orderId:getParams().orderId }
    ).then(res => {
      if (res) {
        exchangeRecordDetailPageView({
          view_type:'exchange_success_page',
          order_state:res.data.status === 1 ? 1 : res.data.status === 3 ? 2 : res.data.status === 2 && res.data.expressStatus === 1 ? 4 : 3,
          product_name:res.data.name,
          item_type:res.data.type === 1 ? 'actual' : res.data.type === 2 ? 'invented' : 'vip'
        })
        this.setState({
          loading:false,
          details:res.data
        })
      }
    })
  }
  goExchange=() => {
    this.props.history.push(`/integration/home?closeWebViewFlag=1`)
  }
  cancelThis=() => {
    const { details } = this.state
    integrationApi.cancelExchangeOrder({
      orderId:getParams().orderId
    }).then(res => {
      if (res) {
        exchangeRecordDetailPageGoto({
          Btn_name:'cancel',
          order_state:1,
          product_name:details.name,
          item_type:details.type === 1 ? 'actual' : details.type === 2 ? 'invented' : 'vip'
        })
        this.getOrderDetail()
      }
    })
  }
  modalToggle = (name) => {
    this.setState({ [name]: !this.state[name] })
  }
  choosePay=(type) => {
    console.log(type)
    this.setState({ active:type })
  }
  confirmThis=() => {
    this.setState({ payNowFlag:true })
  }
  choosePay=(type) => {
    let { details } = this.state
    this.setState({ active:type }, () => {
      integrationApi.prePayOrder({
        orderId:getParams().orderId,
        payType:type === 0 ? 'WXAPP' : 'ALIPAYAPP'
      }).then(res => {
        if (res) {
          exchangeRecordDetailPageGoto({
            Btn_name:'pay_now',
            order_state:1,
            product_name:details.name,
            item_type:details.type === 1 ? 'actual' : details.type === 2 ? 'invented' : 'vip'
          })
          const { data } = res
          andall.invoke('gotoThirdPay', {
            payType:type + 1, data }, re => {
            if (+re.isSuccess) {
              this.props.history.replace(`/integration/exchange/success?orderId=${data.orderId}`)
            } else {
              this.setState({
                payNowFlag:false
              })
              this.getOrderDetail()
            }
          })
        }
      })
    })
  }
  // 查看会员权益
  goPage=(type) => {
    if (type === 1) {
      let url = `${location.origin}/mkt/members?hideTitleBar=1`
      location.href = ua.isAndall() ? `andall://andall.com/inner_webview?url=${url}` : url
    } else {
      this.props.history.push(`${localStorage.productListLength > 4 ? `/integration/exchange?remainPoint=${localStorage.remainPoint}` : '/integration/home?closeWebViewFlag=1'}`)
    }
  }
  handleCopyTxt = () => {
    let clipboard = null
    clipboard = new ClipboardJS(`.copyBtn`)
    clipboard.on('success', e => {
      Toast.info('复制成功', 1)
      e.clearSelection()
    })
    clipboard.on('error', e => {
      Toast.info('请手动长按复制', 1)
    })
  }
  render () {
    const { loading, details, active, payNowFlag } = this.state
    return (
    // type 商品类型 1-实物，2-E卡，3-月卡
    // status 订单状态，1-待支付，2-已支付，3-已取消，4-已退款
    // expressStatus 发货状态：1-待发货，2-已发货
      <Page title='订单详情'>
        {!loading && details ? <div className={styles.orders}>
          <h5>
              订单{
              details.status === 1
                ? '待付款'
                : details.status === 2
                  ? details.type === 1
                    ? details.expressStatus === 1 ? '待发货' : details.expressStatus === 2 ? '已发货' : '已支付'
                    : '已完成'
                  : details.status === 3
                    ? '已取消'
                    : details.status === 4
                      ? '已退款' : ''
            }
          </h5>
          {
            details.type === 1 && <div className={styles.square}>
              {
                details.status !== 3 && details.status !== 1 && details.expressStatus && <div className={styles.logistics}>
                  <img src={images.orders1} />
                  <span id='cardNo'>{`${details.expressStatus === 1 ? '暂无物流信息' : details.expressStatus === 2 ? `快递单号：${details.expressNo}` : '发货已取消'}`}</span>
                  {details.expressStatus === 2 && <img className='copyBtn' data-clipboard-target={`#cardNo`} src={images.copy} onClick={() => this.handleCopyTxt()} />}
                  {details.expressStatus === 2 && <label className='copyBtn' data-clipboard-target={`#cardNo`}>复制</label>}
                </div>
              }
              <div className={styles.address}>
                <img src={images.orders2} />
                <div>
                  <span>{details.userName}</span><span>{details.mobile}</span>
                  <p>{details.address}</p>
                </div>
              </div>
            </div>
          }
          <div className={styles.goods}>
            <Goods details={details} />
          </div>
          {/* { details.status === 1 && <PayWay
            active={active}
            choosePay={(index) => this.choosePay(index)} />
          } */}
          <PayDetail details={details} type={2} />
          {
            details.type === 2 && details.status === 2 &&
            <Cards details={details} goExchange={() => this.goPage(2)} />
          }
          <OrderDetail details={details} />
          {
            details.status === 1
              ? <BottomBtn
                cancelThis={this.cancelThis}
                confirmThis={this.confirmThis}
                type={2}
              />
              : ''
          }
          {
            details.type === 3 && details.status === 2
              ? <BottomBtn
                confirmThis={() => this.goPage(1)}
                name={'查看会员权益'}
                type={1}
              />
              : ''
          }
          {
            payNowFlag
              ? <PayNow
                active={active}
                choosePay={(index) => this.choosePay(index)}
                handleClose={() => this.modalToggle('payNowFlag')}
              />
              : ''
          }
        </div>
          : ''
        }
      </Page>
    )
  }
}
Orders.propTypes = {
  history: propTypes.object,
}
export default Orders
