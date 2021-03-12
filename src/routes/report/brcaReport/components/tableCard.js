import React, { Component } from 'react'
import styles from '../style.scss'
import images  from '../images'
import CardTitle from './cardTitle.js'

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
        let { data } = this.props;
        let array=[];
        data.map(item=>{
            array.push({...item,isShow: 0})
        })

        if(array.length>6){
            this.setState({
                btnFlag:true,
                newData:array.slice(0,6)
            })
        }
        else{
            this.setState({
                isShow:false,
                btnFlag:false,
                newData:array
            })
        }
    }
    showChange(){
        let { data } = this.props;
        let array=[];
        data.map(item=>{
            array.push({...item,isShow: 0})
        })
        
        let flag = this.state.btnFlag;
        this.setState({
            btnFlag: !flag        
        },()=>{
            this.setState({
                newData: !this.state.btnFlag ? array : array.slice(0,6)
            })
        })
       
    }
    hideTips(e){
        if(e){
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        }
        let { newData } = this.state;
        let array=[]
        newData.map((item,index)=>{
            array.push({...item,isShow:0})
        })
        this.setState({
            newData:array
        })
    }
    showTips(e,num,item){
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        let _this=this
        let { newData } = this.state;
        let array=[]
        newData.map((item,index)=>{
            array.push({...item,isShow:index==num?1:0})
        })
        
        this.setState({
            newData:array
        })
    }
    
    render() {
        const { data } = this.props;

        const {btnFlag, newData,showTips,isShow}=this.state;
        return (
          <div className={styles.tablePanel}>
            <CardTitle title='分型结果' />
            <div className={styles.tableCard} onClick={()=>this.hideTips()}>        
                <div className={styles.locus_table}>
                    <table className={`${isShow && !btnFlag? '' : `${styles.isShow}`}`}>
                        <tbody>
                            <tr>
                                <th><h1>基因</h1></th>
                                <th><h1>变异<br/>类型</h1></th>
                                <th><h1>位点</h1></th>
                                <th><h1>核苷酸<br/>变异</h1></th>
                                <th><h1>氨基酸<br/>变异</h1></th>
                                <th><h1>等位基<br/>因类型</h1></th>
                                <th><h1>解释</h1></th>
                            </tr>  
                            {newData.map((item,index)=>{
                                return(
                                    <tr className={`${index%2 === 0 ? '':`${styles.even}`} ${styles.locus_tr}`}>
                                        <td className={styles.en_txt}>{!!item.geneRefGene?item.geneRefGene:'/'}</td>
                                        <td className={styles.en_txt}>{!!item.clnsig?item.clnsig:'/'}</td>
                                        <td className={styles.en_txt}>{!!item.avsnp150?item.avsnp150:'/'}</td>
                                        <td className={styles.en_txt}>{!!item.patientCodeChange?item.patientCodeChange:'/'}</td>
                                        <td className={styles.en_txt}>{!!item.patientAAChange?item.patientAAChange:'/'}</td>
                                        <td className={styles.en_txt}>{!!item.type?item.type:'/'}</td>
                                        <td className={styles.en_txt} onClick={(e)=>this.showTips(e,index,item)}>
                                            <div className={`${styles.questionMask} ${item.isShow?`${styles.active}` :''} `} >
                                                <img src={images.ques} className={styles.questionImg} />
                                                <div className={styles.maskPart} onClick={(e)=>this.hideTips(e)}>
                                                     {item.interpretation}
                                                </div>   
                                            </div>    
                                        </td>   
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
                                    <img src={images.down} />
                                </div>        
                            </div>
                        </div>
                    </div>:null}
                </div>       
            </div>    
          </div> 
              
        )
    }
}

export default GeneLocus
