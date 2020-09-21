import React from 'react'
import Page from '@src/components/page'
import styles from './landPage'
import { ua } from '@src/common/app'
import activeApi from '@src/common/api/activeApi'
import userApi from '@src/common/api/userApi'
import andall from '@src/common/utils/andall-sdk'
import landPage_coupon from '@static/anxiaoruan/landPage_coupon_0.png'
import landPage_couponed from '@static/anxiaoruan/landPage_couponed_0.png'
import landPage_type1 from '@static/anxiaoruan/landPage_type1_0.png'
import landPage_type2 from '@static/anxiaoruan/landPage_type2_0.png'
import landPage_type3 from '@static/anxiaoruan/landPage_type3_0.png'
import landPage_tip from '@static/anxiaoruan/landPage_tip_1.png'
import landPage_back from '@static/anxiaoruan/landPage_back_2.png'
import { trackPointGoodGoto, trackPointCouponGoto, trackPointGoodVistits, trackPointGoodShare } from './buried-point'
import { Toast } from 'antd-mobile'

import detail1 from '@static/anxiaoruan/detail1_1.png'
import detail2 from '@static/anxiaoruan/detail2_1.png'
import detail3 from '@static/anxiaoruan/detail3_1.png'
import detail4 from '@static/anxiaoruan/detail4_1.png'
import detail5 from '@static/anxiaoruan/detail5_1.png'
import detail6 from '@static/anxiaoruan/detail6_1.png'
import detail7 from '@static/anxiaoruan/detail7_1.png'
import detail8 from '@static/anxiaoruan/detail8_1.png'
import detail9 from '@static/anxiaoruan/detail9_1.png'
import detail10 from '@static/anxiaoruan/detail10_1.png'
import detail11 from '@static/anxiaoruan/detail11_1.png'
import detail12 from '@static/anxiaoruan/detail12_1.png'
import detail13 from '@static/anxiaoruan/detail13_1.png'
import detail14 from '@static/anxiaoruan/detail14_1.png'
import detail15 from '@static/anxiaoruan/detail15_1.png'
import detail16 from '@static/anxiaoruan/detail16_1.png'
import detail17 from '@static/anxiaoruan/detail17_1.png'
import head_1 from '@static/anxiaoruan/head_1_0.png'
import head_2 from '@static/anxiaoruan/head_2.png'

import landPage_head from '@static/anxiaoruan/landPage_head_1.png'
import landPage_share from '@static/anxiaoruan/landPage_share.png'
import nfriend_share1 from '@static/anxiaoruan/nfriend_share1.png'
import landPage_head_3 from '@static/anxiaoruan/landPage_head_3.png'
// import LazyLoadPage from './loadImg'
import toDoShare from '@src/common/utils/toDoShare'
const { isAndall } = ua

export default class LandPage extends React.Component {
    state = {
      couponCode: '6cbb2dff9f563ab0aef10b7e579dd53c803bb0577732501a',
      isCoupon: false,
      isLogin: false,
      productId1: '2831111753346048',
      productId2: '2831128225229824',
      productId3: '2831129426324480',
      imgs: [
        detail1, detail2, detail3, detail4, detail5, detail6, detail7, detail8, detail9,
        detail10, detail11, detail12, detail13, detail14, detail15, detail16, detail17,
      ],
      mobileNo: '',
      sharePop: false,
      headImg:`${origin}/mkt/markting/images/landPage_head_3.png`
    }
    componentWillMount() {
      if (origin.indexOf('//wechatshop') > 0) {
        this.setState({
          couponCode: '6cbb2dff9f563ab0aef10b7e579dd53c803bb0577732501a',
          productId1: '2831111753346048',
          productId2: '2831128225229824',
          productId3: '2831129426324480'
        })
      } else {
        this.setState({
          couponCode: '37c471da4c72aa5a0642d05edf433930803bb0577732501a',
          productId1: '2831180009817088',
          productId2: '2831177598010368',
          productId3: '2831175992181760'
        })
      }
    }
    componentDidMount() {
      this.isCouponFn()
      this.getUserInfor()
      // 访问量
      let param = {
        view_type: 'app_home'
      }
      trackPointGoodVistits(param)

      setTimeout(() => toDoShare(this.touchShareParas()), 200)
    }
    // 判断是否领过优惠券
    isCouponFn() {
      const { couponCode } = this.state
      activeApi.queryCouponInfo({ code: couponCode }).then(res => {
        const { data, code } = res
        if (code === 0 && data && data.length) {
          this.setState({
            isCoupon: data[0].isLingQu == '已领取'
          })
        }
      })
    }
    // 跳转到确认订单
    toOrder(id) {
      this.toLogin()
      if (isAndall()) {
        andall.invoke('goPayOrder', {
          seriesId: '',
          linkManId: '',
          productType: 2,
          productId: id
        })
      } else {
        window.location.href = `${window.location.origin}/commodity?id=${id}`
      }
      let param = {
        product_id: id
      }
      trackPointGoodGoto(param)
    }
    // 领取优惠券
    receiveCoupon() {
      this.toLogin()
      // 生产 2828274075577344
      // 测试 2831060724040704
      // 生产 6cbb2dff9f563ab0aef10b7e579dd53c803bb0577732501a
      const { couponCode, mobileNo } = this.state
      activeApi.userRreceiveCoupon({ code: couponCode }).then(res => {
        const { code, data } = res
        if (code === 0) {
          this.setState({
            isCoupon: true
          })
          Toast.success('领取成功', 1, () => {
            let params = {
              Coupon_result: 1,
              mobileNo: mobileNo || ''
            }
            trackPointCouponGoto(params)
          })
        }
      })
    }
    // 判断是否登录
    getUserInfor = () => {
      const infoPara = { noloading: 1 }
      isAndall() && Object.assign(infoPara, { clientType: 'app' })
      userApi.myInfo(infoPara).then(res => {
        const { code, data } = res
        if (!code) {
          this.setState({
            isLogin: true,
            mobileNo: data.mobileNo
          })
        }
      })
    }
    // 跳到登录页面
    toLogin() {
      const { isLogin } = this.state
      if (!isLogin) {
        isAndall() && andall.invoke('login', {}, (res) => {
          window.localStorage.setItem('token', res.result.token)
          window.location.reload()
        })
      }
    }

