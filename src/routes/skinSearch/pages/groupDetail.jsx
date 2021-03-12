import React from 'react'
import propTypes from 'prop-types'
// import { connect } from 'react-redux'
import { API, fun, point, ua } from '@src/common/app'
import axios from 'axios'
import { Page, Bomb } from '@src/components'
import BoxList from '../compoment/boxList'
import { Toast } from 'antd-mobile'
import { trackPointSkinToolElement, trackPointSkinToolPageGoto } from './buried-point'
import wxconfig from '@src/common/utils/wxconfig'
import andall from '@src/common/utils/andall-sdk'
import Bottom from '../compoment/bottom'
import Match from '../compoment/match.js'
import ShowModal from '../compoment/showModal'
import goBack from '@static/skinBeauty/gotoBack.png'
import info1 from '@static/skinBeauty/info1.png'
import info2 from '@static/skinBeauty/info2.png'
import infoR from '@static/skinBeauty/infoR.png'
import info3 from '@static/skinBeauty/info3.png'
import gene1 from '@static/skinBeauty/gene1.png'
import gene2 from '@static/skinBeauty/gene2.png'
import goLock from '@static/skinBeauty/goLock.png'
import suo3 from '@static/skinBeauty/suo3.png'
import suo4 from '@static/skinBeauty/suo4.png'
import wu from '@static/skinBeauty/wu.png'
import one from '@static/skinBeauty/one.png'
import four from '@static/skinBeauty/four.png'
import seven from '@static/skinBeauty/seven.png'
import fangtu from '@static/skinBeauty/fangtu.png'

import styles from './group.scss'
import { DetailLoader } from './detailLoader'

