import React from 'react'
import images from './images'
import {YYGJresultgoodsgoto} from './BuriedPoint'
import styles from '../yinyang'

class RecomList extends React.Component {
  gotoArticle = (url, id) => {
    YYGJresultgoodsgoto({content_id: id})
    window.location.href = url
  }

  render () {
    const { recomData } = this.props
    const dtList = recomData.goodsItemDtos.slice() || []
    return (
      <div className={`${styles.inforCard} ${styles.resCard}`}>
        <img className={styles.cardtop} src={images.cardtop} />
        <div className={styles.recommended}>{recomData.title}</div>

        {dtList.length > 0 && <ul className={styles.recoBox}>
          {dtList.map((item, index) => {
            const {imgUrl, jumpUrl, labelDesc, title, id} = item
            return <li key={index} onClick={() => this.gotoArticle(jumpUrl, id)} className={styles.recomDoods}>
              {/* <img src={imgUrl} /> */}
              <div className={styles.imgbox}><img src={imgUrl} /></div>
              <div className={styles.titBox}>
                <h3>{title}</h3>
                <div className={styles.tagBox}>
                  {labelDesc.split(',').map((tag, ind) => <span key={ind}>{tag}</span>)}
                </div>
              </div>
            </li>
          })}
        </ul>}

        <img className={styles.cardbottom} src={images.cardbottom} />
      </div>
    )
  }
}

export default RecomList