    touchShareParas = () => {
      const { headImg } = this.state
      return {
        shareUrl: window.location.origin + '/mkt/markting/land-page',
        title: '安小软宝宝肠道微生物检测C位出道，惊喜连击！',
        subTitle: '助力宝宝黄金便便养成，领券优惠多多，还有腰凳赠送哦！',
        headImg: headImg,
      }
    }
    toShare = () => {
      trackPointGoodShare()
      if (!isAndall()) {
        this.setState({ sharePop: true })
        return
      }
      toDoShare(this.touchShareParas(), isAndall)
    }
    toggleMask = (key, boolean) => {
      if (boolean) return
      this.setState({
        [key]: !this.state[key]
      })
    }
    render() {
      const { isCoupon, productId1, productId2, productId3, imgs, sharePop } = this.state
      return (
        <Page title='安小软黄金便便养成计划'>
          <div className={styles.myPages}>
            <div onClick={() => this.toShare()} className={styles.shareBox}>
              <img src={landPage_share} />
            </div>
            {/* 引导分享 */}
            {sharePop && <div className={styles.sharebox1} onClick={() => this.toggleMask('sharePop')} >
              <img src={nfriend_share1} alt='nfriend_share' />
            </div>}
            <div className={styles.myLandPage}>

              <img src={head_2} />
              <img src={head_1} />
              {/* <img src={landPage_back} className={styles.myBack} /> */}
              <div className={styles.ctn}>
                <div className={styles.coupon}>
                  <div>
                    <img src={isCoupon ? landPage_couponed : landPage_coupon} />
                    {
                      !isCoupon && <span onClick={() => this.receiveCoupon()}>立即领取</span>
                    }

                  </div>
                </div>

                <div className={styles.type1}>
                  <div>
                    <img src={landPage_type1} />
                    <div className={styles.purBtn + ' ' + styles.purBtn1} onClick={() => this.toOrder(productId1)}>立即购买</div>
                  </div>
                  <div>
                    <img src={landPage_type2} />
                    <div className={styles.purBtn + ' ' + styles.purBtn1} onClick={() => this.toOrder(productId2)}>立即购买</div>
                  </div>
                </div>
                <div className={styles.type2}>
                  <img src={landPage_type3} />
                  <div className={styles.purBtn + ' ' + styles.purBtn2} onClick={() => this.toOrder(productId3)}>立即购买</div>
                </div>

              </div>

            </div>

            <div className={styles.imgbox}>
              {imgs && imgs.length > 0 &&
                            imgs.map((img, ind) => <img key={ind} src={img} />)
              }
            </div>

            {/* <LazyLoadPage imgs={imgs} />   */}

            {/* <div className={styles.myTip}>
                        <img src={landPage_tip} />
                    </div> */}
          </div>

        </Page>
      )
    }
}
