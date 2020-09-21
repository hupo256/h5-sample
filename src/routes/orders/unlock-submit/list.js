import React from 'react'
import propTypes from 'prop-types'
import styles from '../order'
import images from '@src/common/utils/images'
const { changdao_report} = images
class List extends React.Component {
  static propTypes = {
    list: propTypes.array.isRequired,
    buyType: propTypes.string,
    goDetail: propTypes.func.isRequired
  }

  render () {
    const { list, buyType,imgtype } = this.props
    const img=`${changdao_report}${imgtype}.png`;
    return (
      <ul className={`${styles.borderNo}  ${styles.unlockList}`}>
        {
          list.map((item, i) => (
            <li className={`border ${styles.list}`} key={i}>
              <div className={`flex ${styles.row}`}>
                <div className={`${styles.prdPic} imgCenter mr8`} onClick={this.props.goDetail}>
                  <img src={imgtype?img:item.cartProdPath} alt={item.productName} />
                </div>
                <div className={`item ${styles.goodsCon}`}>
                  <h3 className={`mb4 ${styles.productName}`}>{item.productName}</h3>
                  <div className={`${styles.unlockDesc} ${buyType === '4' ? 'mb8' : 'mb20'}`}>
                    购买后将对{item.linkManUserName}的样本检测数据进行解锁
                  </div>
                  {
                    buyType === '4'&&!imgtype
                      ? <div className={`${styles.cardTotal} mb4`}>
                          共{item.lockCards.length}张卡片
                      </div> : null
                  }
                  <div className={`flex ${styles.priceLand}`}>
                    <span className={`item ${styles.price}`}>¥ {item.productPrice}</span>
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
