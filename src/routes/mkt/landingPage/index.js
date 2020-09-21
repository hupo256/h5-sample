import React from 'react'
import Page from '@src/components/page'
import styles from './landing'
import {ConfirmModal,ImgList,BtnList,UnlockAnswer} from '@src/components/acitvityMould'
import UA from '@src/common/utils/ua'
import {fun} from '@src/common/app'
import landing from '@src/common/api/landingApi'
const {getParams, setSetssion, getSetssion} = fun;
import {Toast} from 'antd-mobile'
import images from '@src/common/utils/images'
import wx from 'weixin-js-sdk'
import andall from '@src/common/utils/andall-sdk'
import point from '@src/common/utils/point'
import nfriend from '@static/yinyang/nfriend_share.png'
const { allPointTrack } = point

import toDoShare from '@src/common/utils/toDoShare'
import {activLandingpageView,activLandingpageGoto } from './BuriedPoint'
import publicApi from "@src/common/api/publicApi";
const { yinyang,newUserComponent } = images
const { isWechat, isAndall ,isIos} = UA
class LandingPage extends React.Component {

    state = {
      loginVisible:false,
      couponsList:[1,2,3],
      modalVisible:false,
      orderinfo:{
        templateRuleList:[],
        reqProductIds:[],
        unlockerUserData:[],
        totPrice:0
      },
      imgList:[],
      btnList:[],
      botButtonList:[],
      callbackFun:{},
      saveType:{},
      sharePop:false,
      title:'',
      setStatusText:'',
      mobileNo:'',
      canUnlock:true,
      hasUser:true,
      answerVisible:false,
      isBangs:false,
      updataVersionVisible:false,
      wechatBottom:false,
      hasShare:true,
      linkUrl:'',
      showLinkLogin:false,
      h5NOShare:(isWechat() || isAndall()),
      myInfoVisible:false
    }

    componentDidMount() {
      if (isAndall()) {
        const version = andall.info.version.replace(/\./g, '')
        if (+version <= 166) {
          this.setState({
            updataVersionVisible:true
          })
          return
        }
      }

      this.getActiveDetail()
      if (!isAndall()) {
        this.getUserInfor()
      }
      this.judgeIsIPhone()
    }

    judgeIsIPhone = () => {
      const userA = window.navigator.userAgent
      const isIPhone = /iPhone/.exec(userA)
      // console.log(window.screen);        if (isAndall() && !isWechat() && isIPhone) {
      if (isIPhone) {
        if ((window.screen.width === 414 && window.screen.height === 896) || (window.screen.width === 375 && window.screen.height === 812)) {
          if (isAndall()) {
            this.setState({
              isBangs: true
            })
          } else {
            this.setState({
              wechatBottom:true,
              isBangs:!isWechat()
            })
          }
        }
      }
    }

    getUserInfor = () => {
      const { code, state, source = 'wechat', medium = 'guanfang', channelCode } = getParams()
      const infoPara = { noloading: 1 }
      UA.isAndall() && Object.assign(infoPara, { clientType: 'app' })
      landing.myInfo(infoPara).then(res => {
        // console.log(res)
        const { data } = res
        if (!res.code){
          this.setState({ mobileNo: data.mobileNo})
        } else {
          if (isWechat()) {
            if (code && state) {
              publicApi.publicauth({ code, mobileMode: 'oppo', noloading:1 }).then(res => {
                console.log('publicauth: ' + res.data.token)
                if (res.data) {
                  localStorage.removeItem('token')
                  localStorage.setItem('token', res.data.token)
                  this.init(3)
                }
              })
            } else {
              const url = encodeURIComponent(location.href.split('#')[0])
              publicApi.publicauthurl({ url, noloading:1 }).then(res => {
                console.log('publicauthurl: ' + res.data.snsapiUrl)
                const { code, data } = res
                code || (location.href = data.snsapiUrl)
              })
            }
          } else if (!isAndall()) {
            this.setState({
              myInfoVisible:true
            })
          }
        }
      })
    }

