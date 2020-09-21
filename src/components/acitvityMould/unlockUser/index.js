import React from 'react'
import styles from '../mould'


class UnlockUser extends React.Component {
    state = {
        answerVisible:false
    }

    closeAnswer = () =>{
        this.setState({
            answerVisible:false
        })
    }
    
    render () {
        const {answerVisible} = this.state;
        const {dataList,chooseID,changeId,showAnswer} = this.props;
        return (
            <div className={styles.unlockWrap}>
                <div className={styles.newUser}>
                    <h3>解锁用户<span onClick={()=>showAnswer(true)}>什么是解锁？</span></h3>
                    <div className={styles.userBtnWrap}>
                        {dataList.map((item,index)=>{
                            if(item.usableStatus === 0){
                                return <div key={index} className={`${styles.userUnlock} ${styles.userCommon}`} >{item.userName}</div>
                            }else if(item.linkManId === chooseID && item.usableStatus !== 0){
                                return <div key={index} className={`${styles.userInfo} ${styles.userCommon}`} onClick={()=>changeId(item.linkManId)} >{item.userName}</div>
                            }else{
                                return <div key={index} className={`${styles.userInfoUn} ${styles.userCommon}`} onClick={()=>changeId(item.linkManId)} >{item.userName}</div>
                            }
                        })}
                        
                        {/* <div className={`${styles.userInfoUn} ${styles.userCommon}`}>1122多少岁</div>
                        <div className={`${styles.userUnlock} ${styles.userCommon}`}>1122多少岁</div> */}
                    </div>
                </div>
                
            </div>
        )
    }
}

export default UnlockUser