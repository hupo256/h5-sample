import React from 'react'
import { LinkManList, Page } from '@src/components'
import UA from '@src/common/utils/ua'
import { getProductInfor, gotoSubmitPage } from '@src/common/utils/newToOrderSubmit'
import {Toast} from 'antd-mobile'
import landing from "@src/common/api/landingApi";
import down from '@static/reportEg/down.png'
import sd from '@static/one-key-unlock/sd.png'
import sdd from '@static/one-key-unlock/sdd.png'
import sd2 from '@static/one-key-unlock/sd2.png'
import lock from '@static/one-key-unlock/lock.png'
import styles from '../index.scss'
import oku from '@src/common/api/oneKeyUnlockApi'
import { ua } from '@src/common/app'
import point from '@src/common/utils/point'
import img1 from '@static/changdao_report/img1.png'
import img2 from '@static/changdao_report/img2.png'
import img3 from '@static/changdao_report/img3.png'
import img4 from '@static/changdao_report/img4.png'
const { allPointTrack } = point

const { isWechat } = UA

export default class WxPlatform extends React.Component {
  state = {
    defaultData : [
      {pictureUrl: "https://dnatime-test.oss-cn-hangzhou.aliyuncs.com/shop/product/ebdb5707-8fad-4266-950d-135b82b4d6b0.JPG", productName: "罕见遗传病风险",reportStatus:'0'},
      {pictureUrl: "https://dnatime-test.oss-cn-hangzhou.aliyuncs.com/shop/product/596c4bda-0d2e-4edf-a12f-8e7c87fe7c91.JPG", productName: "慢性病风险",reportStatus:'0'},
      {pictureUrl: "https://dnatime-test.oss-cn-hangzhou.aliyuncs.com/shop/product/ec2c5853-bb6c-4dee-9f31-47638b9673f7.JPG", productName: "肿瘤风险",reportStatus:'0'},
      {pictureUrl: "https://dnatime-test.oss-cn-hangzhou.aliyuncs.com/shop/product/74652ba0-8f33-4177-9728-b1e2802ddd2b.JPG", productName: "儿童罕见遗传病风险",reportStatus:'0'},
      {pictureUrl: "https://dnatime-test.oss-cn-hangzhou.aliyuncs.com/shop/product/e4fd4a4e-257a-41ea-a349-1e029a399b88.JPG", productName: "儿童肿瘤风险",reportStatus:'0'},
      {pictureUrl: "https://dnatime-test.oss-cn-hangzhou.aliyuncs.com/shop/product/773f329d-1b70-40a1-9d0e-02ef42e7f745.JPG", productName: "儿童慢性病风险",reportStatus:'0'},
      {pictureUrl: "https://dnatime-test.oss-cn-hangzhou.aliyuncs.com/shop/product/187729e0-6411-4cca-9a12-3eaa1f9d27b9.PNG", productName: "恬睡睡眠",reportStatus:'0'},
      {pictureUrl: "https://dnatime-test.oss-cn-hangzhou.aliyuncs.com/shop/product/22a4e1c3-8ea8-4d7e-b0a9-a82e0138bee3.PNG", productName: "悦跑马拉松计划基因检测",reportStatus:'0'},
      {pictureUrl: "https://dnatime-test.oss-cn-hangzhou.aliyuncs.com/shop/product/d72f5fba-46f8-41ab-a434-e4b00ef0d071.JPG", productName: "熙熙QWE（女女女）",reportStatus:'0'},
      {pictureUrl: "https://dnatime-test.oss-cn-hangzhou.aliyuncs.com/shop/product/0ca4ee41-82db-4e8b-a72c-68a294213b79.PNG", productName: "安我·享瘦 体型管理基因检测",reportStatus:'0'},
      {pictureUrl: "https://dnatime-test.oss-cn-hangzhou.aliyuncs.com/shop/product/322a55ed-c055-41de-844f-99341f204322.PNG", productName: "聆动运动基因检测（2019版）",reportStatus:'0'}
    ],
    linkManVisible:false,
    saveLineMan:{
      userName:''
    },
    saveProductList:[],
    isX:false,
    itemsNumb:{
      lockedNum:'',
      allUnlockPrice:'',
      traitNum:''
    },
    imgs:{
      1:img1,
      2:img2,
      3:img3,
      4:img4,
    },
    showBtn:3
  }
  componentDidMount() {
    const { linkmanid = null } = this.getParams(location.href.toLocaleLowerCase())
    const getLinkId = linkmanid

    this.getMobileNumber(getLinkId)
    this.judgeIsIPhone()
  }
  // onClick={() => this.showLinkManList(true)}
  getData(linkmanId, mobileNo) {
    oku.getLinkMan().then(res => {
      allPointTrack({
        eventName: 'wechat_unlock_all_product_detail_page_view',
        pointParams: { user_type:mobileNo ? (res.data.bindingInfo.length === 0 ? 'user_no_linkman' : 'user_linkman') : 'new_user' }
      })
      this.setState({
        linkMans:res.data.bindingInfo,
        showBtn:(res.data.bindingInfo.length === 0 && mobileNo) ? 5 : 1
      }, () => {
        this.filterLinkMan(linkmanId)
      })
    })
  }
  getMobileNumber = (getLinkId) => {
    landing.myInfo({ noloading: 1 }).then(res => {
      if (!res.code) {
        this.setState({
          mobileNo:res.data.mobileNo
        })
        this.getData(getLinkId, res.data.mobileNo)
      }
    })
  }
  getParams = (link) => {
    const obj = {}
    let name, value
    let str = link || location.href // 取得整个地址栏
    let num = str.indexOf('?')
    str = str.substr(num + 1) // 取得所有参数   stringvar.substr(start [, length ]
    let arr = str.split('&') // 各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
      num = arr[i].indexOf('=')
      if (num > 0) {
        name = arr[i].substring(0, num)
        value = arr[i].substr(num + 1)
        obj[name] = value
      }
    }
    return obj
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
  handleChooseLinkMan = (id, status, index) => {
    this.filterLinkMan(id)
    this.handleColse()
  }

