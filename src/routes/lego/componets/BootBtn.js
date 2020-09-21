import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import fun from '@src/common/utils/index'
import homeApi from '@src/common/api/homeApi'
import { ZlLandingpageMyDirectBuyGoto,
  ZlLandingpageMyInviteGoto,
  ZlLandingpageMyGetGoto,
  ZlLandingpageFriendHelpGoto,
  ZlLandingpageFriendDoneView,
  ZlLandingpageFriendJoinGoto,
  ZlLandingpageMyCouponBuyGoto} from './BuriedPoint';
import styles from '../yunchan.scss'
const { getParams, getSetssion, setSetssion } = fun

@inject('legoStore')
@observer
class BootBtn extends React.Component {
  static propTypes = {
    toShowQrCode: PropTypes.func.isRequired,
    toShare: PropTypes.func.isRequired,
    mobileNo: PropTypes.string.isRequired
  }
  
  touchBtnText = (status) => {
    switch(status){
      case 0:
        return '活动待开始'
      case 1:
        return '邀请好友助力'
      case 2:
        return '点击领取'
      case 5:
        return '为TA助力'
      case 6:
      case 7:
        return '我也要0元领取'
      default:
        return '加载中...';
    }
  }

  touchBtnTextWithPay = (status) => {
    switch(status){
      case 0:
        return '活动待开始'
      case 1:
        return '邀请助力享超低优惠'
      case 2:
        return '立享优惠领取'
        // return '立享优惠购买'
      case 5:
        return '为TA助力'
      case 6:
      case 7:
        return '我也“邀”超低优惠'
      default:
        return '加载中...';
    }
  }

  createBtn = (activeData) => {
    const { status, originalPrice, productType, productId, freeFlag } = activeData
    const tex = !!freeFlag ? this.touchBtnTextWithPay(status) : this.touchBtnText(status)

    if(status === 2 || status === 5) { //单按钮
      return <button onClick={() => this.toNextPage(status)} className={`${styles.foot}`}>{tex}</button>
    } else {   
      return (<React.Fragment>
        <button onClick={() => this.toOriginalPrice(productType, productId)} className={`${styles.foot} ${styles.w30}`}>{`¥${originalPrice} 原价购买`}</button>
        <button onClick={() => this.toPlay(status, productId)} disabled={status === 0} className={`${styles.foot} ${styles.w70}`}>{tex}</button>
      </React.Fragment>)
    }
  }

  toNextPage = (status) => {
    const { mobileNo, legoStore: {data: {activeData}, assistActiv}, toShowQrCode } = this.props
    const { freeFlag, productType, productId, activCode, showGestationFlag } = activeData
    if(status === 2){
      activCode === 'yunchan' && ZlLandingpageMyGetGoto({product_id: productId})
      activCode === 'NSGEA' && ZlLandingpageMyCouponBuyGoto({product_id: productId})
      
      if(mobileNo){
        if(!!freeFlag) {  // 收费的跳产品详情
          this.toOriginalPrice(productType, productId)
        } else {  // 不收费的去填表
          const { activCode='yunchan' } = getParams()
          this.props.history.push({
            pathname:'/yunchan-edit',
            state:{ activCode, productId, showGestationFlag }
          })
        }
      } else {
        const { origin, pathname, search } = location
        window.location.href =`${origin}/mkt/login/mobileLogin?url=${pathname}${search}`
      }
    } else if(status === 5){
      ZlLandingpageFriendHelpGoto({product_id: productId})
      const { attendRecordId } = getParams()
      assistActiv({attendRecordId}).then(() => {
        toShowQrCode(true)
      })
    }
  }

  toOriginalPrice = (productType, productId) => {
    ZlLandingpageMyDirectBuyGoto({product_id: productId})

    const paras = { productType, productId }
    const { origin } = location
    const { linkManId } = getSetssion('linkMan')

    const { activCode } = getParams()
    if(activCode === 'NSGEA' && !this.props.isAndall) {
      window.location.href = `${origin}/landmember?from=singlemessage&isappinstalled=0`
      return
    }
    // this.props.isAndall ? 
    //   andall.invoke('goProductDetail', paras) :
    //   window.location.href = `${origin}/commodity?id=${productId}&linkManId=${linkManId}`

    //  修改为跳到 下单页
    const orderParas = { productType, productId, linkManId: '', seriesId: '' }
    if(this.props.isAndall) {
      andall.invoke('goPayOrder', orderParas)
    } else {
       // 获取产品详情ByID
      homeApi.productDetail({ id: productId, noloading: 1 }).then(res => {
        // console.log(res);
        const { productName, productPrice, productDetail } = res.data.tradeProduct
        let tempObj = [{
            prodId: productId,
            productNum: 1,
            productName,
            cartProdPath: productDetail.indexPicUrl,
            productPrice,
            fromCartFlag: true
        }]
        setSetssion("shopList", tempObj)
        setTimeout(() => {
          window.location.href = `${origin}/andall-report/order-submit`
        }, 200)
      })
    }
  }

  toPlay = (status, productId) => {
    if(status > 5) {
      ZlLandingpageFriendJoinGoto({product_id: productId})
      const { activCode, viewType } = getParams()
      const {origin, pathname } = location
      const nextUrl = origin + pathname + `?activCode=${activCode}&viewType=${viewType}`
      window.location.href = nextUrl
    } else {
      const pointPara = {
        client_type: this.props.isAndall ? 'app' : 'h5',
        product_id: productId,
      }
      ZlLandingpageMyInviteGoto(pointPara)
      this.props.toShare()
    }
  }

  render () {
    const { legoStore: {data: {activeData}} } = this.props
    return (
      <div className='foot'>
        {this.createBtn(activeData)}
      </div>
    )
  }
}
export default BootBtn

