import React, { Component, Fragment } from 'react'
import Page from '@src/components/page'
import styles from './reportHome.scss'
import { API, fun } from '@src/common/app'
import LoginCover from '@src/components/acitvityMould/loginCover'

import RedLight from './components/redLight'
import Category from './components/homeCategory'
import Program from './components/program'
//import Suggest from './components/suggest'
const { getParams } = fun
import ShareBanner from './components/shareBanner/index'
import images from './image'
import {
    shareLinkGoto
} from './BuriedPoint'
import { ReportLoader } from '@src/components/contentLoader'

import LineBar from './components/lineBar'
import echarts from 'echarts/lib/echarts' // 引入 ECharts 主模块
import 'echarts/lib/chart/radar'// 引入雷达图
import 'echarts/lib/component/tooltip' // 引入提示框组件

export default class ReportList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataInfo: [],
            name: '',
            userName: '',
            linkManId: '',
            code: '',
            QRlist: null,
            reportColor: '#fff',
            mobile: '',
            loginVisible: false,
            userInfo:{},
            programe:{},
            time:'',
            tipFlag:false,
            detail:{ 
                result:{
                "finishTime": "2020-08-03 18:54:01",
                "verdict": "张二帅人生最好的五个词：老病痊愈、久别重逢、失而复得、转危为安、虚惊一场18分，，基本信息",
                "picFlag": "1",
                "categoryArrary": [
                    {
                    "scoreResult": 32,
                    "explainsList": [
                        "<h5>标题一</h5>\n段落一段落一段落一段落一段落一段落一<br />\n<br />\n段落二段落二段落二段落二段落二段落二",
                        "很棒噢噢噢噢噢噢噢噢噢噢噢噢噢噢噢噢哦哦哦"
                    ],
                    "categoryVerdict": "张二帅你知道有些鸟儿是注定不会被关在笼子里的，它的每一片羽毛，都闪烁着自由的光辉。——《肖申克的救赎》$score分",
                    "scoreNum": 2,
                    "categoryDesc": "基本信息"
                    },
                    {
                    "scoreResult": 3,
                    "explainsList": [
                        "<h2>如果每个人的一生都是一本书<h2>，那么我希望，当有人翻来我这本书时，<h3>分不清书中的我们<h3>，谁才是真正的主人公。"
                    ],
                    "categoryVerdict": "张二帅涉江而过，芙蓉千朵。诗也简单，心也简单。——席慕蓉",
                    "scoreNum": 0.5,
                    "categoryDesc": "熙熙分类1"
                    },
                    {
                    "scoreResult": 25,
                    "explainsList": [
                        "长相思长相思,欲把相思说似谁,浅情人不知?",
                        "青丝井,七丈深,百年结发为良人",
                        "回忆到这儿,我突然热泪如倾,爱到底是个什么东西,为什么那么辛酸,那么苦痛,只要还能握住它,到死还是不肯放弃,到死也是甘心"
                    ],
                    "categoryVerdict": "张二帅秋日薄暮，用菊花煮竹叶青，人与海棠俱醉。——林清玄《温一壶月光下酒》",
                    "scoreNum": 1.5,
                    "categoryDesc": "熙熙分类2"
                    }
                ]},
                "linkManId": 2783043984245760,
                "qnaireUrl": "https://test02wechatshop.dnatime.com/mkt/report_suggest?linkManId=2783043984245760&qnaireCode=xixiwenjuan05&productCode=CNN&qnaireId=3146924833047552",
                "docs": "查看完整建议",
                "qnaireId": 3146924833047552,
                "userId": 2783013304763392,
                "btn": "查看完整建议",
                "qnaireCode": "xixiwenjuan05"
            }
            
        }
    }
    componentDidMount() {
        let _this=this
        if(this.state.detail.result.categoryArrary.length>=3){
            this.setState({
                time:!!this.state.detail.result?_this.replaceTime(this.state.detail.result.finishTime):''
            })
          _this.handleMarkRadarChart(this.state.detail.result.categoryArrary)
        }
    }

    toggleMask = (name) => {
        const bool = this.state[name]
        this.setState({
            [name]: !bool
        })
    }
    changeMobile = (num) => {
        this.setState({
            mobile: num
        })
    }
    // 设置登陆标示
    setLoginFlag = bool => {
        return
    }
    unlock=(item)=>{
        console.log({ productId:item.productId, productNum:1 });
        const{linkManId,code}=this.state
        const params = {
          linkManId,
          productList:[{ productId:item.productId, productNum:1 }],
          activeCode:code,
          actualType: 2
        }
        andall.invoke('confirmOrder', params)
    }

    handleMarkRadarChart = (data) => {
        console.log(data)
        console.log(document.getElementById('echartsRadar'))
        let list=[] // 文字
        let listValue=[] // 值
        data.map(item=>{
        list.push({
            text: item.categoryDesc,
            max:100
        })
        listValue.push(item.scoreResult)
        })
        var i = -1
        const geneData=data
        var myChart = echarts.init(document.getElementById('echartsRadar'))
        let option = {
        radar: [
            {
            indicator: list,
            center: ['50%', '50%'],
            radius: 70,
            startAngle: 90,
            splitNumber: 4,
            name: {
                formatter: (a)=>{
                i++;
                if(0<=`${data[i].scoreResult}` && `${data[i].scoreResult}`<=10){
                    return `{a|${a}}\n{img1|}`
                }
                else if(10<`${data[i].scoreResult}` && `${data[i].scoreResult}`<=20){
                    return `{a|${a}}\n{img2|}`
                }
                else if(20<`${data[i].scoreResult}` && `${data[i].scoreResult}`<=30){
                    return `{a|${a}}\n{img3|}`
                }
                else if(30<`${data[i].scoreResult}` && `${data[i].scoreResult}`<=40){
                    return `{a|${a}}\n{img4|}`
                }
                else if(40<`${data[i].scoreResult}` && `${data[i].scoreResult}`<=50){
                    return `{a|${a}}\n{img5|}`
                }
                else if(50<`${data[i].scoreResult}` && `${data[i].scoreResult}`<=60){
                    return `{a|${a}}\n{img6|}`
                }
                else if(60<`${data[i].scoreResult}` && `${data[i].scoreResult}`<=70){
                    return `{a|${a}}\n{img7|}`
                }
                else if(70<`${data[i].scoreResult}` && `${data[i].scoreResult}`<=80){
                    return `{a|${a}}\n{img8|}`
                }
                else if(80<`${data[i].scoreResult}` && `${data[i].scoreResult}`<=90){
                    return `{a|${a}}\n{img9|}`
                }
                else if(90<`${data[i].scoreResult}` && `${data[i].scoreResult}`<=100){
                    return `{a|${a}}\n{img10|}`
                }
                },
                rich: {
                a: {
                    color:"#38395B",
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 24,
                    align: 'center',
                },
                b: {
                    fontSize:22,
                    fontFamily:"DINAlternate-Bold,DINAlternate",
                    fontWeight:"bold",
                    color:'rgba(56,57,91,1)',
                    lineHeight: 28,
                    align: 'center',
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
                    color: ['rgba(101, 103, 229, 0.8)',
                        'rgba(101, 103, 229, 0.5)', 'rgba(101, 103, 229, 0.3)',
                        'rgba(101, 103, 229, 0.1)'],
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
       
    }
    openTipModal=(data)=>{
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
    jumpTo=(url)=>{
        window.location.href=url
    }
    render() {
        const { dataInfo, name, linkManId,
            QRlist, reportColor, loginVisible,userInfo ,programe,time,tipFlag,detail} = this.state
        return (
            // !name ? <ReportLoader /> :
                <Page title={name && `安我生活-${name}`} class={styles.page} >
                    <div>
                        <section className={styles.indexPage}>

                       
                        <div className={styles.suggest_panel}>
                            <div className={styles.suggest_title}>
                                <h1>综合建议</h1>
                                    {time?<div className={styles.title_right}>
                                        <p>测评日期</p>
                                        <p>{time}</p>
                                    </div>:null}    
                            </div> 
                            {!!detail.result?
                            <div>
                                {detail.result.picFlag==1?<div className={styles.tipsTxt} onClick={()=>this.openTipModal()}>
                                    说明
                                </div> :null} 
                                
                                {detail.result.picFlag==1?<div className={styles.echart_content}> 
                                    {detail.result.categoryArrary.length>=3?
                                    <div className={styles.echart_content_con}> 
                                        <div className={styles.echart_radar} id='echartsRadar' />
                                    </div>
                                    :
                                    <div className={styles.echart_line_con}> 
                                    {detail.result.categoryArrary.map((item,index)=>{
                                        return(
                                            <div className={styles.echart_line}>
                                                <LineBar item={item} num={index}></LineBar>
                                            </div>
                                            )
                                        })  
                                    }
                                    </div>  
                                    }
                                </div> :null}    
                                {!!detail.result.verdict?<div className={styles.echart_para}>
                                    <div className={styles.dotLeft}>
                                        <img src={images.dotLeft} />
                                    </div>
                                    <div className={styles.dotRight}>
                                        <img src={images.dotLeft} />
                                    </div>
                                    <div className={styles.echart_para_con} dangerouslySetInnerHTML={{__html:detail.result.verdict}}>
                                    </div>
                                </div> :null}
                                <div className={styles.echart_jump} onClick={()=>this.jumpTo(detail.qnaireUrl)}><span>{detail.btn}</span></div>
                            </div>
                            :<div className={styles.empty_chart}>
                                <img src={images.emptyChart} />
                                <h1>{detail.docsQnaire}</h1>
                                <div className={`${styles.btn} ${!detail.result?`${styles.disabled}`:'' }`} >{detail.btn}</div>
                            </div>
                            }


                            {tipFlag?<div className={styles.tips_modal}>
                                <div className={styles.modal_box}>
                                    <div className={styles.modal_close} onClick={()=>{this.closeTipModal()}}></div>
                                    <div className={styles.modal_content}>
                                    <h1>说明：</h1>
                                    <div className={styles.modal_para_con}>
                                        <p>·指数的分值是根据你的答案，通过智能算法得出。</p>
                                        <p>·分数区间在0～100，数值越大代表越优秀或严重。</p>
                                        <p>·完成测评后，我们会根据你的指数得分，给出你专属的综合建议。</p>
                                    </div>  
                                    </div>  
                                </div>  
                                </div>:null
                            } 
                        </div>
                                           
                            {/* {
                                dataInfo.map((item, index) => {
                                    switch (item.moduleType) {       
                                        case 4403:
                                            return (
                                                <div className={styles.suggest_panel}>
                                                    <div className={styles.suggest_title}>
                                                        <h1>综合建议</h1>
                                                            {time?<div className={styles.title_right}>
                                                                <p>测评日期</p>
                                                                <p>{time}</p>
                                                            </div>:null}    
                                                    </div> 
                                                    {!!item.data.result?
                                                        <div>
                                                            {item.data.result.picFlag==1?<div className={styles.tipsTxt} onClick={()=>this.openTipModal()}>
                                                                说明
                                                            </div> :null} 
                                                            
                                                            {item.data.result.picFlag==1?<div className={styles.echart_content}> 
                                                                {item.data.result.categoryArrary.length>=3?
                                                                <div className={styles.echart_content_con}> 
                                                                    <div className={styles.echart_radar} id='echartsRadar' />
                                                                </div>
                                                                :
                                                                <div className={styles.echart_line_con}> 
                                                                {item.data.result.categoryArrary.map((item,index)=>{
                                                                    return(
                                                                        <div className={styles.echart_line}>
                                                                            <LineBar item={item} num={index}></LineBar>
                                                                        </div>
                                                                        )
                                                                    })  
                                                                }
                                                                </div>  
                                                                }
                                                            </div> :null}    
                                                            {!!item.data.result.verdict?<div className={styles.echart_para}>
                                                                <div className={styles.dotLeft}>
                                                                    <img src={images.dotLeft} />
                                                                </div>
                                                                <div className={styles.dotRight}>
                                                                    <img src={images.dotLeft} />
                                                                </div>
                                                                <div className={styles.echart_para_con} dangerouslySetInnerHTML={{__html:item.data.result.verdict}}>
                                                                </div>
                                                            </div> :null}
                                                            <div className={styles.echart_jump} onClick={()=>this.jumpTo(item.data.qnaireUrl)}><span>{item.data.btn}</span></div>
                                                        </div>
                                                        :<div className={styles.empty_chart}>
                                                            <img src={images.emptyChart} />
                                                            <h1>{item.data.docsQnaire}</h1>
                                                            <div className={`${styles.btn} ${!item.data.result?`${styles.disabled}`:'' }`} >{item.data.btn}</div>
                                                        </div>
                                                        }


                                                        {tipFlag?<div className={styles.tips_modal}>
                                                            <div className={styles.modal_box}>
                                                                <div className={styles.modal_close} onClick={()=>{this.closeTipModal()}}></div>
                                                                <div className={styles.modal_content}>
                                                                <h1>说明：</h1>
                                                                <div className={styles.modal_para_con}>
                                                                    <p>·指数的分值是根据你的答案，通过智能算法得出。</p>
                                                                    <p>·分数区间在0～100，数值越大代表越优秀或严重。</p>
                                                                    <p>·完成测评后，我们会根据你的指数得分，给出你专属的综合建议。</p>
                                                                </div>  
                                                                </div>  
                                                            </div>  
                                                            </div>:null
                                                        }
                                                </div>
                                            )                            
                                    }
                                })
                            } */}
                        </section>

                       
                    </div>
                    
                </Page>
        )
    }
}
