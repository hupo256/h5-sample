import React, { Component } from 'react'
import propTypes from 'prop-types'
import images from '../images'
import styles from '../integration.scss'

class Product extends Component {
  static propTypes = {
    type:propTypes.number,
    productList:propTypes.array,
    goExchange:propTypes.func
  }
  goPage=(item) => {
    this.props.goExchange(item)
  }
  render () {
    const { productList, type } = this.props
    return (
      <div className={`${type === 1 && styles.productList} ${type === 2 && styles.productList2}`} >
        {
          productList.map((item, index) => (
            <div key={index} className={styles.productListBox} onClick={() => this.goPage(item)}>
              <div className={styles.productImg}><img src={item.bigImgUrl} /></div>
              <h5>{item.name.length > 8 ? item.name.slice(0, 8) : item.name}</h5>
              <div className={styles.amounts}>
                <img src={images.points} />
                <span>{item.point}</span>
                {item.amount ? <span><label>+</label>{item.amount}<label>元</label></span> : ''}
              </div>
              {type === 2 ? <div className={styles.taskBtn}>去兑换</div> : ''}
            </div>
          ))
        }
      </div>
    )
  }
}
export default Product
