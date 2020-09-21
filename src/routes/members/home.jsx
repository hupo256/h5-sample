import React, { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import { Toast } from 'antd-mobile'
import andall from '@src/common/utils/andall-sdk'
import Page from '@src/components/page/index'
import Modal from '@src/components/modal/index'
import fun from '@src/common/utils/index'
import ua from '@src/common/utils/ua'
import DiscountAnim from './componets/lottie/index'
import memberApi from '@src/common/api/memberApi'
import { MyLoader } from '@src/components/contentLoader'
import MemberBtn from './componets/btn/index'
import TagList from './componets/tags/index'
import Headuser from './componets/headuser/index'
import images from './componets/images'
import styles from './members'
import { Link } from 'react-router-dom'
import { vipPageView,vipPageGoto,vipBuyPageGoto} from './componets/BuriedPoint'


const { isTheAppVersion, getParams } = fun
const { isIos, isAndall } = ua

export default function Members({ history }) {
  const [qrcode, setqrcode] = useState(false)
  const [vouchers, setvouchers] = useState(false)
  const [toFace, settoFace] = useState(false)
  const [loading, setloading] = useState(true)
  const [vouArr, setvouArr] = useState([])
  const [proInfo, setproInfo] = useState({})
  const [memberInfo, setmemberInfo] = useState({})
  const [isLogin, setislog] = useState(false)
  const [showposFix, setshowposFix] = useState(false)
  const [user_state, setuser_state] = useState(false)
  const [userState, setuserState] = useState(1)   // 1 未买, 2 已买, 3 已过期 
  const [contract, setContract] = useState(false)   // 是否续费会员
  const [statusBarHeight, setStatusBarHeight] = useState('') // 状态栏高度
  const [scrollTop, setScrollTop] = useState('') // 状态栏高度
  const [couponPrice,setCouponPrice ]=useState('') //优惠券总金额
  const [payMethod, setPayMethod]=useState(1) // 续费方式
  const [payType, setPayType]=useState(2) //支付方式
  const [tips, setTips]=useState() // 提示
  const [binding,setBinding]=useState(false) // 绑定
  const [isX,setIsx]=useState(false) //  是否是iPhoneX
  const base64Img = useRef()
  let count=0;

  useEffect(() => {
    touchData(2)
    count++;
    if(count>=1){
      refreshPage()
    }
    
    console.log(count)
    //return componentWillUnmount;
    
  }, [])

  function componentWillUnmount() {
    // 组件销毁时你要执行的代码
    count++;
  }

  // 获取手机状态栏高度
  function getStatusBarHeight(){
    let height = window.localStorage.getItem('statusBarHeight')  
    let statusBarHeight= height? height+'px': '44px'
    setStatusBarHeight(statusBarHeight)
  }
  //监听滚动高度
  function handleScroll(){   
    window.addEventListener('scroll', (e) => {
      setScrollTop(getScrollTop());
    }, false)
  }
  //原生返回页面时刷新
  function refreshPage(){
    andall.on('onVisibleChanged', (res) => {
      res.visibility && touchData(1)
    })
  }
  //返回 
  function goBack() {
    andall.invoke('back')
  }
  function touchData(obj) {
    let num=obj
    getStatusBarHeight()
    judgeIsIPhone()
    handleScroll()

    const params = {
      memberInfoFlag: true,
      productInfoFlag: true,
      couponListFlag: true,
      noloading: 1,
    }
    memberApi.getModel(params).then(res => {  // 获取会员信息
      const { code, data } = res
      if (code) return
      let { couponList = [], memberInfo, productInfo } = data

      let couponMoney='';
      couponList.map(item=>{
        couponMoney=Number.parseFloat(item.discountValue+couponMoney)
      })
      setCouponPrice(couponMoney);
      // 如果是生产环境则排个序
      // const { href } = window.location
      // if (href.includes('://wechatshop')) {
      //   let tempArr = []
      //   const idArr = [3089105184910336, 3089099580402688, 3089096749739008, 3089095459843072]
      //   for (let i = 0, k = idArr.length; i < k; i++) {
      //     const tid = idArr[i]
      //     for (let m = 0, n = couponList.length; m < n; m++) {
      //       const item = couponList[m]
      //       if (item.ruleId === tid) {
      //         tempArr.push(item)
      //         break
      //       }
      //     }
      //   }
      //   couponList = tempArr
      // }

      let uState = 1
      if (memberInfo) {
        const { isMember = 0, isTimeOutMember = 1,isWxContract=0,isAliContract=0} = memberInfo
        !isMember && (uState = 1)
        isMember && (uState = 2)
        isTimeOutMember && (uState = 3);
        setContract(!!(isWxContract || isAliContract))
      }
      
      setuserState(uState)
      setislog(memberInfo)
      setmemberInfo(memberInfo)
      setproInfo(productInfo)
      setvouArr(couponList)
      setloading(false)

      // if (uState !== 2) {
      //   window.addEventListener('scroll', () => {
      //     setshowposFix(getDocumentTop())
      //   }, false)
      // }

      setuser_state(touchUseState(uState, memberInfo))
      // 开始埋点
      let pointConfig={}
      if(num==1){
        pointConfig = {
          view_type: 'vip_paid',
          user_state: !memberInfo? 0: userState,
        }
      } 
      else{
        pointConfig = {
          view_type: getParams().viewType || '',
          user_state: !memberInfo? 0: userState,
        }
      }  
      vipPageView(pointConfig)
    })
   
  }

  // function getDocumentTop() {
  //   let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0
  //   if (document.body) bodyScrollTop = document.body.scrollTop
  //   if (document.documentElement) documentScrollTop = document.documentElement.scrollTop
  //   scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
  //   return scrollTop > 260
  // }

  function getScrollTop() {
    let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0
    if (document.body) bodyScrollTop = document.body.scrollTop
    if (document.documentElement) documentScrollTop = document.documentElement.scrollTop
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
    return scrollTop
  }

  function touchUseState(num, log) {
    if (!log) return 0
    return num
  }
  // function toGetMember() {
  //   if (!isLogin) return toLogin()
  //   if (userState !== 2) {
  //     const pointConfig = {
  //       Btn_name: 'buy_vip',
  //       user_state,
  //     }
  //     vipPageGoto(pointConfig)
  //     gotoPay()
  //   } else {
  //     setvouchers(true)
  //   }
  // }

  function gotoPay() {
    setvouchers(false)
    settoFace(false)
    setshowposFix(true)
  }

  function doToFace() {
    if (!isLogin) return toLogin()
    const pointConfig = {
      Btn_name: 'consult',
      user_state:!memberInfo? 0: userState,
    }
    vipPageGoto(pointConfig)

   
    if (userState === 2) {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      setqrcode(true)
    } else {
      settoFace(true)
    }
  }

  function toLogin() {
    if (isAndall()) {
      andall.invoke('login', {}, res => {
        window.localStorage.setItem('token', res.result.token)
        window.location.reload()
      })
    } else {
      console.log('to login')
      const { origin, pathname, search } = location
      window.location.href = `${origin}/mkt/login/mobileLogin?url=${pathname}${search}`
    }
  }

  function touchCoupon(coupon, ind) {
    if (!isLogin) return toLogin()
    // if (userState !==2 　||(!memberInfo.isTimeOutMember&&memberInfo.isMember)) return setvouchers(true)
    
    if (userState !==2) return setvouchers(true)
    
      
      // if (isUsed) return
      // memberApi.userRreceiveCoupon({ couponId: ruleId, repeatReceiveMark: true }).then(res => {
      //   const { code, data } = res
      //   if (code) return
      //   Toast.info('领取成功')
      //   setvouArr(() => {
      //     return vouArr.map((vou, index) => {
      //       if (index === ind) vou.isGet = 1
      //       return vou
      //     })
      //   })
      // })
    
    // }
    const pointConfig = {
      Btn_name: 'use_coupon',
      user_state:!memberInfo? 0: userState,
    }
    vipPageGoto(pointConfig)
    const { jumpLink } = coupon
    console.log(jumpLink);
    andall.invoke('openUrl', { url:jumpLink })
  }

  function handleHtml2Canvas() {
    let myPoster = base64Img.current
    let canvas = document.createElement('canvas')
    canvas.width = myPoster.offsetWidth * 3
    canvas.height = myPoster.offsetHeight * 3
    let opts = {
      scale: 3,
      canvas: canvas,
      width: myPoster.offsetWidth,
      height: myPoster.offsetHeight,
      useCORS: true
    }
    html2canvas(myPoster, opts).then(canvas => {
      andall.invoke('saveWebImage', {
        source: canvas.toDataURL('image/jpeg'),
      })
    })
    
    const pointConfig = {
      Btn_name: 'save_image',
      user_state:!memberInfo? 0: userState,
    }
    vipPageGoto(pointConfig)
  }
  function payMethodClick(e){
    setPayMethod(e);
    setPayType(2);
  }
  function goBuy(){
    window.location.href = 'andall://andall.com/buy_tab'
  }
  function unlock(obj){
    console.log(obj);
    const pointConfig = {
      Btn_name: 'go_unlock',
      user_state:!memberInfo? 0: userState,
    }
    vipPageGoto(pointConfig)
    if(obj==1){
      window.location.href = 'andall://andall.com/unlock_tab'
    }
    else{
      setBinding(true)
    }
  }
  function setTipsMethod(){
    setTips(true);
    const pointConfig = {
      Btn_name: 'renew_note',
      user_state:!memberInfo? 0: userState,
    }
    vipPageGoto(pointConfig)
  }

  function renewBuy(){
    setshowposFix(true);
    setPayType(2);
    const pointConfig = {
      Btn_name: 'buy_vip',
      user_state:!memberInfo? 0: userState,
    }
    vipPageGoto(pointConfig)
    
  }
  function judgeIsIPhone(){
    const userA = window.navigator.userAgent
    const isIPhone = /iPhone/.exec(userA)
    
    if (isIPhone) {
      if ((window.screen.width === 414 && window.screen.height === 896) || (window.screen.width === 375 && window.screen.height === 812)) {
        setIsx(true);
      }
    }
    console.log(isX)
  }
  function closeBg(){
    setshowposFix(false)
    setPayType(2);
    setPayMethod(1);
  }
  function toPayPreview(){
    if (!isLogin) return toLogin()
    setPayType(2);
    setshowposFix(true)
    const pointConfig = {
      Btn_name: 'buy_vip',
      user_state:!memberInfo? 0: userState,
    }
    vipPageGoto(pointConfig)
  }
  
  function toPay(obj){
    let num=obj;
    if (payMethod==undefined) return Toast.info("请选择续费方式", 2)
    if (!payType) return Toast.info("请选择支付方式", 2)
    
    // const { location: {state:{productId}}} = this.props
    // const { protocol, payType, renewal } = this.state
    // if (!protocol) return Toast.info("请同意服务协议", 2)

    // const pointConfig1 = {
    //   Btn_name: 'open_now',
    //   vip_type: payMethod
    // }
    let pointConfig={Btn_name: 'open_now'} 
    vipBuyPageGoto(pointConfig)

    const params = {
      noloading: 1,
      memberProductId: proInfo.productId,
      signFlag: payMethod, //自动续约 1 不续约 0
      payStr: isAndall() ? 'APP' : 'H5',
      paySuccessUrl: 'mkt/members/members-success?hideTitleBar=1',
      payType,  // 1微信支付  2支付宝
    }
    memberApi.submitOrder(params).then(res => {
      const { code, data } = res
      if (code) return Toast.info("支付失败！")
      const { origin, pathname, search } = location
 
      if(isAndall()){
        andall.invoke('gotoThirdPay', { payType, data }, re => {
          //alert(re.isSuccess);
          if (+re.isSuccess) {
            // history.push({
            //   pathname: '/members/members-success',
            //   search: `hideTitleBar=1`,
            // })
            setshowposFix(false);
            if(num==2){
              let url=`${origin}/mkt/members?hideTitleBar=1`
              window.location.href=`andall://andall.com/inner_webview?url=${url}`
            }
            else{
              let url=`${origin}/mkt/members/members-success?hideTitleBar=1`
              window.location.href=`andall://andall.com/inner_webview?url=${url}`
            }
            
          }
        })
      } else {
        window.location.href = data.mwebUrl
      }
    })
  }

  console.log(userState, contract);
  

  return (
    <Page title='安我会员'>
      {loading ? <MyLoader /> :
        <React.Fragment>
          <div className={`${userState !== 1 ? styles.white : scrollTop? `${styles.login}`:styles.dark} ${styles.titleBar}`} style={{paddingTop: `${statusBarHeight}`}}>
            <div className={styles.titleBarCon}>
              <div className={styles.backIcon} onClick={()=>goBack()}>
                <img src={userState !== 1?images.iconBackBlack:scrollTop?images.iconBackWhite:  images.iconBackWhite} />
              </div>
              <h1>安我会员</h1>
            </div>  
          </div>
          <div className={userState==2? '': isX? styles.hasPaddingBottomX :styles.hasPaddingBottom }>
            {userState === 1 &&
              <div className={`${styles.headInfor} ${userState == 1? '':styles.active}`}>
                {/* {isLogin ?
                  <div className={styles.userCardPadding} style={{paddingTop: `calc(44px + ${statusBarHeight})`}} >
                    <div className={styles.userInfor} >
                    {Headuser(userState, history, proInfo, memberInfo ,couponPrice) }
                    </div>
                  </div>      
                  :
                  (
                    <div>
                      <TagList discount={proInfo.discount} />
                      <div className={styles.tips}>
                        <h1><i>开通安我会员预计省</i><span>¥{Number.parseFloat(couponPrice+199.5)}</span></h1> 
                      </div>
                    </div>
                  )
                  // <img src={images.adtit} className={styles.addtitimg} alt="" />
                } */}

                <div>
                  <TagList discount={proInfo.discount} />
                  <div className={styles.tips}>
                    <h1><i>开通安我会员预计省</i><span>¥{Number.parseFloat(couponPrice+199.5)}</span></h1> 
                  </div>
                </div>
              
              </div>
            }

            <div className={`${styles.memberbox}`}>
              {(userState === 2 || userState === 3) &&
                <div style={{paddingTop: `calc(44px + ${statusBarHeight})`}} >
                  <div className={styles.userInfor} >
                    {Headuser(userState, history, proInfo, memberInfo,couponPrice)}
                  </div>
                </div>
              }

              {((!contract&&userState==2))?<div onClick= {()=>renewBuy()}className={styles.quickBuy}>立即续费</div>:''}

              {/* <MemberBtn
                userState={true}
                conTex='1111'
                togglefunc={toGetMember}
              /> */}

              <div className={styles.cardBox}>
                {userState == 2 ? 
                  <div className={styles.topBtn} onClick={() =>unlock(memberInfo.linkmanFlag)}>去解锁</div>:
                  <div className={styles.saveBox}>
                    <h1>¥<span>199.5</span></h1>
                    <p>预计可省</p>
                  </div>
                }
                  
                
                <h3><u><em>特权</em><i>1</i></u><span>{proInfo.discount || ''}折解锁</span></h3>
                <div className={styles.cardcon}>
                  <p>会员下<span className={styles.boldTxt}>所有检测人</span>可享5折解锁</p>
                  {/* <DiscountAnim /> */}

                  <div className={styles.discountArea}>
                    <div className={styles.discountTableCon}>
                      <table className={styles.discountTable}>
                        <tbody>
                          <tr>
                            <td className={`${styles.width50} ${styles.greyBg}`}><h1>普通用户</h1></td>
                            <td className={styles.width50}></td>
                          </tr> 
                          <tr>
                            <td className={styles.width50}>单个产品<span>¥99</span></td>
                            <td className={styles.width50}></td>
                          </tr> 
                          <tr>
                            <td className={styles.width50}>全解锁<span>¥399</span></td>
                            <td className={styles.width50}></td>
                          </tr>  
                        </tbody>  
                      </table>
                    </div>  
                    <div className={styles.discountPart}>
                      <div className={styles.discountOne}>
                        <h1>会员5折</h1>
                      </div> 
                      <div className={styles.discountTwo}>
                        单个产品<span>¥49.5</span>
                      </div>  
                      <div className={styles.discountOne}>
                        全解锁<span>¥199.5</span>
                      </div> 
                    </div>  

                  </div>  
                </div>
              </div>

              <div className={styles.cardBox}>
                {(userState!==2 ) && (<div className={styles.saveBox}>
                <h1>¥<span>{couponPrice}</span></h1>
                    <p>预计可省</p>
                  </div>)
                }
                
                <h3><u><em>特权</em><i>2</i></u><span>会员专享券</span></h3>
                <p>每月领五张VIP专享券</p>
                <div className={styles.voucherBox}>
                  <ul className={styles.vouchcon}>
                    {vouArr.length > 0 && vouArr.map((item, index) => {
                      let { couponName,limitAmount, isUsed, price } = item
                      couponName = couponName.length > 10 ? couponName.slice(0, 9) : couponName
                      return <li key={index}>
                        <p className={styles.price}><span>￥</span><b>{price}</b></p>
                        <div className={styles.coupon_info}>
                          <p>满{limitAmount}元可用<br/>{couponName}</p>
                          <button disabled={isUsed} onClick={() => touchCoupon(item, index)}>
                            {isUsed ? '已使用' : '去使用'}
                          </button>
                        </div>  
                      </li>
                    })}
                  </ul>
                </div>
              </div>

              <div className={styles.cardBox}>
                <div className={styles.topBtn} onClick={doToFace}>立即咨询</div>
                <h3><u><em>特权</em><i>3</i></u><span>专属顾问</span></h3>
                {/* <div className={styles.ftofbox}>
                  <ul>
                    <li>检测报告问题解读</li>
                    <li>育儿顾问1V1服务</li>
                    <li>健康咨询专业解答</li>
                  </ul>
                </div> */}

                <ul className={styles.consult_ul}>
                  <li>
                    <img src={images.consultIcon_1} />
                  </li>  
                  <li>
                    <img src={images.consultIcon_2} />
                  </li>  
                  <li>
                    <img src={images.consultIcon_3} />
                  </li>  
                </ul>  
              </div>

              <div className={`${styles.cardBox} ${styles.active}` } >
                <h3><u><em>特权</em><i>4</i></u><span>积分翻倍领</span></h3>
                <p>下单时可享受积分翻倍奖励</p>
                <img className={styles.compareImg} src={images.compareImg} alt="" />
                <i className={styles.tipsTxt}>注：积分可在下单时用户现金抵扣，100积分可抵扣1元。</i>
              </div>

    
              {userState === 2 && <p className={styles.forward}>*更多会员特权敬请期待</p>}

              {userState !== 2  &&<div className={ `${isX? `${styles.active}`:'' } ${styles.payFooterTwo}`}>
                <div className={styles.btn_content}>
                  <div className={styles.btn} onClick={()=>toPayPreview()}>
                    立即开通
                  </div>  
                </div>    
                </div>
              }

              <Modal
                type
                handleToggle={() => setvouchers(false)}
                visible={vouchers}>
                <div className={styles.modalCon}>
                  <h3>安我会员专享特权</h3>
                  <p>开通会员，领会员专享券</p>
                  <button onClick={gotoPay} className={styles.btn}>立即开通</button>
                </div>
              </Modal>
              <Modal
                type
                handleToggle={() => setTips(false)}
                visible={tips}>
                <div className={styles.modalCon}>
                  <h3>温馨提示</h3>
                  <p style={{textAlign: 'left'}}>1.会员到期前一天自动续费</p>
                  <p style={{textAlign: 'left'}}>2.续费前短信通知，扣费过程公开透明</p>
                  <p style={{textAlign: 'left'}}>3.开通后可随时关闭，关闭后不影响当期权益使用</p>
                  <button onClick={() => setTips(false)} className={styles.btn}>好的</button>
                </div>
              </Modal>
              <Modal
                type
                handleToggle={() => setBinding(false)}
                visible={binding}>
                <div className={styles.modalCon}>
                  <img className={styles.bindingImg} src={images.binding} />
                  <h2>您当前还没有绑定的采样器，不能进行解锁操作哦～</h2>
                  <div className={styles.btnBox}>
                    <button onClick={() => setBinding(false)} className={styles.btn}>取消</button>
                    <button onClick={() => goBuy()} className={styles.btn}>去购买</button>
                  </div>
                </div>
              </Modal>

              <Modal
                type
                handleToggle={() => settoFace(false)}
                visible={toFace}>
                <div className={styles.modalCon}>
                  <h3>安我会员专享特权</h3>
                  <p>开通会员，享1V1专属顾问服务</p>
                  <button onClick={gotoPay} className={styles.btn}>立即开通</button>
                </div>
              </Modal>

              <Modal
                handleToggle={() => setqrcode(false)}
                type
                visible={qrcode}>
                <div className={styles.modalCon}>
                  <h3>添加专属顾问</h3>
                  <img ref={base64Img} src={images.qrcodeimg} className={styles.qrcodeImg} alt="" />
                  {isTheAppVersion('1.7.4') ?
                    <React.Fragment>
                      <button onClick={handleHtml2Canvas} className={styles.btn}>保存二维码</button>
                      <div className={styles.popTips}>
                        <p>1.保存二维码到手机，打开微信扫一扫</p>
                        <p>2.点击扫码界面右下方，从手机相册中扫码二维码图片</p>
                      </div>
                    </React.Fragment> :
                    <div className={styles.popTips}>
                      <p>1.{isIos() ? '长按图片保存二维码到手机，打开微信“扫一扫”' : '请截屏保存此页面到手机，打开微信“扫一扫”'}</p>
                      <p>2.点击扫码界面右下方，从手机相册中扫码二维码图片</p>
                    </div>
                  }
                </div>
              </Modal>

              {showposFix&&<div className={styles.payMask } >
                <div className={styles.payBg} onClick={()=>closeBg()}></div>
                <div className={`${isX? `${styles.active}`:'' } ${styles.payFooter}`}>
                  <div className={styles.payMethod}>
                    <label className={styles.payMethodField}>
                      <input type="radio" name="payMethod" checked={payMethod==1? true:false} value="1" onChange={() =>payMethodClick(1)}/>
                      <div className={styles.payContent}>
                        <i>连续包月</i>
                        <p>¥19.9</p>
                      </div>  
                    </label> 
                    <label className={styles.payMethodField} >
                      <input type="radio" name="payMethod" checked={payMethod==0? true:false} value="0" onChange={() =>payMethodClick(0)}/>
                      <div className={styles.payContent}>
                        <i>VIP月卡</i>
                        <p>¥29.9</p>
                      </div>  
                    </label>  
                  </div> 
         
                  <div className={styles.payRadio}>
                    <label>
                      <input type="radio" name="pay" value="2" checked={payType==2? true:false} onChange={()=>setPayType(2)} />
                      <i></i>
                      <img src={images.alipay} />
                      <span>支付宝支付</span>
                      {payMethod==1?<em onClick={() => setTipsMethod()}>到期后自动续费，可随时取消</em>:''}
                    </label>
                    {payMethod==0?(
                      <label>
                        <input type="radio" name="pay" value="1" checked={payType==1? true:false} onChange={()=>setPayType(1)} />
                        <i></i>
                        <img src={images.wechatPay} />
                        <span>微信支付</span>
                      </label>):''
                    }
                  </div>
                            
                  <div className={styles.payBtn} onClick={()=>toPay((!contract && userState==2)? "2":"1")}>
                    {(!contract&&userState==2)?"立即续费":"立即开通"}
                  </div>  
                  {payMethod==0?
                    <div className={styles.payTips}>
                      <h1>开通即同意<Link className={styles.linkTxt} to={`/members/agreement-service?hideTitleBar=1&userCenter=1`}>《安我会员服务协议》</Link></h1>
                    </div> :
                    <div className={styles.payTips}>
                      <h1>开通即同意<Link className={styles.linkTxt} to={`/members/agreement-service?hideTitleBar=1&userCenter=1`}>《安我会员服务协议》</Link> 和 <Link className={styles.linkTxt} to={`/members/agreement-buy?hideTitleBar=1&userCenter=1`}>《自动续费协议》</Link></h1>
                    </div> 
                  } 
                </div> 
              </div>
              }
            </div>
          </div>
        </React.Fragment>
      }
    </Page>
  )
}