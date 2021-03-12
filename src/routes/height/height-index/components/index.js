import React from 'react'
import propTypes from 'prop-types'
import andall from '@src/common/utils/andall-sdk'
import wx from 'weixin-js-sdk'
import { fun, ua } from '@src/common/app'
import styles from '../index.scss'
import ChooceLinkMan from './../../components/chooceLinkMan'
import GoodsList from './../../components/goodsList'
import ArticleList from './../../components/articleList'
import Appointment from './../../components/appointment'
import GrowthProposals from './../../components/growthProposals'
import Institute from './../../components/institute'
import API from '@src/common/api/index'
import land1 from '@static/height/height_land_1.jpg'
import land2 from '@static/height/height_land_2.jpg'
import land3 from '@static/height/height_land_3.jpg'
import land4 from '@static/height/height_land_4.jpg'
import land5 from '@static/height/height_land_5.jpg'
import land6 from '@static/height/height_land_6.jpg'
import land7 from '@static/height/height_land_7.jpg'
import land8 from '@static/height/height_land_8.jpg'
import iconHeight1 from '@static/height/icon_height_1.png'
import iconHeight2 from '@static/height/icon_height_2.png'
import iconHeight3 from '@static/height/icon_height_3.png'
import iconHeight4 from '@static/height/icon_height_4.png'
import iconHeight5 from '@static/height/icon_height_5.png'
import iconHeight6 from '@static/height/icon_height_6.png'
import iconHeight7 from '@static/height/icon_height_7.png'
import iconTree from '@static/height/icon_tree.png'
import geneSmile1 from '@static/height/gene_smile_1.png'
import indexBg1 from '@static/height/index_bg_3.png'
import boy from '@static/height/icon_boy.png'
import girl from '@static/height/icon_girl.png'
import iconMark1 from '@static/height/icon_mark_1.png'
import iconMark2 from '@static/height/icon_mark_2.png'
import thr from '@static/height/icon_thr.png'
import heightRight from '@static/height/icon_right_1.png'
import heightRight1 from '@static/height/icon_right_2.png'
import edit3 from '@static/height/icon_edit_3.png'
import {
  trackPointToolHeightHomePageView,
  trackPointToolHeightPageBtnClick
} from './../../buried-point'
const { getSession, setSession, getParams, returnNumByDay } = fun
const { isAndall, isIos } = ua
class Index extends React.Component {
  state = {
    currentLinkManInfo: {}, // 当前检测人的信息
    linkManListInfos: [], // 检测人（宝宝，有报告）列表
    goodsList: [], // 商品列表
    articleList: [], // 文章列表
    pageInfo: {}, // 首页详情
    bomb: {
      choiceLinkmanBomb: false
    },
    qnaireUrl: '', // 问卷链接
  }
  componentDidMount() {
    if (isAndall() && !localStorage.getItem('token')) {
      andall.invoke('token', {}, function (res) {
        localStorage.setItem('token', res.result.token)
      })
    }
    if (!isAndall()) {
      this.handleIsNewUser()
      wx.miniProgram.getEnv(res => {
        if (res.miniprogram) {
          this.handleQueryLinkMans()
        } else {
          this.handleIsNewUser()
        }
      })
    } else {
      this.handleQueryLinkMans()
    }
  }
  // 如果是新用户，则去注册
  handleIsNewUser = () => {
    API.myInfo({ noloading: 1 }).then(res => {
      const { data } = res
      if (data.checkMobileFlag === 2) {
        this.handleQueryLinkMans()
      } else {
        const { origin } = location
        window.location.href = `${origin}/mkt/login/mobileLogin?url=${pathname}${search}`
      }
    })
  }
  // 获取检测人信息
  handleQueryLinkMans = () => {
    const currentLinkManInfo = getSession('currentLinkManInfo')
    let params = { hasReport: true }
    if (currentLinkManInfo && currentLinkManInfo.linkManId) {
      params = {
        ...params,
        linkManId: currentLinkManInfo.linkManId
      }
    }
    const _linkManId = getParams().linkManId
    if (_linkManId) {
      params = {
        ...params,
        linkManId: +_linkManId
      }
    }
    trackPointToolHeightHomePageView({
      sample_linkmanid: (currentLinkManInfo && currentLinkManInfo.linkManId) || ''
    })
    API.getHeightHomeInfo(params).then(({ data }) => {
      const { currentLinkManInfo, linkManListInfos } = data
      this.setState({
        currentLinkManInfo,
        linkManListInfos,
        isChangeLinkMan: false
      }, () => {
        setSession('currentLinkManInfo', currentLinkManInfo)
        const { linkManId, currentStatus } = currentLinkManInfo
        if (currentStatus === 1) { // 有报告有测量记录
          this.handleQueryInfo(linkManId)
          setSession('hasReport', true)
        } else if (currentStatus === 2) { // 有报告无测量记录
          setSession('hasReport', true)
          const newUrl = window.location.href.replace(/height-index/g, 'predicted-height')
          window.history.replaceState({}, '', newUrl)
          window.location.reload()
        } else if (currentStatus === 3) { // 无报告有记录
          this.setState({
            noDataFlag: true
          })
          setSession('hasReport', false)
          this.handleQueryInfo(linkManId)
        } else if (currentStatus === 4) { // 无报告无记录
          setSession('hasReport', false)
          const newUrl = window.location.href.replace(/height-index/g, 'height-land')
          window.history.replaceState({}, '', newUrl)
          window.location.reload()
        }
      })
    })
  }
  // 获取首页接口信息
  handleQueryInfo = (linkmanId) => {
    API.getHeightHomePageInfo({ linkmanId }).then(({ data }) => {
      const { activContentArticleRespList, activGoodsRespList, evaluationFlag, invalidFlag, geneDataFlag, nutritionInvalidFlag, nutritionEvaluationFlag,
        sportInvalidFlag, sportEvaluationFlag, sleepInvalidFlag, sleepEvaluationFlag } = data
      this.setState({
        articleList: activContentArticleRespList,
        goodsList: activGoodsRespList,
        pageInfo: data,
        isChangeLinkMan: false
      }, () => {
        let flags = {
          evaluationFlag,
          nutritionInvalidFlag,
          nutritionEvaluationFlag,
          sportInvalidFlag,
          sportEvaluationFlag,
          sleepInvalidFlag,
          sleepEvaluationFlag
        }
        setSession('evaluationFlag', evaluationFlag)
        setSession('flags', flags)
        if ((!evaluationFlag || invalidFlag) && geneDataFlag) {
          const params = {
            linkmanId,
            toolsCode: 'HEIGHT',
            dimensionCode: 'Nutrition'
          }
          API.getQnaireInfo(params).then(({ data }) => {
            const { qnaireUrl } = data
            this.setState({
              qnaireUrl
            })
          })
        }
      })
    })
  }
  // 添加记录
  handleAddRecord = () => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: 'add_record',
      os_version: version
    })
    const { history } = this.props
    history.push('/height/add-record')
  }
  // 设置成长目标的图片
  handleSetHeightImg = (type, value) => {
    const { pageInfo } = this.state
    const { geneDataFlag } = pageInfo || {}
    if (type === 'gene') {
      if (!geneDataFlag) return iconHeight4
      switch (value) {
      case 1:
        return iconHeight3
      case 2:
        return iconHeight2
      case 3:
        return iconHeight1
      }
    } else if (type === 'average') {
      switch (value) {
      case 1:
        return iconHeight7
      case 2:
        return iconHeight6
      case 3:
        return iconHeight5
      }
    }
  }
  // 切换检测人
  handleChoiceLinkman = (item) => {
    const { bomb } = this.state
    this.setState({
      currentLinkManInfo: item,
      bomb: {
        ...bomb,
        choiceLinkmanBomb: false
      },
      isChangeLinkMan: true
    }, () => {
      const { currentLinkManInfo } = this.state
      setSession('currentLinkManInfo', currentLinkManInfo)
      const { status, linkManId } = currentLinkManInfo || {}
      if (status === 1) { // 有报告有测量记录
        this.handleQueryInfo(linkManId)
      } else if (status === 2) { // 有报告无测量记录
        this.props.history.push(`/height/predicted-height?linkManId=${linkManId}`)
      } else if (status === 3) { // 无报告有记录
        this.setState({
          noDataFlag: true
        })
        this.handleQueryInfo(linkManId)
      } else if (status === 4) { // 无报告无记录
        this.props.history.push('/height/height-land')
      }
    })
  }
  // 检测人弹框关闭
  handleCancel = () => {
    const { bomb } = this.state
    this.setState({
      bomb: {
        ...bomb,
        choiceLinkmanBomb: false
      },
      isChangeLinkMan: false
    })
  }
  // 检测人弹框显示
  handleChangeLinkMan = () => {
    const { bomb, linkManListInfos } = this.state
    if (linkManListInfos.length >= 2) {
      this.setState({
        bomb: {
          ...bomb,
          choiceLinkmanBomb: true
        },
        isChangeLinkMan: false
      })
    }
  }
  // 开始测评
  handleStartQues = () => {
    const { qnaireUrl } = this.state
    window.location.href = qnaireUrl
  }
  handleGoToCurve = (type1, type2) => {
    const { goToCurve } = this.props
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: 'home_to_heightline',
      os_version: version
    })
    goToCurve(type1, type2)
  }
  // 购买基因报告
  handleBuy = () => {
    const { buyFun } = this.props
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({
      Btn_name: 'home_to_buy',
      os_version: version
    })
    buyFun()
  }
  handleSetImages = (type) => {
    const num = returnNumByDay()
    if (num === 3) {
      return type === 'tree' ? iconTree : geneSmile1
    }
  }
  handleLoadData =() => {
    const { linkManId } = getSession('currentLinkManInfo')
    this.handleQueryInfo(linkManId)
  }
  render () {
    const { goodsList, articleList, pageInfo, currentLinkManInfo, bomb, linkManListInfos, isChangeLinkMan } = this.state
    const { linkManName, sex, linkManId } = currentLinkManInfo || {}
    const { currentDate, currentheight, nextDate, nextgeneheight, nextaverageheight, averageGap, geneGap, expertAText, averageGapFlag, geneGapFlag, nutritionTexts, sportTexts, sleepTexts, evaluationFlag, geneDataFlag, nutritionInvalidFlag, nutritionEvaluationFlag, nutritionEvaluationDate, sportInvalidFlag, sportEvaluationDate, sportEvaluationFlag, sleepInvalidFlag, sleepEvaluationDate, sleepEvaluationFlag, familyHeightRecordsExistFlag } = pageInfo || {}
    const { moreFun } = this.props
    const imagesList = [land1, land2, land3, land4, land5, land6, land7, land8]
    return (
      <div className={styles.indexCont}>
        <div className={styles.header} style={{
          background: `url(${indexBg1}) no-repeat #fff`,
          backgroundSize:'100%'
        }}>
          <div className={styles.userCont}>
            <img className={styles.userPhoto} src={sex === 'male' ? boy : girl} alt='' />
            <span className={styles.userName} onClick={this.handleChangeLinkMan}>
              {linkManName}
            </span>
            {
              linkManListInfos.length > 1
                ? <img
                  onClick={this.handleChangeLinkMan}
                  className={styles.userChangeIcon}
                  src={thr} alt=''
                />
                : ''
            }
          </div>
        </div>
        <div
          className={styles.lastRecord}
          style={{
            background: `url(${this.handleSetImages('tree')}) no-repeat`,
            backgroundSize: '100% 100%'
          }}
        >
          <div className={styles.recordCont}>
            <p className={styles.date}>{currentDate}</p>
            <p className={styles.num}>{currentheight}</p>
            <p className={styles.curve} onClick={() => this.handleGoToCurve(false, 'height')}>
              身高成长曲线
              <img className={styles.heightRight} src={heightRight} alt='' />
            </p>
          </div>
          <img onClick={this.handleAddRecord} className={styles.edit3} src={edit3} alt='' />
        </div>
        <div className={styles.targetCont}>
          <p className={styles.title}>身高成长目标</p>
          <p className={styles.nextDay}>目标对应评估时间是：{nextDate}</p>
          <p className={styles.heightsCont}>
            <i className={`${styles.circle} ${styles.green}`} />
            <span>测量身高</span>
            <i className={`${styles.circle} ${styles.yellow}`} />
            <span>基因身高</span>
            <i className={`${styles.circle} ${styles.blue}`} />
            <span>平均身高</span>
          </p>
          <div className={styles.heightsDetail}>
            <div className={styles.item}>
              <div className={styles.greenCont}>
                <p className={styles.heightTitle}>基因年龄身高</p>
                <p className={styles.heightNum}>{nextgeneheight || '无'}</p>
                <img className={styles.heightIcon} src={this.handleSetHeightImg('gene', geneGapFlag)} alt='' />
                <i className={styles.heightThr} />
              </div>
              <p className={`${styles.heightDesc1} ${(geneGapFlag === 1) || !geneGapFlag ? '' : styles.green}`}>对比目标基因身高</p>
              <p className={`${styles.heightDesc2} ${(geneGapFlag === 1) || !geneGapFlag ? '' : styles.green}`}>{geneGap || '无数据'}</p>
            </div>
            <div className={styles.item}>
              <div className={styles.greenCont}>
                <p className={styles.heightTitle}>同龄宝宝的平均身高</p>
                <p className={styles.heightNum}>{nextaverageheight}</p>
                <img className={styles.heightIcon} src={this.handleSetHeightImg('average', averageGapFlag)} alt='' />
                <i className={styles.heightThr} />
              </div>
              <p className={`${styles.heightDesc1} ${averageGapFlag === 1 ? '' : styles.green}`}>对比目标平均身高</p>
              <p className={`${styles.heightDesc2} ${averageGapFlag === 1 ? '' : styles.green}`}>{averageGap}</p>
            </div>
          </div>
          {
            geneDataFlag
              ? <div className={styles.heightDesc}>
                <div className={styles.heightTitleA} dangerouslySetInnerHTML={{ __html: expertAText }} />
                <img className={styles.img1} src={iconMark1} alt='' />
                <img className={styles.img2} src={iconMark2} alt='' />
                <img className={styles.biaoqing} src={this.handleSetImages('biaoqing')} alt='' />
              </div>
              : <div className={styles.heightDesc}>
                <div className={styles.heightTitleA}>
                  <h1>没有找到基因报告~</h1>
                  <p>购买身高基因检测，结合基因数据和测评数据，给出综合评估和身高管理方案。</p>
                </div>
                <img className={styles.img1} src={iconMark1} alt='' />
                <img className={styles.img2} src={iconMark2} alt='' />
                <img className={styles.biaoqing} src={this.handleSetImages('biaoqing')} alt='' />
              </div>
          }

        </div>
        {/* 研究院 */}
        {
          !familyHeightRecordsExistFlag
            ? <Institute
              isChangeLinkMan={isChangeLinkMan}
              linkManId={linkManId}
              onLoadData={this.handleLoadData}
            />
            : ''
        }
        {/* 成长建议 */}
        {
          geneDataFlag ? <div>
            {
              evaluationFlag
                ? <div className={styles.proposalCont}>
                  <p className={styles.title}>{linkManName}的30天成长建议</p>
                  <div>
                    <GrowthProposals growthObj={{
                      title: '30天营养建议',
                      date: nutritionEvaluationDate,
                      values: nutritionTexts,
                      hasMask: true,
                      invalid: nutritionInvalidFlag,
                      evaluation: nutritionEvaluationFlag,
                      goToCurve: () => this.handleGoToCurve(nutritionInvalidFlag, 'Nutrition')
                    }} />
                    <GrowthProposals growthObj={{
                      title: '30天运动建议',
                      date: sportEvaluationDate,
                      values: sportTexts,
                      hasMask: true,
                      invalid: sportInvalidFlag,
                      evaluation: sportEvaluationFlag,
                      goToCurve: () => this.handleGoToCurve(sportInvalidFlag, 'Sport')
                    }} />
                    <GrowthProposals growthObj={{
                      title: '30天睡眠建议',
                      date: sleepEvaluationDate,
                      values: sleepTexts,
                      hasMask: true,
                      invalid: sleepInvalidFlag,
                      evaluation: sleepEvaluationFlag,
                      goToCurve: () => this.handleGoToCurve(sleepInvalidFlag, 'Sleep')
                    }} />
                  </div>
                  {/* } */}
                </div>
                : <div className={styles.proposalCont}>
                  <p className={styles.title}>{linkManName}的现状测评</p>
                  <div className={styles.growthDetail1}>
                    安我身高研究院邀请您填写关于孩子现阶段生活状态的测评问卷。我们将通过营养、运动、睡眠3个维度，将孩子的先天基因与动态生活数据结合，为您提供专属的身高管理方案。
                  </div>
                  <span className={styles.growthBtn1} onClick={this.handleStartQues}>开始测评</span>
                </div>
            }
            {/* 预约专家 */}
            <div className={styles.appointmentCont}>
              <p className={styles.title}>
                预约专家
              </p>
              <Appointment linkmanObj={{ linkmanId: linkManId, linkmanName: linkManName }} />
            </div>
            {/* 推荐商品 */}
            <div className={styles.goodsCont}>
              <p className={styles.title}>
                推荐购买的商品
                <span onClick={() => moreFun(1)} className={styles.more}>
                  查看全部
                  <img src={heightRight1} alt='' />
                </span>
              </p>
              <GoodsList
                goodsList={goodsList}
                history={this.props.history} />
            </div>
            {/* 文章 */}
            <div className={styles.articleCont}>
              <p className={styles.title}>
                文章
                <span onClick={() => moreFun(0)} className={styles.more}>
                  查看全部
                  <img src={heightRight1} alt='' />
                </span>
              </p>
              <ArticleList
                history={this.props.history}
                articleList={articleList}
              />
            </div>
          </div>
            : <div className={styles.imagesList}>
              {
                imagesList.map((item, index) => {
                  return <img key={index} src={item} />
                })
              }
              <span className={styles.buyBtn} onClick={this.handleBuy}>点击购买</span>
            </div>
        }
        {
          bomb.choiceLinkmanBomb
            ? <ChooceLinkMan
              linkmans={linkManListInfos}
              selected={currentLinkManInfo}
              choiceLinkman={this.handleChoiceLinkman}
              cancel={this.handleCancel}
            />
            : ''
        }
      </div>
    )
  }
}
Index.propTypes = {
  history: propTypes.object,
  moreFun: propTypes.func,
  buyFun: propTypes.func,
  goToCurve: propTypes.func,
}
export default Index
