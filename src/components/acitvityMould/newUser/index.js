import React from 'react'
import styles from '../mould'
import delPng from '@static/newUserComponent/del.png'
import addPng from '@static/newUserComponent/add.png'

import {Toast} from 'antd-mobile'

class NewUser extends React.Component {
    state = {
        num:1,
        limitNum:0
    }

    changeNum = (type)=>{
        let {num} = this.state;
        const {limitNum,setNum} = this.props;
        if(type === "add"){
            if(+num === +limitNum){
                Toast.info(`最多购买${limitNum}件`,2)
                return
            }
            num ++
        }else{
            if(+num===1){
                return;
            }
            num --
        }
        this.setState({
            num
        })
        setNum(num)
    }

    render () {
        const {num} = this.state;
        const {chooseID,changeId,numBtnVisible,limitNum} = this.props;
        return (
            <div className={styles.unlockWrap}>
                <div className={styles.newUser}>
                    <h3>新购用户</h3>
                    <div className={styles.userBtnWrap}>
                        {limitNum !== 0 && <div onClick={()=>{changeId("newuser")}} className={`${chooseID === "newuser" ? styles.userInfo:styles.userInfoUn} ${styles.userCommon}`}>新用户</div>}
                        {limitNum === 0 && <div className={`${styles.userUnBuy} ${styles.userCommon}`} onClick={()=>{Toast.info("已达新购上限")}}>新用户</div>}
                        {numBtnVisible && limitNum > 0 && <div className={styles.numWrap}>
                            <img src={delPng} onClick={()=>this.changeNum("del")} />
                            <img src={addPng} onClick={()=>this.changeNum("add")} />
                            <div>{num}</div>
                        </div>}
                    </div>
                </div>
            </div>
        )
      }
}

export default NewUser
