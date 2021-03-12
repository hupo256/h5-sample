import React from 'react'
import styles from '../mould'

class Coupons extends React.Component {
    state = {
        
    }
    
    render () {
        const {data,showModal} = this.props;
        return (
            <div className={styles.couponsWrap}>
                {data.map((item,index)=>{
                    return <div key={index} onClick={()=>showModal()}>{item}</div>
                })}
            </div>
        )
    }
}

export default Coupons