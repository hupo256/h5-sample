import React from 'react'
import propTypes from 'prop-types'
import { Page } from '@src/components'
import integrationApi from '@src/common/api/integrationApi'
import styles from '../integrationHome/home'
import OrderRecord from '../components/orderRecord'
import ShowModal from '../components/showModal'
import PayNow from '../components/payNow'
import images from '../images'
import { exchangeRecordPageView, exchangeRecordPageGoto, exchangeRecordDetailPageGoto } from '../buried-point'
import { fun } from '@src/common/app'
const { getParams } = fun

class ExchangeRecords extends React.Component {
  state = {
    loading:false,
    records:[],
    pageObj: {
      pageNo: 1,
      pageSize: 10,
      totalPage: 1,
    },
    loadingStatus: true,
    cancelFlag:false,
    thisOrderId:'',
    active:'',
    payNowFlag:false

  }
  componentDidMount () {
    this.getExchangeOrderList()
    this.addEventListenerSroll()
    exchangeRecordPageView({ view_type:+getParams().type === 2 ? 'exchange_page' : 'points_page' })
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.getExchangeOrderList)
  }
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.getExchangeOrderList)
  }
  getExchangeOrderList=() => {
    let { loadingStatus, pageObj, records } = this.state
    const { pageNo, pageSize, totalPage } = pageObj || {}
    const params = {
      pageNo,
      pageSize
    }
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    if (loadingStatus && pageNo <= Math.ceil(totalPage / 10) && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        integrationApi.getExchangeOrderList(params).then(({ data }) => {
          if (data) {
            console.log(data)
            this.setState({
              records: [...records, ...data.list],
              pageObj: {
                ...pageObj,
                pageNo:pageNo + 1,
                totalPage: data.total,
              },
            }, () => {
              if (this.state.records.length < 11) {
                document.body.scrollTop = 1
                document.documentElement.scrollTop = 1
              }
            })
          }
          // 页面抖动
          setTimeout(() => {
            this.setState({
              loadingStatus: true
            })
          }, 30)
        })
      })
    }
  }
  goOrders=(item) => {
    // console.log(item)
    // status 订单状态，1-待支付，2-已支付，3-已取消，4-已退款
    exchangeRecordPageGoto({
      Btn_name:'view_detail',
      order_state:item.status === 1 ? 1 : item.status === 3 ? 2 : item.status === 2 && item.expressStatus === 1 ? 4 : 3,
      product_name:item.name,
      item_type:item.type === 1 ? 'actual' : item.type === 2 ? 'invented' : 'vip'
    })
    this.props.history.push(`/integration/orders?orderId=${item.orderId}`)
    // window.location.href = `${window.origin}/mkt/integration/orders?orderId=${item.orderId}`
  }

  cancelThisBtn=(item) => {
    this.setState({
      cancelFlag:true,
      thisOrderId:item.orderId
    })
  }
  modalToggle = (name) => {
    console.log(name)
    this.setState({ [name]: !this.state[name] })
  }
  goConfirm=() => {
    let { records, thisOrderId } = this.state
    integrationApi.cancelExchangeOrder({
      orderId:thisOrderId
    }).then(res => {
      if (res) {
        exchangeRecordPageGoto({
          Btn_name:'cancel',
          order_state:1,
          product_name:records.name,
          item_type:records.type === 1 ? 'actual' : records.type === 2 ? 'invented' : 'vip'
        })
        records.filter(item => item.orderId === thisOrderId)[0].status = 3
        this.setState({
          records,
          cancelFlag:false
        })
      }
    })
  }
  payAgain=(item) => {
    console.log(item)
    exchangeRecordPageGoto({
      Btn_name:'pay_now',
      order_state:1,
      product_name:item.name,
      item_type:item.type === 1 ? 'actual' : item.type === 2 ? 'invented' : 'vip'
    })
    this.setState({
      payNowFlag:true,
      thisOrder:item
    })
  }
  // 30分钟自动取消
  cancelSelf=(orderId) => {
    let { records } = this.state
    records.filter(item => item.orderId === orderId)[0].status = 3
    this.setState({
      records
    })
  }
  choosePay=(type) => {
    let { thisOrder } = this.state
    this.setState({ active:type }, () => {
      integrationApi.prePayOrder({
        orderId:thisOrder.orderId,
        payType:type === 0 ? 'WXAPP' : 'ALIPAYAPP'
      }).then(res => {
        if (res) {
          exchangeRecordDetailPageGoto({
            Btn_name:'pay_now',
            order_state:1,
            product_name:thisOrder.name,
            item_type:thisOrder.type === 1 ? 'actual' : thisOrder.type === 2 ? 'invented' : 'vip'
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
              this.getExchangeOrderList()
            }
          })
        }
      })
    })
  }
  render () {
    const { records, cancelFlag, pageObj, active, payNowFlag } = this.state
    return (
      <Page title='兑换记录'>
        {
          pageObj && pageObj.totalPage === 0
            ? <div className={styles.noRecords}>
              <img src={images.noRecords} />
              <p>您还没有兑换记录哦</p>
            </div>
            : records.length > 0
              ? <div className={styles.exchangeRecords} >
                {
                  records.map((item, index) => {
                    return <div key={index}>
                      <OrderRecord
                        details={item}
                        goOrders={(() => this.goOrders(item))}
                        cancelThisBtn={() => this.cancelThisBtn(item)}
                        payAgain={() => this.payAgain(item)}
                        cancelSelf={(orderId) => this.cancelSelf(orderId)}
                      />
                    </div>
                  })
                }
                {
                  cancelFlag ? <ShowModal
                    type={23}
                    handleToggle={() => this.modalToggle('cancelFlag')}
                    goConfirm={this.goConfirm}
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
ExchangeRecords.propTypes = {
  history: propTypes.object,
}
export default ExchangeRecords
