import React from 'react'
import styles from '../mould'

class UnlockAnswer extends React.Component {
    state = {
        
    }
    close = () =>{
        const {bindProps} = this.props;
        bindProps(false);
    }
    
    render () {
        const {num} = this.state;
        return (
            <div className={styles.answerWrap} onClick={()=>this.setState({answerVisible:false})}>
                <div className={styles.answer}>
                    <h3>什么是解锁</h3>
                    <p>如果您已收到第一份基因检测报告，解锁即代表您授权安我基因对您的原始生物数据进行再次解读（无需再次采集唾液），生成对应产品的检测报告。如果您是新用户，解锁即为下单购买该项基因检测服务。</p>
                    <span onClick={()=>{this.close()}}></span>
                </div>
            </div>
        )
    }
}

export default UnlockAnswer