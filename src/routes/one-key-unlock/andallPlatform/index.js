import React from 'react'
import { LinkManList, Page } from '@src/components'
import head1 from '@static/head1.png'
import down from '@static/reportEg/down.png'
import sd from '@static/one-key-unlock/sd.png'
import sdd from '@static/one-key-unlock/sdd.png'
import sd2 from '@static/one-key-unlock/sd2.png'
import lock from '@static/one-key-unlock/lock.png'
import styles from '../index.scss'
import oku from '@src/common/api/oneKeyUnlockApi'
import { fun, ua } from '@src/common/app'
import img1 from '@static/changdao_report/img1.png'
import img2 from '@static/changdao_report/img2.png'
import img3 from '@static/changdao_report/img3.png'
import img4 from '@static/changdao_report/img4.png'

const { getSetssion ,isTheAppVersion} = fun
import {
  unlockAllProductDetailPageView,
  unlockAllProductDetailPageGoto
} from '../BuriedPoint'

export default class AndallPlatform extends React.Component {
  state = {
    linkManVisible:false,
    saveLineMan:{
      userName:''
    },
    saveProductList:[],
    isX:false,
    itemsNumb:{
      lockedNum:'',
      allUnlockPrice:'',
      traitNum:'',
      memberFlag:false,
      allUnlockMemberPrice:'',
      memberDiscountDesc:''

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
    
    if (ua.isAndall()) {
      andall.invoke('getLinkMan', {}, res => {
        const { linkManId } = res.result
        this.getData((getLinkId || linkManId))
      })
    } else {
      this.getData(getLinkId)
    }
    this.judgeIsIPhone()
  }
  // onClick={() => this.showLinkManList(true)}
  getData(linkmanId) {
    oku.getLinkMan().then(res => {
      this.setState({
        linkMans:res.data.bindingInfo,
      }, () => {
        this.filterLinkMan(linkmanId)
      })
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
    const { linkMans } = this.state
    let saveLineMan = {}

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
  goUnlockAll = (obj) => {
    
    let num=obj // 1 非会员全解锁 2 非会员VIP解锁 3 会员VIP解锁 
    let setParams={} 
    if(num==1){
      setParams={
        linkManId:this.linkManId,
        productList:this.saveList,
        activeCode:'YJJS001',
        actualType: 2
      }
      unlockAllProductDetailPageGoto({vip_state:"not_vip",viewtype:"unlock_all_products"})
    }
    else if(num==2){
      setParams={
        linkManId:this.linkManId,
        productList:this.saveList,
        activeCode:'YJJS001',
        actualType: 2,
        memberProduct: {
          memberProductId: 1,
          relativeDiscountPrice: 0
        }
      }
      unlockAllProductDetailPageGoto({vip_state:"not_vip",viewtype:"vip_unlock"})
    }
    else{
      setParams={
        linkManId:this.linkManId,
        productList:this.saveList,
        activeCode:'YJJS001',
        actualType: 2,
        useMemberFlag: true
      }
      unlockAllProductDetailPageGoto({vip_state:"vip",viewtype:"vip_unlock"})
    }
    console.log(setParams);
    // let setParams = {
    //   linkManId:this.linkManId,
    //   productList:this.saveList,
    //   activeCode:'YJJS001',
    //   actualType: 2
    // }
    if (ua.isAndall()) {
      setTimeout(() => {
        andall.invoke('confirmOrder', setParams)
      }, 200)
    }
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
            this.saveList.push({ productId:list[i].productId, productNum:1 })
            savelockProduct.push(list[i])
          } else {
            saveUnlockProduct.push(list[i])
          }
        }
      }
      saveProductList = savelockProduct.concat(saveUnlockProduct)
      // showBtn:1 显示一键解锁 2 显示已解锁全部


      unlockAllProductDetailPageView({vip_state: res.data.memberFlag==1?"vip":"not_vip"});
     
      this.setState({
        itemsNumb:{ lockedNum:res.data.lockedNum, traitNum:res.data.traitNum, allUnlockPrice:res.data.allUnlockPrice , memberFlag:res.data.memberFlag,
          allUnlockMemberPrice:res.data.allUnlockMemberPrice, memberDiscountDesc:res.data.memberDiscountDesc},
        saveProductList,
        showBtn:(this.saveList.length > 0) ? 1 : 2
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
  render() {
    const { linkMans, linkManVisible, saveLineMan, saveProductList, isX, itemsNumb, imgs, showBtn } = this.state
    return (
      <Page title='一键解锁'>
        <div className={`${styles.pageStyle} ${linkManVisible && styles.noscroll}`}>
          <div className={styles.userInfoBox} onClick={() => this.showLinkMan()}>
            <div>
              <img src={imgs[saveLineMan.headImgType]} />
            </div>
            <p>{saveLineMan.userName}</p>
            <img src={down} />
          </div>
          <div className={styles.sdWrap}>
            <img src={sd} />
          </div>
          <div className={styles.sddImg}>
            <img src={sdd} />
          </div>
          <div className={styles.sdWrap2}>
            <img src={sd2} />
          </div>
          <div className={styles.unlockTips}>解锁全部{itemsNumb.lockedNum}项产品&nbsp;&nbsp;共{itemsNumb.traitNum}项检测</div>
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
              {itemsNumb.memberFlag?
                <div className={styles.btn} onClick={() => this.goUnlockAll(3)}><span>¥</span>{itemsNumb.allUnlockMemberPrice} VIP价解锁</div>
                :
                isTheAppVersion('1.7.6')?
                  <React.Fragment>
                    <div className={styles.btn_con}> 
                      <div className={styles.btnOne} onClick={() => this.goUnlockAll(1)}><span>¥</span>{itemsNumb.allUnlockPrice}全解锁</div>
                      <div className={styles.btnTwo} onClick={() => this.goUnlockAll(2)}>
                        <div>
                        <h1><span>¥</span>{itemsNumb.allUnlockMemberPrice} VIP价解锁</h1>
                        <p>{itemsNumb.memberDiscountDesc}</p>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>:
                <div className={styles.btn} onClick={() => this.goUnlockAll(1)}><span>¥</span>{itemsNumb.allUnlockPrice} 一键全解锁</div>
              }
          </div>
          }
          {showBtn === 2 &&
          <div className={styles.bottomBtn} style={isX ? { height :'81px' } : { height :'61px' }}>
            <div className={styles.unlockAllBtn}>已全部解锁</div>
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
