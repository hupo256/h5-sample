import React, { useState } from 'react'
import images from '../images'
import {vipPageGoto} from '../BuriedPoint'
import styles from '../../members'
import { Link } from 'react-router-dom'
import fun from '@src/common/utils'
const { setSession} = fun


export default function Headuser(userState, history, proInfo, memberInfo,couponPrice) {
  const newUser = userState === 1
  const isMembers = userState === 2
  const isOverdue = userState === 3
  const { contractPrice='' } = proInfo || {}
  const couponPriceAll = couponPrice
  const { showEndTime = '', isMember='',endTime='', isWxContract = '', isAliContract='', username='', imageUrl='',discountPrice="" } = memberInfo || {}
  const contract = !!(isWxContract || isAliContract)
  const user_state = touchUseState(userState, 1)

  function touchUseState(num, log){
    if(!log) return '0'
    if(num === 1) return '1'
    if(num === 2) return '2'
    if(num === 3) return '3'
  }

  function gotoPay() {
    const pointConfig = {
      Btn_name: 'buy_vip',
      user_state,
    }
    vipPageGoto(pointConfig)

    history.push({
      pathname: `/members/members-pay`,
      search: `hideTitleBar=1`,
      state: { ...proInfo }
    })
  }
  function LinkGoto(){
    console.log(discountPrice);
    history.push({
      pathname: `/members/record-list`,
      search: `hideTitleBar=1`,
      state: { }
    })
  }

  function editRene() {
    const pointConfig = {
      Btn_name: 'manage_renew',
      user_state,
    }
    contract && vipPageGoto(pointConfig)
    // let data={...proInfo,  contract, endTime}
    // setSession('vipInfo',data)
    // location.href={}+"mkt/members/members-renewal?hideTitleBar=1";
    history.push({
      pathname: `/members/members-renewal`,
      search: `hideTitleBar=1`,
      state: { ...proInfo,  contract, endTime}
    })
  }
  function save(){
    console.log(user_state);
    const pointConfig = {
      Btn_name: 'saving_record',
      user_state,
    }
    //console.log(pointConfig);
    vipPageGoto(pointConfig)
  }

  return (
    // <div className={styles.membox}>
    //   <div className={styles.personbox}>
    //     <img src={imageUrl || images.person1} alt="person" />
    //     <div className={styles.namebox}>
    //       <p>
    //         <b className={styles.ellipsis}>{username || '小安'}</b>
    //       </p>     
    //       {isMembers && <p>{showEndTime}</p>}
    //       {isOverdue && <p className={styles.overdue}>{showEndTime}</p>}
    //     </div>
    //   </div>

    //   {!newUser && <p className={styles.torenewal}>
    //     <span onClick={editRene}>{contract ? '管理自动续费' : '购买记录'}</span>
    //     <img src={images.toright} alt="" />
    //   </p>}

    //   {!newUser && (isOverdue || !contract) ?
    //     <p className={styles.toduete} onClick={gotoPay}>
    //       <span>¥<b>{contractPrice}</b>/月</span><span>立即续费</span>
    //     </p> : ''
    //   }

    // </div>

    <div className={styles.user_card}>
      <div className={styles.user_content}>
        <div className={styles.user_info}>
          <div className={styles.user_avatar} style={{backgroundImage: `url(${imageUrl || images.person1})`}}>
            {isMember?(<div className={styles.crown}></div>) : null}
          </div>  
          <div className={styles.user_txt_con}>
            <h1>{username ? username : '小安'}</h1>
            {/* {!newUser?
              (isMembers || isOverdue && <p><span>{showEndTime}到期 {contract?"续费管理":''}</span></p>):
              isMembers || isOverdue && <p><span>{showEndTime}到期 </span></p>
            } */}
            {/* {!newUser && <p className={styles}>
              <span onClick={editRene}>{endTime}到期 {contract ? '' : '续费管理'}</span>
            </p>} */}

            {isMembers? <p><span onClick={editRene}>{endTime}到期{contract ? ' 续费管理' : ' '}</span></p>:null}
            {isOverdue ? <p className={styles.overdue}><span onClick={editRene}>已于{endTime}到期</span></p>:null} 

            {/* {!contract && !isOverdue && <p className={styles.overdue}><span onClick={editRene}>{endTime}到期</span></p>} */}
            
            {/* {(contract&&!isOverdue)&& <p className={styles.overdue}><span onClick={editRene}>{endTime}到期{contract ? ' 续费管理' : ' '}</span></p>}
                   */}


            {/* {!newUser && (isOverdue || !contract) ?
              <p className={styles.toduete} onClick={gotoPay}>
              <span>¥<b>{contractPrice}</b>/月</span><span>立即续费</span>
            </p> : ''
            } */}

          </div>  
        </div>  
        <div className={styles.user_detail}>
          <img src={images.vipIcon} />
          <div onClick={save}>
          <Link to='/members/record-list?hideTitleBar=1' className={`${styles.user_save_detail}`}>
            <h1>¥<span>{discountPrice}</span></h1>
            <p>已为您节省</p>
          </Link>  
          </div>
        </div>  
      </div>  
    </div>
  )
}
