import React from 'react'
import Page from '@src/components/page'
import {API, fun, ua } from '@src/common/app'
import userApi from '@src/common/api/userApi'
import images from './images'
import { observer, inject } from 'mobx-react'
import andall from '@src/common/utils/andall-sdk'
import Title from './components/title'
import Suggest from './components/suggest'
import Program from './components/program'
import LineBar from './components/lineBar'
import NavigationBar from './components/navigationBar'
import echarts from 'echarts/lib/echarts' // 引入 ECharts 主模块
import 'echarts/lib/chart/radar'// 引入雷达图
import 'echarts/lib/component/tooltip' // 引入提示框组件
import {
  compreSugResultView,
  compreSugResultGoto
} from './BuriedPoint'

import styles from './report.scss'
const { getParams } = fun
@inject('user')
@observer
class report extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    isAndall: ua.isAndall(),
    suggestList:[],
    programeList:[],
    programe:{},
    detail:{
      categoryArrary:[]
    },
    tipFlag: false,
    time:'',
    barcode:'',
    reFlag:true,
    hasShareToken:false,
    name:''
  }

  componentDidMount() {   
    const{isAndall}=this.state;
    if(!!isAndall){
      andall.invoke('pageTitleBar', {show: false})
    }
    const{qnaireId,reportId,linkManId,productCode,qnaireCode,userId,shareToken}=getParams()

    userApi.myInfo({ noloading: 1 }).then(res => {
      this.setState({name:res.data.nickName})
      const userIdTwo=res.data.userId
      let params={
        linkManId:Number(linkManId),
        qnaireId:Number(qnaireId),
        reportId:Number(reportId),
        userId:!!userId?userId:userIdTwo
      } 
      API.getVerdictInfo(params).then(res=>{
        if(res.data){
          this.setState({
            detail:res.data,
            time:this.replaceTime(res.data.finishTime),
            barcode:res.data.barcode,
            reFlag:!!userId?false:true,
            hasShareToken:!!shareToken?true:false
          })
          if(res.data.categoryArrary.length>2 && res.data.picFlag==1){  
            this.handleMarkRadarChart(res.data.categoryArrary)
          }

          compreSugResultView({
            qnaire_code:qnaireCode,
            sample_linkmanid:linkManId
          })
        }
      })
      this.handlePromotion(linkManId,productCode);
    })


    
    
  }

  // 制作雷达图
  handleMarkRadarChart = (data) => {
    let list=[] // 文字
    let listValue=[] // 值
    data.map(item=>{
      list.push({
        text: item.categoryDesc,
        max:5
      })
      listValue.push(item.scoreNum)
    })
    var i = -1
    const geneData=data
    var myChart = echarts.init(document.getElementById('echartsRadar'))
    let option = {
      radar: [
        {
          indicator: list,
          center: ['50%', '50%'],
          radius: 60,
          startAngle: 90,
          splitNumber: 4,
          name: {
            formatter: (a)=>{
              i++;
              if(`${data[i].scoreNum}`==0){
                return `{a|${a}}\n{img0|}`
              }
              if(0<`${data[i].scoreNum}` && `${data[i].scoreNum}`<=0.5){
                return `{a|${a}}\n{img1|}`
              }
              else if(0.5<`${data[i].scoreNum}` && `${data[i].scoreNum}`<=1){
                return `{a|${a}}\n{img2|}`
              }
              else if(1<`${data[i].scoreNum}` && `${data[i].scoreNum}`<=1.5){
                return `{a|${a}}\n{img3|}`
              }
              else if(1.5<`${data[i].scoreNum}` && `${data[i].scoreNum}`<=2){
                return `{a|${a}}\n{img4|}`
              }
              else if(2<`${data[i].scoreNum}` && `${data[i].scoreNum}`<=2.5){
                return `{a|${a}}\n{img5|}`
              }
              else if(2.5<`${data[i].scoreNum}` && `${data[i].scoreNum}`<=3){
                return `{a|${a}}\n{img6|}`
              }
              else if(3<`${data[i].scoreNum}` && `${data[i].scoreNum}`<=3.5){
                return `{a|${a}}\n{img7|}`
              }
              else if(3.5<`${data[i].scoreNum}` && `${data[i].scoreNum}`<=4){
                return `{a|${a}}\n{img8|}`
              }
              else if(4<`${data[i].scoreNum}` && `${data[i].scoreNum}`<=4.5){
                return `{a|${a}}\n{img9|}`
              }
              else if(4.5<`${data[i].scoreNum}` && `${data[i].scoreNum}`<=5){
                return `{a|${a}}\n{img10|}`
              }
            },
            rich: {
              a: {
                color:"#38395B",
                fontSize: 13,
                fontWeight: 400,
                lineHeight: 24,
                align: 'center',
              },
              b: {
                fontSize:20,
                fontFamily:"DINAlternate-Bold,DINAlternate",
                fontWeight:"bold",
                color:'rgba(56,57,91,1)',
                lineHeight: 28,
                align: 'center',
              },
              img0:{
                width: 64,
                height: 12,
                align: 'center',
                backgroundColor: {
                  image: `${images.rankZero}`
                }
              },
              img1:{
                width: 64,
                height: 12,
                align: 'center',
                backgroundColor: {
                  image: `${images.rankOne}`
                }
              },
              img2:{
                width: 64,
                height: 12,
                align: 'center',
                backgroundColor: {
                  image: `${images.rankTwo}`
                }
              },
              img3:{
                width: 64,
                height: 12,
                align: 'center',
                backgroundColor: {
                  image: `${images.rankThree}`
                }
              },
              img4:{
                width: 64,
                height: 12,
                align: 'center',
                backgroundColor: {
                  image: `${images.rankFour}`
                }
              },
              img5:{
                width: 64,
                height: 12,
                align: 'center',
                backgroundColor: {
                  image: `${images.rankFive}`
                }
              },
              img6:{
                width: 64,
                height: 12,
                align: 'center',
                backgroundColor: {
                  image: `${images.rankSix}`
                }
              },
              img7:{
                width: 64,
                height: 12,
                align: 'center',
                backgroundColor: {
                  image: `${images.rankSeven}`
                }
              },
              img8:{
                width: 64,
                height: 12,
                align: 'center',
                backgroundColor: {
                  image: `${images.rankEight}`
                }
              },
              img9:{
                width: 64,
                height: 12,
                align: 'center',
                backgroundColor: {
                  image: `${images.rankNine}`
                }
              },
              img10:{
                width: 64,
                height: 12,
                align: 'center',
                backgroundColor: {
                  image: `${images.rankTen}`
                }
              }
            }
          },
          splitArea: {
            areaStyle: {
                color: ['rgba(197,197,245,1)',
                    'rgba(214,214,248,1)', 'rgba(230,230,251,1)',
                    'rgba(246,246,254,1)'],
            }
          },
          axisLine: {
            lineStyle: {
                color: 'transparent'
            }
          },
          splitLine: {
            lineStyle: {
                color: 'transparent'
            }
          }
        }
      ],
      series: [
        {
          name: '雷达图',
          type: 'radar',
          emphasis: {
              lineStyle: {
                width: 4
              }
          },
          data: [
              {
                value: listValue,
                name: '图一',
                symbol: 'rect',
                symbolSize: 0,
                lineStyle: {
                  color: 'transparent'
                },
                areaStyle: { 
                  opacity: 0.6,  
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(86, 92, 248, 1)' },
                    { offset: 1, color: "rgba(3, 188, 177, 1)" }
                  ])
                }
              }     
          ]
        }  
      ]
    }
   
    if (myChart) {
      myChart.clear()
    }
    // 基于准备好的dom，初始化echarts实例
    myChart.setOption(option)
    //window.scrollTo(0, 0)
  }

  // 推荐项目
  handlePromotion=(linkManId,productCode)=>{
    let params={
      linkManId,
      productCode
    }
    API.getRecommendProductInfo(params).then(res=>{
      if(!!res.data){
        this.setState({
          programeList: !!res.data.dataList?res.data.dataList:[],
          programe:res.data
        })
      }
      
    })
  }
  unlock=(item)=>{
    const{linkManId,productCode,qnaireCode}=getParams()
    const params = {
      linkManId,
      productList:[{ productId:item.productId, productNum:1 }],
      activeCode:productCode,
      actualType: 2
    }
    andall.invoke('confirmOrder', params)
    compreSugResultGoto({
      qnaire_code:qnaireCode,
      sample_linkmanid:linkManId,
      Btn_name:'recom_pro'
    })
  }
  review=(url)=>{
    const { origin } = location
    const{qnaireCode,reportId,linkManId,productCode}=getParams()
    //this.props.history.push('/report5?id=1')
    //window.location.href = `${origin}/mkt/questionnaire?linkManId=${linkManId}&qnaireCode=${qnaireCode}&writeChannel=3`
    let link = url+`&productCode=`+productCode

    location.href = ua.isAndall() ? `andall://andall.com/inner_webview?url=${link}` : link
    
    compreSugResultGoto({
      qnaire_code:qnaireCode,
      sample_linkmanid:linkManId,
      Btn_name:'redo'
    })
  }
  
  openTipModal=()=>{
    this.setState({
      tipFlag:true
    })
  }
  closeTipModal =()=>{
    this.setState({
      tipFlag:false
    })
  }
  replaceTime=(time)=>{
    return time.replace(/\s[\x00-\xff]*/g,'')
  }
  goBack=()=>{
    //andall.invoke('closeWebViewFlag', {})
    andall.invoke('back');
  }

  

  render() {
    const { programe,programeList,detail,tipFlag,time,reFlag,hasShareToken,name} = this.state
    return (
      <Page title='综合建议'>
        <NavigationBar scrollTop={true} title="综合建议" type="black" back={()=>{this.goBack()}}></NavigationBar>
        <div className={styles.bg_color}></div>
        <div className={styles.report_panel}>
          <div className={styles.report_chart}>
            <Title title="你的评测结果" time={time} />
            <div className={styles.report_block}>
              {detail.picFlag==1?<div className={styles.report_tips} onClick={()=>{this.openTipModal()}}>
                <img src={images.questionMark} />
                <h1>说明</h1>
              </div>:''}
              {detail.picFlag==1?<div className={styles.echart_content}> 
                {detail.categoryArrary.length>=3?
                  <div className={styles.echart_content_con}> 
                    <div className={styles.echart_radar} id='echartsRadar' />
                  </div>
                  :
                  <div className={styles.echart_line_con}> 
                  {detail.categoryArrary.map((item,index)=>{
                    return(
                      <div className={styles.echart_line}>
                        <LineBar item={item} num={index}></LineBar>
                      </div>
                    )
                    })  
                  }
                  </div>  
                }
              </div>:''}
              {!!detail.verdict?
                <div className={styles.echart_para}>
                  <div className={styles.dotLeft}>
                    <img src={images.dotLeft} />
                  </div>
                  <div className={styles.dotRight}>
                    <img src={images.dotLeft} />
                  </div>
                  <div className={styles.echart_para_con} dangerouslySetInnerHTML={{__html:detail.verdict}}>
                  </div>
                </div> :null
              }
            </div>  
          </div>
          <div className={styles.report_suggest}>
            <Title title="安我专家这样建议：" />
            <div className={styles.report_suggest_block}>
              {detail.categoryArrary.length>0 && detail.categoryArrary.map(item=>{
                  return(
                    <Suggest item={item}></Suggest>  
                  )
                })
              }
            </div>
          </div> 
          {!!reFlag?<div className={`${styles.report_change} ${!!hasShareToken? `${styles.disabled}`:''}`}  onClick={()=>{this.review(detail.reQnaireUrl)}}>情况有改变？<span>点击这里，重新测评</span></div>:null} 
          {programeList.length>0?
            <div className={styles.report_program}>
              <Title title={"我们推荐"+`${name}`+"关注以下项目"}  />
              <div className={styles.report_program_list}>
                {programeList.map(item=>{return(
                    <div className={styles.report_program_field}>
                      <Program item={item} onUnlock={()=>{this.unlock(item)}}></Program>
                    </div>
                  ) 
                })}  
              </div> 
            </div>:null}
         
          {tipFlag?<div className={styles.tips_modal}>
              <div className={styles.modal_box}>
                <div className={styles.modal_close} onClick={()=>{this.closeTipModal()}}></div>
                <div className={styles.modal_content}>
                  <h1>说明：</h1>
                  <div className={styles.modal_para_con}>
                    <p>- 星星的个数是通过你的问卷答案计算得出的，代表了你在各个项目中的评估结果</p>
                    <p>- 星星的个数越多，则表示你在该项目中的表现越良好</p>
                    <p>- 安我专家会根据你的具体答题情况，结合最终分数，给出最适合你的综合建议</p>
                  </div>  
                </div>  
              </div>  
            </div>:null
          }

          
           
        </div>
      </Page>
    )
  }
}

export default report
