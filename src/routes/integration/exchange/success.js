import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from '../integrationHome/home'
import Cards from '../components/cards'
import images from '../images'
import { ua, fun } from '@src/common/app'
import integrationApi from '@src/common/api/integrationApi'
import { exchangeSuccessPageView, exchangeSuccessPageGoto } from '../buried-point'
const { getParams } = fun

class ExchangeSuccess extends React.Component {
  state = {
    loading:false,
    descObj:{}
  }

  componentDidMount () {
    this.getPayResult()
  }
  getPayResult=() => {
    integrationApi.getPayResult({
      orderId:getParams().orderId
    }).then(res => {
      if (res) {
        exchangeSuccessPageView({
          product_name:res.data.name,
          item_type:res.data.type === 1 ? 'actual' : res.data.type === 2 ? 'invented' : 'vip'
        })
        this.setState({ descObj:res.data })
      }
    })
  }

  goPage=(type) => {
    let { descObj } = this.state
    exchangeSuccessPageGoto({
      Btn_name:type === 1 ? 'vip_page' : type === 2 ? 'continue_exchange' : 'view_order',
      product_name:descObj.goodsName,
      item_type:descObj.type === 1 ? 'actual' : descObj.type === 2 ? 'invented' : 'vip'
    })
    if (type === 1) {
      let url = `${location.origin}/mkt/members?hideTitleBar=1`
      location.href = ua.isAndall() ? `andall://andall.com/inner_webview?url=${url}` : url
    } else {
      let url = type === 2
        ? localStorage.productListLength > 4 ? '/integration/exchange?more=1' : '/integration/home?closeWebViewFlag=1'
        : `/integration/orders?orderId=${getParams().orderId}`
      this.props.history.push(url)
    }
  }
  render () {
    const { descObj } = this.state
    return (
      <Page title='积分兑换'>
        <div className={styles.exchangeSuccess}>
          <img src={images.success2} />
          <h5>兑换成功</h5>
          <p>
            {descObj.type === 1 ? descObj.goodsResp.desc
              : descObj.type === 2 ? `恭喜你获得${descObj.goodsName}`
                : descObj.type === 3 ? `您已成为安我会员，有效期至${descObj.monthCardResp.desc}`
                  : ''
            }</p>
          {
            descObj.type === 3
              ? <div className={styles.btns}>
                <p onClick={() => this.goPage(1)}>查看会员权益</p>
                <p onClick={() => this.goPage(2)}>继续兑换</p>
              </div>
              : descObj.type === 1
                ? <div className={styles.btns}>
                  <p onClick={() => this.goPage(3)}>查看订单</p>
                  <p onClick={() => this.goPage(2)}>兑换更多</p>
                </div>
                : ''
          }
          {
            descObj.type === 2 && descObj &&
            <Cards
              details={descObj}
              goExchange={() => this.goPage(2)}
              from='success'
            />
          }
        </div>
      </Page>
    )
  }
}
ExchangeSuccess.propTypes = {
  history: propTypes.object,
}
export default ExchangeSuccess
