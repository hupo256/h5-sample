import React from 'react'
import propTypes from 'prop-types'
import styles from '../skinBeauty.scss'
import noData1 from '@static/skinBeauty/noData1.png'
import Star from './start'

class Recommend extends React.Component {
  static propTypes = {
    thisBoxList: propTypes.array,
    type:propTypes.number,
    onhandleRecommend:propTypes.func,
  }
  handleThis=(item) => {
    this.props.onhandleRecommend(item)
  }
  render () {
    const { thisBoxList, type } = this.props
    return (
      <div className={`${styles.recommendBox} ${type === 2 ? styles.recommendBox2 : ''}`}>
        {
          thisBoxList && thisBoxList.length > 0
            ? <ul>
              {
                thisBoxList.map((item, n) => (
                  <li className={`${styles.recommendLi}`}
                    key={n}
                    onClick={() => this.handleThis(item)}>
                    <div className={`${styles.recommendBoxImg}`}>
                      <img src={item.ourImage === null ? noData1 : item.ourImage} />
                    </div>
                    <div className={`item ${styles.recommendTxt}`} >
                      <p className={styles.recommendName}>{item.name}</p>
                      <div className={styles.recommendMatch}>
                        <Star pfValue={item.matching} type={2} />
                      </div>
                      {
                        item.price === 0 || item.price === null
                          ? <p className={styles.noPrice}>
                          暂无报价
                          </p>
                          : <p className={styles.recommendPrice}>
                            <span>参考价</span>
                            <span>{`¥${item.price}/${item.specification}`}</span>
                          </p>
                      }
                    </div>
                  </li>
                ))
              }
            </ul> : null
        }
      </div>

    )
  }
}
export default Recommend