const { getParams } = fun
class GoodsDetail extends React.Component {
  state = {
    loadingStatus:true,
    pageNum:1,
    showTips:false, // 显示匹配度贴士
    elementInfo:{},
    thisMatch:getParams().thisMatch,
    geneNameList:[],
    showMoreFlag:false, // 成分说明 是否需要 展开收起
    tipsFlag:false, // 展示全部 收起 / 显示部分 展开
    showGene:false, // 基因位点收起
    thisTabname:'全部',
    productList:[],
    categoryList:[],
    isCollect:false,
    securityrisks:'', // 安全风险
    accurateMark:0, // 喜欢
    notAccurateMark:0, // 不喜欢
    categaryList:[], // 含有该成分的产品 tab
    isVariant:1, // null补录中
    loading:true
  }
  componentDidMount () {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    document.scrollingElement.scrollTop = 0
    trackPointSkinToolElement({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      element_id:getParams().id,
    })
    setTimeout(() => {
      this.searchElementDetail()
      this.queryPorductByElement()
      window.addEventListener('scroll', this.queryPorductByElement)
    }, 200)
    this.wxShare()
  }
  searchElementDetail=() => {
    let params = {
      elementId:getParams().id,
      reportStatus:localStorage.reportStatus,
      linkManId:localStorage.linkManId === 'null' ? null : localStorage.linkManId,
      toolsCode:'BEAUTY',
      noloading:1,
    }
    API.searchElementDetail(params).then(res => {
      res.data.categaryList.unshift('全部')
      this.setState({
        elementInfo:res.data,
        geneNameList:res.data.geneNameList === null ? [] : res.data.geneNameList,
        isCollect:res.data.isFavorite,
        securityrisks:res.data.securityrisks,
        categaryList:res.data.categaryList,
        accurateMark:res.data.accurateMark,
        notAccurateMark:res.data.notAccurateMark,
        isVariant:res.data.isVariant,
        loading:false
      }, () => {
        document.body.scrollTop = 1
        document.documentElement.scrollTop = 1
        // alert(this.state.loading)
        if (this.refs.thisTips) {
          if (this.refs.thisTips.clientHeight > 96) {
            this.setState({ showMoreFlag:true })
          }
        }
      })
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
           link: `${window.location.origin}/mkt/skinSearch/homePage?viewType=link`,
           imgUrl:`${fangtu}`,
         }
       })
     }, 400)
   }
   componentWillUnmount () {
     window.removeEventListener('scroll', this.queryPorductByElement)
   }
  showAllOrOne=() => {
    const { thisFenxiFlag } = this.state
    this.setState({
      thisFenxiFlag:!thisFenxiFlag
    })
  }
  // 含有该成分的产品
  queryPorductByElement=() => {
    const { loadingStatus, thisTabname, pageNum, productList } = this.state
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    // console.log(scrollTop, offsetHeight, bodyHeight, isFoot)
    let params = {
      category:thisTabname,
      elementId :getParams().id,
      linkManId:localStorage.linkManId === 'null' ? null : localStorage.linkManId,
      pageNum:pageNum,
      pageSize :10,
      toolsCode:'BEAUTY',
    }
    if (thisTabname === '全部') {
      delete params.category
    }
    if (loadingStatus && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        API.queryPorductByElement(params).then(res => {
          if (res.data) {
            if (res.data.length === 0) {
              window.removeEventListener('scroll', this.queryPorductByElement)
              return
            }
            this.setState({
              productList: [...productList, ...res.data],
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
  // 含该成分的产品tabs切换
  handleNavTab = (item) => {
    console.log(item)
    this.setState({
      thisTabname:item,
      pageNum:1,
      productList:[],
      loadingStatus:true
    }, () => {
      this.queryPorductByElement()
      window.addEventListener('scroll', this.queryPorductByElement)
    })
  }
  showTips=() => {
    this.setState({ showTips:true })
  }
  modalToggle=() => {
    this.setState({ showTips:false })
  }
  goBack=() => {
    this.props.history.goBack()
  }
  showGeneName=() => {
    const { showGene } = this.state
    this.setState({ showGene:!showGene })
  }
  showAllOrOne=() => {
    const { tipsFlag } = this.state
    this.setState({ tipsFlag:!tipsFlag })
  }
    // 收藏
    collectBtn=() => {
      trackPointSkinToolPageGoto({
        os_version: navigator.userAgent,
        user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
        Btn_name:'element_collect',
        cream_product_id:'',
        element_id:getParams().id,
      })
      let params = {
        favoriteProductId:getParams().id,
        favoriteProductType:'ELEMENT',
        linkManId:localStorage.linkManId === 'null' ? null : localStorage.linkManId,
        matching:this.state.thisMatch,
        toolsCode:'BEAUTY',
        noloading:1,
      }
      API.addFavoriteBoxData(params).then(res => {
        if (res.data) {
          this.setState({ isCollect:!this.state.isCollect })
        }
      })
    }
    // 喜欢/不喜欢
    recordBtn=(type) => {
      const { accurateMark, notAccurateMark } = this.state
      let params = {
        accurateMark:type === 1 ? accurateMark === 0 ? 1 : 0 : 0, // 1准确
        notAccurateMark:type === 2 ? notAccurateMark === 0 ? 1 : 0 : 0,
        linkManId:localStorage.linkManId === 'null' ? null : localStorage.linkManId,
        productRelId:getParams().id,
        productType:'ELEMENT',
        toolsCode:'BEAUTY',
        noloading:1,
      }
      API.recordFeedback(params).then(res => {
        if (res.data) {
          this.setState({
            accurateMark:type === 1 ? accurateMark === 0 ? 1 : 0 : 0,
            notAccurateMark:type === 2 ? notAccurateMark === 0 ? 1 : 0 : 0,
          })
        }
      })
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
      Btn_name:'element_banner_to_buy',
      cream_product_id:'',
      element_id:getParams().id,
    })
  }
  // 分享
  shareBtn=() => {
    // 成分分享埋点
    trackPointSkinToolPageGoto({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      Btn_name:'element_share',
      cream_product_id:'',
      element_id:getParams().id,
    })
    window.removeEventListener('scroll', this.queryPorductByElement)
    const { elementInfo, thisMatch } = this.state
    localStorage.setItem('shareName', elementInfo.elementName.length > 11 ? elementInfo.elementName.substring(0, 11) + '...' : elementInfo.elementName)
    localStorage.setItem('shareType', 2)
    this.props.history.push(`/skinSearch/sharePage?thisMatch=${thisMatch}&shareId=${getParams().id}`)
  }
  onhandleDetail2=(item) => {
    this.props.history.push(`/skinSearch/goodsDetail?id=${item.creamProductId}&thisMatch=${item.matching}`)
  }
  render () {
    const { elementInfo, thisMatch, geneNameList, showMoreFlag, tipsFlag, showGene, thisTabname, categaryList,
      productList, showTips, isCollect, securityrisks, accurateMark, notAccurateMark, isVariant, loading } = this.state
    return (
      <Page title='肌秘美肤小工具'>
        {this.state.loading ? <DetailLoader />
          : <div className={`${styles.groups} ${showTips && styles.noscroll}`}>
            {
              ua.isAndall() ? '' : <img src={goBack} onClick={this.goBack} className={styles.goBack} />
            }
            <div className={styles.groupsDes}>
              <p className={styles.title}>{elementInfo.elementName}</p>
              <p className={styles.thisMatch}>
                {
                  +localStorage.reportStatus !== 3 ? '匹配度 ？' : thisMatch === 'null' ? '匹配度 --' : `匹配度${thisMatch}%`
                }
              </p>
              <p className={styles.info}>
                <span>CAS号</span>
                <span>{elementInfo.cas === '' || elementInfo.cas === null ? '--' : elementInfo.cas}</span>
              </p>
              <p className={styles.level}>
                <span>安全风险</span>
                <span>
                  {
                    securityrisks === '' || securityrisks === null
                      ? <img src={wu} />
                      : securityrisks.indexOf('-') > -1
                        ? (Number(securityrisks.split('-')[0]) + Number(securityrisks.split('-')[1])) / 2 >= 0 && (Number(securityrisks.split('-')[0]) + Number(securityrisks.split('-')[1])) / 2 < 4
                          ? <label className={styles.ju1}>{securityrisks}</label>
                          : (Number(securityrisks.split('-')[0]) + Number(securityrisks.split('-')[1])) / 2 >= 4 && (Number(securityrisks.split('-')[0]) + Number(securityrisks.split('-')[1])) / 2 < 7
                            ? <label className={styles.ju2}>{securityrisks}</label>
                            : (Number(securityrisks.split('-')[0]) + Number(securityrisks.split('-')[1])) / 2 >= 7 && (Number(securityrisks.split('-')[0]) + Number(securityrisks.split('-')[1])) / 2 <= 10
                              ? <label className={styles.ju3}>{securityrisks}</label> : ''
                        : +securityrisks >= 0 && +securityrisks < 4
                          ? <img src={one} />
                          : +securityrisks >= 4 && +securityrisks < 7
                            ? <img src={four} />
                            : +securityrisks >= 7 && +securityrisks <= 10
                              ? <img src={seven} />
                              : ''
                  }
                </span>
              </p>
              <p className={styles.book}>
                {`${elementInfo.riskblain}` === '0' ? <span>无致痘风险</span> : ''}
                {`${elementInfo.pregnantCantUse}` === 1 ? <span>孕妇慎用</span> : ''}
                {
                  elementInfo.newElementType === null || elementInfo.newElementType === '' ? ''
                    : `${elementInfo.newElementType}`.indexOf(',')
                      ? `${elementInfo.newElementType}`.split(',').map((item, i) => (
                        <span key={i}>{item}</span>
                      ))
                      : elementInfo.newElementType
                }
              </p>
              <div className={styles.infoTitle}>
                <img src={info1} />
                <span className={styles.medium}>匹配度分析</span>
                <img src={infoR} onClick={this.showTips} />
              </div>
              {
                showTips
                  ? <ShowModal
                    handleToggle={this.modalToggle}
                    visible={showTips}
                    type={2}
                  />
                  : null
              }
              {localStorage.reportStatus === 'null' ? <img src={goLock} className={styles.goLock} onClick={this.goToLock} /> : ''}
              {
                +localStorage.reportStatus !== 3
                  ? localStorage.reportStatus === 'null'
                    ? <img src={suo3} className={styles.suo3} />
                    : <img src={suo4} />
                  : thisMatch === 'null'
                    ? <div className={`${styles.infoDes} ${styles.noMatch}`}>
                      {
                        isVariant === null || isVariant === 'null'
                          ? <div className={styles.name}>
                            <p><label>科学家们正在揭秘，</label></p>
                            <p><label>该成分与基因位点的关系，</label></p>
                            <p><label>敬请期待哦！</label></p>
                          </div>
                          : <div className={styles.name}>
                            <p><label>由于此成分较为特殊，</label></p>
                            <p><label>属于非功效成分，</label></p>
                            <p><label>故不存在基因匹配度。</label></p>
                          </div>
                      }

                      <p className={styles.btns}>
                        <span onClick={() => this.recordBtn(1)} className={`${accurateMark === 0 ? styles.yes1 : styles.yes2}`}>
                          <label>喜欢</label>
                        </span>
                        <span onClick={() => this.recordBtn(2)} className={`${notAccurateMark === 0 ? styles.no1 : styles.no2}`}>
                          <label>不喜欢</label>
                        </span>
                      </p>
                    </div>
                    : <div className={styles.infoDes}>
                      <div className={styles.circle}>
                        <span className={styles.matchValue}>{thisMatch}</span>
                        <span className={styles.matchB}>%</span>
                        <span className={styles.matchResults}>
                          {
                            thisMatch > 79 ? '匹配度较高'
                              : thisMatch > 59 && thisMatch < 80 ? '匹配度中等'
                                : thisMatch > 39 && thisMatch < 60 ? '匹配度较低'
                                  : thisMatch < 40 ? '匹配度极低' : ''
                          }
                        </span>
                        { <Match matchValue={thisMatch} /> }
                      </div>
                      <p className={styles.advise}>
                        <span>
                          {
                            thisMatch > 79 ? '建议试用'
                              : thisMatch > 59 && thisMatch < 80 ? '考虑试用'
                                : thisMatch > 39 && thisMatch < 60 ? '谨慎选择'
                                  : thisMatch < 40 ? '慎重选择' : ''
                          }
                        </span>
                      </p>
                      <p className={styles.des}>
                        <span>与你匹配度相关的薄弱基因位点：</span>
                        {
                          geneNameList.length < 4 ? ''
                            : !showGene
                              ? <img src={gene1} onClick={this.showGeneName} />
                              : <img src={gene2} onClick={this.showGeneName} />
                        }
                        {
                          geneNameList.length === 0
                            ? <p className={styles.geneName}><label>无</label></p>
                            : <p ref='geneName' className={`${styles.geneName} ${!showGene ? styles.geneName2 : ''}`}>
                              {geneNameList.map(item => (
                                <label key={item}>{item}</label>
                              ))}
                            </p>
                        }
                      </p>
                      <p className={styles.btns}>
                        <span onClick={() => this.recordBtn(1)} className={`${accurateMark === 0 ? styles.yes1 : styles.yes2}`}>
                          <label>喜欢</label>
                        </span>
                        <span onClick={() => this.recordBtn(2)} className={`${notAccurateMark === 0 ? styles.no1 : styles.no2}`}>
                          <label>不喜欢</label>
                        </span>
                      </p>
                    </div>
              }
              {
                `${elementInfo.remark}` === ''
                  ? '' : <div className={styles.infoTitle}>
                    <img src={info2} />
                    <span className={styles.medium}>成分说明</span>
                  </div>
              }
              {
                `${elementInfo.remark}` === '' ? ''
                  : <div className={styles.groupTip}>
                    {
                      showMoreFlag
                        ? <p className={`${!tipsFlag ? styles.maxH : ''}`} ref='thisTips'>{elementInfo.remark}</p>
                        : <p ref='thisTips'>{elementInfo.remark}</p>
                    }
                    {
                      showMoreFlag
                        ? <p className={`${styles.upOrDown} ${tipsFlag ? styles.up : styles.down}`} onClick={() => this.showAllOrOne()}>
                          <span>{tipsFlag ? '显示部分' : '展开全部'}</span>
                        </p>
                        : ''
                    }
                    {
                      showMoreFlag
                        ? !tipsFlag ? <p className={styles.jianbian} /> : ''
                        : ''
                    }
                  </div>
              }
              <div className={styles.infoTitle}>
                <img src={info3} />
                <span className={styles.medium}>含该成分的产品</span>
              </div>
              <div className={styles.groupTabs}>
                <div id='tagBox' className={styles.tabBox}>
                  <div className={`${styles.tagListBox}  ${name ? styles.fexd : ''}`}>
                    <div id='tagList' className={`${styles.tagList}`} >
                      <span className={styles.toRight} />
                      <div className={styles.tag}>
                        {
                          categaryList.map((item, i) => (
                            <span
                              key={i}
                              onClick={() => { this.handleNavTab(item) }}
                              className={thisTabname === item ? styles.active : ''}>{item}
                            </span>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  <div className={styles.results}>
                    <BoxList
                      type={2}
                      thisBoxList={productList}
                      noMatchValue={1}
                      onhandleDetail2={this.onhandleDetail2}
                    />
                  </div>
                </div>
              </div>
              <div />
            </div>
            <Bottom
              isCollect={isCollect}
              collectBtn={this.collectBtn}
              shareBtn={this.shareBtn}
            />
          </div>
        }
      </Page>
    )
  }
}
GoodsDetail.propTypes = {
  history: propTypes.object,
}
export default GoodsDetail
