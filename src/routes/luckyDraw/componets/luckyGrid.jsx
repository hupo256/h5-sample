import React, { useState, useEffect, useRef, useContext } from 'react'
import { LuckyGrid } from 'react-luck-draw'
import { ctx } from '../common/context'
import Header from '../common/header'
import GameRes from '../common/gameRes'
import Rulebox from '../common/rulebox'
import Footer from '../common/footer'
import { gridImg, axis } from '../tools/data'
import styles from './luckyDraw.scss'

let canPlay = true

export default function Grid(props) {
  const { gData, gameDone, actNum, toLottly, gameEnd, activityJoinType } = useContext(ctx)
  const [prizes, setprizes] = useState([])
  const myGrid = useRef()

  useEffect(() => {
    touchprize()
  }, [])

  useEffect(() => {
    !gameDone && (canPlay = true)
  }, [gameDone])

  function touchprize() {
    const arr = gData?.prize?.map((pri, ind) => {
      const { prizeName, prizeImage, prizeCode } = pri
      return {
        x: axis[ind][0],
        y: axis[ind][1],
        index: ind,
        name: prizeName,
        fonts: [{ text: prizeName, fontSize: '12px', top: '72%', prizeCode }],
        imgs: [{ src: prizeImage, width: '53%', top: '6%' }],
      }
    })
    setprizes(arr)
  }

  const Gconfig = {
    blocks: [{ padding: '4px', background: '#721DE2', borderRadius: 20 }],
    buttons: [
      {
        x: 1,
        y: 1,
        background: 'linear-gradient(90deg, #e94c3b, #FF1111)',
        shadow: '0 5 1 #e94c3b',
        imgs: [{ src: `${gridImg}text.png`, width: '70%', top: '35%' }],
      },
    ],
    activeStyle: {
      background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
      shadow: '',
    },
    defaultConfig: {
      gutter: 7,
    },
    defaultStyle: {
      borderRadius: 15,
      fontColor: '#DF424B',
      fontSize: '14px',
      textAlign: 'center',
      background: '#fff',
    },
    prizes,
  }

  function goPlay() {
    // if (!canPlay) return
    // canPlay = false

    toLottly(myGrid)
  }

  return (
    <div className={`${styles.luckybox} ${styles.gridbox}`}>
      {/* 头部 */}
      <Header {...props} baseImg={gridImg} from="grid" />

      <div className={styles.gridCanvas}>
        <LuckyGrid
          ref={myGrid}
          width="290px"
          height="230px"
          blocks={Gconfig.blocks}
          prizes={Gconfig.prizes}
          buttons={Gconfig.buttons}
          defaultStyle={Gconfig.defaultStyle}
          onStart={goPlay}
          onEnd={gameEnd}
        />

        <p className={styles.counter}>{`您${activityJoinType === 1 ? '当前' : '今日'}还剩 ${actNum} 次抽奖机会`}</p>
        {/* <span className={styles.gameMask}></span> */}
      </div>

      {/* 规则 */}
      <Rulebox baseImg={gridImg} />

      {/* footer */}
      <Footer />

      {/* 结束弹层 */}
      {gameDone && <GameRes {...props} from="grid" />}
    </div>
  )
}
