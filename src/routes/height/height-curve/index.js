import React from 'react'
import propTypes from 'prop-types'
import wx from 'weixin-js-sdk'
import { fun, API, config, images, ua } from '@src/common/app'
import { Icon, Picker, Toast } from 'antd-mobile'
import ChooceLinkMan from '../components/chooceLinkMan'
import echarts from 'echarts/lib/echarts' // 引入 ECharts 主模块
import 'echarts/lib/chart/line' // 引入柱状图
import 'echarts/lib/component/tooltip' // 引入提示框组件
import { Page } from '@src/components'
import andall from '@src/common/utils/andall-sdk'
import styles from './curve'
import wxconfig from '@src/common/utils/wxconfig'
import {
  trackPointToolHeightGoodsClick,
  trackPointToolHeightGraphPageView,
  trackPointToolHeightPageBtnClick
} from '../buried-point'
const { getParams, setSession, getDayListExport } = fun
const { isAndall, isIos } = ua
class HeightCurve extends React.Component {
  state = {
    goodsList: [],
    pickerPop: false,
    timeList:getDayListExport(3),
    orderTime: '',
    isGray: false,
    isOpen: true,
    data: {
      averageData: [],
      geneData: [],
      inputData: [],
      xData: []
    },
    traitList: [],
    detail: {},
    noDataFlag: false,
    isOrder: false,
    bomb: {
      orderSuccessBomb: false,
      choiceLinkmanBomb: false,
      dataDetailBomb: false
    },
    linkManListInfos: [],
    currentLinkManInfo: {},
    productDetail1: {},
    isAgree: false,
    start: undefined,
    end: undefined,
    right: '0.53rem',
    shareInfo: {},
    isAndall: ua.isAndall(),
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
  componentDidMount () {
    if (isAndall() && !localStorage.getItem('token')) {
      andall.invoke('token', {}, function (res) {
        localStorage.setItem('token', res.result.token)
      })
    }
    if (!isAndall()) {
      wx.miniProgram.getEnv(res => {
        if (res.miniprogram) {
          this.handleQueryStatus()
          this.handleQueryShare()
          this.addEventListenerSroll()
        } else {
          this.handleIsNewUser()
        }
      })
    } else {
      this.handleQueryStatus()
      this.handleQueryShare()
      this.addEventListenerSroll()
    }
  }
  // 如果是新用户，则去注册
  handleIsNewUser = () => {
    API.myInfo({ noloading:1 }).then(res => {
      const { data } = res
      if (data.checkMobileFlag === 2) {
        this.handleQueryStatus()
        this.handleQueryShare()
        this.addEventListenerSroll()
      } else {
        const { origin } = location
        window.location.href = `${origin}/login?url=height-curve`
      }
    })
  }
  handleQueryShare=() => {
    const { isAndall } = this.state
    API.getActivShareInfo({ shareCode: 'height' }).then(({ data }) => {
      this.setState({
        shareInfo: data
      }, () => {
        if (!isAndall) {
          this.wxShare(data)
        }
      })
      if (!isAndall) {
        setSession('shareInfo', data)
      }
    })
  }
  /**
   * 微信分享
   */
  wxShare = (shareInfo) => {
    const { title, jumpUrl, subTitle, headImg } = shareInfo
    wxconfig({
      showMenu: true,
      params:{
        title,
        link: jumpUrl,
        desc: subTitle,
        imgUrl: headImg,
      }
    })
  }
  addEventListenerSroll = () => {
    let scrollTimer
    const timeout = 200
    const that = this
    function handler () {
      that.setState({
        right: 20
      })
    }
    document.addEventListener('scroll', () => {
      this.setState({
        right: -45
      })
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(handler, timeout)
    })
  }
  handleQueryHeightDetail = () => {
    API.getHeightProductInfo({ toolsCode: 'HEIGHT' }).then(({ data }) => {
      this.setState({
        productDetail1: data
      })
    })
  }
  // 获取状态跳转链接
  handleQueryStatus = (value, type) => {
    const { linkmanId } = getParams()
    let params = {}
    if (linkmanId && linkmanId !== 'null') {
      params = {
        linkManId: +linkmanId
      }
    }
    if (value) {
      params = {
        ...params,
        linkManId: value,
      }
    }
    API.getHeightHomeInfo(params).then(({ data }) => {
      const { currentLinkManInfo, linkManListInfos } = data
      const { currentStatus } = currentLinkManInfo || {}
      setSession('currentLinkManInfo', currentLinkManInfo)
      if (currentStatus === 1) { // 有报告有测量记录
        this.setState({
          linkManListInfos,
          currentLinkManInfo
        })
        this.handleQueryHeightRecords(currentLinkManInfo.linkManId || (!linkmanId && currentLinkManInfo.linkManId), type)
        this.handleQueryAppointment(currentLinkManInfo.linkManId || (!linkmanId && currentLinkManInfo.linkManId))
      } else if (currentStatus === 2) { // 有报告无测量记录
        // this.props.history.push('/predicted-height')
        const newUrl = window.location.href.replace(/height-curve/g, 'predicted-height')
        window.history.replaceState({}, '', newUrl)
        window.location.reload()
      } else if (currentStatus === 3) { // 无报告有记录
        this.handleQueryHeightDetail()
        this.setState({
          linkManListInfos,
          currentLinkManInfo,
          noDataFlag: true
        })
        this.handleQueryHeightRecords(currentLinkManInfo.linkManId || (!linkmanId && currentLinkManInfo.linkManId), type)
      } else if (currentStatus === 4) { // 无报告无记录
        // this.props.history.push('/height-land')
        const newUrl = window.location.href.replace(/height-curve/g, 'height-land')
        window.history.replaceState({}, '', newUrl)
        window.location.reload()
      }
    })
  }
  // 获取预约信息
  handleQueryAppointment = (value) => {
    const { linkmanId } = getParams()
    const params = {
      linkmanId: +linkmanId || value
    }
    API.selectExpertAppointment(params).then(({ data }) => {
      const { endTime, startTime } = data
      if (startTime) {
        let dateTime = new Date()
        let Time = new Date(endTime + ':00')
        let isGray = false
        if (dateTime - Time <= 0) {
          isGray = true
        }
        this.setState({
          orderTime: startTime + '-' + endTime.split(' ')[1],
          isGray,
          isOrder: true
        })
      }
    })
  }
  // 获取折线的数据
  handleQueryHeightRecords = (value, type) => {
    const { linkmanId, brithday, measureDate } = getParams()
    const { start, end } = this.state
    let params = {
      start,
      end
    }
    if (linkmanId) {
      params = {
        ...params,
        linkmanId: +linkmanId || '',
        brithday: type ? '' : (brithday || ''),
        measureDate: type ? '' : (measureDate || ''),
      }
    }
    if (value) {
      params = {
        ...params,
        linkmanId: value,
      }
    }
    trackPointToolHeightGraphPageView({
      sample_linkmanid: params.linkmanId
    })
    API.selectHeightRecordsWithoutOrPresentation(params).then(({ data }) => {
      const { activGoodsRespList, baseDatayAxis, geneDatayAxis, inputRecordyAxis, traitTextResp, xaxis, labelFlag } = data
      this.setState({
        goodsList: activGoodsRespList,
        data: {
          averageData: baseDatayAxis,
          geneData: geneDatayAxis,
          inputData: inputRecordyAxis,
          xData: xaxis
        },
        detail: data,
        traitList: traitTextResp
      }, () => {
        this.handleSetMouthPosition(labelFlag)
        this.handleMarkLineChart()
      })
    })
  }
  handleSetMouthPosition = (labelFlag) => {
    if (labelFlag <= 4) return
    let scrollWrap = document.getElementById('mouthDiv')
    scrollWrap.scrollLeft = (labelFlag - 2) * 82
  }
  // 显示预约时间的框
  handleShowPicker = () => {
    this.setState({
      pickerPop: true
    })
  }
  // 选择预约时间的确认事件
  pickerOk = (e) => {
    this.setState({
      orderTime: e.join(' '),
      pickerPop: false
    })
  }
  // 隐藏预约时间的框
  hidePicker = () => {
    this.setState({ pickerPop: false })
  }
  // 预约专家
  handleOrderExport = () => {
    return Toast.info('感谢您的支持，预约名额已满，请等待下次开放预约，谢谢。')
    const { orderTime, isGray, currentLinkManInfo, isOrder, bomb, isAgree } = this.state
    if (isGray || isOrder || !isAgree) return
    if (!orderTime) return Toast.info('请选择预约时间！')
    const startTime = `${orderTime.split(' ')[0]} ${orderTime.split(' ')[1].split('-')[0]}`
    const endTime = `${orderTime.split(' ')[0]} ${orderTime.split(' ')[1].split('-')[1]}`
    const params = {
      linkmanId: currentLinkManInfo.linkManId,
      startTime,
      endTime,
      linkmanName: currentLinkManInfo.linkManName
    }
    API.insertExpertAppointment(params).then(({ code }) => {
      if (!code) {
        let version = 'wechat_h5'
        if (isAndall()) {
          if (isIos()) {
            version = 'app_ios'
          } else {
            version = 'app_android'
          }
        }
        trackPointToolHeightPageBtnClick({ Btn_name: 'appointment_expert', os_version: version })

        this.setState({
          bomb: {
            ...bomb,
            orderSuccessBomb: true
          }
        })
        this.setState({
          isGray: true,
          isOrder: true
        })
      }
    })
  }
  // 查看历史记录
  handleGoToRecordList = () => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({ Btn_name: 'history_record', os_version: version })
    let { linkmanId } = getParams()
    const { currentLinkManInfo } = this.state
    linkmanId = linkmanId || currentLinkManInfo.linkManId
    this.props.history.push(`/record-list?linkmanId=${linkmanId}`)
  }
  // 制作折线图
  handleMarkLineChart = () => {
    const { data } = this.state
    const { averageData, geneData, inputData, xData } = data || {}
    var myChart = echarts.init(document.getElementById('echarts'))
    // 指定图表的配置项和数据
    /* eslint-disable */
    let option = {
      tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(10,167,85,1)',
          color: '#fff',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            lineStyle: {
              color: 'rgba(255, 255, 255, .2)'
            }
          },
          formatter: function (params) {
            let res = ''
            if (params[0] && params[0].value) {
              res += '<p style="padding: 0 8px;"><span style="width: 8px;height:8px;border-radius: 100%;display:inline-block;background: rgba(81, 244, 239, 1);margin-right:4px;"></span>' + params[0].seriesName + '：'+params[0].value + '</p>'
            }
            if (params[1] && params[1].value) {
              let color = 'rgba(236, 255, 0, 1)'
              if (params.length === 2) {
                color = '#fff'
              }
              res += '<p style="padding: 0 8px;"><span style="width: 8px;height:8px;border-radius: 100%;display:inline-block;background: '+color+';margin-right:4px;"></span>' + params[1].seriesName + '：'+params[1].value + '</p>'
            }
            if (params[2] && params[2].value) {
              res += '<p style="padding: 0 8px;"><span style="width: 8px;height:8px;border-radius: 100%;display:inline-block;background:#fff;margin-right:4px;"></span>' + params[2].seriesName + '：'+params[2].value + '</p>'
            }
            return res
          }
      },
      legend: {
          data: ['平均身高', '基因身高', '测量身高'],
          x: 'left'
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
              show: false,
          },
          axisTick: {
              show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff',  //更改坐标轴文字颜色
              fontSize : 12     //更改坐标轴文字大小
            },
            formatter: (val, index) => {
              if (index === 0) {
                if (val === '0个月') return ''
                return `(${val})`
              } else {
                return `${index}月`
              }
            },
            interval:0,  
          },
          data: xData
      },
      yAxis: [{
          type: 'value',
          axisLine: {
              show: false,
          },
          axisTick: {
              show: false,
          },
          min: function(value) {
            if (value <= 20) return value
            return parseInt((value.min - 10)/10)*10
          },
          axisLabel: {
            show: true,
             textStyle: {
               color: '#fff',  //更改坐标轴文字颜色
               fontSize : 12     //更改坐标轴文字大小
             }
          },
          splitLine: {
              lineStyle: {
                  type: 'solid',
                  color:'rgba(17, 164, 63, 1)',
                  width: 0.5
              }
          },
          splitNumber: 5
      }],
      grid: {
          left: '18px',
          right: '4%',
          bottom: '0',
          top: '4%',
          containLabel: true,
          borderWidth: '0'
      },
      series: [{
              name: "平均身高",
              type: "line",
              smooth: true,
              symbol: 'circle',
              symbolSize: 6,
              data: averageData,
              itemStyle: {
                  normal: {
                      color: 'rgba(84, 250, 255, 1)',
                      lineStyle: {
                          width: 2
                      }
                  }
              },
              connectNulls: true
          },
          {
              name: "基因身高",
              type: "line",
              smooth: true,
              symbol: 'circle',
              symbolSize: 6,
              data: geneData,
              itemStyle: {
                  normal: {
                      color: 'rgba(236, 255, 0, 1)',
                      lineStyle: {
                          width: 2,
                      }
                  }
              },
              connectNulls: true
          },
          {
              name: "测量身高",
              type: "line",
              smooth: true,
              symbol: 'circle',
              symbolSize: 6,
              data: inputData,
              itemStyle: {
                  normal: {
                      color: '#fff',
                      lineStyle: {
                          width: 2,
                      }
                  }
              },
              connectNulls: true
          }
      ]
    }
    if (myChart) {
      myChart.clear()
    }
    // 基于准备好的dom，初始化echarts实例
    myChart.setOption(option)
    window.scrollTo(0, 0)
  }
  // 添加测量记录
  handleAddRecord = () => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({ Btn_name: 'add_record', os_version: version })
    this.props.history.push('/add-record')
  }
  // 推荐商品详情
  handleGoToDetail = (item) => {
    const { id } = item
    const {isAndall} = this.state
    trackPointToolHeightGoodsClick({ goods_id: id })
    this.props.history.push(`/article-detail-index?type=4&id=${id}`)
  }

  // 根据code返回对应的图片
  handleCodeToImg = (code) => {
    const imagesList = [{
      name: 'ZMTNUTR0001-1-DOCC',
      src: images.ZMTNUTR0001
    }, {
      name: 'ZMTNUTR0002-1-DOCB',
      src: images.ZMTNUTR0002
    }, {
      name: 'ZMTNUTR0004-1-DOCB',
      src: images.ZMTNUTR0004
    }, {
      name: 'ZMTNUTR0010-1-DOCD',
      src: images.ZMTNUTR0010
    }, {
      name: 'ZMTNUTR0018-1-DOCC',
      src: images.ZMTNUTR0018
    }]
    if(!code) return
    for (let i = 0;i<imagesList.length;i++) {
      if (imagesList[i].name === code) {
        return imagesList[i].src
      }
    }
  }
 
  handleHideOrderBomb = () => {
    const { bomb }=this.state
    this.setState({
      bomb: {
        ...bomb,
        orderSuccessBomb: false
      }
    })
  }
  handleChangeLinkMan = () => {
    const { bomb, linkManListInfos }=this.state
    if (linkManListInfos.length <= 1) return
    this.setState({
      bomb: {
        ...bomb,
        choiceLinkmanBomb: true
      }
    })
  }
  handleChoiceLinkman = (item) => {
    const { bomb }=this.state
    this.setState({
      currentLinkManInfo: item,
      bomb: {
        ...bomb,
        choiceLinkmanBomb: false
      }
    }, () => {
      const { currentLinkManInfo } = this.state
      setSession('currentLinkManInfo', currentLinkManInfo)
      const { status, linkManId } = currentLinkManInfo || {}
      if (status === 1) { // 有报告有测量记录
        this.handleQueryStatus(linkManId, 1)
        // this.handleQueryHeightRecords(linkManId)
        this.handleQueryAppointment(linkManId)
      } else if (status === 2) { // 有报告无测量记录
        this.props.history.push(`/predicted-height?linkManId=${linkManId}`)
      } else if (status === 3) { // 无报告有记录
        this.setState({
          noDataFlag: true
        })
        this.handleQueryStatus(linkManId, 1)
        // this.handleQueryHeightRecords(linkManId)
      } else if (status === 4) { // 无报告无记录
        this.props.history.push('/height-land')
      }
    })
  }
  handleCancel = () => {
    const { bomb }=this.state
    this.setState({
      bomb: {
        ...bomb,
        choiceLinkmanBomb: false
      }
    })
  }
  handleBuyFun = (id, type) => {
    const {isAndall} = this.state
    let version = 'wechat_h5'
    if (isAndall) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({ Btn_name: 'buyguide_to_productdetail', os_version: version })
    
    if (isAndall) {
      andall.invoke('goProductDetail', { productId:id, productType:type } )
    } else {
      window.location.href = `${window.location.origin}/commodity?id=${id}`
    }
  }
  handleAgreeFun = () => {
    const {isAgree} = this.state
    this.setState({
      isAgree: !isAgree
    })
  }
  handleChangeMouth = (item, index) => {
    const {labelFlag, currentLinkManInfo} = this.state
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({ Btn_name: 'year_tab', os_version: version })
    if (labelFlag === index) return
    this.setState({
      start: item.start,
      end: item.end
    }, () => {
      this.handleQueryHeightRecords(currentLinkManInfo.linkManId)
    })
  }
  handleShowDetailBomb = (value) => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({ Btn_name: 'graph_explain', os_version: version })
    const { bomb } = this.state
    this.setState({
      bomb: {
        ...bomb,
        dataDetailBomb: value
      }
    })
  }
   // 分享
   handleShare = () => {
    const { shareInfo } = this.state
    const { title, subTitle, jumpUrl, headImg } = shareInfo || {}
    andall.invoke('share',
      {
        type: 'link',
        title,
        text: subTitle,
        url: jumpUrl,
        image: headImg,
        thumbImage: headImg
      })
  }
  handleOpenReport = () => {
    const {isAndall,detail } = this.state
    if (isAndall) {
      window.location.href = detail && detail.reportUrl
    } else {
      window.location.href = `${window.location.origin}/download-app`
    }
  }
  render () {
    const { goodsList, pickerPop, timeList, orderTime,isGray,detail,traitList, noDataFlag, isOrder, bomb, currentLinkManInfo, linkManListInfos, productDetail1, isAgree,
      mounthList,right,isAndall } = this.state
    const { expertAText, expertText,currentMonth,currentheight,nextMonth,nextaverageheight,nextgeneheight,labelFlag} = detail || {}
    const { dnaHeight, linkManName } = currentLinkManInfo
    const imagesList = [images.land1, images.land2, images.land3, images.land4, images.land5, images.land6, images.land7, images.land8]
    return (
      <Page title='身高成长曲线'>
        <div className={styles.curveCont}>
          <div className={styles.curveDetail}>
            <div className={styles.babyCont}>
              <img className={styles.babyPhoto} src={currentLinkManInfo.sex === 'male' ? images.boy : images.girl} alt='' />
              <div className={styles.nameCont}>
                <p className={styles.name} onClick={this.handleChangeLinkMan}>
                  {linkManName}
                  {
                    linkManListInfos.length > 1 
                    ? <img className={styles.thr} src={images.thr} alt='' />
                    : ''
                  }
                </p>
                <p className={styles.height}>预计成年后最高身高{
                  noDataFlag ? ' ? ' : dnaHeight
                  }cm</p>
                {
                  noDataFlag 
                  ? <p className={styles.noDataDesc}>没有基因检测数据，无法生成基因身高数据。</p>
                  : ''
                }
              </div>
                {
                isAndall ? <img className={styles.share1} onClick={this.handleShare} src={images.share1} alt=""/>
                : ''
              }
            </div>
            {
              noDataFlag
              ? <div className={styles.buyCont}>
                <div className={styles.leftCont}>
                  <img src={productDetail1.productDetail &&productDetail1.productDetail.headPicUrl} alt=""/>
                </div>
                <div className={styles.rightCont}>
                  <p className={styles.buyTitle}>{productDetail1.productName}</p>
                  <p className={styles.buyDesc}>4大类17项身高相关基因评估</p>
                  <span onClick={() => this.handleBuyFun(productDetail1.id, productDetail1.productType)} className={styles.buyBtn}>立即购买</span>
                </div>
              </div>
              : ''
            }
            <div className={styles.mouthCont}>
              <div className={styles.overHidden} id='mouthDiv'>
                <div className={styles.mouthDiv}>
                  {
                    mounthList.map((item, index) => {
                      return <span 
                       className={`${styles.mouthItem} ${labelFlag === index+1 ? styles.actived : ''}`} 
                       key={index}
                       onClick={() => this.handleChangeMouth(item, index+1)}
                       >{item.name}</span>
                    })
                  }
                </div>
              </div>
            </div>
            <div className={styles.recordCont}>
              <div className={styles.heightCont}>
                <span><i className={`${styles.circle} ${styles.white}`} />测量身高</span>
                {
                  noDataFlag ? '' : <span><i className={`${styles.circle} ${styles.yellow}`} />基因身高</span>
                }
                <span><i className={`${styles.circle} ${styles.blue}`} />平均身高</span>
              </div>
              <span className={styles.recordList} onClick={this.handleGoToRecordList}>
                历史记录
                <Icon className={styles.downIcon} type='right' size='xs' />
              </span>
            </div>
            <p className={styles.heightDesc}>身高（CM）</p>
            <div className={styles.echartCont}>
              <div style={{width: '100%', height: '300px'}} id='echarts' />
            </div>
            <p className={styles.bombTitle} onClick={() => this.handleShowDetailBomb(true)}>
              如何查看身高曲线
              <Icon className={styles.downIcon} type='right' size='xs' />
            </p>
          </div>
          {
            noDataFlag ? '' : <div className={styles.resultCont}>
            {/* <p className={styles.resultDesc}>{expertText}</p> */}
            <p className={styles.resultDesc1}>{expertAText}</p>
            <div className={styles.heightDetail}>
              <p className={styles.title}>当前测量时间：{currentMonth}</p>
              <div className={styles.heightDetail}>
                <div className={styles.heightItem}>
                  <div className={styles.height1}>
                    <i className={`${styles.circle} ${styles.white}`} />
                    <div>
                      <p className={styles.heightTitle}>测量身高</p>
                    </div>
                  </div>
                  <div className={`${styles.height2} ${styles.grayColor}`}>{currentheight}</div>
                </div>
              </div>
              <p className={styles.title}>{linkManName}{nextMonth}时要达到的身高</p>
              <div className={styles.heightDetail}>
                <div className={styles.heightItem}>
                  <div className={styles.height1}>
                    <i className={`${styles.circle} ${styles.yellow}`} />
                    <div>
                      <p className={styles.heightTitle}>基因身高</p>
                    </div>
                  </div>
                  <div className={styles.height2}>{nextgeneheight}</div>
                </div>
                <div className={styles.heightItem}>
                  <div className={styles.height1}>
                    <i className={`${styles.circle} ${styles.blue}`} />
                    <div>
                      <p className={styles.heightTitle}>平均身高</p>
                    </div>
                  </div>
                  <div className={styles.height2}>{nextaverageheight}</div>
                </div>
              </div>
            </div>
          </div>
          }
          <div className={styles.expertCont}>
            <p className={styles.expertTitle}>安我儿童健康专家</p>
            <p className={styles.expertDesc}>专注于儿童成长发育、营养、心理</p>
            <div className={styles.expertUser}>
              <img className={styles.expertPhoto} src={images.exportP} alt='' />
              {
                noDataFlag 
                ? <div className={styles.expertDesc1}>购买基因检测后，会综合宝宝的基因数据给出综合分析和指导意见。</div>
                : <div className={styles.expertDesc1} dangerouslySetInnerHTML={{__html: expertText}} />
              }
            </div>
            {
              noDataFlag ? ''
              : <div className={styles.expertDesc2}>
              {
                traitList &&traitList.length
                ? traitList.map((item, index)=> {
                  return (<div className={styles.traitCont} key={index}>
                    <h3>
                      {
                        item.traitCode 
                        ? <img className={styles.icon} src={this.handleCodeToImg(item.traitCode)} alt=""/>
                        : ''
                      }
                      {item.title}
                    </h3>
                    <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
                  </div>)
                })
                : ''
              }
            </div>
            }
            {/* {
              noDataFlag ? '' : <span
              onClick={this.handleOpenReport}
               className={styles.exportBtn}
               >查看身高检测报告</span>
            } */}
          </div>
          {
            noDataFlag ? ''
            : <div className={styles.recommendCont}>
            <p className={styles.recommendTitle}>营养补充推荐</p>
            {
              goodsList && goodsList.length
                ? goodsList.map((item, index) => {
                  return <div 
                  key={index} className={styles.goodsItem}
                  onClick={() => this.handleGoToDetail(item)}
                  >
                    <img className={styles.goodsImg} src={item.goodsPictureUrl} alt='' />
                    <p className={styles.goodsTitle}>{item.title}</p>
                  </div>
                })
                : ''
            }
            <div style={{ clear: 'both' }} />
          </div>
          }
          {
            noDataFlag ? ''
            : <div className={styles.orderCont}>
            <p className={styles.orderTitle}>预约专家</p>
            {
              isOrder ?
              <div className={styles.orderTime}>已预约时间<span>{orderTime}</span></div>
              : <div className={styles.orderTime} onClick={this.handleShowPicker}>
                预约时间
                {
                  orderTime ? <span>{orderTime}</span> : ''
                }
                <Icon className={styles.downIcon} type={'down'} size='xs' />
              </div>
            }
            {
              isOrder ? <p className={styles.orderDesc}>安我育儿专家会在这个时间联系您，请保持电话畅通</p>
              : <p className={styles.shouquan} onClick={this.handleAgreeFun}>
                <span className={`${styles.radio} ${isAgree ? styles.active : ''}`} >
                  <em></em>
                  </span>
                  同意授权报告给专家查看</p>
            }
            {
              isOrder ? ''
              : <span className={`${styles.orderBtn} ${isGray || !isAgree || !orderTime ? styles.isGray : ''}`}  onClick={this.handleOrderExport}>立即预约</span>
            }
          </div>
          }
          {
            noDataFlag ? <div className={styles.landCont}>
              {imagesList.map((item, index) => {
                return <img src={item} />
              })}
            </div>
            : ''
          }
          <Picker
            data={timeList}
            visible={pickerPop}
            cols={2}
            onOk={(e) => {
              this.pickerOk(e)
            }}
            onDismiss={this.hidePicker}
            extra='请选择(可选)'
          />
          <span className={styles.addBtn} style={{right: right}} onClick={this.handleAddRecord}>
            <img src={images.add} />
          </span>
          {
            bomb.orderSuccessBomb
             ? <div className={styles.bombCont}>
               <div className={styles.mask}></div>
               <div className={styles.orderContBomb}>
                 <img src={images.iconSuccess} alt=""/>
                 <p className={styles.title}>预约成功</p>
                 <p className={styles.time}>预约时间：{orderTime}</p>
                 <span className={styles.knowBtn} onClick={this.handleHideOrderBomb}>我知道了</span>
               </div>
             </div> 
             : ''
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
          {
            bomb.dataDetailBomb 
            ? <div className={styles.bombCont}>
              <div className={styles.mask} />
              <div className={styles.detailContBomb}>
                <p className={styles.iconClose} onClick={() => this.handleShowDetailBomb(false)}>
                  <img src={images.close2} />
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
        </div>
      </Page>
    )
  }
}
HeightCurve.propTypes = {
  history: propTypes.object,
}
export default HeightCurve
