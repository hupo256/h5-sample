import React from 'react'
import propTypes from 'prop-types'
import { Page } from '@src/components'
import integrationApi from '@src/common/api/integrationApi'
import styles from '../integrationHome/home'
import { fun, ua } from '@src/common/app'
import BottomBtn from '../components/bottomBtn'
import Goods from '../components/goods'
import FormNew from '@src/components/formNew'
import PayWay from '../components/payWay'
import PayDetail from '../components/payDetail'
import { Toast } from 'antd-mobile'
import ShowModal from '../components/showModal'
import { exchangeConfirmPageView, exchangeConfirmPageGoto } from '../buried-point'
const { getParams, isPoneAvailable } = fun
const { isAndall } = ua

class ExchangeConfirm extends React.Component {
  state = {
    loading:true,
    details:{},
    orderAddress: {},
    confirmModal:false,
    active:0,
  }
  componentDidMount () {
    this.getGoodsDetail()
  }
  getGoodsDetail=() => {
    integrationApi.getGoodsDetail({
      goodsId:getParams().goodsId
    }).then(res => {
      if (res) {
        exchangeConfirmPageView({
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
  goRecords=() => {
    this.props.history.push('/integration/exchangeRecords')
  }
  goOrders=(item) => {
    console.log(item)
    this.props.history.push(`/integration/orders?orderId=${item.orderId}`)
  }
  formChange = (value, key) => {
    const { orderAddress } = this.state
    let addersObj = { [key]: value }
    if (key === 'adders') {
      addersObj = {
        area: value[2].split('-')[1],
        city: value[1].split('-')[1],
        province: value[0]
      }
    }
    if (key === 'mobile') {
      const isPhone = isPoneAvailable(+value)
      isPhone && this.setState({ phoneNum: true })
    }
    Object.assign(orderAddress, addersObj)
    this.setState({ orderAddress })
  }

  formBlur = (value, key) => {
    const isPhone = isPoneAvailable(+value)
    if (!isPhone) {
      Toast.fail('电话号码不符合规范', 2)
      this.setState({ phoneNum: false })
    } else {
      this.setState({ phoneNum: true })
    }
  }
  choosePay=(type) => {
    this.setState({ active:type })
  }
  confirmThis=() => {
    let { details } = this.state
    if (details.type === 1) {
      const { orderAddress } = this.state
      let { name, mobile, province, addressDetail } = orderAddress
      console.log(orderAddress)
      if (!name) {
        Toast.info('请填写收件人', 1)
        return
      }
      if (!mobile) {
        Toast.info('请填写正确手机号', 1)
        return
      }
      if (!province) {
        Toast.info('请选择地区', 1)
        return
      }
      if (!addressDetail) {
        Toast.info('请填写详细地址', 1)
        return
      }
    }
    console.log(details.amount)
    if (details.amount > 0) {
      this.goConfirm()
    } else {
      this.setState({
        confirmModal:true
      })
    }
  }
  modalToggle = (name) => {
    this.setState({ [name]: !this.state[name] })
  }
  goConfirm=() => {
    let { active, details, orderAddress } = this.state
    let { name, mobile, province, area, city, addressDetail } = orderAddress
    let params = {
      goodsId:getParams().goodsId,
      payType:active === 0 ? 'WXAPP' : 'ALIPAYAPP'
    }
    if (details.type === 1) {
      params.username = name
      params.mobile = mobile
      params.province = province
      params.city = city
      params.area = area
      params.address = addressDetail
    }
    console.log(params)
    exchangeConfirmPageGoto({
      Btn_name:'comfirm',
      product_name:details.name,
      item_type:details.type === 1 ? 'actual' : details.type === 2 ? 'invented' : 'vip'
    })
    integrationApi.exchangeGoods(params).then(res => {
      if (res) {
        const { data } = res
        if (data.needPay) {
          if (isAndall()) {
            andall.invoke('gotoThirdPay', {
              payType:active + 1, data }, re => {
              if (+re.isSuccess) {
                this.props.history.replace(`/integration/exchange/success?orderId=${data.orderId}`)
              } else {
                this.getGoodsDetail()
              }
            })
          }
        } else {
          this.props.history.replace(`/integration/exchange/success?orderId=${data.orderId}`)
        }
      }
    })
  }
  render () {
    // type 商品类型1-实物，2-E卡，3-会员卡
    const { loading, details, confirmModal, active } = this.state
    return (
      <Page title='积分兑换'>
        {!loading && <div className={styles.exchangeConfirm}>
          {
            details.type === 1 && <div className={styles.shippingFrom}>
              <FormNew onChange={this.formChange} onBlur={this.formBlur} type={0} />
            </div>
          }
          <div className={styles.goods}>
            <Goods details={details} />
          </div>
          {details.amount > 0
            ? <PayWay
              active={active}
              choosePay={(index) => this.choosePay(index)} />
            : ''}
          <PayDetail details={details} />
          <BottomBtn
            name={'确认兑换'}
            confirmThis={this.confirmThis}
          />
          {
            confirmModal
              ? <ShowModal
                type={22}
                handleToggle={() => this.modalToggle('confirmModal')}
                details={details}
                goConfirm={() => this.goConfirm()}
              />
              : null
          }
        </div>}
      </Page>
    )
  }
}
ExchangeConfirm.propTypes = {
  history: propTypes.object,
}
export default ExchangeConfirm
