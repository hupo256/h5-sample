import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../../hpvReport/hpvReport.scss'
import CardTitle from '../../hpvReport/components/cardTitle'
import ShowModal from '../../hpvReport/components/showModal'
import { fun } from '@src/common/app'
import { observer, inject } from 'mobx-react'
import hpvReportApi from '@src/common/api/hpvReportApi'
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
      }
      // 去加购
      gohave=() => {
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
