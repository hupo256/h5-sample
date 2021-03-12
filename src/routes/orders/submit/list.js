import React from 'react'
import propTypes from 'prop-types'
import styles from '../order'
class List extends React.Component {
  static propTypes = {
    list: propTypes.array.isRequired,
    goDetail: propTypes.func.isRequired
  }
  render () {
    const { list, productBuyDesc, transportCost, showPrice, orderUserInfoKitInfo } = this.props
    return (
      <ul className={styles.borderNo}>
        {
          list.map((item, i) => (
            <li className={`white  solid ${styles.list}`} key={i}>
              <div className={`flex ${styles.row}`}>
                <div className={`${styles.prdPic} imgCenter`} onClick={this.props.goDetail}>
                  <img src={item.cartProdPath ? item.cartProdPath : item.pictureUrl} alt={item.productName} />
                </div>
                <div className={`item ${styles.conent}`}>
                  <span className='nowrap'>{item.productName}</span>
                  <p className='nowrap'>{productBuyDesc || item.productDesc || item.seriesDesc}</p>
                  <div className={`flex fz14 pt20 ${styles.absolute}`}>
                    {!orderUserInfoKitInfo &&
                    <span className='item blue'>¥ {transportCost ? showPrice : item.productPrice}</span>
                    }
                    {orderUserInfoKitInfo &&
                    <span className='item blue'>¥ {item.productPrice}</span>
                    }
                    <span>x{item.productNum || 1}</span>
                  </div>
                </div>
              </div>
            </li>
          ))
        }
      </ul>
    )
  }
}

export default List
