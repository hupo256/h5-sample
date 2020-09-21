import React from 'react';
import styles from './suggest.scss'
import images from '../../images'
class Title extends React.Component {
    state = {
        flag: false,
        btnFlag: true  
    }
    componentDidMount() {
        const { item } = this.props  
        let count=0
        item.explainsList.map(item=>{
            count+=item.length
        })
        count+=!!item.categoryVerdict?item.categoryVerdict.length:0
        console.log(count)
       
        
        this.setState({
            flag: count>200 ? true:false, 
            btnFlag: count>200 ? true:false,     
        }) 
  
    }
    showChange(){
        const { btnFlag } = this.state; 
        this.setState({
            btnFlag: !btnFlag
        }) 
    }   
    render() {
        const { item } = this.props
        const {flag,btnFlag}=this.state
        return (
            (item.explainsList.length>0 || !!item.categoryVerdict)?
                <div className={styles.suggest_block}>
                    <div className={styles.suggest_title_con}>
                        <div className={styles.suggest_title}>
                            <div className={styles.suggest_title_txt}>{item.categoryDesc}</div>
                            <div className={styles.suggest_rank_star}>
                                {item.scoreNum==0?<img src={images.rankZero} />:null}
                                {0<item.scoreNum && item.scoreNum<=0.5?<img src={images.rankOne} />:null}
                                {0.5<item.scoreNum && item.scoreNum<=1?<img src={images.rankTwo} />:null}
                                {1<item.scoreNum && item.scoreNum<=1.5?<img src={images.rankThree} />:null}
                                {1.5<item.scoreNum && item.scoreNum<=2?<img src={images.rankFour} />:null}
                                {2<item.scoreNum && item.scoreNum<=2.5?<img src={images.rankFive} />:null}
                                {2.5<item.scoreNum && item.scoreNum<=3?<img src={images.rankSix} />:null}
                                {3<item.scoreNum && item.scoreNum<=3.5?<img src={images.rankSeven} />:null}
                                {3.5<item.scoreNum && item.scoreNum<=4?<img src={images.rankEight} />:null}
                                {4<item.scoreNum && item.scoreNum<=4.5?<img src={images.rankNine} />:null}
                                {4.5<item.scoreNum && item.scoreNum<=5?<img src={images.rankTen} />:null}  
                            </div>
                        </div>
                    </div>
                
                    <div className={ btnFlag?`${styles.suggest_menu_con_out}`:''}>
                        <div className={ flag?`${styles.suggest_menu_con}`:''}>
                            <div className={styles.suggest_desc} dangerouslySetInnerHTML={{__html:item.categoryVerdict}}>
                            </div> 
                            {item.explainsList.length>0 && item.explainsList.map(items=>{
                                return(
                                    <div className={styles.suggest_menu}>
                                        <div className={styles.dot}></div>
                                        <div className={styles.suggest_txt_con}  dangerouslySetInnerHTML={{__html:items}}>
                                        </div>
                                    </div>    
                                )
                            })}
                        </div> 
                    </div>
                    {flag?            
                        <div onClick={() => this.showChange()} className={`${styles.suggest_more_btn} ${btnFlag?'':`${styles.active}`}`} >
                            <div className={styles.suggest_more}>
                                <div className={styles.btn}>
                                    <span>{btnFlag?'展开详情':'收起详情'}</span>
                                    <div className={btnFlag? '' : styles.active }>
                                        <img src={images.arrowBottom} />
                                    </div>        
                                </div>
                            </div>
                        </div>:null
                    }
                     
            </div>:null
        )
    };
}

export default Title;