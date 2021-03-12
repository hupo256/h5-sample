import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../hpvReport.scss'
import CardTitle from './cardTitle'
import ShowModal from './showModal'
import { fun } from '@src/common/app'
import { observer, inject } from 'mobx-react'
import hpvReportApi from '@src/common/api/hpvReportApi'
import { HpvCouponGoto, HpvPurchaseGoto } from '../buried-point'
import andall from '@src/common/utils/andall-sdk'
const { getParams } = fun
@inject('hpvReport')
@observer

class ReviewCard extends Component {
    static propTypes = {
      data:propTypes.object,
      productId:propTypes.number
    }
      state = {
        haveBtn:false,
        isGet:0,

      }
      componentDidMount() {
        const { data } = this.props
        this.setState({ isGet:data.couponDto.isGet })
      }
      modalToggle = (name, couponId) => {
        console.log(name, this.state[name])
        const { hpvReport: { toggleNoscroll } } = this.props
        if (getParams().shareToken) {
          return
        }

        if (this.state.isGet === 0 || this.state[name]) {
          this.setState({ [name]: !this.state[name] })
          if (!this.state[name]) {
            sessionStorage.setItem('scrollY', window.scrollY)
          } else {
            if (sessionStorage.scrollY) {
              setTimeout(() => {
                window.scrollTo(0, sessionStorage.scrollY)
              })
            }
          }
          toggleNoscroll()
        }

        if (this.state.isGet === 0) {
          hpvReportApi.getUserCoupon({
            barCode:getParams().barCode,
            couponId,
            noloading:1
          }).then(res => {
            this.setState({
              isGet:1
            })
          })
        }

        if (!this.state[name]) {
          HpvCouponGoto({
            Coupon_result:this.state.isGet, // 0未领取 1已领取
            sample_linkmanid:+localStorage.linkManId,
          })
        }
      }
      // 去加购
      gohave=() => {
        HpvPurchaseGoto({
          sample_linkmanid:+localStorage.linkManId,
          sample_barcode:getParams().barCode,
          report_code:localStorage.productCode,
        })
        andall.invoke('goProductDetail', { productId:this.props.productId, newProductDetailType: 3 })
      }
      render() {
        const { data } = this.props
        const { haveBtn, isGet } = this.state
        return (
          <div className={styles.padding15}>
            <CardTitle title={data.head} />
            <div className={`${styles.square} ${styles.reviewCard}`} >
              {
                data.des && data.des.split('<br/>').length
                  ? data.des.split('<br/>').map((item, index) => (
                    <div className={styles.circleList} key={index}>
                      <div className={styles.circle} />
                      <p>{item}</p>
                    </div>
                  ))
                  : ''
              }
              <div className={`${styles.coupon} ${isGet === 1 ? styles.coupon2 : ''}`} onClick={() => this.modalToggle('haveBtn', data.couponDto.couponId)}>
                <div className={styles.left}>
                  <label>¥</label><span>{data.couponDto.amount}</span>
                </div>
                <div className={styles.right}>
                  <div>{data.couponDto.head}</div>
                  <p dangerouslySetInnerHTML={{ __html:data.couponDto.des }} />
                </div>
              </div>
              {
                haveBtn
                  ? <ShowModal
                    type={3}
                    handleToggle={() => this.modalToggle('haveBtn')}
                    gohave={this.gohave}
                  />
                  : null
              }
            </div>
          </div>
        )
      }
}

export default ReviewCard
