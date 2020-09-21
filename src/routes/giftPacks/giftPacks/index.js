import React from 'react'
import { Page } from '@src/components'
import styles from '../giftPacks.scss'
import gift from '@static/giftPacks/gift.png'
import mjs from '@static/giftPacks/mjs.png'
import listen from '@static/giftPacks/listen.png'
import rightArrow from '@static/giftPacks/rightArrow.png'
import delPng from '@static/newUserComponent/del.png'
import addPng from '@static/newUserComponent/add.png'
import CountTime from './components/countTime'
import { Carousel, Toast } from 'antd-mobile'
import gp from '@src/common/api/giftPacksApi'
import {fun} from '@src/common/app'
import landing from '@src/common/api/landingApi'
import UA from '@src/common/utils/ua'
import { getProductInfor, gotoSubmitPage } from '@src/common/utils/newToOrderSubmit'
import andall from '@src/common/utils/andall-sdk'
import toDoShare from '@src/common/utils/toDoShare'
import nfriend from '@static/yinyang/nfriend_share.png'
import point from '@src/common/utils/point'
import dna from '@static/reportEg/dna.png'
import wxQR from '@static/wxQR.png'
import close1 from '@static/reportEg/close1.png'
import topPng from '@static/report4_2/top.png'

const { getParams } = fun
const { isWechat, isAndall } = UA
const { allPointTrack } = point

class GiftPacks extends React.Component {
  state = {
    isX:false,
    countTime:{
      days:'00',
      hours:'00',
      mins:'00',
      secs:'00'
    },
    modalVisible:false,
    num:1,
    videoVisible:false,
    currentSlide:1,
    salesVolume:null,
    spreeHeadImgList:[],
    pageData:{
    },
    productIndex:0,
    detailImgs:[],
    showQR:false,
    saveImgList:[]
  }
  componentDidMount() {
    console.log(window)
    // 禁用返回手势
    // if (UA.isIos() && UA.isAndall()) {
    //   andall.invoke('interactivePopDisabled')
    // }
    this.getData()
    this.judgeIsIPhone()
  }
  vailedUser = () => {
    landing.myInfo({ noloading: 1 }).then(res => {
      // console.log(res)
      const { data } = res
      if (!res.code){
        this.setState({ mobileNo: data.mobileNo })
      }
    })
  }
  getData = () => {
    const getUrl = location.href.toLocaleLowerCase()
    let { spreeid = null, spreeimgtype = null} = getParams(getUrl)
    this.spreeid = spreeid
    gp.getTradeSpreeDetail({ 'spreeId': spreeid, 'spreeImgType': spreeimgtype }).then(res => {
      if (res.code) return
      this.handleData(res.data)
      this.vailedUser()
      this.listenScroll()
    })
  }
  handleData = (data) => {
    // 处理数据
    // spreeHeadImgList-头图 couponGroupRespList-优惠券 spreeProductPriceDesc-标签文字 serviceDescList-邮费说明
    const { couponGroupRespList, seckillTimeMillis, spreeHeadCoverImgMapList } = data
    let countCouponsAll = 0
    for (let i in couponGroupRespList) {
      countCouponsAll += couponGroupRespList[i].couponGroupTotal
    }
    let saveImgList = []
    for (let i in spreeHeadCoverImgMapList) {
      const imgurl = { imgUrl:spreeHeadCoverImgMapList[i].headImgUrl, videoUrl:spreeHeadCoverImgMapList[i].videoUrl }
      saveImgList.push(imgurl)
    }
    console.log(saveImgList)
    // 裂变数据处理
    if (data.spreeFissionService && data.spreeFissionService.enableFlag) {
      const txt = data.spreeFissionService.serviceDesc
      if (txt.indexOf('<#') > 0) {
        data.spreeFissionService.color = txt.substring(txt.indexOf('#'), txt.indexOf('>'))
        data.spreeFissionService.des = [txt.slice(0, txt.indexOf('<#')), txt.slice(txt.indexOf('>')+1, txt.lastIndexOf('<#')),txt.slice(txt.lastIndexOf('>')+1)]
      } else {
        data.spreeFissionService.des = [txt]
      }
    }
    this.setState({
      countCouponsAll,
      pageData:data,
      detailImgs:data.subProductList[0].productDetailImgList,
      saveImgList,
      isReady:true
    }, () => {
      allPointTrack({
        eventName: 'gift_landing_page_view',
        pointParams: { product_name:data.spreeProductName, client_type:isAndall() ? 'app' : 'wechat' }
      })
      if (UA.isAndall()) {
        andall.invoke('showShareIcon', {
          type: 'mini',
          url: data.shareJumpUrl,
          title: data.shareTitle,
          text: data.shareSubTitle,
          thumbImage: data.shareHeadImg,
          image: data.shareHeadImg,
          miniId:(location.host.indexOf('wechatshop') === 0) ? 'gh_e8dc3393d0dc' : 'gh_08c07758d9a3',
          pagePath:`/pages/gift/index?spreeId=${data.id}&spreeImgType=1`,
          miniShareImg:data.shareImg
        })
      }
      if (isWechat()) {
        const shareParams = {
          shareUrl: data.shareJumpUrl,
          title: data.shareTitle,
          subTitle: data.shareSubTitle,
          headImg: data.shareHeadImg,
        }
        toDoShare(shareParams)
      }
    })
    seckillTimeMillis && this.countdown(seckillTimeMillis)
  }
  judgeIsIPhone = () => {
    const userA = window.navigator.userAgent
    const isIPhone = /iPhone/.exec(userA)
    // console.log(window.screen);        if (isAndall() && !isWechat() && isIPhone) {
    if (isIPhone) {
      if ((window.screen.width === 414 && window.screen.height === 896) || (window.screen.width === 375 && window.screen.height === 812)) {
        this.setState({
          isX:true
        })
      }
    }
  }
  countdown = (tt) => {
    setInterval(() => {
      if (tt > -1) {
        this.countdownTime(tt)
        tt--
      } else {
        location.reload()
      }
    }, 1000)
  }
  countdownTime = (tt) => {
    const baseDay = 60 * 60 * 24
    let days = tt > baseDay ? parseInt(tt / baseDay) : 0
    let hours = parseInt((tt - (days * baseDay)) / 3600)
    let mins = parseInt((tt - (days * baseDay) - hours * 3600) / 60)
    let secs = tt - days * baseDay - hours * 3600 - mins * 60
    hours = hours > 9 ? hours : '0' + hours
    mins = mins > 9 ? mins : '0' + mins
    secs = secs > 9 ? secs : '0' + secs
    this.setState({
      countTime:{
        days,
        hours,
        mins,
        secs
      }
    })
  }