    filterImg = (ary) => {
      const { botButtonList } = this.state
      for (let i = 0; i < ary.length; i++) {
        if (ary[i].buttonType === 'botButton') {
          botButtonList.push(ary[i])
        }
      }
      this.setState({
        ...botButtonList
      })
    }

    getActiveDetail = () => {
      const getUrl = location.href.toLocaleLowerCase()
      let { aid = null, kid = null, viewtype, clickindex = null } = getParams(getUrl)
      let saveUrlParams = {}
      const getU = getParams(location.href)
      if (getU.hasOwnProperty('referenceId')) {
        saveUrlParams = { referenceId:getU.referenceId }
      }
      this.state.saveUrlParams = saveUrlParams
      const setParams = aid ? { aId:aid } : { kId:kid }
      // this.saveId = setParams
      // if (localStorage.getItem('clickInfo') && isAndall() && clickindex) {
      //   if (localStorage.getItem('clickInfo').id !== this.saveId) {
      //     localStorage.removeItem('clickInfo')
      //   } else {
      //     clickindex = getSetssion('clickInfo').clickindex
      //   }
      // }
      landing.getPopularizeActive(setParams).then((res) => {
        if (res.code) {
          window.history.replaceState({}, '', `${origin}/andall-sample/yunchan-timeout?title=0`)
          // window.history.replaceState({}, '', `${origin}/mkt/lego/yunchan-timeout?title=0`)
          // window.location.reload()
          return
        }
        let oMeta = document.createElement('meta')
        oMeta.charset = 'utf-8'
        document.getElementsByTagName('head')[0].appendChild(oMeta)
        const { data } = res
        this.filterImg(data.activTemplateList)
        // 提交订单数据

        const saveType = {
          activeCode:data.activCode,
          channelId:data.channelId || '',
          channelCode:data.channelCode || '',
          viewType:data.viewType ? data.viewType : viewtype
        }
        const { origin, pathname, search } = location
        this.setState({
          imgList:data.activImageList ? data.activImageList : [],
          saveType,
          title:data.activName,
          shareTitle:data.shareTitle,
          shareDesc:data.shareDesc,
          shareUrl:data.shareUrl,
          shareImage:data.shareImage,
          hasShare:!saveUrlParams.hasOwnProperty('referenceId'),
          linkUrl: window.location.origin + `/mkt/login/mobileLogin?channelId=${data.channelId}&url=${pathname}${search}`,
          showLinkLogin:(!this.hasToken() && !isAndall() && !isWechat() && isIos()),

        }, () => {
          if (!saveUrlParams.hasOwnProperty('referenceId')) {
            toDoShare(this.touchShareParas())
          } else {
            allPointTrack({
              eventName: 'all_sales_landing_page_view',
              pointParams: { reference_id:saveUrlParams.referenceId }
            })
          }
        })

        const params = {
          view_type: data.viewType ? data.viewType : viewtype,
          client_type: isAndall() ? 'app' : 'h5',
          active_code: data.activCode,
          channel_id:data.channelId || '',
        }
        allPointTrack({
          eventName: 'activ_landingpage_view',
          pointParams: params
        })
        if (clickindex !== null) {
          this.showModal(data.activTemplateList[+clickindex], `botButton${+clickindex + 1}`, +clickindex)
          history.replaceState(null, '', location.href.split('&clickindex')[0])
          // if (isAndall()) {
          //   localStorage.removeItem('clickInfo')
          // }
        }
        // activLandingpageView(params)
        if (+data.activStatus === 1) return
        let setStatusText
        switch (+data.activStatus) {
        case 0:
          Toast.info('此活动已下架', 2)
          setStatusText = '活动已下架'
          break
        case 2:
          Toast.info('此活动已结束', 2)
          setStatusText = '活动已结束'
          break
        case 3:
          Toast.info('此活动未开始')
          setStatusText = '活动未开始'
          break
        }
        this.setState({
          setStatusText
        })
      })
    }

