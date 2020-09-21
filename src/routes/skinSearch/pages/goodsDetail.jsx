import React from 'react'
import propTypes from 'prop-types'
import { API, fun, point, ua } from '@src/common/app'
import axios from 'axios'
import { Page, Bomb } from '@src/components'
import { trackPointSkinToolProduct, trackPointSkinToolPageGoto } from './buried-point'
import wxconfig from '@src/common/utils/wxconfig'
import andall from '@src/common/utils/andall-sdk'
import goBack from '@static/skinBeauty/gotoBack.png'
import info1 from '@static/skinBeauty/info1.png'
import info2 from '@static/skinBeauty/info2.png'
import infoR from '@static/skinBeauty/infoR.png'
import explain from '@static/skinBeauty/explain.png'
import huo from '@static/skinBeauty/huo.png'
import one from '@static/skinBeauty/one.png'
import four from '@static/skinBeauty/four.png'
import seven from '@static/skinBeauty/seven.png'
import wu from '@static/skinBeauty/wu.png'
import goLock from '@static/skinBeauty/goLock.png'
import suo2 from '@static/skinBeauty/suo2.png'
import suo1 from '@static/skinBeauty/suo1.png'
import suo4 from '@static/skinBeauty/suo4.png'
import noData3 from '@static/skinBeauty/noData3.png'
import xiaoyu from '@static/skinBeauty/xiaoyu.png'
import fangtu from '@static/skinBeauty/fangtu.png'

import Match from '../compoment/match.js'
import ShowModal from '../compoment/showModal'
import Bottom from '../compoment/bottom'
import styles from './goods.scss'
import { DetailLoader } from './detailLoader'

const { getParams } = fun

