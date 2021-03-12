import React, { Component, Fragment } from 'react'
import styles from './style.scss'
import toright from '@static/reportEg/jt.png'
import images from './image'
import { fun } from '@src/common/app'
import LineBar from '../lineBar'
import echarts from 'echarts/lib/echarts' // 引入 ECharts 主模块
import 'echarts/lib/chart/radar'// 引入雷达图
import 'echarts/lib/component/tooltip' // 引入提示框组件
const { getParams } = fun


export default class Suggest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tipFlag:false,
            detail:{categoryArrary:[]}
        }
    }
    componentDidMount() {
        console.log(this.props.data);
        const{detail}=this.state;
        const{data}=this.props
        let _this=this
        _this.setState({
            detail:data.result,
            time:!!data.result?this.replaceTime(data.result.finishTime):''
        },()=>{
            console.log(data.result.categoryArrary);
            // if(data.result.categoryArrary.length>=3){
            //     // 
            // }  
            _this.handleMarkRadarChart(data.result.categoryArrary)  
        })
    }
    checkHighlight = el => {
        const { history } = this.props
        const { shareToken } = getParams()
        if (el.num) {
            history.push(
                `/reportShare/highLight?shareToken=${shareToken}&reportType=${el.reportType}&type=${el.type}&linkManId=${el.linkManId}&productCategory=${el.productCategory || 0}&status=${el.status || 0}&id=${el.id || 0}&code=${el.code}&barCode=${el.barCode}`
            )
        }
    }
    // 制作雷达图
    handleMarkRadarChart = (data) => {
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
    jumpTo=(url)=>{
        window.location.href=url
    }
    render() {
        const { data,userInfo } = this.props
        const {detail,tipFlag,time}=this.state;
        return (
           <div className={styles.suggest_panel}>
               <div className={styles.suggest_title}>
                   <h1>综合建议</h1>
                    {time?<div className={styles.title_right}>
                        <p>测评日期</p>
                        <p>{time}</p>
                    </div>:null}    
               </div> 
               {!data.result?
                <div>
                    {detail.picFlag==1?<div className={styles.tipsTxt} onClick={()=>this.openTipModal()}>
                        说明
                    </div> :null} 

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
                    </div> :null}    
                    {!!detail.verdict?<div className={styles.echart_para}>
                        <div className={styles.dotLeft}>
                            <img src={images.dotLeft} />
                        </div>
                        <div className={styles.dotRight}>
                            <img src={images.dotLeft} />
                        </div>
                        <div className={styles.echart_para_con} dangerouslySetInnerHTML={{__html:detail.verdict}}>
                        </div>
                    </div> :null}
                    <div className={styles.echart_jump} onClick={()=>this.jumpTo(data.qnaireUrl)}><span>{data.btn}</span></div>
                </div>
                :<div className={styles.empty_chart}>
                    <img src={images.emptyChart} />
                    <h1>{data.docsQnaire}</h1>
                    <div className={`${styles.btn} ${!data.result?`${styles.disabled}`:'' }`} >{data.btn}</div>
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
}
