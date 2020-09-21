import React, { Component } from 'react'
import propTypes from 'prop-types'

import { filter } from '@src/common/app'
import toup from '@static/detail/toup.png'
import todown from '@static/detail/todown.png'
import styles from '../order'

const { orderStatus } = filter

export default class GoodsList extends Component {
  static propTypes = {
    list: propTypes.array.isRequired,
    type: propTypes.number
  }

  state = {
    showAll: false
  }

  computerNumber = () => {
    const { list } = this.props
    let allNum = 0
    list[0].orderDetails && list[0].orderDetails.map(item => {
      allNum += item.buyNum
    })
    return allNum
  }

  toggleList = () => {
    const { showAll } = this.state
    const { touchDets } = this.props
    touchDets(!showAll)
    this.setState({
      showAll: !showAll
    })
  }

  render () {
    const { list, type, dList } = this.props
    const { showAll } = this.state
    return (
      <div>
        <ul>
          {
            list.map((item, i) => (
              <li className={`white  ${styles.list}`} key={i}>
                <div className={`flex ${styles.number}`}>
                  <div className='item'>
                    {type ? `订单号：${item.orderNo}` : '商品信息'}
                  </div>
                  {/* <span className='blue'>{orderStatus(item.orderStatus)}</span> */}
                </div>

                <div className={styles.listbox}>
                  {
                    dList&&dList.length > 0 && dList.map((list, i) => (
                      <div className={`flex ${styles.row}`} key={i + 'a'}>
                        <div className='img imgCenter'>
                          <img src={list.indexPicUrl} />
                        </div>
                        <div className={`item ${styles.conent}`}>
                          <span className='nowrap'>{list.productName}</span>
                          <p className='nowrap'>{list.productBuyDesc}</p>
                          {/* <p className='nowrap'>{list.categoryName}</p> */}
                          <div className={'flex ' + styles.fixed}>
                            <span className='item blue'>¥ {list.productOriginalPrice}</span>
                            <span>x{list.buyNum}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>

                {item.orderDetails && item.orderDetails.length !== 3 && dList&&dList.length > 2 && <p className={styles.showtac} onClick={this.toggleList}>
                  {showAll ? '收起' : '展开更多'} <img src={showAll ? toup : todown} />
                </p>}

                <br />
                
                {/* <div className={`flex ${styles.bottom}`}>
                  <div className='item'>
                    {
                      !type ? (`共 ${this.computerNumber()} 件商品 `) : ''
                    }
                    合计：<label className='blue'>￥{item.paymentAmount}</label>
                  </div>
                </div> */}
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}
