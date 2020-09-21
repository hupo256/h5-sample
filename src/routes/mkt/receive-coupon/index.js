import React from 'react'
import propTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import { API, fun, ua } from '@src/common/app'
import andall from '@src/common/utils/andall-sdk'
import { Page } from '@src/components'
import styles from './coupon.scss'
import {
  trackPointCouponListView,
  trackPointCouponGetGoto,
  trackPointCouponGet,
  trackPointCouponUseGoto
} from './buried-point'

import wxconfig from '@src/common/utils/wxconfig'
import images from '@src/common/utils/images'

const { bindOnly } = images
const { isAndall } = ua
const { getParams } = fun
class Coupon extends React.Component {
  static propTypes = {
    history: propTypes.object,
  }
  state = {
    couponList: [],
  }

  componentDidMount () {
    trackPointCouponListView()
    if(isAndall()){
      andall.invoke('token', {}, (res) => {
        window.localStorage.setItem('token', res.result.token)
        this.handleQueryCouponInfo()
      })
    }else{
      this.handleQueryCouponInfo()
    }

    const rigthBtnData = {
      name: '我的优惠券',
      color: '#6567e5',
      action: 'myCoupon'
    }
    andall.invoke('rightTopButton', rigthBtnData)
  }

  handleQueryCouponInfo = () => {
    const { couponCode } = getParams()
    console.log(couponCode)
    API.queryCouponInfo({ code: couponCode }).then(res => {
      const { data, code } = res
      !code && this.setState({ couponList: data })
      // !code && this.setState({couponList: code})
      // console.log(code)
    })
  }

  handleRreceiveCoupon = item => {
    const { couponCode, callback } = getParams()
    let params = {
      coupon_id: item.id,
      coupon_name: item.ruleName
    }
    trackPointCouponGetGoto(params)
    API.userRreceiveCoupon({ code: couponCode }).then(res => {
      const { code, data } = res
      if (code === 0) {
        this.setState({
          couponList: data
        })
        trackPointCouponGet(params)
        Toast.success('领取成功', 1, () => {
          // 跳转
          if (callback) {
            location.href = callback
          }
        })
      }
    })
  }
  handleSetBtnCont = (value, item) => {
    const { callback } = getParams()
    if (value === '已领取' || value === '领取成功') {
      if (callback) {
        return <span className={styles.btn}>已领取</span>
      } else {
        return <span onClick={() => this.handleGotoShop(item)} className={styles.btn}>去使用</span>
      }
    } else if (value === '未领取') {
      return <span onClick={() => this.handleRreceiveCoupon(item)} className={styles.btn}>立即领取</span>
    }
  }
  handleGotoShop = (item) => {
    let params = {
      coupon_id: item.id,
      coupon_name: item.ruleName
    }
    trackPointCouponUseGoto(params)

    if(isAndall()){
      // 购买tab
      andall.invoke('goProductList')
    } else {
      window.location.href = 'https://wechatshop.andall.com/download-app'
      // this.props.history.push('/')
    }

  }
  render () {
    const { couponList } = this.state
    const { callback } = getParams()
    return (
      <div>
        <Page title='领取优惠券'>
          <div className={styles.couponCont}>
            {
              couponList && couponList.length > 0
                ? couponList.map((item, index) => {
                  return (<div key={index}
                    className={`${styles.couponItem} ${(item.isLingQu === '已领取' || item.isLingQu === '领取成功') && callback ? styles.received : ''}`}
                  >
                    <div className={styles.couponPrice}>
                      <p className={styles.price}>
                        <span className={styles.small}>￥</span>
                        <span className={styles.big}>{item.discountValue}</span>
                      </p>
                      <p className={styles.jian}>
                        {
                          item.limitAmount
                            ? `满${item.limitAmount}元可用`
                            : '无门槛'
                        }
                      </p>
                      {
                        this.handleSetBtnCont(item.isLingQu, item)
                      }
                    </div>
                    <div className={styles.couponDetail}>
                      <p className={styles.title}>{item.ruleName}</p>
                      <p className={styles.desc}>
                        {
                          !item.ruleNameList || item.ruleNameList.length > 0
                            ? `仅限“${item.ruleNameList.join('、')}”使用，请在有效期内尽快使用`
                            : '全品类可用，请在有效期内尽快使用'
                        }
                      </p>
                      {
                        item.validType === 2
                          ? <p className={styles.time}>领取后{item.validDay}日内有效</p>
                          : <div>
                            <p className={styles.time}>开始时间：{item.fixDate}</p>
                            <p className={styles.time}>结束时间：{item.endDate}</p>
                          </div>
                      }
                      <div />
                    </div>
                  </div>)
                })
                : null
            }
            
            <br />
            <br />
            <br />
            {/* <button className="foot" onClick={this.toShare}>to share</button> */}
          </div>
        </Page>
      </div>
    )
  }
}
export default Coupon
