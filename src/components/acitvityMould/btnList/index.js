import React from 'react'
import styles from '../mould'

class BtnList extends React.Component {
    state = {

    }

    render () {
        const {dataList,showConfirm,isBangs} = this.props;
        return (
            <div className={styles.botBtnWrap}>
                {dataList.map((item,index,ary)=>{
                    return <div key={index} style={{color:`${item.buttonTextColor}`,background:`${item.buttonColor}`,width:`${100/ary.length}%`}} onClick={()=>{showConfirm(item,`botButton${index+1}`, index)}}>{item.buttonText}</div>
                })}
                {isBangs && <div className={styles.isBangs}></div>}
            </div>
        )
    }
}

export default BtnList
