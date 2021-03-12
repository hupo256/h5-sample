import React, { Component } from 'react'
import styles from './geneDetail.scss'
import images from '../../images'

class GeneDetail extends Component {
    state={
        array:[],
        currentIndex:''
    }
    static propTypes = {

    }
    componentDidMount() {
        const { data = {} } = this.props;
        console.log(data);
        if(!!data.geneDtos){
            data.geneDtos.map(item=>{
                item.tipShowOne = false;
                item.tipShowTwo = false;
            })
            this.setState({
                array:data.geneDtos
            })
            
        }
    }
    hideTips(){ 
        this.resetTips()
    }
    resetTips(){
        const { data = {} } = this.props;
        if(!!data.geneDtos){
            data.geneDtos.map(item=>{
                item.tipShowTwo = false;
                item.tipShowOne = false;
            })
            this.setState({
                array:data.geneDtos
            })
        }
        
    }
    showTipsOne(e,index){
        this.resetTips()
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        let _this=this;
        let array = this.state.array;
        array[index].tipShowOne = true;
        this.setState({
            array
        }) 
    }
    showTipsTwo(e,index){
        this.resetTips()
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        let _this=this;
        let array = this.state.array;
        array[index].tipShowTwo = true;
        this.setState({
            array
        })   
    }
    
    render() {
        const { data } = this.props
        const{ array}=this.state;
        return (
            <div className={styles.cardPanel}>
                {array.length>0&& array.map((item,index)=>{
                    return(
                        <div className={styles.card} onClick={()=>this.hideTips()}>
                            <div className={styles.gene_detail}>  
                                <div className={styles.gene_header}>
                                    <h1>{item.gsite}</h1>
                                    {data.isExitGeneSub==1?
                                        <div className={styles.gene_header_right}>
                                            {!!item.frequencyDto&&item.frequencyDto.chromosomePicUrl?
                                            item.frequencyDto.chromosome.indexOf('线粒体')!=-1?
                                                <img src={item.frequencyDto.chromosomePicUrl} className={`${styles.img}`}/>
                                            :   <div className={styles.imgContent}>
                                                    <div className={styles.imgCon}>
                                                        <img src={item.frequencyDto.chromosomePicUrl} />
                                                        <img src={item.frequencyDto.chromosomePicUrl} />
                                                    </div>
                                                </div>
                                            : null
                                            }
                                            <p>{item.gname?item.gname:''}{!!item.frequencyDto&&!!item.frequencyDto.chromosome?'，'+item.frequencyDto.chromosome:''}</p>
                                        </div> :
                                        <div className={styles.gene_header_right}>
                                            <p>{item.gname?item.gname:''}</p>
                                        </div>    
                                    } 
                                </div>
                                {data.isExitGeneSub==1?<div className={styles.gene_block}>
                                    {!!item.geneType?<div className={styles.gene_block_field}>
                                        <div className={styles.gene_block_field_txt}>我的基因型</div>
                                        {!!item.geneType?<div className={styles.richTxt} dangerouslySetInnerHTML={{ __html:item.geneType }}></div>:null}
                                    </div>:null}
                                    {!!item.frequencyDto&&!!item.frequencyDto.effectAllele?<div className={styles.gene_block_field}>
                                        {data.diseaseType==1?
                                        <div className={styles.gene_block_field_txt}>
                                            <div className={styles.tipsMaskOut} onClick={(e)=>this.showTipsOne(e,index)}>风险变异<img src={images.tipsIcon} />
                                                {item.tipShowOne ? (
                                                    <div className={`${styles.tipsMask} ${styles.active}`}>
                                                        变异指任何人之间DNA的差异。例如，某些人可能在DNA的某个位置是“A”，而其他人可能是“G”。基因检测正是检测你是否携带某些变异，从而得出你的报告结论。风险变异，即风险等位基因（Risk Allele），指可能导致本项目患病风险增加的等位基因，同一位点在不同项目中风险等位基因可能不同。
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>:
                                         <div className={styles.gene_block_field_txt}>
                                            <div className={styles.tipsMaskOut} onClick={(e)=>this.showTipsOne(e,index)}>变异<img src={images.tipsIcon} />
                                                {item.tipShowOne ? (
                                                    <div className={`${styles.tipsMask} ${styles.tips} ${styles.active}`}>
                                                       变异指任何人之间DNA的差异。例如，某些人可能在DNA的某个位置是“A”，而其他人可能是“G”。基因检测正是检测你是否携带某些变异，从而得出你的报告结论。
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                                        }
                                        {!!item.frequencyDto?<p>{item.frequencyDto.effectAllele.map(item=>{
                                            return(
                                                <span>{item.genotype}</span>
                                            )
                                        })}</p>:null}
                                    </div>:null }
                                    {!!item.frequencyDto&&!!item.frequencyDto.populationGFreq?<div className={styles.gene_block_field}>
                                        <div className={styles.gene_block_field_txt}>
                                            <div className={styles.tipsMaskOut}  onClick={(e)=>this.showTipsTwo(e,index)}>基因型频率人群分布<img src={images.tipsIcon} />
                                                {item.tipShowTwo ? (
                                                    <div className={`${styles.tipsMask}  ${styles.two} ${styles.active}`}>
                                                        基因型频率指不同基因型的个体在全部个体中所占的比例。如100个人中，该位点上基因型为AA的有35人，则AA的基因型频率为35.0%。下图展示东亚人群的基因型频率分布，数据来源于1000Genomies Project。
                                                    </div>
                                                ) : null}   
                                            </div>                                         
                                        </div> 
                                    </div>:null} 
                                    {!!item.frequencyDto&&!!item.frequencyDto.populationGFreq?<div className={styles.gene_area_con} >
                                        {item.frequencyDto.showType==1?
                                            <div className={styles.gene_value_other_con}>
                                            {item.frequencyDto.populationGFreq.map(items=>{
                                                return(<div className={`${styles.gene_other_item} ${!!items.myRateFlag?`${styles.active}`:''}`}>
                                                    {items.genotype} {items.value}
                                                </div>)
                                            })}
                                            </div>  
                                        :
                                        <div>
                                            <div className={styles.gene_area}>
                                                {item.frequencyDto.populationGFreq.map(items=>{
                                                    return(<div className={styles.gene_bar} style={{width: items.value}}>
                                                    </div>)
                                                })}
                                            </div>
                                            <div className={styles.gene_value_con}>
                                                {item.frequencyDto.populationGFreq.map(items=>{
                                                    return(<div className={styles.gene_item}>
                                                        {items.genotype}:{items.value}
                                                    </div>)
                                                })}
                                            </div>  
                                        </div>
                                    
                                        }
                                          
                                    </div> :null}      
                                </div> 
                                :
                                    <div className={styles.gene_block}>
                                        <div className={styles.gene_block_field}>
                                            <div className={styles.gene_block_field_txt}>我的基因型</div>
                                            <div className={`${styles.richTxt} ${styles.active}`} dangerouslySetInnerHTML={{ __html:item.geneType }}></div>
                                        </div>
                                    </div>
                                }
                                <div className={styles.gene_desc}>
                                    <h1>基因位点释义：</h1>
                                    <p>{item.siteDes}</p>
                                </div>       
                            </div>
                        </div>
                    )
                })}  
            </div>  
        )
    }
}

export default GeneDetail
