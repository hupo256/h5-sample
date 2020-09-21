import React, { Component } from 'react'
import styles from '../style.scss'
import images  from '../images'
import CardTitle from './cardTitle.js'


class TabConclusion extends Component {
    state={
        currentId:0,
    }
    static propTypes = {

    }
    componentDidMount() {
        const{tabIndex}=this.props;
        this.setState({
            currentId:tabIndex
        })
    }
    changeTab(obj){
        this.setState({
            currentId:obj 
        })
        this.props.handleTab(obj)

    }
    
    
    render() {
        const {currentId}=this.state;
        const {data}=this.props;
        return (
           <div className={styles.tabConclusion}>  

                <div className={styles.tab}> 
                    {data.reportBrcaAdvices.map((item,index)=>{
                        return(
                            <div className={`${styles.tab_item} ${currentId==index? `${styles.active}`:''}`} onClick={()=>{this.changeTab(index)}}>
                                {item.type}
                            </div>    
                        )
                    })}
                </div>
                <div className={styles.TabPartCon}>
                    <div className={styles.tab_img} style={{backgroundImage:`url(${currentId==0?`${images.productBg_0}`:`${images.productBg_1}`})`}}>
                        <h1>结合评测问卷，你目前的{data.reportBrcaAdvices[currentId].type}风险</h1>
                        <p>{data.reportBrcaAdvices[currentId].level}</p>
                    </div>
                    <div className={styles.tab_info}>
                        <p dangerouslySetInnerHTML={{ __html: data.reportBrcaAdvices[currentId].explain }}></p>
                        {!!data.finishTime?<h5>测评日期：{data.finishTime}</h5>:null}
                    </div>    
                </div>       
           </div>
        )
    }
}

export default TabConclusion
