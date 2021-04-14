import React, { useState, useEffect, useRef, useContext } from 'react'
import { LuckyWheel } from 'react-luck-draw'
import { ctx } from '../common/context'
import Header from '../common/header'
import GameRes from '../common/gameRes'
import Rulebox from '../common/rulebox'
import Footer from '../common/footer'
import { wheelImg, prizeImg } from '../tools/data'
import styles from './luckyDraw.scss'

let canPlay = true

export default function Wheel(props) {
  const { gData, gameDone, actNum, toLottly, gameEnd } = useContext(ctx)
  const [prizes, setprizes] = useState([])
  const [showhand, setshowhand] = useState(true)
  const myWheel = useRef()

  useEffect(() => {
    touchprize()
  }, [])

  useEffect(() => {
    if (!gameDone) {
      canPlay = true
      setshowhand(true)
    }
  }, [gameDone])

  function touchprize() {
    const arr = gData?.prize?.map((pri, ind) => {
      const { prizeName, prizeImage, prizeCode } = pri
      const background = ind % 2 === 1 ? 'rgba(253, 235, 178, 1)' : '#fff'
      return {
        background,
        fonts: [{ text: prizeName, top: '9%', prizeCode }],
        imgs: [{ src: prizeImage || `${prizeImg}${ind + 1}@2x.png`, width: '35%', top: '35%' }],
      }
    })
    setprizes(arr)
  }

  const Wconfig = {
    blocks: [
      {
        padding: '34px',
        imgs: [{ src: `${wheelImg}turntable@2x.png`, width: '300px' }],
      },
    ],
    buttons: [
      {
        radius: '35px',
        background: '#ffdea0',
        imgs: [{ src: `${wheelImg}begain.png`, width: '96px', top: -65 }],
      },
    ],
    defaultStyle: { fontColor: '#d64737', fontSize: '12px' },
    prizes,
  }

  function goPlay() {
    // if (!canPlay) return
    // canPlay = false

    setshowhand(false)
    toLottly(myWheel)
  }

  return (
    <div className={styles.luckybox}>
      {/* 头部 */}
      <Header {...props} baseImg={wheelImg} />

      <LuckyWheel
        ref={myWheel}
        width="300px"
        height="300px"
        blocks={Wconfig.blocks}
        prizes={Wconfig.prizes}
        buttons={Wconfig.buttons}
        defaultStyle={Wconfig.defaultStyle}
        onStart={goPlay}
        onEnd={gameEnd}
      />

      <img className={`${styles.hand} ${showhand ? '' : styles.hide}`} src={`${wheelImg}Gesture guidance@2x.png`} alt="" />
      <img className={styles.wheelshadow} src={`${wheelImg}shadow@2x.png`} alt="" />
      <p className={styles.counter}>{`您${gData?.activityJoinType === 1 ? '当前' : '今日'}还剩 ${actNum} 次抽奖机会`}</p>

      {/* 规则 */}
      <Rulebox baseImg={wheelImg} />

      {/* footer */}
      <Footer />

      {/* 结束弹层 */}
      {gameDone && <GameRes {...props} />}
    </div>
  )
}
