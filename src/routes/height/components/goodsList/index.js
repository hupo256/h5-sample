import React from 'react'
import propTypes from 'prop-types'
import styles from './goods.scss'
import {
  trackPointToolHeightGoodsClick
} from '../../buried-point'
class GoodsList extends React.Component {
  state = {
  }
  componentDidMount () {
  }
  handleSetTips = (value) => {
    if (value && value.length) {
      value = value.replace(/，/g, ',')
      let arr = value.split(',')
      return <p className={styles.goodsTips}>
        {
          arr.map((elm, i) => {
            return <span key={i} className={styles.tipItem}>{elm}</span>
          })
        }
      </p>
    }
  }
  handleGoToDetail = (value) => {
    trackPointToolHeightGoodsClick({
      goods_id: value
    })
    window.location.href = `${window.location.origin}/mkt/news/article-detail-index?type=4&id=${value}`
  }
  render () {
    const { goodsList } = this.props
    return (
      <div className={styles.goodsCont}>
        {
          goodsList && goodsList.length
            ? goodsList.map((el, ind) => {
              return <div className={styles.goodsItem} key={ind} onClick={() => this.handleGoToDetail(el.id)}>
                <img className={styles.goodsImg} src={el.goodsPictureUrl} alt='' />
                <div className={styles.goodsRight}>
                  <p className={styles.goodsName}>{el.title}</p>
                  {
                    this.handleSetTips(el.displayLabel)
                  }
                </div>
              </div>
            })
            : ''
        }
      </div>
    )
  }
}
GoodsList.propTypes = {
  goodsList: propTypes.array,
  history: propTypes.object,
}
export default GoodsList