  changeProd = (index) => {
    const { pageData } = this.state
    // productDetailImgList
    this.setState({
      productIndex:index,
      detailImgs:pageData.subProductList[index].productDetailImgList,
      num:1
    })
  }
  hasToken = () => {
    let token = window.localStorage.getItem('token')
    return token !== '' && token
  }
  showModal = (btnName) => {
    const { modalVisible, mobileNo } = this.state
    if (btnName) {
      this.btnName = btnName
      allPointTrack({
        eventName: 'gift_landing_page_goto',
        pointParams: { button_name:btnName }
      })
    } else {
      this.btnName = null
    }
    if (!this.hasToken()) {
      if (isAndall()) {
        andall.invoke('login', {}, (res) => {
          window.localStorage.setItem('token', res.result.token)
          const setUrl = location.href + `&clickindex=1`
          // window.localStorage.setItem('clickInfo', { clickindex:clickIndex, id : this.saveId })
          window.location.replace(setUrl)
        })
        return
      }
      if (!isAndall() && !isWechat()) {
        const { origin, pathname, search } = location
        window.location.href = `${origin}/mkt/login/mobileLogin?&url=${pathname}${search}&clickindex=1`
      }
    }
    if (isWechat()) {
      if (!mobileNo) {
        const { origin, pathname, search } = location
        window.location.href = `${origin}/mkt/login/mobileLogin?&url=${pathname}${search}&clickindex=1`
        return
      }
    }
    if (!modalVisible) {
      allPointTrack({
        eventName: 'specification_page_view',
        pointParams: { }
      })
    } else {
      allPointTrack({
        eventName: 'specification_page_goto',
        pointParams: { button_name: 'close' }
      })
    }
    this.setState({
      modalVisible:!modalVisible
    })
  }
  changeNum = (type) => {
    let { num } = this.state
    if (type === 'add') {
      num++
    } else {
      if (+num === 1) {
        return
      }
      num--
    }
    allPointTrack({
      eventName: 'specification_page_goto',
      pointParams: { button_name: type === 'add' ? 'up' : 'down' }
    })
    this.setState({
      num
    })
  }
  playVideo = (url) => {
    this.setState({
      videoVisible:true,
      videoUrl:url
    }, () => {
      const vid = document.getElementById('vid')
      vid.play()
      vid.addEventListener('pause', () => {
        this.setState({
          videoVisible:false
        })
      })
      if (UA.isIos()) {
        vid.addEventListener('play', () => {
          this.setState({
            videoVisible:true
          })
        })
      }
    })
  }

