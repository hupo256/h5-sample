import React from 'react'
import { Page } from '@src/components'
import styles from './landPage'
import { API, ua } from '@src/common/app'
import andall from '@src/common/utils/andall-sdk'
import landPage_coupon from '@static/landPage_coupon_1.png'  
import landPage_couponed from '@static/landPage_couponed_1.png'
import landPage_type1 from '@static/landPage_type1.png'
import landPage_type2 from '@static/landPage_type2.png'
import landPage_type3 from '@static/landPage_type3.png'
import landPage_tip from '@static/landPage_tip_1.png'
import landPage_back from '@static/landPage_back_1.png'
import {trackPointGoodGoto,trackPointCouponGoto,trackPointGoodVistits,trackPointGoodShare} from './buried-point'
import { Toast } from 'antd-mobile'

import detail1 from '@static/detail1.png'
import detail2 from '@static/detail2.jpg'
import detail3 from '@static/detail3.jpg'
import detail4 from '@static/detail4.jpg'
import detail5 from '@static/detail5.jpg'
import detail6 from '@static/detail6.jpg'
import detail7 from '@static/detail7.jpg'
import detail8 from '@static/detail8.jpg'
import detail9 from '@static/detail9.jpg'
import detail10 from '@static/detail10.jpg'

import landPage_head from '@static/landPage_head_1.png'
import landPage_share from '@static/landPage_share.png'

import LazyLoadPage from './loadImg'

import toDoShare from '@src/common/utils/toDoShare'

import images from '@src/common/utils/images'
const { isAndall, isIos } = ua 
const { shareRedPacker } = images
export default class LandPage extends React.Component {
    state={
        couponCode:(IS_ENV === 'production' || IS_ENV === 'pre')?'a8b4a88ea3c2d68280b63f7e999d920e803bb0577732501a':'d998cce969d6120fffabc031c626ad06803bb0577732501a',
        isCoupon:false,
        isLogin:false,
        productId1:(IS_ENV === 'production' || IS_ENV === 'pre')?'2831111753346048':'2831180009817088',
        productId2:(IS_ENV === 'production' || IS_ENV === 'pre')?'2831128225229824':'2831177598010368',
        productId3:(IS_ENV === 'production' || IS_ENV === 'pre')?'2831129426324480':'2831175992181760',
        imgs:[
            detail1,detail2,detail3,detail4,detail5,detail6,detail7,detail8,detail9,detail10
        ],
        mobileNo:'',
        sharePop: false,
    }
    componentDidMount(){
        this.isCouponFn();
        this.getUserInfor();

        //访问量
        let param={
            view_type:'app_home'
        }
        trackPointGoodVistits(param)

        toDoShare(this.touchShareParas());

    }
    // 判断是否领过优惠券
    isCouponFn(){
        const {couponCode}=this.state;
        API.queryCouponInfo({ code: couponCode }).then(res => {
            const { data, code } = res
            if (code === 0&&data&&data.length) {
                this.setState({
                  isCoupon:data[0].isLingQu=='已领取'?true:false
                })
            }
          })
    }
    // 跳转到确认订单
    toOrder(id){
        this.toLogin();
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
        let param={
            product_id:id
        }
        trackPointGoodGoto(param);

    }
    // 领取优惠券
    receiveCoupon(){
        this.toLogin();
        //生产 2828274075577344
        //测试 2831060724040704
        //生产 a8b4a88ea3c2d68280b63f7e999d920e803bb0577732501a
        const {couponCode,mobileNo}=this.state;
        API.userRreceiveCoupon({ code: couponCode }).then(res => {
            const { code, data } = res
            if (code === 0) {
              this.setState({
                isCoupon:true
              })
              Toast.success('领取成功', 1, () => {
                  let params={
                    Coupon_result:1,
                    mobileNo:mobileNo ||''
                  }
                  trackPointCouponGoto(params);
              })
            }
          })
    }
    // 判断是否登录
    getUserInfor = () => {
        const infoPara = {noloading: 1}
        isAndall() && Object.assign(infoPara, {clientType: 'app'})
        API.myInfo(infoPara).then(res => {
            const {code, data} = res
            if(!code) {
                this.setState({
                    isLogin: true,
                    mobileNo:data.mobileNo
                })

            }
        })
    }
    // 跳到登录页面
    toLogin(){
        const {isLogin}=this.state;
        if(!isLogin){
            isAndall()&&andall.invoke('login', {}, (res) => {
                window.localStorage.setItem('token', res.result.token)
                window.location.reload()
            })
        }     
    }

    touchShareParas = () => {
        return {
            shareUrl: window.location.origin + '/andall-sample/land-page',
            title: "安小软宝宝肠道微生物检测C位出道，惊喜连击！",
            subTitle: "助力宝宝黄金便便养成，预售期优惠多多，还有腰凳赠送哦！",
            headImg: landPage_head,
          }
    }
    toShare=()=>{
        trackPointGoodShare();
        if (!isAndall()) {
            this.setState({sharePop: true})
            return
        }
        toDoShare(this.touchShareParas(), isAndall)
    }
    toggleMask = (key, boolean) => {
        if(boolean) return
        this.setState({
          [key]: !this.state[key]
        })
      }
    render(){
        const {isCoupon,productId1,productId2,productId3,imgs,sharePop}=this.state;
        return(
            <Page title='安小软黄金便便养成计划'>
                <div className={styles.myPages}>
                    <div onClick={()=>this.toShare()} className={styles.shareBox}>
                        <img src={landPage_share} />
                    </div>
                    {/* 引导分享 */}
                    {sharePop && <div className={styles.sharebox1}  onClick={() => this.toggleMask('sharePop')} >
                        <img src={`${shareRedPacker}nfriend_share1.png`} alt="nfriend_share"/>
                    </div>}
                    <div className={styles.myLandPage}>
                        <img src={landPage_back} className={styles.myBack} />
                        <div className={styles.ctn}>
                            <div className={styles.coupon}>
                                <div>
                                    <img src={isCoupon?landPage_couponed:landPage_coupon} />
                                    {
                                    !isCoupon&&<span onClick={()=>this.receiveCoupon()}>立即领取</span>
                                    }
                                    
                                </div>
                            </div>
                            
                            
                            <div className={styles.type1}>
                                <div>
                                    <img src={landPage_type1} />
                                    <div className={styles.purBtn+' '+styles.purBtn1} onClick={()=>this.toOrder(productId1)}>立即购买</div>
                                </div>
                                <div>
                                    <img src={landPage_type2} />
                                    <div className={styles.purBtn+' '+styles.purBtn1}  onClick={()=>this.toOrder(productId2)}>立即购买</div>
                                </div>
                            </div>
                            <div className={styles.type2}>
                                <img src={landPage_type3} />
                                <div className={styles.purBtn+' '+styles.purBtn2} onClick={()=>this.toOrder(productId3)}>立即购买</div>
                            </div>
                            
                          
                            
                        </div>

                    </div>

                    <LazyLoadPage imgs={imgs} />  

                    <div className={styles.myTip}>
                        <img src={landPage_tip} />
                    </div>  
                </div>
                
            </Page>
        )
    }
}