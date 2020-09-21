import React from 'react'
import propTypes from 'prop-types'
import { API, point, fun, ua } from '@src/common/app'
import { Page } from '@src/components'
import SkinTabs from '../compoment/skinTabs'
import BoxList from '../compoment/boxList'
import Recommend from '../compoment/recommend'
import ShowModal from '../compoment/showModal'
import wxconfig from '@src/common/utils/wxconfig'
import { trackPointSkinToolView, trackPointSkinToolPageGoto } from './buried-point'
import andall from '@src/common/utils/andall-sdk'

import goBack from '@static/skinBeauty/gotoBack.png'
import skinName from '@static/skinBeauty/skinName.png'
import goLock from '@static/skinBeauty/goLock.png'
import title1 from '@static/skinBeauty/title1.png'
import title2 from '@static/skinBeauty/title2.png'
import noLike from '@static/skinBeauty/noLike.png'
import check from '@static/skinBeauty/check.png'
import close from '@static/skinBeauty/close.png'
import choose from '@static/skinBeauty/choose.png'

import styles from '../skinBeauty.scss'
import images from '@src/common/utils/images'
import { MyLoader } from './MyLoader'
const { bindOnly } = images
const { getParams } = fun
const toolsCode = 'BEAUTY'

class HomePage extends React.Component {
  state = {
    thisData:{}, // 查询结果
    linkManId:'',
    linkManName:'',
    reportStatus:'',
    thisBoxList:[], // 为你推荐
    favoriteList:[], // 护肤小抽屉
    curIndex: 0, // 当前选中的tab索引
    circleList:[], // 猜你想找
    tabList:[
      { title: '产品' },
      { title: '成分' }
    ],
    showPerson:false,
    showTips:false, // 免责声明
    pageNum: 1,
    loadingStatus: true,
    loading:true,
  }
  componentDidMount () {
    if (+getParams().clearFlag === 1 || ua.isAndall()) {
      localStorage.removeItem('linkManId')
      localStorage.removeItem('linkManName')
      localStorage.removeItem('reportStatus')
      localStorage.removeItem('headImgType')
      localStorage.removeItem('userName')
    }
    setTimeout(() => {
      this.getHomeInfo(localStorage.linkManId)
    }, 200)
    this.wxShare()
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.getFavoriteBoxData)
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
  getHomeInfo=(id) => {
    let params = {
      linkManId:id === undefined ? null : id,
      toolsCode:toolsCode,
      noloading:1,
    }
    API.getBeautyHomeInfo(params).then(res => {
      localStorage.setItem('linkManId', res.data.linkManId)
      localStorage.setItem('reportStatus', res.data.reportStatus === undefined ? null : res.data.reportStatus)
      localStorage.setItem('linkManName', res.data.linkManName)
      localStorage.setItem('headImgType', res.data.headImgType)
      localStorage.setItem('userName', res.data.userName)
      this.setState({
        thisData:res.data,
        linkManId:res.data.linkManId === 'null' ? null : res.data.linkManId,
        linkManName:res.data.linkManName,
        reportStatus:res.data.reportStatus,
        thisBoxList:res.data.recommendProduct,
      }, () => {
        trackPointSkinToolView({
          view_type: getParams().viewType || '',
          os_version: navigator.userAgent,
          user_state:+res.data.reportStatus === 3 ? 2 : res.data.reportStatus === null || res.data.reportStatus === 'null' ? 0 : 1
        })
        // 猜你想找
        if (+res.data.reportStatus !== 3) {
          this.getHostKeyWord()
        }
        // 护肤小抽屉(默认产品)
        window.addEventListener('scroll', this.getFavoriteBoxData)
        this.getFavoriteBoxData()
      })
    })
  }
  // 切换检测人
  chooseThis=(item) => {
    trackPointSkinToolPageGoto({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      Btn_name:'home_linkman_switch',
      cream_product_id:'',
      element_id:'',
    })
    this.setState({
      linkManId:item.id,
      linkManName:item.userName,
      showPerson:false,
      curIndex:0, // tab切换为产品
      pageNum:1,
    }, () => {
      this.getHomeInfo(item.id)
    })
  }
  // 猜你想找
  getHostKeyWord=(str) => {
    let params = {
      lastKeyWords:str,
      toolsCode:toolsCode,
      noloading:1,
    }
    API.getHostKeyWord(params).then(res => {
      console.log(res.data)
      let arr = res.data.sort(function(a, b) {
        return b.length - a.length
      })
      let arr2 = []
      arr2[0] = arr[2]
      arr2[1] = arr[0]
      arr2[2] = arr[3]
      arr2[3] = arr[1]
      this.setState({ circleList:arr2 })
    })
  }
  // 猜你想找 词点击
  goSkinSearch=(val) => {
    this.props.history.push(`/skinSearch/skinSearch`)
    localStorage.setItem('keywords', val)
    localStorage.setItem('curIndex', 0)
    trackPointSkinToolPageGoto({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      Btn_name:'home_search_tag',
      cream_product_id:'',
      element_id:'',
    })
  }
  // 不感兴趣
  noLike=() => {
    trackPointSkinToolPageGoto({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      Btn_name:'home_search_tag_change',
      cream_product_id:'',
      element_id:'',
    })
    this.getHostKeyWord(this.state.circleList.join(','))
  }
  // 护肤小抽屉
  getFavoriteBoxData=() => {
    console.log(1111111111)
    const { pageNum, curIndex, loadingStatus, favoriteList } = this.state
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    // console.log(scrollTop, offsetHeight, bodyHeight)
    let params = {
      favoriteProductType:curIndex === 0 ? 'PRODUCT' : 'ELEMENT',
      linkManId:localStorage.linkManId === undefined || localStorage.linkManId === 'undefined' ? null : localStorage.linkManId,
      pageNum:pageNum,
      pageSize:10,
      reportStatus:localStorage.reportStatus === 'null' ? null : +localStorage.reportStatus,
      toolsCode:toolsCode,
    }
    if (pageNum === 1) {
      API.getFavoriteBoxData(params).then(res => {
        if (res.data) {
          if (res.data[0].favoriteList === null) {
            this.setState({
              favoriteList: [],
              loading:false
            })
            window.removeEventListener('scroll', this.getFavoriteBoxData)
            return
          } else {
            window.addEventListener('scroll', this.getFavoriteBoxData)
          }
          this.setState({
            loadingStatus:true,
            favoriteList: res.data[0].favoriteList,
            pageNum: pageNum + 1,
            loading:false,
          })
        }
      })
    } else {
      if (loadingStatus && isFoot) {
        delete params.noloading
        this.setState({ loadingStatus: false }, () => {
          API.getFavoriteBoxData(params).then(res => {
            if (res.data) {
              if (res.data[0].favoriteList === null) {
                window.removeEventListener('scroll', this.getFavoriteBoxData)
                return
              }
              this.setState({
                favoriteList: [...favoriteList, ...res.data[0].favoriteList],
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
  // 切换产品/成分
  handleToggleTab = (i) => {
    this.setState({
      curIndex: i,
      pageNum:1,
      favoriteList:[],
    }, () => {
      this.getFavoriteBoxData()
    })
  }
  goSearch=() => {
    this.props.history.push('/skinSearch/records')
  }
  goBack=() => {
    // this.props.history.goBack()
  }
  checkPerson=() => {
    this.setState({ showPerson:true })
  }
  modalToggle = (name) => {
    const bool = this.state[name]
    this.setState({
      [name]: !bool
    })
  }
  showTips=() => {
    this.setState({ showTips: true })
  }
  // 购买入口banner
  goLockPage=() => {
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
      Btn_name:'home_banner_to_buy',
      cream_product_id:'',
      element_id:'',
    })
  }
  // 查看报告
  seeReport=() => {
    const { thisData, linkManId } = this.state
    if (ua.isAndall()) {
      andall.invoke('openReport', {
        linkManId:linkManId,
        barCode:thisData.barCode,
        id:'2487411480100864',
        code:thisData.peoductCode,
        name:'肌秘美肤',
        reportType:21,
      })
    } else {
      window.location.href = window.location.origin + '/download-app'
    }
    trackPointSkinToolPageGoto({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      Btn_name:'home_to_report',
      cream_product_id:'',
      element_id:'',
    })
  }
  // 为你推荐去产品详情页
  handleRecommend=(item) => {
    this.props.history.push(`/skinSearch/goodsDetail?id=${item.creamProductId}&thisMatch=${item.matching}`)
    trackPointSkinToolPageGoto({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      Btn_name:'home_recom_to_product',
      cream_product_id:'',
      element_id:'',
    })
  }
  onhandleDetail=(item) => {
    this.props.history.push(`/skinSearch/groupDetail?id=${item.creamElementId}&thisMatch=${item.matching}`)
  }
  onhandleDetail2=(item) => {
    this.props.history.push(`/skinSearch/goodsDetail?id=${item.creamProductId}&thisMatch=${item.matching}`)
  }
  render () {
    const { curIndex, tabList, thisBoxList, thisData, reportStatus, linkManId, linkManName,
      showPerson, favoriteList, circleList, showTips, loading } = this.state
    return (
      <Page title='肌秘美肤小工具'>
        {loading ? <MyLoader />
          : <div className={`${styles.home} ${showPerson || showTips && styles.noscroll}`}>
            <img src={skinName} className={styles.skinName} />
            <div className={styles.search}>
              {/* <img src={goBack} onClick={this.goBack} /> */}
              <span className={styles.searchBtn} onClick={this.goSearch}>搜索护肤品，查看匹配度</span>
            </div>
            {
              localStorage.reportStatus === 'null' &&
            (thisData.linkManEntityList === null || (thisData.linkManEntityList && thisData.linkManEntityList.length === 0))
                ? <div className={styles.goLock2} onClick={this.goLockPage}><img src={goLock} /></div>
                : <div className={`${styles.myResult} ${+reportStatus === 3 ? '' : reportStatus === null ? styles.myResult2 : styles.myResult3}`}>
                  <p className={styles.title}>
                    <span onClick={this.checkPerson}>{`${linkManName}`}</span>
                    <img src={check} onClick={this.checkPerson} />
                    {+reportStatus === 3
                      ? <span onClick={this.seeReport}>查看报告</span>
                      : reportStatus === null
                        ? <span className={styles.noReport}>暂无报告</span>
                        : <span className={styles.noReport}>报告解锁中</span>
                    }
                  </p>
                  {
                    showPerson
                      ? <div>
                        <div className={styles.mask} onClick={() => this.modalToggle('showPerson')} />
                        <div className={styles.person}>
                          <p className={styles.title}>
                            <span>切换检测人</span>
                            <img src={close} onClick={() => this.modalToggle('showPerson')} />
                          </p>
                          <div className={`${styles.name} ${thisData.linkManEntityList.length >= 4 ? styles.name1 : ''}`}>
                            {
                              thisData.linkManEntityList.map((item, index) => (
                                <p onClick={() => this.chooseThis(item)} key={index}>
                                  <span>{`${item.userName}(${item.relationName})`}</span>
                                  {item.id === linkManId ? <img src={choose} /> : ''}
                                </p>
                              ))
                            }
                          </div>
                        </div>
                      </div>
                      : ''
                  }
                  {
                    +reportStatus === 3
                      ? <p className={styles.des}>{`肌秘美肤基因检测结果显示，我的内在肤质有${thisData.highNum === null ? 0 : thisData.highNum}个亮点基因、
                        ${thisData.lighNum === null ? 0 : thisData.lighNum}个红点基因。`}
                      </p>
                      : reportStatus === null
                        ? <div className={styles.goLock} onClick={this.goLockPage}>
                          <img src={goLock} />
                        </div>
                        : ''
                  }
                </div>
            }
            {
              +reportStatus !== 3
                ? <div className={styles.guessYour} style={{ paddingBottom:0 }}>
                  <p className={styles.left}>
                    <img src={title1} />
                    <span>猜你想找</span>
                    <img src={noLike} onClick={this.noLike} />
                    <span onClick={this.noLike}>不感兴趣</span>
                  </p>
                </div>
                : <div className={styles.guessYour}>
                  <p className={styles.left}><img src={title1} /><span>基于你的内在肤质为你推荐</span></p>
                </div>
            }
            {
              +reportStatus !== 3
                ? <div className={styles.yourKey}>
                  {
                    circleList.map((item, index) => (
                      index === 0
                        ? <span key={index} onClick={() => this.goSkinSearch(item)}>
                          {item.length > 4 ? item.substring(0, 4) : item}
                        </span>
                        : index === 1
                          ? <span key={index} onClick={() => this.goSkinSearch(item)} className={`${item.length > 4 ? styles.line2 : ''}`}>
                            {item.length > 8 ? item.substring(0, 8) : item}
                          </span>
                          : index === 2
                            ? <span key={index} onClick={() => this.goSkinSearch(item)}>
                              {item.length > 3 ? item.substring(0, 3) : item}
                            </span>
                            : <span key={index} onClick={() => this.goSkinSearch(item)}>
                              {item.length > 4 ? item.substring(0, 4) : item}
                            </span>
                    ))
                  }
                </div>
                : <div className={styles.recommend}>
                  <Recommend
                    type={1}
                    thisBoxList={thisBoxList}
                    onhandleRecommend={this.handleRecommend}
                  />
                </div>
            }
            <div className={styles.guessYour}>
              <p className={styles.left}><img src={title2} /><span>护肤小抽屉</span></p>
              <SkinTabs
                type={1}
                cur={curIndex}
                tabData={tabList}
                onHandle={(i) => this.handleToggleTab(i)} />
              <div>
                {
                  favoriteList.length > 0
                    ? <BoxList
                      type={curIndex === 0 ? 1 : 3}
                      thisBoxList={favoriteList}
                      onhandleDetail={this.onhandleDetail}
                      onhandleDetail2={this.onhandleDetail2}
                    />
                    : <div className={styles.noBox}>
                      <span>装点什么好呢？</span>
                    </div>
                }
              </div>
            </div>
            <div className={`${styles.disclaimer} ${+reportStatus !== 3 ? styles.disclaimer2 : ''}`} onClick={this.showTips}>
              <span className={styles.span1}>!</span>
              <span className={styles.span2}>免责声明</span>
            </div>
            {
              +reportStatus === 3
                ? <div className={styles.searchTips}>
                  <span>!</span>
                  <span>搜索维护中，可能导致结果较少，敬请谅解。</span>
                </div>
                : ''
            }
            {
              showTips
                ? <ShowModal
                  handleToggle={() => this.modalToggle('showTips')}
                  visible={showTips}
                  type={3}
                />
                : null
            }
          </div>}
      </Page>
    )
  }
}
HomePage.propTypes = {
  history: propTypes.object,
}
export default HomePage