  changeSlide = (index) => {
    this.setState({
      currentSlide:index + 1
    })
  }
  // 下单
  goBuy = () => {
    const {pageData, productIndex,num } = this.state
    const {subProductList} = pageData
    const prod = subProductList[productIndex]
    const params = {
      linkManId: '',
      actualType:8,
      productList:[{productId:pageData.spreeProductId, productNum:num}],
      extraData:{subProductList:[{ productId:prod.productId, productNum:num }]},
      activeCode:pageData.spreeActiveCode,
      giveFlag:this.btnName === 'present_bt'
    }
    if (isAndall()) {
      delete params['linkManId']
      setTimeout(() => {
        andall.invoke('confirmOrder', params)
      }, 200)
      return
    }
    landing.getProductBuyDetailInfo(params).then((res) => {
      allPointTrack({
        eventName: 'specification_page_goto',
        pointParams: { button_name: 'buy' }
      })
      // this.setState({
      //   newUserNum:1,
      // })
      allPointTrack({
        eventName: 'gift_landing_page_goto',
        pointParams: { button_name:'buy_now' }
      })
      if (!res.code) {
        params.extraData = res.data.extraData
        params['giveFlag'] = (this.btnName === 'present_bt')
        getProductInfor(res.data, params.actualType, params, () => {
          let paras = {
            linkManId:'',
            productList:[{productId:pageData.spreeProductId, productNum:num}],
            activeCode:pageData.spreeActiveCode,
            buyType:8,
            extraData:res.data.extraData
          }
          paras['giveFlag'] = (this.btnName === 'present_bt')
          gotoSubmitPage(paras)
        })
      } else {
        Toast.info(res.msg, 2)
      }
    })
  }
  handleShare = () => {
    if (isAndall()) {
      const { pageData } = this.state
      andall.invoke('share', {
        type: 'mini',
        url: pageData.shareJumpUrl,
        title: pageData.shareTitle,
        text: pageData.shareSubTitle,
        thumbImage: pageData.shareHeadImg,
        image: pageData.shareHeadImg,
        miniId:(location.host.indexOf('wechatshop') === 0) ? 'gh_e8dc3393d0dc' : 'gh_08c07758d9a3',
        pagePath:`/pages/gift/index?spreeId=${pageData.id}&spreeImgType=1`,
        miniShareImg:pageData.shareImg
      })
      // toDoShare(shareParams, true)
      allPointTrack({
        eventName: 'gift_landing_page_goto',
        pointParams: { button_name:'top_share' }
      })
    } else {
      allPointTrack({
        eventName: 'gift_landing_page_goto',
        pointParams: { button_name:'title_share' }
      })
      this.setState({ sharePop: true })
    }
  }
  showLive = (url) => {
    allPointTrack({
      eventName: 'gift_landing_page_goto',
      pointParams: { button_name:'live' }
    })
    window.location.href = url
  }
  showCustomer = () => {
    const { showQR } = this.state
    if (isAndall()) {
      location.href = 'andall://andall.com/my_service'
      return
    }
    this.setState({
      showQR:!showQR
    })
    if (showQR) return
    allPointTrack({
      eventName: 'gift_landing_page_goto',
      pointParams: { button_name:'customer' }
    })
  }
  goCouponsDetail = (name, price, groupId) => {
    allPointTrack({
      eventName: 'gift_landing_page_cupon_goto',
      pointParams: { cupon_name:name, cupon_amount:price }
    })
    location.href = `${origin}/mkt/giftPacks/couponDetail?groupId=${groupId}&spreeId=${this.spreeid}`
  }
  toggleMask = (key) => {
    this.setState({
      [key]: !this.state[key]
    })
  }
  listenScroll = () => {
    document.body.onscroll = e => {
      if (e.target.documentElement.scrollTop) {
        if (e.target.documentElement.scrollTop > 667) {
          this.setState({
            showTop: true
          })
        } else {
          this.setState({
            showTop: false
          })
        }
      } else {
        if (e.target.body.scrollTop > 667) {
          this.setState({
            showTop: true
          })
        } else {
          this.setState({
            showTop: false
          })
        }
      }
    }
  }
  backTop = () => {
    document.getElementById('top').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
  goDownApp = () => {
    window.location.href = `${origin}/download-app`
  }
  fission = () => {
    const {pageData} = this.state
    window.location.href = pageData.spreeFissionService.serviceUrl
  }
  // http://static.andall.com/shop/video/samplingStatus/1.mp4
  render() {
    const { isX, countTime, modalVisible, num, videoVisible, currentSlide, pageData, productIndex, countCouponsAll, detailImgs, sharePop,
      showQR, saveImgList, videoUrl, liveVisible, showTop, isReady } = this.state
    return (
      <Page title={pageData.spreeProductName || '大礼包'}>
        <div style={{display:`${isReady?'inherit':'none'}`}}>
        <div className={styles.whiteBg}>
          {pageData.spreeHeadImgList &&
            <div id="top">
              <div className={styles.topWrap}>
                {pageData.spreeLiveBroadcast && pageData.spreeLiveBroadcast.enableFlag === 1 && UA.isAndall() &&
                <div className={styles.liveBtn} onClick={() => this.showLive(pageData.spreeLiveBroadcast.broadcastUrl)}>
                  <img src={pageData.spreeLiveBroadcast.broadcastImage} />
                  {/* <p>直播详情</p> */}
                </div>
                }
                <div className={styles.videoWrap} style={{ display:`${videoVisible ? 'block' : 'none'}` }}>
                  <video src={videoUrl} controls='controls' autoPlay='autoplay' id='vid' />
                </div>
                <Carousel
                  autoplay
                  infinite
                  height={280}
                  dots={false}
                  afterChange={index => { this.changeSlide(index) }}
                >
                  {saveImgList && saveImgList.map((item, index) => {
                    return (<div className={styles.slideDiv} key={index} onClick={() => item.videoUrl ? this.playVideo(item.videoUrl) : null}><img src={item.imgUrl} className={item.videoUrl?styles.videoImg:null} />{item.videoUrl && <div onClick={() => this.playVideo(item.videoUrl)} className={styles.playV}></div>}</div>)
                  })}
                  {/* <div style={{ background:'#000', width:'100%', height:'280px' }} onClick={() => this.playVideo()}>111</div> */}
                </Carousel>
                {pageData.spreeHeadImgList && pageData.spreeHeadImgList.length > 1 &&
                <div className={styles.carIndex}>
                  {currentSlide}/{pageData.spreeHeadImgList.length}
                </div>
                }
              </div>
            </div>
          }
          {pageData.seckillFlag && <CountTime countTime={countTime} />}
          <div className={styles.giftPacksContent}>
            <div className={styles.contentTop}>
              {(pageData.spreeMemberPrice && pageData.memberFlag) && <div className={styles.vipPrice}><div className={styles.vipWrap}></div><div className={styles.vipPrice}>¥{pageData.spreeMemberPrice}</div></div>}
              <div className={styles.price} style={{fontSize:`${pageData.spreeMemberPrice && pageData.memberFlag?'14px':'24px'}`, lineHeight:`${pageData.spreeMemberPrice && pageData.memberFlag?'28px':'24px'}`}}><span>¥</span>{pageData.spreeProductPrice}</div>
              {!pageData.spreeMemberPrice && <div className={styles.tips}>{pageData.spreeProductPriceDesc}</div>}
              {(pageData.spreeProductOriginPrice && !pageData.spreeMemberPrice) && <div className={styles.thPrice}>￥{pageData.spreeProductOriginPrice}</div>}
              {(pageData.spreeMemberPrice && !pageData.memberFlag) && <div className={styles.noMemVip}>¥{pageData.spreeMemberPrice}</div>}
              <div className={styles.saleNum}>已售 {pageData.salesVolume}</div>
            </div>
            <div className={styles.title}><p>{pageData.spreeProductName}</p><div className={styles.shareBtn} onClick={() => this.handleShare()}>分享</div></div>
            {pageData.spreeProductDescList && pageData.spreeProductDescList.length > 0 &&
              <div className={styles.des}>
                <div>
                  <div className={styles.desLeft}>
                    {pageData.spreeProductDescList.map((item, index) => {
                      return (<div key={index}>{item}</div>)
                    })}
                  </div>
                  <div className={styles.desRight}>
                    {pageData.crowd}
                  </div>
                </div>
              </div>
            }
          </div>
          {pageData.couponGroupRespList && pageData.couponGroupRespList.length > 0 &&
            <div className={styles.couponsWrap}>
              <div className={styles.couponTips}>
                <div>
                  <div>
                    <div><img src={mjs} /></div>
                    <div>
                      <p>价值</p><p>{countCouponsAll}</p><p>元优惠券</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.couponsSlide}>
                <div className={styles.slide}>
                  {pageData.couponGroupRespList.map((item, index) => {
                    return (
                      <div className={`${item.groupType === 'JSD'?styles.unlock:styles.buy}`} key={index} onClick={() => this.goCouponsDetail(item.groupName,item.couponGroupTotal,item.groupId)}>
                        <div className={styles.left}><span>￥</span>{item.couponGroupTotal}</div>
                        <div className={styles.right}>
                          <p>{item.groupName}</p>
                          <p>{item.groupTypeName}</p>
                        </div>
                      </div>)
                  })}
                </div>
              </div>
            </div>
          }
        </div>
        <div className={styles.service}>
          <div className={styles.item} onClick={() => this.showModal('choose')}>
            <div className={styles.itemLeft}>已选</div>
            <div className={styles.itemRight}><p>{(pageData.subProductList && pageData.subProductList[productIndex] && pageData.subProductList[productIndex].productName) && (pageData.subProductList[productIndex].productName.length > 13 ? `${pageData.subProductList[productIndex].productName.substring(0, 13)}...`:pageData.subProductList[productIndex].productName)}，{num}件</p></div>
            <div className={styles.arrowIcon}><img src={rightArrow} /></div>
          </div>
          {pageData.serviceDescList && pageData.serviceDescList.length > 0 &&
            <div className={styles.item}>
              <div className={styles.itemLeft}>服务</div>
              <div className={`${styles.itemRight} ${styles.smSize}`}><p>
                {pageData.serviceDescList.map((item, index) => {
                  if (index > 0) {
                    return ` • ${item}`
                  }
                  return item
                })}
              </p></div>
            </div>
          }
        </div>
        {/* 裂变 */}
        {pageData.spreeFissionService && pageData.spreeFissionService.enableFlag && UA.isAndall() &&
          <div className={styles.service} onClick={() => this.fission()}>
            <div className={styles.item}>
              <div className={styles.itemLeft}>分享</div>
              <div className={styles.itemRight} style={{float:'inherit',marginLeft:'43px'}}>
                <div className={styles.serviceBG}>
                  <div className={styles.serviceIcon} style={{background:`url(${pageData.spreeFissionService.serviceIcon}) no-repeat left center`, backgroundSize:'10px 10px', paddingLeft:'12px'}}>
                    {pageData.spreeFissionService.iconDesc}
                  </div>
                </div>
                {pageData.spreeFissionService.des && pageData.spreeFissionService.des.length > 1 && <p className={styles.pWidth}>{pageData.spreeFissionService.des[0]}<span style={{color:`${pageData.spreeFissionService.color}`}}>{pageData.spreeFissionService.des[1]}</span>{pageData.spreeFissionService.des[2]}</p>}
                {pageData.spreeFissionService.des && pageData.spreeFissionService.des.length === 1 && <p className={styles.pWidth}>{pageData.spreeFissionService.des[0]}</p>}
              </div>
              <div className={styles.arrowIcon}><img src={rightArrow} /></div>
            </div>
          </div>
        }
        {/*推荐模块*/}
        {/*<div className={styles.service}>*/}
        {/*  <div className={styles.commondWrap}>*/}
        {/*    <h6>为你推荐</h6>*/}
        {/*    <div className={styles.commonContent}>*/}
        {/*      <div className={styles.commonItem}>*/}
        {/*        <img src={jb} />*/}
        {/*        <div className={styles.itemTitle}>综合免疫力</div>*/}
        {/*        <div className={styles.itemPrice}><span>￥</span>49<span>￥499</span></div>*/}
        {/*      </div>*/}
        {/*      */}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className={styles.btnWrap}>
          <div className={styles.btnLeft}>
            <div onClick={() => this.showCustomer()}>
              <img src={listen} />
              <p>客服</p>
            </div>
            {pageData.spreeStatus && pageData.spreeStatus === 1 &&
              <div onClick={() => this.showModal('present_bt')}>
                <img src={gift}/>
                <p>送亲友</p>
              </div>
            }
          </div>
          {pageData.spreeStatus && pageData.spreeStatus === 1 && <div className={styles.btnRight} onClick={() => this.showModal('buy_now')}>立即购买</div>}
          {pageData.spreeStatus && pageData.spreeStatus === 2 && <div className={styles.btnRight} style={{background:"#C3C3CD"}} >已下架</div> }
          {isX && <div className={styles.zw}></div>}
        </div>
        <div className={styles.detailImgs}>
          {detailImgs && detailImgs.map((item, index) => {
            return <img src={item} key={index} />
          })}
        </div>
        <div className={styles.zw2} style={{height:`${isX ? '94px':'60px'}`}}></div>
        {modalVisible &&
          <div>
            <div className={styles.modalMask}></div>
            <div className={`${styles.buyModal} ${modalVisible ? styles.ModalMoveTop : ''}`}>
              <div className={styles.productWrap}>
                <div className={styles.left}>
                  <img src={pageData.spreePictureUrl} />
                </div>
                <div className={styles.right}>
                  <div>{pageData.spreeProductName}</div>
                  {!pageData.spreeMemberPrice && <div><span>¥</span>{pageData.spreeProductPrice}<span>¥{pageData.spreeProductOriginPrice}</span></div>}
                  {pageData.spreeMemberPrice && pageData.memberFlag && <div className={styles.vipModal}><div className={styles.vipIcon}>
                    <img src="http://dnatime-prod.oss-cn-hangzhou.aliyuncs.com/misc/giftPacks/vipicon.png" /></div><div className={styles.modalVprice}>￥{pageData.spreeMemberPrice}</div><div className={styles.orgPrice}>￥{pageData.spreeProductPrice}</div></div>}
                  {pageData.spreeMemberPrice && !pageData.memberFlag && <div className={styles.vipModal}><div className={styles.noVipP}>￥{pageData.spreeProductPrice}</div><div className={styles.noVipVprice}>{pageData.spreeMemberPrice}</div></div>}
                </div>
              </div>
              <div className={styles.prdName}>
                <p>产品</p>
                <div className={styles.wrapName}>
                  {pageData.subProductList && pageData.subProductList.map((item, index) => {
                    return (<div key={index} className={`${productIndex === index ? styles.isSelect : ''}`} onClick={() => this.changeProd(index)}>{item.productName}</div>)
                  })}
                </div>
              </div>
              <div className={styles.userBtnWrap}>
                <p>数量</p>
                <div className={styles.numWrap}>
                  <img src={delPng} onClick={() => this.changeNum('del')} />
                  <img src={addPng} onClick={() => this.changeNum('add')} />
                  <div>{num}</div>
                </div>
              </div>
              <div className={styles.buyBtnWrap}>
                {pageData.spreeStatus && pageData.spreeStatus === 1 && <div className={styles.buyBtn} onClick={() => this.goBuy()}>确认下单</div> }
                {pageData.spreeStatus && pageData.spreeStatus === 2 && <div className={styles.buyBtn} style={{background:"#C3C3CD"}}>已下架</div>}
                {isX && <div className={styles.zw}></div>}
              </div>
              <div className={styles.close} onClick={() => this.showModal()}></div>
            </div>
          </div>
        }

        {sharePop && <div className={styles.sharebox} onClick={() => this.toggleMask('sharePop')}>
          <img src={nfriend} alt='nfriend_share' />
        </div>}

        {
          liveVisible && <section className={styles.QRcode}>
            <div>
              <div>
                <div style={{ backgroundImage: `url(${dna})` }}>
                  <p>{pageData.spreeLiveBroadcast.broadcastName}</p>
                </div>
              </div>
              <div>
                <img src={pageData.spreeLiveBroadcast.broadcastImage} />
                <div>扫码观看直播</div>
              </div>
            </div>
            <img src={close1} onClick={() => this.setState({ liveVisible:false })} />
          </section>
        }
        {
          showQR && <section className={styles.QRcode}>
            <div>
              <div>
                <div style={{ backgroundImage: `url(${dna})` }}>
                  <p>加安迪姐分享你的经历，领取福利</p>
                </div>
              </div>
              <div>
                <img src={wxQR} />
                <div>微信扫码添加</div>
              </div>
            </div>
            <img src={close1} onClick={() => this.showCustomer()} />
          </section>
        }
        <div className={styles.top} onClick={this.backTop} style={showTop ? null : { display: 'none' }}>
          <img src={topPng} />
        </div>
        {
          !isAndall() && <div className={styles.goApp} onClick={() => this.goDownApp()}>查看订单</div>
        }
        </div>
      </Page>
    )
  }
}

export default GiftPacks
