import React from 'react'
import propTypes from 'prop-types'
import { Page } from '@src/components'
import integrationApi from '@src/common/api/integrationApi'
import styles from '../integrationHome/home'
import Product from '../components/product'
import images from '../images'
import { exchangeListView, exchangeListGoto } from '../buried-point'
import { fun } from '@src/common/app'
const { getParams } = fun

class Exchange extends React.Component {
  state = {
    loading:false,
    productList:[]
  }
  componentDidMount () {
    this.getGoodsList()
  }
  getGoodsList=() => {
    exchangeListView({
      view_type:getParams().more ? 'exchange_success_page' : 'points_page'
    })
    integrationApi.getGoodsList().then(({ data }) => {
      if (data) {
        this.setState({
          pointVal:data.pointVal,
          productList:data.productList
        })
      }
    })
  }
  goPage=(type, item) => {
    this.props.history.push(type === 1 ? '/integration/exchange/records?type=2' : `/integration/exchange/details?goodsId=${item.id}&type=2`)
    exchangeListGoto({ Btn_name:type === 1 ? 'exchange_record' : 'go_exchange' })
  }
  render () {
    const { productList, pointVal } = this.state
    return (
      <Page title='积分兑好礼'>
        <div className={styles.exchangePage}>
          <div className={styles.exchangeMine} onClick={() => this.goPage(1)}>
            <div>
              <img src={images.points} />
              <span>我的积分：</span>
              <label>{pointVal}</label>
            </div>
            <p>兑换记录</p>
          </div>
          <Product
            type={2}
            productList={productList}
            goExchange={(item) => this.goPage(2, item)}
          />
        </div>
      </Page>
    )
  }
}
Exchange.propTypes = {
  history: propTypes.object,
}
export default Exchange
