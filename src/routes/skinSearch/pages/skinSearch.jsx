import React from 'react'
import propTypes from 'prop-types'
import { API, fun, point, ua } from '@src/common/app'
import { Page, Bomb, Toast } from '@src/components'
import SkinTabs from '../compoment/skinTabs'
import BoxList from '../compoment/boxList'
import Modal from '../compoment/modal/index'
import Recommend from '../compoment/recommend'
import { trackPointSkinToolSearch, trackPointSkinToolPageGoto } from './buried-point'
import wxconfig from '@src/common/utils/wxconfig'
import goBack from '@static/skinBeauty/gotoBack.png'
import searchChoosed from '@static/skinBeauty/searchChoosed.png'
import goLock from '@static/skinBeauty/goLock.png'
import searchClose from '@static/skinBeauty/searchClose.png'
import noSearchData from '@static/skinBeauty/noSearchData.png'
import fangtu from '@static/skinBeauty/fangtu.png'
import styles from './search.scss'
import andall from '@src/common/utils/andall-sdk'
const { getParams } = fun
const chooseTabs = [
  {
    type:1,
    name:'分类'
  },
  {
    type:2,
    name:'品牌'
  },
  {
    type:3,
    name:'匹配度'
  },
  {
    type:4,
    name:'高级筛选'
  }
]
class SkinSearch extends React.Component {
  state = {
    pageNum: 1,
    loadingStatus: true,
    pageFlag:1, // 1 大家都在搜  2 帅选结果
    hostKeyWords:[], // 大家都在搜
    searchHistoryList:[], // 历史搜索
    curIndex: 0, // 产品/成分
    upOrDown:0,
    isModal:false,
    thisTabIndex:'', // 分类/品牌/匹配度/高级筛选
    isFixedTop: false,
    tabList:[
      { title: '产品' },
      { title: '成分' }
    ],
    categoryList:[], // 分类
    thisChooseCategory:'',
    bandList:[], // 品牌
    thisChooseBrand:'',
    productList:[], // 产品列表
    searchValue:'', // 搜索内容
    tabOne:'分类',
    tabTwo:'品牌',
    matchList:['不限', '80%-100%', '60%-80%', '40%-60%', '40%以下'],
    thisChooseMatch:'', // 匹配度单选
    highObj:{
      list1:['美白', '祛斑', '祛痘', '保湿', '抗皱', '防晒', '去角质', '控油', '舒敏'],
      list2:['不限', '1000以上', '500-1000', '300-500', '100-300', '100以下'],
      radioFlag1:true,
      radioFlag2:false,
    },
    thisHighChoose:[], // 高级筛选
    productFunction:'', // 功效单选
    downProductFunction:'',
    choosePrice:'', // 价格范围单选
    maxPrice:'', // 价格最大值
    mixPrice:'', // 价格最小值
    downChoosePrice:'',
    downMaxPrice:'',
    downMixPrice:'',
    pregnantCanUse:false, // 浦乳期可用
    downPregnantCanUse:false,
    sensitiveSkin:false, // 敏感肤质可用
    downSensitiveSkin:false,
    noKeyWordsData:false,
    hotKeyWord:[], // 换个词搜索
    thisBoxList:[], // 为你推荐
  }
  componentDidMount () {
    const pointParams = {
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1
    }
    trackPointSkinToolSearch(pointParams)
    this.setState(
      {
        searchValue:localStorage.keywords,
        curIndex:+localStorage.curIndex
      }, () => {
        this.searchProduct()
      })
    window.addEventListener('scroll', this.searchProduct)
    window.addEventListener('scroll', this.onWindowScroll)
    this.wxShare()
  }
  // 微信分享
  wxShare = () => {
    setTimeout(() => {
      wxconfig({
        showMenu: true,
        params:{
          title: '我的专属护肤品匹配神器',
          desc: '选对护肤品，谁还去打啥上万的玻尿酸？',
          link: `${window.location.origin}/mkt/skinSearch/homePage?viewType=link`,
          imgUrl:`${fangtu}`,
        }
      })
    }, 400)
  }
  getHistoryAndHostKey=() => {
    API.getHistoryAndHostKey({
      linkManId:localStorage.linkManId === 'null' ? null : localStorage.linkManId,
      toolsCode:'BEAUTY'
    }).then(res => {
      this.setState({
        hotKeyWord:res.data.hotKeyWord,
      })
    })
  }
  getBeautyHomeInfo=() => {
    API.getBeautyHomeInfo({
      linkManId:localStorage.linkManId === 'null' ? null : localStorage.linkManId,
      toolsCode:'BEAUTY'
    }).then(res => {
      if (res.data.recommendProduct) {
        this.setState({
          thisBoxList:res.data.recommendProduct === null ? [] : res.data.recommendProduct
        })
      }
    })
  }
  componentWillUnmount () {
    if (this.state.curIndex === 0) {
      window.removeEventListener('scroll', this.onWindowScroll)
    }
    window.removeEventListener('scroll', this.searchProduct)
  }
  onWindowScroll = () => {
    if (this.state.curIndex === 0 && !this.state.noKeyWordsData) {
      let _top = document.getElementById('tabNav').offsetTop
      let h = document.body.scrollTop || document.documentElement.scrollTop
      h > _top ? this.setState({
        isFixedTop: true
      }) : this.setState({
        isFixedTop: false
      })
    }
  }
  searchProduct=() => {
    if (this.state.noKeyWordsData) {
      return
    }
    const { loadingStatus, productList, searchValue, curIndex, thisChooseBrand, thisChooseCategory, maxMatching, mixMatching, productFunction,
      maxPrice, mixPrice, pregnantCanUse, sensitiveSkin, pageNum, thisChooseMatch, choosePrice, isModal } = this.state
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    console.log(isFoot)
    // console.log(scrollTop, offsetHeight, bodyHeight)
    let params = {
      toolsCode:'BEAUTY',
      pageNum,
      pageSize:10,
      linkManId: localStorage.linkManId === 'null' ? null : localStorage.linkManId,
      reportStatus: localStorage.reportStatus,
      keyWords: searchValue, // 搜索关键词
      searchProductType: curIndex === 0 ? 'PRODUCT' : 'ELEMENT', // 产品/成分
      searchProductCategory: thisChooseCategory, // 分类
      searchProductBrand: thisChooseBrand, // 品牌
      maxMatching:maxMatching, // 匹配度最大值
      mixMatching:mixMatching, // 匹配度最小值
      productFunction: productFunction, // 功效
      maxPrice:maxPrice, // 价格最大值
      mixPrice:mixPrice, // 价格最小值
      pregnantCanUse:pregnantCanUse === '' ? '' : pregnantCanUse ? 'Y' : 'N', // 哺乳期可用  Y/N
      sensitiveSkin: sensitiveSkin === '' ? '' : sensitiveSkin ? 'Y' : 'N', // 敏感肤质可用  Y/N
    }
    if (pageNum === 1) {
      API.searchProduct(params).then(({ data }) => {
        if (data) {
          this.setState({ noKeyWordsData:false })
          // 关键词搜索无结果
          if (curIndex === 0) {
            if (thisChooseCategory === '' && thisChooseBrand === '' && thisChooseMatch === '' &&
            productFunction === '' && choosePrice === '' && pregnantCanUse !== 'Y' && sensitiveSkin !== 'Y' && data.productList.length === 0) {
              this.setState({ noKeyWordsData:true })
              this.getHistoryAndHostKey()
              this.getBeautyHomeInfo()
            }
          }
          if (curIndex === 1) {
            if (data.productList.length === 0) {
              this.setState({ noKeyWordsData:true })
              this.getHistoryAndHostKey()
              this.getBeautyHomeInfo()
            }
          }
          if (data.productList.length > 0) {
            this.setState({ noKeyWordsData:false })
            window.addEventListener('scroll', this.searchProduct)
          }
          this.setState({
            loadingStatus:true,
            productList:data.productList,
            pageNum: pageNum + 1,
          })
          if (thisChooseCategory === '' && thisChooseBrand === '' && thisChooseMatch === '' &&
          productFunction === '' && choosePrice === '' && pregnantCanUse !== 'Y' && sensitiveSkin !== 'Y') {
            this.setState({
              bandList:data.bandList,
              categoryList:data.categoryList,
            })
          }
        }
      })
    } else {
      if (loadingStatus && isFoot && !isModal) {
        this.setState({ loadingStatus: false }, () => {
          API.searchProduct(params).then(({ data }) => {
            console.log(data)
            if (data) {
              if (data.productList.length === 0) {
                // Toast.success('没有更多数据了！')
                window.removeEventListener('scroll', this.searchProduct)
                return
              }
              this.setState({
                productList: [...productList, ...data.productList],
                pageNum: pageNum + 1,
              })
            }
            // 页面抖动
            setTimeout(() => {
              this.setState({
                loadingStatus: true
              })
            }, 30)
          })
        })
      }
    }
  }
  // 选择分类
 chooseType1=(v) => {
   if (v === this.state.thisChooseCategory) {
     this.setState({
       thisChooseCategory:'',
       tabOne:'分类',
       isModal:false,
       productList:[], // 清空产品列表
       pageNum: 1,
     }, () => {
       this.searchProduct()
     })
   } else {
     this.setState({
       thisChooseCategory:v,
       tabOne:v.substring(0, 4) + '...',
       isModal:false,
       productList:[], // 清空产品列表
       pageNum: 1,
     }, () => {
       this.searchProduct()
     })
   }
 }
 // 选择品牌
 chooseType2=(v) => {
   if (v === this.state.thisChooseBrand) {
     this.setState({
       thisChooseBrand:'',
       tabTwo:'品牌',
       isModal:false,
       productList:[], // 清空产品列表
       pageNum: 1,
     }, () => {
       this.searchProduct()
     })
   } else {
     this.setState({
       thisChooseBrand:v,
       tabTwo:v.substring(0, 4) + '...',
       isModal:false,
       productList:[], // 清空产品列表
       pageNum: 1,
     }, () => {
       this.searchProduct()
     })
   }
 }
 // 选择匹配度
 chooseType3=(v) => {
   console.log(v)
   if (v === this.state.thisChooseMatch) {
     this.setState({
       thisChooseMatch:'',
       maxMatching:'',
       mixMatching:'',
       isModal:false,
       productList:[], // 清空产品列表
       pageNum: 1,
     }, () => {
       this.searchProduct()
     })
   } else {
     switch (v) {
     case '80%-100%':
       this.setState({
         maxMatching:100,
         mixMatching:80
       })
       break
     case '60%-80%':
       this.setState({
         maxMatching:80,
         mixMatching:60
       })
       break
     case '40%-60%':
       this.setState({
         maxMatching:60,
         mixMatching:40
       })
       break
     case '40%以下':
       this.setState({
         maxMatching:40,
         mixMatching:''
       })
       break
     }
     this.setState({
       thisChooseMatch:v,
       isModal:false,
       productList:[], // 清空产品列表
       pageNum: 1,
     }, () => {
       this.searchProduct()
     })
   }
 }
 // 选择功效
 chooseProduct=(v) => {
   this.setState({
     productFunction:v,
   })
 }
 // 选择价格
 choosePrice=(v) => {
   this.setState({
     choosePrice:v,
   })
 }
 // 切换产品/成分
  handleToggleTab = (i) => {
    this.setState({
      curIndex: i,
      isModal:false,
      pageNum:1,
      productList:[],
      searchProductCategory: '', // 分类
      searchProductBrand: '', // 品牌
      maxMatching:'', // 匹配度最大值
      mixMatching:'', // 匹配度最小值
      productFunction: '', // 功效
      maxPrice:'', // 价格最大值
      mixPrice:'', // 价格最小值
      pregnantCanUse:'', // 哺乳期可用  Y/N
      sensitiveSkin: '', // 敏感肤质可用  Y/N
    }, () => {
      console.log(this.state.curIndex + '=====')
      this.searchProduct()
    })
  }
  // 选择分类/品牌/匹配度/高级筛选
  chooseThisType=(type) => {
    const { isModal, thisTabIndex, downProductFunction, downMaxPrice, downPixPrice,
      downPregnantCanUse, downSensitiveSkin, downChoosePrice } = this.state
    console.log(type, thisTabIndex)
    this.setState({
      isModal:type === thisTabIndex ? !isModal : true,
      thisTabIndex:type,
      productFunction:downProductFunction,
      maxPrice:downMaxPrice,
      mixPrice:downPixPrice,
      pregnantCanUse:downPregnantCanUse,
      sensitiveSkin:downSensitiveSkin,
      choosePrice:downChoosePrice
    })
  }
  // 关闭模态框
 handleToggle = () => {
   const { isModal, downProductFunction, downMaxPrice, downPixPrice,
     downPregnantCanUse, downSensitiveSkin, downChoosePrice } = this.state
   this.setState({
     isModal: !isModal,
     productFunction:downProductFunction,
     maxPrice:downMaxPrice,
     mixPrice:downPixPrice,
     pregnantCanUse:downPregnantCanUse,
     sensitiveSkin:downSensitiveSkin,
     choosePrice:downChoosePrice
   })
 }
  // 敏感肤质可用/ 哺乳期可用
 checkRadio=(type) => {
   const { pregnantCanUse, sensitiveSkin } = this.state
   if (type === 1) {
     this.setState({
       pregnantCanUse:!pregnantCanUse
     })
   } else {
     this.setState({
       sensitiveSkin:!sensitiveSkin
     })
   }
 }
 // 重置
 resetBtn=() => {
   this.setState({
     productFunction:'',
     choosePrice:'',
     pregnantCanUse:'',
     sensitiveSkin:''
   })
 }
 // 完成
 downBtn=() => {
   const { thisTabIndex, choosePrice, productFunction, maxPrice, mixPrice, pregnantCanUse, sensitiveSkin } = this.state
   console.log(thisTabIndex + '=======')
   if (thisTabIndex === 4) {
     switch (choosePrice) {
     case '1000以上':
       this.setState({
         maxPrice:'',
         mixPrice:1000
       })
       break
     case '500-1000':
       this.setState({
         maxPrice:1000,
         mixPrice:500
       })
       break
     case '300-500':
       this.setState({
         maxPrice:500,
         mixPrice:300
       })
       break
     case '100-300':
       this.setState({
         maxPrice:300,
         mixPrice:100
       })
       break
     case '100以下':
       this.setState({
         maxPrice:100,
         mixPrice:''
       })
       break
     }
   }
   this.setState({
     isModal:false,
     productList:[], // 清空产品列表
     pageNum: 1,
     downProductFunction:productFunction, // 完成 选择最终的功效
     downChoosePrice:choosePrice,
     downMaxPrice:maxPrice,
     downPixPrice:mixPrice,
     downPregnantCanUse:pregnantCanUse,
     downSensitiveSkin:sensitiveSkin
   }, () => {
     this.searchProduct()
   })
 }
 goBack=() => {
   this.props.history.push(`/skinSearch/records?curIndex=${this.state.curIndex}`)
   window.removeEventListener('scroll', this.searchProduct)
 }
 // 购买banner入口
 goToLock=() => {
   if (ua.isAndall()) {
     andall.invoke('goProductDetail', {
       productId: '2487411480100864',
       productType: 2
     })
   } else {
     window.location.href = window.location.origin + '/commodity?id=2487411480100864&from=groupmessage&isappinstalled=0'
   }
   trackPointSkinToolPageGoto({
     os_version: navigator.userAgent,
     user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
     Btn_name:'search_result_banenr_to_buy',
     cream_product_id:'',
     element_id:'',
   })
 }
 onChange =(e) => {
   if (e.target.value === '') {
     this.props.history.push(`/skinSearch/records?curIndex=${this.state.curIndex}`)
     window.removeEventListener('scroll', this.searchProduct)
   }
   this.setState({
     searchValue: e.target.value
   })
 }
  // 搜索
  handleSubmit=() => {
    event.preventDefault()
    document.activeElement.blur() // 关闭软键盘
    this.setState({
      productList:[], // 清空产品列表
      pageNum: 1,
    }, () => {
      this.searchProduct()
    })
  }
  goSearch=(text) => {
    this.setState({
      searchValue:text,
      productList:[], // 清空产品列表
      pageNum: 1,
      noKeyWordsData:false,
    }, () => {
      this.searchProduct()
    })
    localStorage.setItem('keywords', text)
    localStorage.setItem('curIndex', this.state.curIndex)
  }
  onhandleDetail=(item) => {
    this.props.history.push(`/skinSearch/groupDetail?id=${item.creamElementId}&thisMatch=${item.matching}`)
  }
  onhandleDetail2=(item) => {
    this.props.history.push(`/skinSearch/goodsDetail?id=${item.creamProductId}&thisMatch=${item.matching}`)
  }
   // 为你推荐去产品详情页
   handleRecommend=(item) => {
     this.props.history.push(`/skinSearch/goodsDetail?id=${item.creamProductId}&thisMatch=${item.matching}`)
   }
   render () {
     const { searchValue, tabOne, tabTwo, curIndex, tabList, productList, isModal, thisTabIndex, categoryList, thisChooseCategory, bandList, thisChooseBrand,
       thisChooseMatch, matchList, highObj, isFixedTop, productFunction, choosePrice, pregnantCanUse, sensitiveSkin, pageNum, noKeyWordsData, hotKeyWord, thisBoxList } = this.state
     return (
       <Page title='肌秘美肤小工具'>
         <div className={`${styles.searchPage} ${isModal && styles.noscroll}`}>
           <div className={styles.search}>
             {
               ua.isAndall() ? '' : <img src={goBack} onClick={this.goBack} className={styles.back} />
             }
             <form action='#' id='myform' onSubmit={this.handleSubmit}>
               <input
                 type='search'
                 placeholder='搜索护肤品，查看匹配度'
                 value={searchValue}
                 onChange={this.onChange}
               />
             </form>
             <img src={searchClose} className={styles.empty} onClick={() => { this.props.history.push(`/skinSearch/records?curIndex=${this.state.curIndex}`) }} />
             <span onClick={this.goBack}>取消</span>
           </div>
           <div>
             <SkinTabs
               type={2}
               cur={curIndex}
               tabData={tabList}
               onHandle={(i) => this.handleToggleTab(i)} />
           </div>
           {
             //  localStorage.reportStatus === 'null'
             //    ? <div className={styles.goLock} onClick={this.goToLock}>
             //      <img src={goLock} />
             //    </div>
             //    : null
           }
           {
             curIndex === 0 && !noKeyWordsData
               ? <div id='tabNav' className={`${styles.choose} ${isFixedTop ? styles.fixTop : ''}`}>
                 <div className={styles.chooseTab}>
                   {/* {chooseTabs.map((item, index) => (
                 <span
                   className={`${styles.chooseThisOne} ${thisTabIndex === index + 1 ? styles.active : ''}`}
                   onClick={() => this.chooseThisType(item.type)}>
                   {item.name}
                   <i className={`${styles.foldIcon} ${thisTabIndex === index + 1 ? styles.up : styles.down}`} />
                 </span>
               ))
               } */}
                   <span className={`${styles.chooseThisOne} ${thisTabIndex === 1 && isModal || thisChooseCategory !== '' ? styles.active : ''}`}
                     onClick={() => this.chooseThisType(1)}>
                     {tabOne}
                     {
                       thisChooseCategory ? '' : <i className={`${styles.foldIcon} ${thisTabIndex === 1 && isModal || thisChooseCategory !== '' ? styles.up : styles.down}`} />
                     }
                   </span>

                   <span className={`${styles.chooseThisOne} ${thisTabIndex === 2 && isModal || thisChooseBrand !== '' ? styles.active : ''}`}
                     onClick={() => this.chooseThisType(2)}>
                     {tabTwo}
                     {
                       thisChooseBrand ? '' : <i className={`${styles.foldIcon} ${thisTabIndex === 2 && isModal || thisChooseBrand !== '' ? styles.up : styles.down}`} />
                     }
                   </span>
                   {
                     +localStorage.reportStatus !== 3
                       ? <span className={`${styles.chooseThisOne} ${styles.noMatch}`}>
                       匹配度<i className={`${styles.foldIcon} ${styles.noMatchBtn}`} />
                       </span>
                       : <span className={`${styles.chooseThisOne} ${thisTabIndex === 3 && isModal || thisChooseMatch.length ? styles.active : ''}`}
                         onClick={() => this.chooseThisType(3)}>
                        匹配度
                         <i className={`${styles.foldIcon} ${thisTabIndex === 3 && isModal || thisChooseMatch.length ? styles.up : styles.down}`} />
                       </span>
                   }

                   <span className={`${styles.chooseThisOne} 
                 ${thisTabIndex === 4 && isModal || productFunction !== '' || choosePrice !== '' || pregnantCanUse || sensitiveSkin ? styles.active : ''}`}
                     onClick={() => this.chooseThisType(4)}>
                   高级筛选
                     <i className={`${styles.foldIcon} ${thisTabIndex === 4 && isModal ||
                    productFunction !== '' || choosePrice !== '' || pregnantCanUse || sensitiveSkin ? styles.up : styles.down}`} />
                   </span>
                 </div>
                 {
                   isModal
                     ? <div className={`${styles.chooseContent} ${thisTabIndex === 4 ? styles.chooseContent2 : styles.chooseContent3}`} >
                       {
                         thisTabIndex === 1
                           ? categoryList.map((v, i) => (
                             <span
                               key={i}
                               className={`${styles.span1} 
                           ${v === thisChooseCategory ? styles.categoryActive : ''} `}
                               onClick={() => this.chooseType1(v)}
                             >
                               {v === thisChooseCategory ? <img src={searchChoosed} className={styles.choosedImg} /> : ''}
                               {v}
                             </span>
                           ))
                           : thisTabIndex === 2
                             ? bandList.map((v, i) => (
                               <span
                                 key={i}
                                 className={`${styles.span1}
                             ${v === thisChooseBrand ? styles.categoryActive : ''} `}
                                 onClick={() => this.chooseType2(v)}
                               >
                                 {v === thisChooseBrand ? <img src={searchChoosed} className={styles.choosedImg} /> : ''}
                                 {v}
                               </span>
                             ))
                             : thisTabIndex === 3
                               ? matchList.map((v, i) => (
                                 <label
                                   key={i}
                                   className={`${v === thisChooseMatch ? styles.categoryActive : ''} `}
                                   onClick={() => this.chooseType3(v)}
                                 >
                                   {v === thisChooseMatch ? <img src={searchChoosed} className={styles.choosedImg} /> : ''}
                                   {v}
                                 </label>
                               ))
                               : <div className={styles.highChoose}>
                                 <p className={styles.p1}>功效</p>
                                 <div>
                                   {
                                     highObj.list1.map((v, i) => (
                                       <span
                                         key={i}
                                         className={`${styles.span2}
                                    ${productFunction.includes(v) ? styles.productActive : ''}`}
                                         onClick={() => this.chooseProduct(v)}
                                       >{v}</span>
                                     ))
                                   }
                                 </div>
                                 <p className={styles.p2}>价格范围（元）</p>
                                 <div>
                                   {
                                     highObj.list2.map((v, i) => (
                                       <span
                                         key={i}
                                         className={`${styles.span2}
                                      ${choosePrice.includes(v) ? styles.productActive : ''}`}
                                         onClick={() => this.choosePrice(v)}
                                       >{v}</span>
                                     ))
                                   }
                                 </div>
                                 <p className={styles.p3}>
                                   <span>孕妇/哺乳期 可用</span>
                                   <span className={`${styles.radio} ${pregnantCanUse ? styles.true : ''}`}
                                     onClick={() => this.checkRadio(1)} />
                                 </p>
                                 <p className={styles.p4}>
                                   <span>敏感肤质使用</span>
                                   <span className={`${styles.radio} ${sensitiveSkin ? styles.true : ''}`}
                                     onClick={() => this.checkRadio(2)} />
                                 </p>
                               </div>
                       }
                       {
                         thisTabIndex === 4
                           ? <div className={styles.bottomBtn}>
                             <span onClick={this.resetBtn}>重置</span>
                             <span onClick={this.downBtn}>完成</span>
                           </div>
                           : ''
                       }
                     </div>
                     : null
                 }
               </div>
               : ''
           }
           <Modal
             type={thisTabIndex}
             visible={isModal}
             handleToggle={() => { this.handleToggle() }}
           />
           {
             pageNum === 2 && productList.length === 0 && !noKeyWordsData
               ? <div className={styles.results}>
                 <div className={styles.noSearchData}>
                   <img src={noSearchData} />
                   <p>没有搜索到结果</p>
                   <p>请更换或减少筛选条件吧～</p>
                 </div>
               </div>
               : !noKeyWordsData
                 ? <div className={styles.results}>
                   <BoxList
                     type={curIndex === 0 ? 2 : 3}
                     thisBoxList={productList}
                     onhandleDetail={this.onhandleDetail}
                     onhandleDetail2={this.onhandleDetail2}
                   />
                 </div>
                 : ''
           }
           {
             noKeyWordsData
               ? <div>
                 <div className={styles.noKeyWordsData}>
                   <img src={noSearchData} />
                   <p>没有搜索到结果~</p>
                 </div>
                 {
                   localStorage.reportStatus === 'null'
                     ? <div className={styles.goLock} onClick={this.goToLock}>
                       <img src={goLock} />
                     </div>
                     : ''
                 }
                 <div className={styles.searchMoudle}>
                   <p><span>换个词搜搜</span></p>
                   <div>
                     {
                       hotKeyWord.length
                         ? hotKeyWord.map((item, i) => (
                           <span key={i} onClick={() => this.goSearch(item)}>{item}</span>
                         ))
                         : ''
                     }
                   </div>
                 </div>
                 {
                   thisBoxList.length
                     ? <div className={styles.recommend}>
                       <p>
                 为你推荐
                       </p>
                       <Recommend
                         type={2}
                         thisBoxList={thisBoxList}
                         onhandleRecommend={this.handleRecommend}
                       />
                     </div>
                     : null
                 }
                 {
                   +localStorage.reportStatus === 3
                     ? <div className={styles.searchTips}>
                       <span>!</span>
                       <span>搜索维护中，可能导致结果较少，敬请谅解。</span>
                     </div>
                     : ''
                 }
               </div>
               : ''
           }
         </div>
       </Page>
     )
   }
}
SkinSearch.propTypes = {
  history: propTypes.object,
}
export default SkinSearch
