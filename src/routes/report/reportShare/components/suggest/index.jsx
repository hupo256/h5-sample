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
        let _this=this;
        const{data}=this.props
        this.setState({
            detail:data,
            time:!!data.result?this.replaceTime(data.result.finishTime):''
        },()=>{
            console.log(this.state.detail)
            if(!!this.state.detail.result){
                console.log(this.state.detail.result);
                if(this.state.detail.result.categoryArrary.length>2 && this.state.detail.result.picFlag==1){
                   _this.handleMarkRadarChart(this.state.detail.result.categoryArrary)
                }  
            }
              
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
                    fontSize:22,
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
                    'rgba(246,246,254,1)']
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
        const { shareToken } = getParams()
        window.location.href=url+"&shareToken="+shareToken
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
               {!!data.result?
                <div>
                    {data.result.picFlag==1?<div className={styles.tipsTxt} onClick={()=>this.openTipModal()}>
                        说明
                    </div> :null} 

                    {data.result.picFlag==1?<div className={styles.echart_content}> 
                        {data.result.categoryArrary.length>=3?
                        <div className={styles.echart_content_con}> 
                            <div className={styles.echart_radar} id='echartsRadar' />
                        </div>
                        :
                        <div className={styles.echart_line_con}> 
                        {data.result.categoryArrary.map((item,index)=>{
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
                    {data.result.picFlag==1?null:<div className={styles.whiteBlock}></div>}
                       
                    {!!data.result.verdict?<div className={styles.echart_para}>
                        <div className={styles.dotLeft}>
                            <img src={images.dotLeft} />
                        </div>
                        <div className={styles.dotRight}>
                            <img src={images.dotLeft} />
                        </div>
                        <div className={styles.echart_para_con} dangerouslySetInnerHTML={{__html:data.result.verdict}}>
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
                            <p>- 星星的个数是通过你的问卷答案计算得出的，代表了你在各个项目中的评估结果</p>
                            <p>- 星星的个数越多，则表示你在该项目中的表现越良好</p>
                            <p>- 安我专家会根据你的具体答题情况，结合最终分数，给出最适合你的综合建议</p>
                        </div>  
                        </div>  
                    </div>  
                    </div>:null
                }
           </div>

        )
    }
}
