import React from 'react'
import propTypes from 'prop-types'
import { API, point, fun, ua } from '@src/common/app'
import { Page, Bomb } from '@src/components'
import { Toast } from 'antd-mobile'
import SkinTabs from '../compoment/skinTabs'
import Recommend from '../compoment/recommend'
import { trackPointSkinToolSearch, trackPointSkinToolPageGoto } from './buried-point'
import wxconfig from '@src/common/utils/wxconfig'
import andall from '@src/common/utils/andall-sdk'
import goBack from '@static/skinBeauty/gotoBack.png'
import goLock from '@static/skinBeauty/goLock.png'
import delBtn from '@static/skinBeauty/delBtn.png'
import noSearchData from '@static/skinBeauty/noSearchData.png'
import searchClose from '@static/skinBeauty/searchClose.png'
import styles from './search.scss'
import images from '@src/common/utils/images'
import { SearchLoader } from './SearchLoader'

const { bindOnly } = images
const { getParams } = fun

class Records extends React.Component {
  state = {
    pageFlag:1, // 1 大家都在搜  2 帅选结果
    linkManId:localStorage.linkManId === 'null' ? null : localStorage.linkManId,
    reportStatus:+localStorage.reportStatus,
    hotKeyWord:[], // 大家都在搜
    searchHistoryList:[], // 历史搜索
    curIndex:+getParams().curIndex === 1 ? 1 : 0, // 产品/成分
    upOrDown:0,
    isFixedTop: false,
    tabList:[
      { title: '产品' },
      { title: '成分' }
    ],
    thisBoxList:[], // 为你推荐
    noResult:false,
    searchValue:'',
    loading:true,
  }
  componentDidMount () {
    trackPointSkinToolSearch({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1
    })
    this.getHistoryAndHostKey()
    this.getBeautyHomeInfo()
    this.wxShare()
  }
  getBeautyHomeInfo=() => {
    let params = {
      linkManId:this.state.linkManId,
      toolsCode:'BEAUTY',
      noloading:1,
    }
    API.getBeautyHomeInfo(params).then(res => {
      if (res.data.recommendProduct) {
        this.setState({
          thisBoxList:res.data.recommendProduct === null ? [] : res.data.recommendProduct,
          loading:false
        })
      }
    })
  }
   // 微信分享
   wxShare = () => {
     setTimeout(() => {
       wxconfig({
         showMenu: true,
         params:{
           title: '我的专属护肤品匹配神器',
           desc: '选对护肤品，谁还去打啥上万的玻尿酸？',
           link: `${window.location.origin}/andall-sample/skinSearch/homePage?viewType=link`,
           imgUrl: `${bindOnly}fangtu.png`,
         }
       })
     }, 400)
   }
  // 大家都在搜
  getHistoryAndHostKey=() => {
    API.getHistoryAndHostKey({
      linkManId:this.state.linkManId,
      toolsCode:'BEAUTY',
      noloading:1,
    }).then(res => {
      this.setState({
        hotKeyWord:res.data.hotKeyWord,
        searchHistoryList:res.data.searchHistoryList,
        loading:false
      })
    })
  }
  handleToggleTab = (i) => {
    this.setState({
      curIndex: i,
    }, () => {
      this.handleSubmit()
    })
  }
  chooseThisType=(type) => {
    console.log(type)
    this.setState({
      isModal:true,
      thisTabIndex:type
    })
  }
 handleToggle = () => {
   const { isModal } = this.state
   this.setState({
     isModal: !isModal
   })
 }
 goBack=() => {
   this.props.history.push('/skinSearch/homePage')
 }
 onWindowScroll = () => {
   let _top = document.getElementById('tabNav').offsetTop
   let h = document.body.scrollTop || document.documentElement.scrollTop
   h > _top ? this.setState({
     isFixedTop: true
   }) : this.setState({
     isFixedTop: false
   })
 }
  // 清空历史记录
  emptyHistory=() => {
    API.clearHistory({ toolsCode:'BEAUTY', noloading:1 }).then(res => {
      this.setState({ searchHistoryList:[] })
    })
  }
  goSearch=(text) => {
    this.props.history.push(`/skinSearch/skinSearch`)
    localStorage.setItem('keywords', text)
    localStorage.setItem('curIndex', this.state.curIndex)
  }
  onChange =(e) => {
    this.setState({ searchValue: e.target.value })
  }
  // 搜索
  handleSubmit=() => {
    if (this.state.searchValue !== '') {
      event.preventDefault()
      let params = {
        toolsCode:'BEAUTY',
        pageNum:1,
        pageSize:10,
        linkManId: localStorage.linkManId === 'null' ? null : localStorage.linkManId,
        reportStatus: localStorage.reportStatus,
        keyWords: this.state.searchValue, // 搜索关键词
        searchProductType: this.state.curIndex === 0 ? 'PRODUCT' : 'ELEMENT', // 产品/成分
        searchProductCategory: '', // 分类
        searchProductBrand: '', // 品牌
        maxMatching:'', // 匹配度最大值
        mixMatching:'', // 匹配度最小值
        productFunction: '', // 功效
        maxPrice:'', // 价格最大值
        mixPrice:'', // 价格最小值
        pregnantCanUse:'', // 哺乳期可用
        sensitiveSkin: '', // 敏感肤质可用
      }
      API.searchProduct(params).then(({ data }) => {
        if (data) {
          if (data.productList.length === 0) {
            this.setState({ noResult:true })
          } else {
            localStorage.setItem('keywords', this.state.searchValue)
            localStorage.setItem('curIndex', this.state.curIndex)
            this.props.history.push(`/skinSearch/skinSearch`)
          }
        }
      })
    }
    document.activeElement.blur() // 关闭软键盘
  }
  // 购买banner
  goToLock=() => {
    if (ua.isAndall()) {
      andall.invoke('goProductDetail', {
        productId: '2487411480100864',
        productType: 2
      })
    } else {
      window.location.href = 'https://wechatshop.dnatime.com/commodity?id=2487411480100864&from=groupmessage&isappinstalled=0'
    }
    trackPointSkinToolPageGoto({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      Btn_name:'search_banner_to_buy',
      cream_product_id:'',
      element_id:'',
    })
  }
    // 为你推荐去产品详情页
    handleRecommend=(item) => {
      this.props.history.push(`/skinSearch/goodsDetail?id=${item.creamProductId}&thisMatch=${item.matching}`)
    }
    render () {
      const { curIndex, tabList, thisBoxList, isModal, hotKeyWord, searchHistoryList, noResult, searchValue, loading } = this.state
      return (
        <Page title='肌秘美肤小工具'>
          { loading ? <SearchLoader />
            : <div className={`${styles.searchPage} ${isModal && styles.noscroll}`}>
              <div className={styles.search} >
                {
                  ua.isAndall() ? '' : <img src={goBack} onClick={this.goBack} className={styles.back} />
                }
                <form action='#' id='myform' onSubmit={this.handleSubmit}>
                  <input
                    placeholder='搜索护肤品，查看匹配度'
                    type='search'
                    id='myInput'
                    value={searchValue}
                    onChange={this.onChange}
                  />
                </form>
                <img src={searchClose} className={styles.empty} onClick={() => { this.setState({ searchValue:'' }) }} />
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
                noResult
                  ? <div className={styles.noResult} >
                    <img src={noSearchData} />
                    <p>没有搜索到结果～</p>
                  </div>
                  : ''
              }
              {
                localStorage.reportStatus === 'null'
                  ? <div className={styles.goLock} onClick={this.goToLock}>
                    <img src={goLock} />
                  </div>
                  : ''
              }
              <div className={styles.searchMoudle}>
                <p><span>{noResult ? '换个词搜搜' : '大家都在搜'}</span></p>
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
                noResult ? ''
                  : searchHistoryList.length
                    ? <div className={styles.searchMoudle}>
                      <p>
                        <span>历史搜索</span>
                        <img src={delBtn} onClick={this.emptyHistory} />
                      </p>
                      <div>
                        {searchHistoryList.map((item, i) => (
                          <span key={i} onClick={() => this.goSearch(item)}>{item}</span>
                        ))}
                      </div>
                    </div>
                    : null
              }
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
            </div>}
        </Page>
      )
    }
}
Records.propTypes = {
  history: propTypes.object,
}
export default Records
