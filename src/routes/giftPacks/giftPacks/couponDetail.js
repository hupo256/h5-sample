import React from 'react'
import { Page } from '@src/components'
import styles from './detail.scss'
import point from '@src/common/utils/point'
import { fun } from '@src/common/app'
import oku from "@src/common/api/oneKeyUnlockApi";
const { allPointTrack } = point
const { getParams } = fun

class CouponDetail extends React.Component {
  state = {
    pageData:{}
  }
  componentDidMount() {
    this.getDetail()
  }
  getDetail = async () => {
    const getUrl = location.href.toLocaleLowerCase()
    let { groupid = null, spreeid = null } = getParams(getUrl)
    oku.getCoupon({ 'spreeId': spreeid, 'groupId': groupid }).then(res => {
      if (res.code) return
      const {data} = res
      data.groupDesc = data.groupDesc.replace(/&nbsp;/ig, '')
      this.setState({
        pageData:data,
        isReady:true
      })
      allPointTrack({
        eventName: 'cupon_detail_page_view',
        pointParams: { cupon_name:data.groupName }
      })
    })
  }
  render() {
    const { pageData, isReady } = this.state
    return (
      <Page title='优惠券详情'>
        <div className={styles.couWrap} style={{background:'#fff',display:`${isReady?'inherit':'none'}`}}>
          <div className={styles.couPage}>
            <div className={styles.couLeft} >
              <span>￥</span>{pageData.couponGroupTotal || 0}
            </div>
            <div className={styles.couRight} style={{paddingTop:`${pageData.groupName && pageData.groupName.length > 8 ?'24px':'38px'}`}}>
              <p>{pageData.groupName}</p>
              <p>{pageData.groupTypeName}</p>
            </div>
          </div>
          <div className={styles.couNodes}
            dangerouslySetInnerHTML={{ __html: pageData.groupDesc }} />
          {pageData.productSimpleDtoList && pageData.productSimpleDtoList.length > 0 &&
            <div className={styles.couRecommend}>
              <p>适用产品</p>
              {pageData.productSimpleDtoList.map((item, index) => {
                return (
                  <div className={styles.recommContent} key={index}>
                    <div className={styles.contentTitle}>{item.productName}</div>
                    <div className={styles.contentDes}>{item.productBuyDesc}</div>
                  </div>
                )
              })}
            </div>
          }
        </div>
      </Page>
    )
  }
}

export default CouponDetail
