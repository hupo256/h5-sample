import React from 'react'
import propTypes from 'prop-types'
import styles from '../skinBeauty.scss'
import Star from './start'
import noData2 from '@static/skinBeauty/noData2.png'
import wu from '@static/skinBeauty/wu.png'
import one from '@static/skinBeauty/one.png'
import four from '@static/skinBeauty/four.png'
import seven from '@static/skinBeauty/seven.png'

class BoxList extends React.Component {
  static propTypes = {
    thisBoxList: propTypes.array,
    type:propTypes.number,
    noMatchValue:propTypes.number,
    onhandleDetail:propTypes.func,
    onhandleDetail2:propTypes.func,
  }
  handleThis=(item) => {
    this.props.onhandleDetail(item)
  }
  handleThis2=(item) => {
    this.props.onhandleDetail2(item)
  }
  render () {
    const { thisBoxList = [], type, noMatchValue } = this.props
    return (
      <div>
        {
          type === 3 // 成分
            ? <ul className={styles.boxList}>
              {
                thisBoxList.map((items, k) => (
                  <li key={k} className={`${styles.li} ${styles.li2}`} onClick={() => this.handleThis(items)}>
                    {/* <a href={`/andall-sample/skinSearch/groupDetail?id=${items.creamElementId}&thisMatch=${items.matching}`}> */}
                    <div className={`item ${styles.boxTxt}`} >
                      <p className={styles.boxName}>{items.elementName}</p>
                      <div className={styles.boxMatch}>
                        <Star pfValue={items.matching} type={1} />
                      </div>
                      <p className={styles.boxPrice}>
                        <span>安全风险</span>
                        <span>
                          {
                            items.securityrisks === '' || items.securityrisks === null
                              ? <img src={wu} />
                              : items.securityrisks.indexOf('-') > -1
                                ? (Number(items.securityrisks.split('-')[0]) + Number(items.securityrisks.split('-')[1])) / 2 >= 0 && (Number(items.securityrisks.split('-')[0]) + Number(items.securityrisks.split('-')[1])) / 2 < 4
                                  ? <label className={styles.ju1}>{items.securityrisks}</label>
                                  : (Number(items.securityrisks.split('-')[0]) + Number(items.securityrisks.split('-')[1])) / 2 >= 4 && (Number(items.securityrisks.split('-')[0]) + Number(items.securityrisks.split('-')[1])) / 2 < 7
                                    ? <label className={styles.ju2}>{items.securityrisks}</label>
                                    : (Number(items.securityrisks.split('-')[0]) + Number(items.securityrisks.split('-')[1])) / 2 >= 7 && (Number(items.securityrisks.split('-')[0]) + Number(items.securityrisks.split('-')[1])) / 2 <= 10
                                      ? <label className={styles.ju3}>{items.securityrisks}</label> : ''
                                : +items.securityrisks >= 0 && +items.securityrisks < 4
                                  ? <img src={one} />
                                  : +items.securityrisks >= 4 && +items.securityrisks < 7
                                    ? <img src={four} />
                                    : +items.securityrisks >= 7 && +items.securityrisks <= 10
                                      ? <img src={seven} />
                                      : ''
                          }
                        </span>
                        {items.riskblain === '0' ? <span className={`${styles.books} ${styles.books2}`}>无致痘风险</span> : ''}
                        {items.pregnantCantUse === 0 ? <span className={`${styles.books} ${styles.books2}`}>孕妇慎用</span> : ''}
                      </p>
                    </div>
                    {/* </a> */}
                  </li>
                ))
              }
            </ul>
            : <ul className={styles.boxList}>
              {
                thisBoxList.map((items, k) => (
                  <li key={k} className={`${styles.li} ${type === 1 ? styles.li1 : styles.li2}`} onClick={() => this.handleThis2(items)}>
                    {/* <a href={`/andall-sample/skinSearch/goodsDetail?id=${items.creamProductId}&thisMatch=${items.matching}`}> */}
                    <div className={styles.boxImg}>
                      <img src={items.ourImage === null ? noData2 : items.ourImage} />
                    </div>
                    <div className={`item ${styles.boxTxt}`} >
                      <p className={styles.boxName}>{items.name}</p>
                      {
                        noMatchValue === 1 ? ''
                          : <div className={styles.boxMatch}>
                            <Star pfValue={items.matching} type={1} />
                          </div>
                      }
                      {
                        items.price === 0 || items.price === null
                          ? <p className={styles.noPrice}>暂无报价</p>
                          : <p className={styles.boxPrice}>
                            <span>参考价</span>
                            <span>
                              {items.price === 0 || items.price === null
                                ? ''
                                : items.specification === ''
                                  ? `¥${items.price}`
                                  : `¥${items.price}/${items.specification}`}
                            </span>
                          </p>
                      }

                      <p>
                        {items.category !== null ? <span className={styles.books}>{items.category}</span> : ''}
                        {items.mainfunc !== null ? <span className={styles.books}>{items.mainfunc}</span> : ''}
                        {items.placeOfOrigin !== null ? <span className={styles.books}>{items.placeOfOrigin}</span> : ''}
                      </p>
                    </div>
                    {/* </a> */}
                  </li>
                ))
              }
            </ul>
        }
      </div>

    )
  }
}
export default BoxList