    hasToken = () => {
      const obj = getParams()
      // if (isWechat() && obj.token) {
      //   wx.miniProgram.getEvn(res => {
      //     alert(obj.token)
      //     window.localStorage.setItem('token', obj.token)
      //   })
      // }
      let token = window.localStorage.getItem('token')
      return token !== '' && token
    }

    showModal = async(orderinfo, btnName,clickIndex) => {
      const { mobileNo,saveType,saveUrlParams } = this.state
      const {channelId} = saveType
      this.setState({
        hasUser:true,
        canUnlock:true,
      })
      const { origin, pathname, search } = location
      if (!this.hasToken()) {
        if (!isAndall() && !isWechat()) {
          var b = document.createElement('a')
          b.setAttribute('href', window.location.origin + `/mkt/login/mobileLogin?channelId=${channelId}&url=${window.location.href}&clickindex=${clickIndex}`)
          b.setAttribute('id', 'startTelMedicine2')
          if (document.getElementById('startTelMedicine2')) {
            document.body.removeChild(document.getElementById('startTelMedicine2'))
          }
          document.body.appendChild(b)
          b.click()
          window.location.href = window.location.origin + `/mkt/login/mobileLogin?channelId=${channelId}&url=${pathname}${search}&clickindex=${clickIndex}`
          return
        }
        if (isAndall()) {
          // history.replaceState(null, '', location.href + `&clickindex=${clickIndex}`)
          andall.invoke('login', {}, (res) => {
            window.localStorage.setItem('token', res.result.token)
            const setUrl = location.href + `&clickindex=${clickIndex}`
            // window.localStorage.setItem('clickInfo', { clickindex:clickIndex, id : this.saveId })
            window.location.replace(setUrl)
          })
          return
        }
        window.location.href = `${origin}/mkt/login/mobileLogin?channelId=${channelId}&url=${pathname}${search}&clickindex=${clickIndex}`
        return
      }
      if (isWechat()) {
        if (!mobileNo) {
          const { origin, pathname, search } = location
          window.location.href = `${origin}/mkt/login/mobileLogin?channelId=${channelId}&url=${pathname}${search}&clickindex=${clickIndex}`
          // this.setState({
          //   loginVisible:true,
          // })
          return
        }
      }
      if (saveUrlParams.hasOwnProperty('referenceId')) {
        allPointTrack({
          eventName: 'all_sales_landing_page_goto',
          pointParams: { reference_id:saveUrlParams.referenceId, active_code:this.state.saveType.activeCode }
        })
      }
      let obj = orderinfo
      let productIds = []
      let productPrice = []
      let productCodeList = []
      for (let i = 0; i < obj.templateRuleList.length; i++) {
        productIds.push(obj.templateRuleList[i].productId)
        productCodeList.push(obj.templateRuleList[i].productCode)
        productPrice.push({
          id:obj.templateRuleList[i].productId,
          productPrice:obj.templateRuleList[i].productPrice,
          unlockPrice:obj.templateRuleList[i].unlockPrice,
          productOriginPrice:obj.templateRuleList[i].productOriginPrice,
          unlockOriginPrice:obj.templateRuleList[i].unlockOriginPrice
        })
      }
      const gotoParams = {
        Btn_name:btnName,
        product_id:productIds.toString(),
        active_code:this.state.saveType.activeCode,
        product_code:productCodeList,
        client_type: isAndall() ? 'app' : 'h5',
        channel_id:this.state.saveType.channelId,
      }
      allPointTrack({
        eventName: 'activ_landingpage_goto',
        pointParams: gotoParams
      })
      // activLandingpageGoto(gotoParams)
      await landing.getAvailableLinkMan({ linkManType:obj.templateRole, productIds, sex:orderinfo.templateSex }).then((res) => {
        // 渲染用户NewUser
        if (+res.code === 100001 || res.msg === '用户未登录') {
          if (!isAndall() && !isWechat()) {
            var b = document.createElement('a')
            b.setAttribute('href', window.location.origin + `/mkt/login/mobileLogin?channelId=${channelId}&url=${window.location.href}&clickindex=${clickIndex}`)
            b.setAttribute('id', 'startTelMedicine2')
            if (document.getElementById('startTelMedicine2')) {
              document.body.removeChild(document.getElementById('startTelMedicine2'))
            }
            document.body.appendChild(b)
            b.click()
            window.location.href = window.location.origin + `/mkt/login/mobileLogin?channelId=${channelId}&url=${pathname}${search}&clickindex=${clickIndex}`
            return
          }
          if (isAndall()) {
            // history.replaceState(null, '', location.href + `&clickindex=${clickIndex}`)
            andall.invoke('login', {}, (res) => {
              window.localStorage.setItem('token', res.result.token)
              const setUrl = location.href + `&clickindex=${clickIndex}`
              // window.localStorage.setItem('clickInfo', { clickindex:clickIndex, id : this.saveId })
              window.location.replace(setUrl)
            })
            return
          }
        }
        if (res.code) return

        let userConfig = {
          unlockUserVisible:true,
          newUserVisible:true,
          unlockerUserData:res.data,
          numBtnVisible:true,
          limitNum:obj.buyNumber,
          buyType:obj.buyType,
          unlockType:obj.unlockType,
          productIds,
          reqProductIds:productIds,
          productPrice
        }
        let initUser = 'newuser'
        if (obj.unlockFlag === 1) {
          // 能解锁
          if (+obj.buyNumber === 0) {
            userConfig.numBtnVisible = false
          }
          switch (+obj.buyFlag) {
          case 2:
            // 多件购买 默认状态
            if (+obj.buyNumber === 0 && res.data.length > 0) {
              initUser = this.setUserUnlock(res.data, initUser)
            }
            break
          case 1:
            // 单件购买
            userConfig.numBtnVisible = false
            break
          case 0:
            // 不能购买
            initUser = this.setUserUnlock(res.data, initUser)
            userConfig.newUserVisible = false
            break
          }
        } else {
          // 不能解锁
          userConfig.unlockUserVisible = false
          if (+obj.buyNumber === 0) {
            userConfig.numBtnVisible = false
          }
        }

        userConfig = Object.assign(userConfig,{templateRuleList:obj.templateRuleList,hasUser:this.state.hasUser,canUnlock:this.state.canUnlock,unlockNumber:obj.unlockNumber,totPrice:0,buyFlag:obj.buyFlag})
        this.setState({ orderinfo:userConfig })
        if (initUser !== '') {
          this.state.comfirm.changeId(initUser)
        }
      })

      // 判定登录与否
      this.setState({
        loginVisible:false,
        modalVisible:true,
      })
    }
    setUserUnlock = (data,initUser) => {
      const dataLength = data.length
      let countUsableStatus = []
      for (let i = 0; i < dataLength; i++) {
        if (data[i].usableStatus !== 0) {
          initUser = data[i].linkManId
          break
        } else {
          countUsableStatus.push(data[i].linkManId)
        }
        initUser = initUser === 'newuser' ? '' : initUser
      }
      if (countUsableStatus.length === dataLength) {
        if (dataLength === 0) {
          this.setState({
            hasUser:false
          })
        } else {
          this.setState({
            canUnlock:false
          })
        }
      }
      return initUser
    }

