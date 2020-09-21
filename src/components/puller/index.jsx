import React, { useState, useRef } from 'react'
import {Toast} from 'antd-mobile'
import styles from './pull'

/**
 *
 * @param {*} config
 * getDom   返回主体dom的function  required
 * topTips  上拉露出的提示文案
 * botTips  下拉露出的提示文案
 * distance 下上拉动的敏感值
 * disleng  触发切换的移动长度
 * hasFirst 第一条信息
 * hasEnd   最后一条信息
 */

export default function UserInfor(config) {
  const { getDom, topTips = '上一页', botTips = '下一页', distance = 70, disleng = 120, callback = null ,hasFirst={},hasEnd={}} = config
  if (!getDom || !getDom()) return

  const [istop, setistop] = useState(false)
  const [isbottom, setisbottom] = useState(false)
  const [rbot, setrbot] = useState(false)
  const [dragTex, setdragTex] = useState(false)
  const [isAnim, setisAnim] = useState(false)
  const [firstY, setfirstY] = useState(0) // 第一次落点y坐标
  const [startY, setstartY] = useState(0) // 初始y坐标
  const [displacement, setdisplacement] = useState(0) // 上、下拉时主体的位移
  const [domRun, setdomRun] = useState('') // toDown 滑出, domReset 归位, totop 滑入
  const anibox = useRef()

  // 触碰时记录初始值
  function touchstartEvent(e) {
    setdragTex(false)
    setfirstY(e.touches[0].clientY)
    setstartY(e.touches[0].clientY)
  }

  // 滑动时主体内容跟随
  function touchmoveEvent(e) {
    const curY = e.touches[0].clientY
    const dis = Math.abs(curY - startY) // 相对位移
    if (dis < distance) return // 移动大于设定值时才计算

    const distentce = curY - firstY // 位移累计值
    const direct = distentce > 0 // 确定方向，大于0则向上
    const pullH = anibox.current.clientHeight // 内容高
    const dH = document.documentElement.clientHeight // 视窗高
    const dT = document.documentElement.scrollTop || document.body.scrollTop // 滚动高
    if (isAnim) contentMove(direct, distentce)
    if (direct && dT === 0) {
      console.log(`top`)
      contentMove(direct, distentce)
    }
    if (!direct && pullH <= dH + dT) {
      console.log(`bottom`)
      contentMove(direct, distentce)
    }
    setstartY(curY) // 顺便保存一下
  }

  function contentMove(top, dis) {
    //console.log(top,dis);
    if(dis>0 && Object.keys(hasFirst).length==0){
      return Toast.info('这是第一条哦～');
    }
    if(dis<0 && Object.keys(hasEnd).length==0){
      return Toast.info('测评到底啦！');
    }
    const abdis = Math.abs(dis)
    setisAnim(true)
    setistop(top)
    setisbottom(!top)
    setdragTex(abdis > disleng) // 改变文字

    if (abdis >= 240) return
    setdisplacement(`${dis}px`)
  }

  // 抬起手时开始切换
  function touchendEvent(e) {
    if (!rbot && !istop) {
      setrbot(true)
      resetTips(istop)
      // setdisplacement(0)
      return
    }
    if (!isAnim) return
    const curY = e.changedTouches[0].clientY
    const isdis = Math.abs(curY - firstY) > disleng + 5
    // alert(curY + ' -:- '+firstY + ' -:- '+ isdis)
    if (isdis) {
      istop && toSwiper(true)
      isbottom && toSwiper()
    } else {
      setdisplacement(0)
      resetTips(istop)
    }
    setisAnim(false)
  }

  // 滑动
  function toSwiper(top) {
    setdisplacement(top ? '100%' : '-100%') // 滑出
    setistop(false)
    setisbottom(false)

    setTimeout(() => { // 隐藏并复位
      setdomRun(top ? 'backTop' : 'backDown')
      setdisplacement(top ? '-105%' : '105%')
      callback && callback(top)

      resetTips(true)
      setTimeout(() => { // 刷新后复位
        setdomRun('')
        setdragTex(false)
        setdisplacement(0)
      }, 100)
    }, 400)
  }

  // 提示、滚动复位
  function resetTips(top) {
    setistop(false)
    setisbottom(false)
    if (!top) return
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  return (
    <div className={`${styles.aniout} ${(isAnim && istop) ? styles.overflow : ''}`}>
      <p className={`${istop ? '' : styles.tipHide}`}>
        <span>{dragTex ? '释放打开上一测评' : '下拉刷新'}</span>
        <b>{topTips}</b>
      </p>

      <div
        ref={anibox}
        onTouchStart={touchstartEvent}
        onTouchEnd={touchendEvent}
        onTouchMove={touchmoveEvent}
        className={`${styles.anitbox} ${domRun ? styles[domRun] : ''}`}
        style={{ transform: `translateY(${displacement})` }}
      >
        {getDom()}
        <div style={{height:0, fontSize:0}}>{`anibox: ${document.documentElement.scrollTop || document.body.scrollTop}`}</div>
      </div>

      <p className={`${styles.bottomTrait} ${isbottom ? '' : styles.tipHide}`}>
        <span>{dragTex ? '释放打开下一测评' : '上拉刷新'}</span>
        <b>{botTips}</b>
      </p>
    </div>
  )
}