class GoodsDetail extends React.Component {
  state = {
    productInfo:{},
    elementList:[],
    showTips:false,
    thisFenxiFlag:false, // 收起
    thisMatch:getParams().thisMatch,
    isCollect:false,
    accurateMark:0, // 准确
    notAccurateMark:0, // 不准确
    loading:true
  }
  componentDidMount () {
    console.log(document.documentElement.scrollTop)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    document.scrollingElement.scrollTop = 0
    trackPointSkinToolProduct({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      cream_product_id:getParams().id
    })
    setTimeout(() => {
      this.searchProductDetail()
    }, 200)
    this.wxShare()
  }
  // 产品详情
  searchProductDetail=() => {
    let params = {
      productId:getParams().id,
      reportStatus:localStorage.reportStatus,
      linkManId:localStorage.linkManId === 'null' ? null : localStorage.linkManId,
      toolsCode:'BEAUTY',
      noloading:1
    }
    API.searchProductDetail(params).then(res => {
      this.setState({
        productInfo:res.data,
        elementList:res.data.elementList,
        isCollect:res.data.isFavorite,
        accurateMark:res.data.accurateMark,
        notAccurateMark:res.data.notAccurateMark,
        loading:false
      }, () => {
        // alert(this.state.loading)
        document.body.scrollTop = 1
        document.documentElement.scrollTop = 1
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
  showAllOrOne=() => {
    const { thisFenxiFlag } = this.state
    this.setState({
      thisFenxiFlag:!thisFenxiFlag
    })
  }
  goDetail=(id, match) => {
    this.props.history.push(`/skinSearch/groupDetail?id=${id}&thisMatch=${match}`)
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
  // 收藏
  thisCollectBtn=() => {
    trackPointSkinToolPageGoto({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      Btn_name:'product_collect',
      cream_product_id:getParams().id,
      element_id:'',
    })
    let params = {
      favoriteProductId:getParams().id,
      favoriteProductType:'PRODUCT',
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
  // 准确/不准确
  recordBtn=(type) => {
    const { accurateMark, notAccurateMark } = this.state
    let params = {
      accurateMark:type === 1 ? accurateMark === 0 ? 1 : 0 : 0, // 1准确
      notAccurateMark:type === 2 ? notAccurateMark === 0 ? 1 : 0 : 0,
      linkManId:localStorage.linkManId === 'null' ? null : localStorage.linkManId,
      productRelId:getParams().id,
      productType:'PRODUCT',
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
      Btn_name:'product_banner_to_buy',
      cream_product_id:getParams().id,
      element_id:'',
    })
  }
  // 分享
  thisShareBtn=() => {
    // 产品分享埋点
    trackPointSkinToolPageGoto({
      os_version: navigator.userAgent,
      user_state:+localStorage.reportStatus === 3 ? 2 : localStorage.reportStatus === 'null' ? 0 : 1,
      Btn_name:'product_share',
      cream_product_id:getParams().id,
      element_id:'',
    })
    const { productInfo, thisMatch } = this.state
    this.props.history.push(`/skinSearch/sharePage?thisMatch=${thisMatch}&shareId=${getParams().id}`)
    localStorage.setItem('shareName', productInfo.name.length > 11 ? productInfo.name.substring(0, 11) + '...' : productInfo.name)
    localStorage.setItem('shareImg', productInfo.ourImage)
    localStorage.setItem('shareType', 1)
  }
  render () {
    const { productInfo, elementList, thisFenxiFlag, showTips, thisMatch, isCollect, accurateMark, notAccurateMark } = this.state
    return (
      <Page title='肌秘美肤小工具'>
        {this.state.loading ? <DetailLoader />
          : <div className={`${styles.details} ${showTips && styles.noscroll}`}>
            <div className={styles.goods}>
              <img src={productInfo.ourImage === '' || productInfo.ourImage === null ? noData3 : productInfo.ourImage}
                className={`${productInfo.ourImage === '' || productInfo.ourImage === null ? styles.noOurImage : ''}`} />
              {
                ua.isAndall() ? '' : <img src={goBack} onClick={this.goBack} className={styles.back} />
              }
              <span>
                {
                  // +localStorage.reportStatus !== 3 || thisMatch === 'null' ? '匹配度 ？' : `匹配度${thisMatch}%`
                  +localStorage.reportStatus !== 3 ? '匹配度 ？'
                    : thisMatch === 'null' ? `匹配度<30%`
                      : `匹配度${thisMatch}%`
                }
              </span>
            </div>
            <div className={styles.goodsInfo}>
              <p className={styles.medium}>{productInfo.name}</p>
              {
                productInfo.price === '' || productInfo.price === null || productInfo.price === 0
                  ? <p className={styles.span2}>暂无报价</p>
                  : <p>
                    <span className={styles.span1}>
                      <label>¥</label>
                      <span>
                        {productInfo.price === '' || productInfo.price === null || productInfo.price === 0 ? '--' : productInfo.price}
                      </span>
                    </span>
                    <span className={styles.span2}>{productInfo.specification}</span>
                  </p>
              }

              <p>
                {productInfo.category !== null ? <span className={styles.span3}>{productInfo.category}</span> : ''}
                {productInfo.mainfunc !== null ? <span className={styles.span3}>{productInfo.mainfunc}</span> : ''}
                {productInfo.placeOfOrigin !== null ? <span className={styles.span3}>{productInfo.placeOfOrigin}</span> : ''}
              </p>
              <div className={styles.infoTitle}>
                <img src={info1} />
                <span className={styles.medium}>匹配度分析</span>
                <img src={infoR} onClick={this.showTips} />
              </div>
              {
                localStorage.reportStatus === 'null'
                  ? <img src={goLock} className={styles.goLock} onClick={this.goToLock} />
                  : ''
              }
              {
                +localStorage.reportStatus === 3 && thisMatch === 'null'
                  ? <div className={styles.infoDes}>
                    <div className={styles.circle}>
                      {/* <span style={{ position:'absolute', fontSize:'28px', width:'28px', top:'32px', left:'21px', color:'rgba(68, 8, 23, 1)', 'fontFamily':'PingFangSC-Medium' }}>&lt;</span> */}
                      <img src={xiaoyu} className={styles.matchXiaoyu} />
                      <span className={styles.matchValue2}>30</span>
                      <span className={styles.matchB}>%</span>
                      <span className={styles.matchResults}>匹配度极低</span>
                      <Match matchValue={30} />
                    </div>
                    <p className={styles.advise}>
                      <span>
                        慎重选择
                      </span>
                    </p>
                    <div className={styles.des}>
                      <p><span>天呐，险些踩雷！它的成分</span><span>和你的匹配度较低，赶快拔草吧！</span></p>
                    </div>
                    <p className={styles.btns}>
                      <span onClick={() => this.recordBtn(1)} className={`${accurateMark === 0 ? styles.yes1 : styles.yes2}`}>
                        <label>准确</label>
                      </span>
                      <span onClick={() => this.recordBtn(2)} className={`${notAccurateMark === 0 ? styles.no1 : styles.no2}`}>
                        <label>不准确</label>
                      </span>
                    </p>
                  </div>
                  //  <div className={styles.waiting}>
                  //   <img src={suo2} />
                  //   <p>匹配度解锁中</p>
                  // </div>
                  : +localStorage.reportStatus === 3 && thisMatch !== 'null'
                    ? <div className={styles.infoDes}>
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
                        <Match matchValue={thisMatch} />
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
                      <div className={styles.des}>
                        {
                          thisMatch > 79
                            ? <p><span>太棒啦！它的成分非常适合你，</span><span>是仙女养成必备神器的不二之选！</span></p>
                            : thisMatch > 59 && thisMatch < 80
                              ? <p><span>不错呦！它的成分与你挺配，继续</span><span>搜索，专属你的美颜神器在等你！</span></p>
                              : thisMatch > 39 && thisMatch < 60
                                ? <p><span>它的成分和你的匹配度一般，</span><span>相信我，你值得更好的。</span></p>
                                : thisMatch < 40
                                  ? <p><span>天呐，险些踩雷！它的成分</span><span>和你的匹配度较低，赶快拔草吧！</span></p> : ''
                        }
                      </div>
                      <p className={styles.btns}>
                        <span onClick={() => this.recordBtn(1)} className={`${accurateMark === 0 ? styles.yes1 : styles.yes2}`}>
                          <label>准确</label>
                        </span>
                        <span onClick={() => this.recordBtn(2)} className={`${notAccurateMark === 0 ? styles.no1 : styles.no2}`}>
                          <label>不准确</label>
                        </span>
                      </p>
                    </div>
                    : localStorage.reportStatus === 'null'
                      ? <img src={suo2} />
                      : <img src={suo4} />
              }
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
            <div className={styles.analysis}>
              <div className={styles.infoTitle} style={{ padding:'0 20px 16px', background:'#FFF0EE' }}>
                <img src={info2} />
                <span className={styles.medium}>成分分析</span>
                <label>（成分正在补录中）</label>
              </div>
              <p className={styles.title}>
                <span className={styles.column100}>成分</span>
                <span className={styles.column}>安全等级</span>
                <span className={styles.column123}>功能</span>
                <span className={styles.column}>活性成分</span>
                <span className={styles.column}>匹配度</span>
              </p>
              <div className={styles.analysisList}>
                {
                  thisFenxiFlag
                    ? elementList.map((item, i) => (
                      <p key={i} className={styles.content}>
                        <span className={styles.column100} onClick={() => this.goDetail(item.creamElementId, item.matching)}>
                          <span className={styles.line}>
                            {item.elementName}
                          </span>
                        </span>
                        <span className={`${styles.column} ${styles.column2}`}>
                          <label>
                            {
                              item.securityrisks === '' || item.securityrisks === null
                                ? <img src={wu} />
                                : item.securityrisks.indexOf('-') === -1
                                  ? item.securityrisks < 4
                                    ? <img src={one} />
                                    : item.securityrisks >= 4 && item.securityrisks < 7
                                      ? <img src={four} />
                                      : item.securityrisks >= 7 && item.securityrisks <= 10
                                        ? <img src={seven} />
                                        : ''
                                  : (Number(item.securityrisks.split('-')[0]) + Number(item.securityrisks.split('-')[1])) / 2 < 4
                                    ? <img src={one} />
                                    : (Number(item.securityrisks.split('-')[0]) + Number(item.securityrisks.split('-')[1])) / 2 >= 4 && (Number(item.securityrisks.split('-')[0]) + Number(item.securityrisks.split('-')[1])) / 2 < 7
                                      ? <img src={four} />
                                      : (Number(item.securityrisks.split('-')[0]) + Number(item.securityrisks.split('-')[1])) / 2 >= 7 && (Number(item.securityrisks.split('-')[0]) + Number(item.securityrisks.split('-')[1])) / 2 <= 10
                                        ? <img src={seven} /> : ''
                            }
                          </label>
                        </span>
                        <span className={`${styles.column123}`}>
                          <span className={styles.line}>
                            {item.newElementType}
                          </span>
                        </span>
                        <span className={`${styles.column} ${styles.column4}`}>
                          { item.activeingred === '1' ? <img src={huo} /> : '' }
                        </span>
                        <span className={`${styles.column} ${styles.column5}`} >
                          {
                            +localStorage.reportStatus !== 3
                              ? <img src={suo1} />
                              : item.matching === null ? '--' : `${item.matching}%`
                          }
                        </span>
                      </p>
                    ))
                    : elementList.slice(0, 5).map((item, index) => (
                      <p key={index} className={`${styles.content} ${styles.content2}`}>
                        <span className={styles.column100} onClick={() => this.goDetail(item.creamElementId, item.matching)}>
                          <span className={styles.line}>
                            {item.elementName}
                          </span>
                        </span>
                        <span className={`${styles.column} ${styles.column2}`}>
                          <label>
                            {
                              item.securityrisks === '' || item.securityrisks === null
                                ? <img src={wu} />
                                : item.securityrisks.indexOf('-') === -1
                                  ? item.securityrisks < 4
                                    ? <img src={one} />
                                    : item.securityrisks >= 4 && item.securityrisks < 7
                                      ? <img src={four} />
                                      : item.securityrisks >= 7 && item.securityrisks <= 10
                                        ? <img src={seven} />
                                        : ''
                                  : (Number(item.securityrisks.split('-')[0]) + Number(item.securityrisks.split('-')[1])) / 2 < 4
                                    ? <img src={one} />
                                    : (Number(item.securityrisks.split('-')[0]) + Number(item.securityrisks.split('-')[1])) / 2 >= 4 && (Number(item.securityrisks.split('-')[0]) + Number(item.securityrisks.split('-')[1])) / 2 < 7
                                      ? <img src={four} />
                                      : (Number(item.securityrisks.split('-')[0]) + Number(item.securityrisks.split('-')[1])) / 2 >= 7 && (Number(item.securityrisks.split('-')[0]) + Number(item.securityrisks.split('-')[1])) / 2 <= 10
                                        ? <img src={seven} /> : ''
                            }
                          </label>
                        </span>
                        <span className={`${styles.column123}`}>
                          <span className={styles.line}>
                            {item.newElementType}
                          </span>
                        </span>
                        <span className={`${styles.column} ${styles.column4}`}>
                          { item.activeingred === '1' ? <img src={huo} /> : '' }
                        </span>
                        <span className={`${styles.column} ${styles.column5}`}>
                          {
                            +localStorage.reportStatus !== 3
                              ? <img src={suo1} />
                              : item.matching === null ? '--' : `${item.matching}%`
                          }
                        </span>
                      </p>
                    ))
                }
                {
                  !thisFenxiFlag && elementList.length > 5
                    ? <p className={styles.jianbian} />
                    : ''
                }
                {
                  elementList.length > 5
                    ? <p className={`${styles.upOrDown} ${thisFenxiFlag ? styles.up : styles.down}`} onClick={() => this.showAllOrOne()}>
                      <span>{thisFenxiFlag ? '显示部分' : '展开全部'}</span>
                    </p>
                    : null
                }
              </div>
            </div>
            <div className={styles.explain}>
              <div className={styles.des}>
                <img src={explain} className={styles.head} />
                <div className={styles.info}>
                  <p className={`${styles.title}`}>产品成分顺序</p>
                  <p className={styles.mt8}>
                    <span className={`${styles.title} ${styles.medium}`}>成分表根据单一成分含量从多到少排序。</span>
                    <span className={styles.text}>含量低于1%的成分可以随意排列。产品在药监局备案提供的成分表，原则上应该和产品标签一致，但由于厂家问题也有例外情况。</span>
                  </p>
                  <p className={`${styles.title} ${styles.mt20}`}>安全风险</p>
                  <p className={styles.mt8}>
                    <span className={`${styles.title}`}>安全风险打分从0-10，</span>
                    <span className={styles.text}>评分结合EWG美国环境工作组以及成分的安全性等多种因素，
                    用于表示长期累积使用该成分对人体皮肤和身体健康存在的风险。数字越高代表风险越大。
                    安全风险高并不意味着成分不好，很多常见的活性成分比如水杨酸、羟基乙酸、视黄醇等具有较强功效的活性成分，一些功效强的活性成分，不一定都是最安全温和的。</span>
                  </p>
                  <div className={styles.levels}>
                    <p>绿色（0-3）表示安全</p>
                    <p>橙色（4-6）表示中等</p>
                    <p>红色（7-10）表示风险</p>
                    <p>由于该成分较特殊，暂无风险相关信息。</p>
                  </div>
                  <p className={`${styles.title} ${styles.mt20}`}>活性成分</p>
                  <p className={styles.huoxing}>表示产品中含有的能够帮助改善皮肤状态的功效成分</p>
                  <p className={`${styles.title} ${styles.mt20}`}>匹配度</p>
                  <p className={styles.mt8}>
                    <span className={`${styles.title}`}>匹配度等级从0%-100%，</span>
                    <span className={styles.text}>表示该成分/产品和您的基因检测结果以及目前肌肤状态的匹配程度。</span>
                  </p>
                  <p className={styles.match}>
                    <span>80%～100%</span><span>：匹配度较高，建议试用</span>
                  </p>
                  <p className={styles.match}>
                    <span>60%～79%</span><span>：匹配度中等，考虑试用</span>
                  </p>
                  <p className={styles.match}>
                    <span>40%～59%</span><span>：匹配度较低，谨慎选择</span>
                  </p>
                  <p className={styles.match}>
                    <span>0%～39%</span><span>：匹配度极低，慎重选择</span>
                  </p>
                </div>
              </div>
            </div>
            <Bottom
              isCollect={isCollect}
              collectBtn={this.thisCollectBtn}
              shareBtn={this.thisShareBtn}
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
