import React, { useState, useEffect, useRef } from 'react'
import imgs from './componets/images'
import styles from './success.scss'

export default function Success({ togglePopup }) {
  const [eggList, seteggList] = useState([])

  useEffect(() => {
    // setprizeList(touchPrize())
  }, [])

  function toClose() {
    togglePopup()
  }

  return (
    <div id="modal-success" className={styles.modalWrap}>
      <div className={styles.blink}></div>
      <div className={styles.modalContent}>
        <div className={styles.redPacket}>
          <div className={styles.redPacketHead}></div>
          <div className={styles.redPacketBody}></div>
          <div className={styles.card}>
            <div className={styles.prize}>
              <img src={imgs.prizeImg} alt="奖品" />
            </div>
          </div>
        </div>
        <div id="fetch-prize" className={styles.fetchBtn}>
          我要领奖
        </div>
        <div onClick={toClose} className={styles.closeUuccess}></div>
      </div>
    </div>
  )
}