    toggleMask = (key) => {
      this.setState({
        [key]: !this.state[key]
      })
    }

    touchShareParas = () => {
      const { shareTitle, shareDesc, shareUrl, shareImage } = this.state
      return {
        shareUrl: shareUrl,
        title: shareTitle,
        subTitle: shareDesc,
        headImg: shareImage,
      }
    }

    toShare = () => {
      const { saveType:{ activeCode, channelId },saveUrlParams } = this.state
      const gotoParams = {
        Btn_name:'share',
        product_id:'',
        active_code:activeCode,
        product_code:'',
        client_type: isAndall() ? 'app' : 'h5',
        channel_id:channelId,
      }
      allPointTrack({
        eventName: 'activ_landingpage_goto',
        pointParams: gotoParams
      })
      // activLandingpageGoto(gotoParams)

      if (!isAndall()) {
        this.setState({ sharePop: true })
        return
      }
      if (!saveUrlParams.hasOwnProperty('')) {
        toDoShare(this.touchShareParas(), true)
      }
    }

    changeMobile = (mobile) => {
      this.setState({
        mobileNo:mobile
      })
    }

    setModalData = (obj) => {
      this.setState({
        orderinfo:obj
      })
    }

    onRef = (obj) => {
      this.state.comfirm = obj
    }

