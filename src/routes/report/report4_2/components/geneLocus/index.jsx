import React, { Component } from 'react'
import styles from './geneLocus.scss'
import images  from '../../images'

class GeneLocus extends Component {
    state={
        btnFlag:false,
        newData: [],
        showTips:false,
        isShow: true
    }
    static propTypes = {

    }
    componentDidMount() {
        const { data } = this.props;

        if(data.variantDetailDtoList.length>6){
            this.setState({
                btnFlag:true,
                newData:data.variantDetailDtoList.slice(0,6)
            })
        }
        else{
            this.setState({
                isShow:false,
                btnFlag:false,
                newData:data.variantDetailDtoList
            })
        }
    }
    showChange(){
        const { data } = this.props;
        let flag = this.state.btnFlag;
        this.setState({
            btnFlag: !flag,
            newData: flag ? data.variantDetailDtoList : data.variantDetailDtoList.slice(0,6)
        })
    }
    hideTips(e){
        this.setState({
            showTips:false
        }) 
    }
    showTips(e){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        let _this=this
        this.setState({
            showTips:true
        })
    }
    
    render() {
        const { data } = this.props;

        const {btnFlag, newData,showTips,isShow}=this.state;
        return (
            <div className={styles.card} onClick={()=>this.hideTips()}>
                {data.isExitGeneSub==1?
                    <div className={styles.locus_header}>   
                        <div className={styles.locus_title}>
                            <h1>共检测的位点</h1>
                            <p><span>{data.variantTotal}</span>个</p>
                        </div>
                        <div className={styles.locus_title}>
                            <h1>检测到的风险变异</h1> 
                            <p className={styles.redTxt}><span>{data.riskVariantCount}</span>个</p>
                        </div>
                    </div> :
                    <div className={styles.locus_header_con}>
                        <h1>共检测的位点个数</h1>
                        <p><span>{data.variantTotal}</span></p>
                    </div>    
                }
                <div className={styles.locus_table}>
                    <table className={`${isShow && !btnFlag? '' : `${styles.isShow}`}`}>
                        <tbody>
                            {data.isExitGeneSub==1?
                                <tr>
                                    <th>位点</th>
                                    <th>基因</th>
                                    <th><h1>所属<br/>染色体</h1></th>
                                    <th><h1>我的<br/>基因型</h1></th>
                                    <th>
                                        {data.diseaseType==1?<div onClick={(e)=>this.showTips(e)}>风险变异<img src={images.tipsIcon} />
                                            <div className={`${styles.tipsMask} ${showTips?`${styles.active}`:''}`}>
                                            变异指任何人之间DNA的差异。例如，某些人可能在DNA的某个位置是“A”，而其他人可能是“G”。基因检测正是检测你是否携带某些变异，从而得出你的报告结论。风险变异，即风险等位基因（Risk Allele），指可能导致本项目患病风险增加的等位基因，同一位点在不同项目中风险等位基因可能不同。
                                            </div>    
                                        </div>:
                                        <div onClick={(e)=>this.showTips(e)}>变异<img src={images.tipsIcon} />
                                            <div className={`${styles.tipsMask} ${showTips?`${styles.active}`:''}`}>
                                            变异指任何人之间DNA的差异。例如，某些人可能在DNA的某个位置是“A”，而其他人可能是“G”。基因检测正是检测你是否携带某些变异，从而得出你的报告结论。
                                            </div>    
                                        </div>}
                                    </th>
                                </tr>:
                                <tr className={styles.three_tr}>
                                    <th>位点</th>
                                    <th>基因</th>
                                    <th>我的基因型</th>
                                </tr>    
                            }
                            {newData.map((item,index)=>{
                                return(
                                    <tr className={`${index%2 === 0 ? '':`${styles.even}`} ${styles.locus_tr}`}>
                                        <td className={`${styles.en_txt} ${styles.uppercase}`}>{item.variant}</td>
                                        <td className={styles.en_txt}>{item.gene}</td>
                                        {data.isExitGeneSub==1?<td>{item.chromosome}</td>:null}
                                        <td className={styles.en_txt} dangerouslySetInnerHTML={{__html:item.myGeneType}}></td>
                                        {data.isExitGeneSub==1?<td>{!!item.isCarryFlag?'携带':'未携带'}</td>:null}
                                    </tr>  
                                    )
                                })
                            }
                              
                        </tbody>    
                    </table>
                    {isShow?<div onClick={() => this.showChange()} className={`${styles.suggest_more_btn} ${btnFlag?'':`${styles.active}`}`} >
                        <div className={styles.suggest_more}>
                            <div className={styles.btn}>
                                <span>{btnFlag?'展开详情':'收起详情'}</span>
                                <div className={btnFlag? '' : styles.active }>
                                    <img src={images.arrowBottom} />
                                </div>        
                            </div>
                        </div>
                    </div>:null}
                </div>       
            </div>    
           
              
        )
    }
}

export default GeneLocus
