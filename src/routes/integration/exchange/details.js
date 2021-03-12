import React from 'react'
import propTypes from 'prop-types'
import { Page } from '@src/components'
import integrationApi from '@src/common/api/integrationApi'
import styles from '../integrationHome/home'
import { fun } from '@src/common/app'
import images from '../images'
import BottomBtn from '../components/bottomBtn'
import ShowModal from '../components/showModal'
import { exchangeDetailView, exchangeDetailGoto, notEnoughView, notEnoughGoto, exchangeConfirmView, exchangeConfirmGoto } from '../buried-point'
const { getParams } = fun

class ExchangeDetail extends React.Component {
  state = {
    loading:true,
    details:{},
    confirmModal:false,
    insufficientPoint:false, // 积分不足
  }
  componentDidMount () {
    this.getGoodsDetail()
  }
  getGoodsDetail=() => {
    integrationApi.getGoodsDetail({
      goodsId:getParams().goodsId
    }).then(res => {
      if (res) {
        console.log(res.data)
        this.setState({
          loading:false,
          details:res.data
        }, () => {
          exchangeDetailView({
            view_type:+getParams().type === 1 ? 'points_page' : 'exchange_page',
            item_state:res.data.status === 1 ? 'out_of_stock' : res.data.status > 1 && res.data.status < 5 ? 'no_chance' : 'normal',
            product_name:res.data.name
          })
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
  confirmThis=() => {
    let { details } = this.state
    exchangeDetailGoto({
      Btn_name:details.status !== 1 && details.status !== 2 && details.status !== 3 && details.status !== 4 ? 'exchange_now' : '',
      item_state:details.status === 1 ? 'out_of_stock' : details.status > 1 && details.status < 5 ? 'no_chance' : 'normal',
      product_name:details.name
    })
    if (details.status === 4) { // 积分不足
      notEnoughView()
      return this.setState({ insufficientPoint:true })
    }
    if (details.amount === 0 && details.type !== 1) {
      exchangeConfirmView()
      this.setState({ confirmModal:true })
    } else {
      this.props.history.push(`/integration/exchange/confirm?goodsId=${getParams().goodsId}`)
    }
  }
  modalToggle = (name) => {
    let { details } = this.state
    if (name === 'insufficientPoint') {
      notEnoughGoto({ Btn_name:'cancel' })
    } else {
      exchangeConfirmGoto({
        btn_name:'cancel',
        product_name:details.name,
        item_type:details.type === 1 ? 'actual' : details.type === 2 ? 'invented' : 'vip'
      })
    }
    this.setState({ [name]: !this.state[name] })
  }
  goConfirm=() => {
    let { details } = this.state
    integrationApi.exchangeGoods({
      goodsId:getParams().goodsId
    }).then(res => {
      if (res) {
        exchangeConfirmGoto({
          btn_name:'comfirm',
          product_name:details.name,
          item_type:details.type === 1 ? 'actual' : details.type === 2 ? 'invented' : 'vip'
        })
        this.props.history.push(`/integration/exchange/success?orderId=${res.data.orderId}`)
      }
    })
  }
  doSomething=() => {
    notEnoughGoto({ Btn_name:'canceget_pointsl' })
    this.props.history.push(`/integration/home?closeWebViewFlag=1&notEnough=1`)
  }
  render () {
    // type 商品类型1-实物，2-E卡，3-月卡
    const { loading, details, confirmModal, insufficientPoint } = this.state
    return (
      <Page title='积分兑换'>
        {
          !loading && details
            ? <div className={styles.exchangeDetail}>
              <div className={styles.bigImg}><img src={details.bigImgUrl} /></div>
              <div className={styles.desc}>
                <div>
                  <p>{details.name}</p>
                  <span>已兑：{details.deductCount}</span>
                </div>
                <div className={`${styles.amounts} ${styles.amounts2}`}>
                  <img src={images.points} />
                  <span>{details.point}</span>
                  {details.amount ? <span><label>+</label>{details.amount}<label>元</label></span> : ''}
                  <p className={styles.marketPrices}>市场价：<span>¥{details.marketPrices}</span></p>
                </div>
              </div>
              <div className={styles.tips}>
                <h5>详情说明：</h5>
                <p dangerouslySetInnerHTML={{ __html:details.desc }} />
                {
                  details.detailedImage && details.detailedImage.map((item, index) => (
                    <img src={item} key={index} />
                  ))
                }
              </div>
              {/* status;//1-库存不足，2-今日已兑完，3-今日兑换已达上限,4-积分不足 */}
              <BottomBtn
                disabled={details.status === 1 || details.status === 2 || details.status === 3}
                name={details.status === 1 || details.status === 2 ? '今日已兑完' : details.status === 3 ? '今日兑换已达上限' : '立即兑换'}
                confirmThis={this.confirmThis}
              />
              {
                confirmModal
                  ? <ShowModal
                    type={22}
                    handleToggle={() => this.modalToggle('confirmModal')}
                    details={details}
                    goConfirm={this.goConfirm}
                  />
                  : ''
              }
              {
                insufficientPoint
                  ? <ShowModal
                    type={21}
                    insufficientDesc={details.tipDesc}
                    handleToggle={() => this.modalToggle('insufficientPoint')}
                    doSomething={this.doSomething}
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
ExchangeDetail.propTypes = {
  history: propTypes.object,
}
export default ExchangeDetail