    showAnswer = (bol) => {
      this.setState({
        answerVisible:bol
      })
    }

    goBack = () => {
      andall.invoke('goHome')
    }

    render () {
      const {loginVisible,updataVersionVisible,isBangs,answerVisible,setStatusText,title,sharePop,modalVisible,orderinfo,imgList,botButtonList,wechatBottom,saveType,saveUrlParams,hasShare,linkUrl,showLinkLogin,h5NOShare,myInfoVisible} = this.state;
      // 商品弹窗控制  showAnswer->什么是弹窗 setData->修改弹窗数据 setVisible->弹窗显示
      const callbackFun = {
        showAnswer : this.showAnswer,
        setVisible : this.toggleMask,
        setData : this.setModalData,
        onRef : this.onRef
      }
      // 弹窗参数
      let modalParams = {
        setZIndex : answerVisible,
        isBangs : isBangs,
        visible : modalVisible,
        wechatBottom : wechatBottom
      }
      // 下单所需参数
      const AssOrderinfo = Object.assign({},{ people:saveUrlParams }, orderinfo, saveType)
      return (
        <Page title={title} class={styles.page}>
          {/* styles.noScroll */}
          <div className={`${modalVisible || loginVisible || sharePop ? styles.noScroll : styles.setHeight}`}>
            <ImgList dataList={imgList} />
            {/* 优惠券 */}
            {/* <Coupons data={couponsList} showModal={this.showModal} /> */}
            {/* 手机登录弹窗 */}
            {/*<LoginCover visible={loginVisible} setVisible={this.toggleMask} changeMobile={this.changeMobile} />*/}
            {/* 弹窗 */}
            {!answerVisible && <ConfirmModal modalParams={modalParams} callbackFun={callbackFun} dataObj={AssOrderinfo} />}
            {setStatusText === '' &&
              <div className={styles.bottomBtnWrap}>
                <BtnList dataList={botButtonList ? botButtonList : []} showConfirm={this.showModal} isBangs={isBangs} />
              </div>
            }
            {setStatusText !== '' &&
              <div className={styles.noRunningBtn}>
                {setStatusText}
              </div>
            }
            {hasShare && h5NOShare && <div className={styles.shareBtn} onClick={() => this.toShare()} style={{backgroundColor:`${botButtonList.length>0?botButtonList[0].buttonColor:""}`}}>
                分享
            </div>}
            {sharePop && <div className={styles.sharebox} onClick={() => this.toggleMask('sharePop')}>
              <img src={nfriend} alt='nfriend_share' />
            </div>}
            {answerVisible && <UnlockAnswer bindProps={this.showAnswer} />}
            {updataVersionVisible &&
              <div className={styles.pupopbox}>
                <div className={styles.pupcon}>
                  <p>为保证您的体验，请将App更新至最新版本，再参与此活动哦~</p>
                  <div onClick={() => { this.goBack() }} className={styles.btn}>我知道了</div>
                </div>
              </div>
            }
            {((showLinkLogin || myInfoVisible) && botButtonList) &&
              <div className={styles.bottomHref} style={isBangs ? { height:'100px' } : { height:'50px' }}>
                {botButtonList.map((item,index)=>{
                  return (
                    <a href={linkUrl + '&clickindex=' + index} style={isBangs ? { height:'100px', width:`${100/botButtonList.length}%` } : { height:'50px', width:`${100/botButtonList.length}%`}}></a>
                  )
                })}
              </div>
            }
          </div>
        </Page>
      )
    }
}

export default LandingPage