  filterLinkMan = (id) => {
    const { linkMans, defaultData } = this.state
    let saveLineMan = {}
    if (linkMans.length === 0) {
      this.setState({
        saveProductList:defaultData
      })
      return
    }
    if (!id) {
      saveLineMan = linkMans[0]
    } else {
      for (let i = 0; i < linkMans.length; i++) {
        if (+linkMans[i].id === +id) {
          saveLineMan = linkMans[i]
          break
        }
        saveLineMan = linkMans[0]
      }
    }
    this.setState({
      saveLineMan
    })
    this.getUnlockProduct(saveLineMan.id)
  }
  goUnlockAll = () => {
    const { mobileNo } = this.state
    allPointTrack({
      eventName: 'wechat_unlock_all_product_detail_page_goto',
      pointParams: { viewtype:'unlock_all_products' }
    })
    if (!mobileNo) {
      const { origin, pathname, search } = location
      window.location.href = `${origin}/mkt/login/mobileLogin?url=${pathname}${search}`
      return
    }
    const params = {
      linkManId:this.linkManId,
      activeCode:'YJJS002',
      actualType: 2,
      productList:this.saveList,
    }
    oku.getProductBuyDetailInfo(params).then(res=>{
      if(!res.code){
        res.data.buyProductList[0].productList[0] = Object.assign(res.data.buyProductList[0].productList[0],{})
        getProductInfor(res.data,params.actualType,params, () => {
          const paras = {
            linkManId:this.linkManId,
            productList:this.saveList,
            activeCode:'YJJS002',
            unlockType:2
          }
          gotoSubmitPage(paras)
        })
      } else {
        Toast.info(res.msg,2)
      }
    })
    // if (ua.isAndall()) {
    //   setTimeout(() => {
    //     andall.invoke('confirmOrder', setParams)
    //   }, 200)
    // }
  }
  getUnlockProduct = (linkManId) => {
    oku.categoryList({ linkManId:linkManId }).then(res => {
      let saveProductList = []
      let savelockProduct = []
      let saveUnlockProduct = []
      this.linkManId = linkManId
      this.saveList = []
      for (let item in res.data.productCategoryList) {
        const list = res.data.productCategoryList[item].productList
        const listLen = list.length
        for (let i = 0; i < listLen; i++) {
          if (list[i].reportStatus === '0') {
            this.saveList.push({ productId: list[i].productId, productNum: 1 })
            savelockProduct.push(list[i])
          } else {
            saveUnlockProduct.push(list[i])
          }
        }
      }
      saveProductList = savelockProduct.concat(saveUnlockProduct)
      // showBtn:1 显示一键解锁 2 显示已解锁全部
      this.setState({
        itemsNumb: {
          lockedNum: res.data.lockedNum,
          traitNum: res.data.traitNum,
          allUnlockPrice: res.data.allUnlockPrice
        },
        saveProductList,
        showBtn: (this.saveList.length > 0) ? 1 : 2
      })
    })
  }
  handleColse = () => {
    this.setState({
      linkManVisible: false
    })
  }
  showLinkMan = () => {
    this.setState({
      linkManVisible: true
    })
  }
  goDownload = () => {
    window.location.href = `${origin}/download-app`
  }
  render() {
    const { linkMans, linkManVisible, saveLineMan, saveProductList, isX, itemsNumb, imgs, showBtn } = this.state
    return (
      <Page title='一键解锁'>
        <div className={`${styles.pageStyle} ${linkManVisible && styles.noscroll}`}>
          {linkMans && linkMans.length > 0 &&
            <div className={styles.userInfoBox} onClick={() => this.showLinkMan()}>
              <div>
                <img src={imgs[saveLineMan.headImgType]} />
              </div>
              <p>{saveLineMan.userName}</p>
              <img src={down} />
            </div>
          }
          <div className={styles.sdWrap}>
            <img src={sd} />
          </div>
          <div className={styles.sddImg}>
            <img src={sdd} />
          </div>
          <div className={styles.sdWrap2}>
            <img src={sd2} />
          </div>
          {(itemsNumb.lockedNum && showBtn !== 2) ?
            <div className={styles.unlockTips}>解锁全部{itemsNumb.lockedNum}项产品&nbsp;&nbsp;共{itemsNumb.traitNum}项检测</div>:null
          }
          <div className={styles.unlockBG}>
            {saveProductList.map((item, index) => {
              return (
                <div className={styles.items} key={index}>
                  <img src={item.pictureUrl} />
                  <p>{item.productName}</p>
                  {item.reportStatus === '0' &&
                  <div className={styles.lock}>
                    <img src={lock} />
                  </div>
                  }
                </div>
              )
            })
            }
          </div>
          {showBtn === 1 &&
          <div className={styles.bottomBtn} style={isX ? { height :'81px' } : { height :'61px' }}>
            <div className={styles.btn} onClick={() => this.goUnlockAll()}>{linkMans.length === 0 ? '' : '¥'}{itemsNumb.allUnlockPrice} 一键全解锁</div>
          </div>
          }
          {showBtn === 2 &&
          <div className={styles.bottomBtn} style={isX ? { height :'81px' } : { height :'61px' }}>
            <div className={styles.unlockAllBtn}>已全部解锁</div>
          </div>
          }
          {showBtn === 5 &&
          <div className={styles.bottomBtn} style={isX ? { height :'81px' } : { height :'61px' }}>
            <div className={styles.unlockAllBtn} style={{background:'linear-gradient(140deg,#6064E0 0%,#1E1FB5 100%)'}} onClick={() => this.goDownload()}>新购用户请下载APP购买</div>
          </div>
          }
          <div className={styles.zw} />
        </div>
        {linkManVisible && <LinkManList
          manList={linkMans}
          toggleMask={this.handleColse}
          showList
          curLinkManId={''}
          switchTheMan={this.handleChooseLinkMan}
        />}
      </Page>
    )
  }
}
