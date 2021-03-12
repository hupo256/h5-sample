import React from 'react'
import propTypes from 'prop-types'
import { Icon } from 'antd-mobile'
import { fun, ua, API } from '@src/common/app'
import EchartsCom from '../../components/echart'
import GrowthProposals from './../../components/growthProposals'
import styles from '../index.scss'
import NoDataBomb from './../../components/noDataBomb'
import ZMTNUTR0001 from '@static/height/ZMTNUTR0001-1.png'
import ZMTNUTR0002 from '@static/height/ZMTNUTR0002-1.png'
import ZMTNUTR0004 from '@static/height/ZMTNUTR0004-1.png'
import ZMTNUTR0010 from '@static/height/ZMTNUTR0010-1.png'
import ZMTNUTR0018 from '@static/height/ZMTNUTR0018-1.png'
import iconMoreRecord from '@static/height/icon_more_record.png'
import close2 from '@static/height/icon_close2.png'
import {
  trackPointToolHeightAssessmentPageView,
  trackPointToolHeightOutPopup,
  trackPointToolHeightAssessmentHeight,
  trackPointToolHeightAssessmentNutrition,
  trackPointToolHeightAssessmentSport,
  trackPointToolHeightAssessmentSleep,
  trackPointToolHeightAssessmentConstitution,
  trackPointToolHeightPageBtnClick
} from './../../buried-point'
const { getSession, setSession } = fun
const { isAndall, isIos } = ua
class Curve extends React.Component {
  state = {
    tabsList: ['身高曲线', '营养', '运动', '睡眠', '体质'],
    activedTab: 0,
    title: '身高成长曲线',
    labelFlag: 2,
    bomb: {
      dataDetailBomb: false,
      noDataBomb: false
    },
    qnaireUrl: '', // 问卷地址
    start: undefined,
    end: undefined,
    echartsData: {}, // 图表类型加数据
    curveDatas: {}, // 接口返回的数据
    code: '',
    desc: '当前身高与宝宝对应年龄段的基因身高和同龄宝宝的平均身高进行比对。',
    bombNum: 0,
    mounthList: [
      {
        name: '0-12月',
        start: 0,
        end: 12
      }, {
        name: '1-2岁',
        start: 12,
        end: 24
      }, {
        name: '2-3岁',
        start: 24,
        end: 36
      }, {
        name: '3-4岁',
        start: 36,
        end: 48
      }, {
        name: '4-5岁',
        start: 48,
        end: 60
      }, {
        name: '5-6岁',
        start: 60,
        end: 72
      }, {
        name: '6-7岁',
        start: 72,
        end: 84
      }, {
        name: '7-8岁',
        start: 84,
        end: 96
      }, {
        name: '8-9岁',
        start: 96,
        end: 108
      }, {
        name: '9-10岁',
        start: 108,
        end: 120
      }, {
        name: '10-11岁',
        start: 120,
        end: 132
      }, {
        name: '11-12岁',
        start: 132,
        end: 144
      }, {
        name: '12-13岁',
        start: 144,
        end: 156
      }, {
        name: '13-14岁',
        start: 156,
        end: 168
      }, {
        name: '14-15岁',
        start: 168,
        end: 180
      }, {
        name: '15-16岁',
        start: 180,
        end: 192
      }, {
        name: '16-17岁',
        start: 192,
        end: 204
      }, {
        name: '17-18岁',
        start: 204,
        end: 216
      }]
  }
  componentDidMount() {
    const { activedTab } = this.props
    const currentLinkManInfo = getSession('currentLinkManInfo')
    this.setState({
      activedTab
    }, () => {
      if (activedTab === 0) {
        this.handleQueryEchartData()
      } else if (activedTab === 1 || activedTab === 2 || activedTab === 3 || activedTab === 4) {
        this.handleChangeTab(activedTab)
      }
    })
    trackPointToolHeightAssessmentPageView({
      sample_linkmanid: currentLinkManInfo.linkManId
    })
    this.handleQueryQnaireInfo(activedTab)
  }
  // 获取问卷信息
  handleQueryQnaireInfo = (activedTab) => {
    if (!getSession('hasReport')) return
    let dimensionCode = 'Nutrition'
    if (activedTab === 2) {
      dimensionCode = 'Sport'
    } else if (activedTab === 3) {
      dimensionCode = 'Sleep'
    }
    const currentLinkManInfo = getSession('currentLinkManInfo')
    const params = {
      linkmanId: currentLinkManInfo.linkManId,
      toolsCode: 'HEIGHT',
      dimensionCode
    }
    API.getQnaireInfo(params).then(({ data }) => {
      const { qnaireUrl } = data
      this.setState({
        qnaireUrl
      })
    })
  }
  // 顶部Tab切换
  handleChangeTab = (index) => {
    const currentLinkManInfo = getSession('currentLinkManInfo')
    const _linkmanId = currentLinkManInfo.linkManId
    let title = ''
    let code = ''
    let desc = ''
    let bombNum = 0
    if (index === 0) {
      title = '身高成长曲线'
      desc = '当前身高与宝宝对应年龄段的基因身高和同龄宝宝的平均身高进行比对。'
      trackPointToolHeightAssessmentHeight({
        sample_linkmanid: _linkmanId
      })
    } else if (index === 1) {
      bombNum = 1
      title = '营养与身高'
      code = 'Nutrition'
      desc = '通过问卷评测，对宝宝的营养状态进行评估，得出对应的评级，通过评级的变化，了解宝宝在营养方面的改善情况。'
      trackPointToolHeightAssessmentNutrition({
        sample_linkmanid: _linkmanId
      })
    } else if (index === 2) {
      bombNum = 2
      title = '运动与身高'
      code = 'Sport'
      desc = '通过问卷评测，对宝宝的运动状态进行评估，得出对应的评级，通过评级的变化，了解宝宝在运动方面的改善情况。'
      trackPointToolHeightAssessmentSport({
        sample_linkmanid: _linkmanId
      })
    } else if (index === 3) {
      bombNum = 3
      title = '睡眠与身高'
      code = 'Sleep'
      desc = '通过问卷评测，对宝宝的睡眠状态进行评估，得出对应的评级，通过评级的变化，了解宝宝在睡眠方面的改善情况。'
      trackPointToolHeightAssessmentSleep({
        sample_linkmanid: _linkmanId
      })
    } else if (index === 4) {
      title = '体质与身高'
      desc = '基因检测中与体质相关的检测评估，会反应出宝宝的低骨密度倾向、积极情绪倾向、肥胖可能性、长高可能性、受挫恢复能力和脂肪代谢能力，这6项的先天水平。'
      trackPointToolHeightAssessmentConstitution({
        sample_linkmanid: _linkmanId
      })
    }
    if (index === 4 && !getSession('hasReport')) {
      const { bomb } = this.state
      this.setState({
        bombNum,
        bomb: {
          ...bomb,
          noDataBomb: true
        }
      })
      return
    }
    if (index === 1) {
      const { nutritionInvalidFlag, nutritionEvaluationFlag } = getSession('flags')
      if (!getSession('hasReport') || !nutritionEvaluationFlag || nutritionInvalidFlag) {
        const { bomb } = this.state
        if (nutritionInvalidFlag) {
          trackPointToolHeightOutPopup({
            sample_linkmanid: _linkmanId
          })
        }
        this.setState({
          bombNum,
          bomb: {
            ...bomb,
            noDataBomb: true
          },
          code
        })
        this.handleQueryQnaireInfo(index)
        return
      }
    }
    if (index === 2) {
      const { sportInvalidFlag, sportEvaluationFlag } = getSession('flags')
      if (!getSession('hasReport') || !sportEvaluationFlag || sportInvalidFlag) {
        const { bomb } = this.state
        if (getSession('sportInvalidFlag')) {
          trackPointToolHeightOutPopup({
            sample_linkmanid: _linkmanId
          })
        }
        this.setState({
          bombNum,
          bomb: {
            ...bomb,
            noDataBomb: true
          },
          code
        })
        this.handleQueryQnaireInfo(index)
        return
      }
    }
    if (index === 3) {
      const { sleepInvalidFlag, sleepEvaluationFlag } = getSession('flags')
      if (!getSession('hasReport') || !sleepEvaluationFlag || sleepInvalidFlag) {
        const { bomb } = this.state
        if (getSession('sleepInvalidFlag')) {
          trackPointToolHeightOutPopup({
            sample_linkmanid: _linkmanId
          })
        }
        this.setState({
          bombNum,
          bomb: {
            ...bomb,
            noDataBomb: true
          },
          code
        })
        this.handleQueryQnaireInfo(index)
        return
      }
    }
    setSession('activedTab', index)
    this.setState({
      activedTab: index,
      title,
      code,
      desc,
      bombNum
    }, () => {
      if (index === 0) {
        this.handleQueryEchartData()
      } else if (index === 1 || index === 2 || index === 3) {
        this.handleQueryDate(code)
      } else if (index === 4) {
        this.handleQueryPhysiqueData()
      }
    })
  }
  // 获取营养，运动，睡眠的数据
  handleQueryDate = (dimensionCode) => {
    const currentLinkManInfo = getSession('currentLinkManInfo')
    const { start, end } = this.state
    const params = {
      linkmanId: currentLinkManInfo.linkManId,
      start,
      end,
      dimensionCode
    }
    API.getDimensionCheckInfo(params).then(({ data }) => {
      const { yaxis, xaxis, labelFlag } = data
      this.setState({
        echartsData: {
          yData: yaxis,
          xData: xaxis,
          type: dimensionCode
        },
        labelFlag,
        curveDatas: data
      }, () => {
        this.handleSetMouthPosition(labelFlag)
      })
    })
  }
  // 显示成长曲线弹框
  handleShowDetailBomb = (value) => {
    if (value) {
      let version = 'wechat_h5'
      if (isAndall()) {
        if (isIos()) {
          version = 'app_ios'
        } else {
          version = 'app_android'
        }
      }
      trackPointToolHeightPageBtnClick({
        Btn_name: 'graph_explain',
        os_version: version
      })
    }
    const { bomb } = this.state
    this.setState({
      bomb: {
        ...bomb,
        dataDetailBomb: value
      }
    })
  }
  // 获取折线图数据
  handleQueryEchartData = () => {
    const currentLinkManInfo = getSession('currentLinkManInfo')
    const { start, end } = this.state
    const params = {
      linkmanId: currentLinkManInfo.linkManId,
      start,
      end
    }
    API.selectHeightRecordsWithoutOrPresentation(params).then(({ data }) => {
      const { baseDatayAxis, geneDatayAxis, inputRecordyAxis, xaxis, labelFlag } = data
      this.setState({
        echartsData: {
          averageData: baseDatayAxis,
          geneData: geneDatayAxis,
          inputData: inputRecordyAxis,
          xData: xaxis,
          type: 'height'
        },
        labelFlag,
        curveDatas: data
      }, () => {
        this.handleSetMouthPosition(labelFlag)
      })
    })
  }
  // 月份初始化时，滚到相应位置
  handleSetMouthPosition = (labelFlag) => {
    if (labelFlag <= 4) return
    let scrollWrap = document.getElementById('mouthDiv')
    scrollWrap.scrollLeft = (labelFlag - 2) * 82
  }
  // 切换月份
  handleChangeMouth = (item, index) => {
    const { labelFlag, activedTab, code } = this.state
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: 'year_tab',
      os_version: version
    })
    if (labelFlag === index) return
    this.setState({
      start: item.start,
      end: item.end
    }, () => {
      if (activedTab === 0) {
        this.handleQueryEchartData()
      } else if (activedTab === 1 || activedTab === 2 || activedTab === 3) {
        this.handleQueryDate(code)
      } else if (activedTab === 5) {
        this.handleQueryPhysiqueData()
      }
    })
  }
  // 获取雷达图
  handleQueryPhysiqueData =() => {
    const currentLinkManInfo = getSession('currentLinkManInfo')
    const params = {
      linkmanId: currentLinkManInfo.linkManId
    }
    API.getPhysiqueData(params).then(({ data }) => {
      const { categoryRespList } = data
      let newArr = []
      categoryRespList.map((item, index) => {
        if (item.score === 0) {
          item.score = 1
        } else if (item.score === 50) {
          item.score = 3
        } else if (item.score === 100) {
          item.score = 5
        }
        newArr.push(item)
      })
      this.setState({
        echartsData: {
          categoryRespList,
          type: 'tizhi'
        },
        curveDatas: data
      })
    })
  }
  // 再次测评
  handleGoToTest = (value) => {
    const { qnaireUrl, bombNum } = this.state
    let version = 'wechat_h5'
    let name = ''
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    if (bombNum === 0) {
      name = 'assessment_height_to_addrecord'
    } else if (bombNum === 1) {
      name = 'assessment_nutrition_retest'
    } else if (bombNum === 2) {
      name = 'assessment_sport_retest'
    } else if (bombNum === 3) {
      name = 'assessment_sleep_retest'
    }
    if (!value) {
      name = 'assessment_out30_popup_Btn'
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: name,
      os_version: version
    })
    if (bombNum === 0) {
      this.props.history.push('/height/add-record')
    } else {
      window.location.href = qnaireUrl
    }
  }
  // 查看历史记录
  handleMoreRecords = () => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: 'history_record',
      os_version: version
    })
    this.props.history.push('/height/record-list')
  }
  // 根据code返回对应的图片
  handleCodeToImg = (code) => {
    const imagesList = [{
      name: 'ZMTNUTR0001-1-DOCC',
      src: ZMTNUTR0001
    }, {
      name: 'ZMTNUTR0002-1-DOCB',
      src: ZMTNUTR0002
    }, {
      name: 'ZMTNUTR0004-1-DOCB',
      src: ZMTNUTR0004
    }, {
      name: 'ZMTNUTR0010-1-DOCD',
      src: ZMTNUTR0010
    }, {
      name: 'ZMTNUTR0018-1-DOCC',
      src: ZMTNUTR0018
    }]
    if (!code) return
    for (let i = 0; i < imagesList.length; i++) {
      if (imagesList[i].name === code) {
        return imagesList[i].src
      }
    }
  }
  handleClose = () => {
    const { bomb } = this.state
    this.setState({
      bomb: {
        ...bomb,
        noDataBomb: false
      }
    })
  }
  // 购买基因报告
  handleBuy = (value) => {
    const { buyFun } = this.props
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    let name = 'assessment_height_to_buy'
    if (!value) {
      name = 'assessment_out30_popup_Btn'
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: name,
      os_version: version
    })
    buyFun()
  }
  render () {
    const { tabsList, activedTab, title, mounthList, labelFlag, bomb, echartsData, curveDatas, desc, code } = this.state
    const { checkDate, expertAnalysisList } = curveDatas || {}
    const productDetail1 = this.props.productDetail1 || getSession('productDetail1')
    return (
      <div className={styles.curveCont}>
        <ul className={styles.tabsList}>
          {
            tabsList.map((item, index) => {
              return <li
                className={activedTab === index ? styles.actived : ''}
                key={index}
                onClick={() => this.handleChangeTab(index)}
              >
                {item}
              </li>
            })
          }
        </ul>
        <div className={styles.curveDetail}>
          <div className={styles.curveDetail}>
            <p className={styles.curveTitle}>
              {
                activedTab === 0
                  ? <img onClick={this.handleMoreRecords} className={styles.moreRecords} src={iconMoreRecord} alt='' />
                  : ''
              }
            </p>
            {
              activedTab !== 4
                ? <p className={styles.curveDate}>
                  {
                    activedTab === 0
                      ? '测量日期：'
                      : '测评日期：'
                  }
                  {checkDate}
                </p>
                : ''
            }
            <p className={styles.curveDesc}>{desc}</p>
            {
              activedTab === 4
                ? <p className={styles.curveHeightKong} />
                : ''
            }
            {
              activedTab !== 4
                ? <div className={styles.mouthCont}>
                  <div className={styles.overHidden} id='mouthDiv'>
                    <div className={styles.mouthDiv}>
                      {
                        mounthList.map((item, index) => {
                          return <span
                            className={`${styles.mouthItem} ${labelFlag === index + 1 ? styles.actived : ''}`}
                            key={index}
                            onClick={() => this.handleChangeMouth(item, index + 1)}
                          >{item.name}</span>
                        })
                      }
                    </div>
                  </div>
                </div>
                : ''
            }
            {
              activedTab === 0
                ? <div className={styles.heightCont}>
                  <span><i className={`${styles.circle} ${styles.white}`} />测量身高</span>
                  <span><i className={`${styles.circle} ${styles.yellow}`} />基因身高</span>
                  <span><i className={`${styles.circle} ${styles.blue}`} />平均身高</span>
                </div>
                : ''
            }
            {
              activedTab === 0
                ? <p className={styles.heightDesc}>身高（CM）</p>
                : ''
            }
            {
              activedTab !== 0 && activedTab !== 4
                ? <p className={styles.heightDesc}>{title.substring(0, 2)}评级</p>
                : ''
            }
            <EchartsCom echartsData={echartsData} />
            {
              activedTab === 0
                ? <p className={styles.bombTitle} onClick={() => this.handleShowDetailBomb(true)}>
                  如何查看身高曲线
                  <Icon className={styles.downIcon} type='right' size='xs' />
                </p>
                : ''
            }
          </div>
        </div>
        {
          !getSession('hasReport')
            ? <div className={styles.buyCont}>
              <div className={styles.leftCont}>
                <img src={productDetail1.productDetail && productDetail1.productDetail.headPicUrl} alt='' />
              </div>
              <div className={styles.rightCont}>
                <p className={styles.buyTitle}>{productDetail1.productName}</p>
                <p className={styles.buyDesc}>4大类17项身高相关基因评估</p>
                <span onClick={() => this.handleBuy(1)} className={styles.buyBtn}>立即购买</span>
              </div>
            </div>
            : <div className={styles.groupDetail}>
              {
                activedTab === 1 || activedTab === 2 || activedTab === 3
                  ? <GrowthProposals growthObj={{
                    title: `30天${title.substring(0, 2)}建议`,
                    values: expertAnalysisList,
                    hasMask: false,
                    isCurve: true
                  }} />
                  : ''
              }
              {
                activedTab === 4
                  ? <GrowthProposals growthObj={{
                    title: `基因中的体质评估`,
                    values: expertAnalysisList,
                    hasMask: false,
                    isCurve: true
                  }} />
                  : ''
              }
              {
                activedTab !== 4
                  ? <span onClick={() => this.handleGoToTest(1)} className={styles.groupBtn}>
                    {activedTab === 0 ? '再次测量' : '再次测评' }
                  </span>
                  : ''
              }
            </div>
        }
        {
          bomb.dataDetailBomb
            ? <div className={styles.bombCont}>
              <div className={styles.mask} />
              <div className={styles.detailContBomb}>
                <p className={styles.iconClose} onClick={() => this.handleShowDetailBomb(false)}>
                  <img src={close2} />
                </p>
                <p className={styles.title}>如何查看身高曲线</p>
                <p className={styles.desc}>安我基因通过三个维度为家长们提供孩子专属的身高成长曲线。</p>
                <ul>
                  <li>
                    <i className={styles.circle} />
                    <p>测量身高曲线：孩子实际测量的身高。</p>
                  </li>
                  <li>
                    <i className={styles.circle} />
                    <p>基因身高曲线：通过大数据算法预估出的基因身高。</p>
                  </li>
                  <li>
                    <i className={styles.circle} />
                    <p>平均身高曲线：参照《中国0~18岁儿童生长参照标准》中的平均身高。</p>
                  </li>
                </ul>
                <p className={styles.desc1}>通过三条曲线的对比，您可以直观的看出孩子的身高发育水平现状与预测的未来趋势。当孩子的测量身高低于人群平均身高与基因身高时，建议您多多关注孩子的生活状态，确保健康的生长发育环境。</p>
              </div>
            </div>
            : ''
        }
        {
          bomb.noDataBomb
            ? <NoDataBomb
              closeFn={this.handleClose}
              buyFun={this.handleBuy}
              goToTest={this.handleGoToTest}
              hasReport={getSession('hasReport')}
              evaluationFlag={getSession('evaluationFlag')}
              invalidFlag={getSession('flags')}
              code={code}
            />
            : ''
        }
      </div>
    )
  }
}
Curve.propTypes = {
  history: propTypes.object,
  activedTab: propTypes.number,
  productDetail1: propTypes.object,
  buyFun: propTypes.func,
}
export default Curve
