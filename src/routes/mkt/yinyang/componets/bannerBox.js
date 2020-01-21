import React from 'react'
import { ua } from '@src/common/app'
import {YYGJbannergoto} from './BuriedPoint'
import styles from '../yinyang'

class bannerBox extends React.Component {
  gotoPage = (productId, linkManId, productType) => {
    const pointPara = {
      view_type: this.props.viewType,
      product_id: productId
    }
    YYGJbannergoto(pointPara)

    // console.log(pointPara)
    // return

    setTimeout(() => {
      ua.isAndall() ? 
        andall.invoke('goProductDetail', { productType, productId } ) :
        window.location.href = `${origin}/commodity?id=${productId}&linkManId=${linkManId}`
    }, 200)
  }

  gotoAppUrl = (url, productId) => {
    const pointPara = {
      view_type: this.props.view_Type,
      product_id: productId
    }
    YYGJbannergoto(pointPara)

    setTimeout(() => {
      ua.isAndall() ? 
        andall.invoke('goProductList') :
        window.location.href = url
    }, 200)
  }

  render () {
    const { banList } = this.props
    return (
      <React.Fragment>
       {banList.map((item, index) => {
          const {appUrl, imageUrl, productId, linkManId, productType, type} = item
          if(type) {
            return <div className={`${styles.inforCard} ${styles.bannerBox}`} key={index} >
                <img src={imageUrl} onClick={() => this.gotoAppUrl(appUrl, productId)}/>
              </div> 
          } else {
            return <div className={`${styles.inforCard} ${styles.bannerBox}`} key={index} >
              <img src={imageUrl} onClick={() => this.gotoPage(productId, linkManId, productType)}/>
            </div>
         }
        })}
      </React.Fragment>
    )
  }
}

export default bannerBox
