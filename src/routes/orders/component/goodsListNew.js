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
    list[0].tradeOrderKitRespList && list[0].tradeOrderKitRespList.map(item => {
      allNum += item.productNum
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
  getAllNum=() => {
    const { list } = this.props
    let len = 0
    list.map(item1 => {
      item1.tradeOrderKitRespList && item1.tradeOrderKitRespList.map(item2 => {
        len += (item2.tradeOrderKitProductRespList && item2.tradeOrderKitProductRespList.length) || 0
      })
    })
    return len
  }
  render () {
    let { list, type, dList } = this.props
    console.log(list, dList)
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
                    dList && dList.length && dList.map((item1, i) => (
                      <div key={i}>
                        <div className={`${styles.kitName} mb10`}>{item1.kitName}</div>
                        {
                          item1.tradeOrderKitProductRespList && item1.tradeOrderKitProductRespList.map((list, i) => (
                            <div className={`flex ${styles.row}`} key={i + 'a'}>
                              <div className='img imgCenter'>
                                <img src={list.indexPicUrl} />
                              </div>
                              <div className={`item ${styles.conent}`}>
                                <span className='nowrap'>{list.productName}</span>
                                <p className='nowrap'>{list.productBuyDesc}</p>
                                <div className={'flex ' + styles.fixed}>
                                  <span className='item blue'>¥ {list.productPrice || 0}</span>
                                  <span>x1</span>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>

                    ))
                  }
                </div>
                {/* && dList.length > 2  */}
                {this.getAllNum() > 3 && <p className={styles.showtac} onClick={() => this.toggleList()}>
                  {showAll ? '收起' : '展开更多'} <img src={showAll ? toup : todown} />
                </p>}

                <div className={`flex ${styles.bottom}`}>
                  <div className='item'>
                    {
                      !type ? (`共 ${item.kitProductNum} 件商品 `) : ''
                    }
                    合计：<label className='blue'>￥{item.paymentAmount}</label>
                  </div>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}
