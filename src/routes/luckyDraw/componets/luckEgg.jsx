import React, { useState, useContext } from 'react'
import $ from 'jquery'
import Loadable from '@src/components/loading/index'
import { ctx } from '../common/context'
import Header from '../common/header'
import Rulebox from '../common/rulebox'
import Footer from '../common/footer'
import { eggImg } from '../tools/data'
import styles from './egg.scss'

const SayHi = Loadable(() => import('fdTest/sayHi'))

export default function Lucky(props) {
  const { history } = props
  const { gData, isPlaying, toEggLottly, actNum, gameDone, setgameDone, sucData, gameEnd } = useContext(ctx)
  const [isShake, setisShake] = useState(true)
  const [toHit, settoHit] = useState(false)
  const [broken, setbroken] = useState(false)

  const eggTag = broken ? 'poegg.png' : 'egg.png'

  function GameRes() {
    const { isPrize, prizeImage, prizeName, limit } = sucData
    const resTex = isPrize ? '恭喜您！获得' : '离中奖就差一点点'
    const pnTex = isPrize ? prizeName : '未中奖'
    const btnTex = isPrize ? '查看我的奖品' : limit ? '再试试手气' : '确定'
    return (
      <div className={styles.popupbox}>
        <div className={styles.popupcon}>
          <div className={styles.rescon}>
            <p>{resTex}</p>
            <img src={prizeImage} alt="" />
            <b>{pnTex}</b>
          </div>
          {!!limit && <p className={styles.leftNum}>{`您${gData?.activityJoinType === 1 ? '当前' : '今日'}还有 ${limit} 次抽奖机会`}</p>}
          <a onClick={(e) => toTryagain(e, !isPrize)}>{btnTex}</a>
        </div>
      </div>
    )
  }

  function toTryagain(e, retry) {
    e.stopPropagation()
    if (retry) return rerestGame()
    const { search } = location
    props.history.push(`/recods${search}`)
  }

  function doWithLottly(dom) {
    const { currentTarget } = dom
    toEggLottly(currentTarget, hitEgg)
  }

  function hitEgg(curDom) {
    const $this = $(curDom)
    const position = $this.position()
    const width = $this.width()
    setisShake(false)

    //  改状态
    $('#hammer').css({
      left: `${position.left + width - 200}px`,
      top: `${position.top - 20}px`,
    })

    setTimeout(function () {
      settoHit(true)
      setbroken(true)
    }, 1200)

    setTimeout(function () {
      $('#hammer').css({
        left: `${665 / rem}rem`,
        top: `${30 / rem}rem`,
      })
      gameEnd()
    }, 1800)
  }

  function rerestGame() {
    setisShake(true)
    settoHit(false)
    setbroken(false)
    $('#hammer').css({
      left: '',
      top: '',
    })
    setTimeout(() => {
      setgameDone(false) //等一会再关掉弹层
    }, 400)
  }

  function gotoRecods() {
    if (isPlaying) return
    const { search } = location
    history.push(`/recods${search}`)
  }

  return (
    <div className={styles.luckybox}>
      {/* 头部 */}
      <p>wwee eerrt</p>
      <SayHi />
      <Header {...props} baseImg={eggImg} from="egg" />

      <div className={styles.main}>
        <img id="hammer" className={`${styles.hammer} ${isShake ? styles.shake : ''} ${toHit ? styles.hit : ''}`} src={`${eggImg}chuzi.png`} alt="" />
        <ul>
          <li>
            <img onClick={(e) => doWithLottly(e)} src={`${eggImg}${eggTag}`} className={`${isShake ? styles.goldEgg : ''}`} />
            <img src={`${eggImg}dizhuo.png`} alt="" />
          </li>
        </ul>
        <p className={styles.counter}>{`${gData?.activityJoinType === 1 ? '当前' : '今日'}砸蛋次数还剩 ${actNum} 次`}</p>
        <span onClick={gotoRecods}>我的奖品</span>
      </div>

      {/* 规则 */}
      <Rulebox baseImg={eggImg} />

      {/* footer */}
      <Footer />

      {gameDone && <GameRes />}
    </div>
  )
}
