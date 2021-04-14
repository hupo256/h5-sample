import React, { useState, useEffect, useContext } from 'react'
import moment from 'moment'
import { ctx } from '../context'
import styles from './header.scss'

export default function Timebox(props) {
  const { history, baseImg, from } = props
  const { gData, isPlaying } = useContext(ctx)
  const [stateTip, setstateTip] = useState('')
  const { startTime, endTime, activitySubtitle, state } = gData
  // state 0未开始  1进行中  2已结束
  // const state = 2
  useEffect(() => {
    touchTimeTex()
  }, [])

  function touchTimeTex() {
    let stateTex = ''
    let dayTex = ''
    let timeTex = ''

    // 时间转为number以便计算相对日期
    const startNum = +moment(startTime).format('YYYYMMDD')
    const endNum = +moment(endTime).format('YYYYMMDD')
    const nowNum = +moment().format('YYYYMMDD')
    const theTime = state === 0 ? startNum : endNum // 根据状态确定需要用来比对的时间
    const dis = nowNum - theTime

    if (state === 0) {
      stateTex = '开始时间: '
      if (dis === -1) {
        dayTex = '明天'
        timeTex = moment(startTime).format('HH:mm') // 开始时分
      } else if (dis === 0) {
        dayTex = '今天'
        timeTex = moment(startTime).format('HH:mm') // 开始时分
      } else {
        dayTex = ''
        timeTex = moment(startTime).format('YYYY-MM-DD HH:mm')
      }
    }
    if (state === 2) {
      stateTex = '结束时间: '
      if (dis === 1) {
        dayTex = '昨天'
        timeTex = moment(endTime).format('HH:mm') //结束时分
      } else if (dis === 0) {
        dayTex = '今天'
        timeTex = moment(endTime).format('HH:mm') // 结束时分
      } else {
        dayTex = ''
        timeTex = moment(endTime).format('YYYY-MM-DD HH:mm')
      }
    }
    setstateTip(`${stateTex}${dayTex} ${timeTex}`)
  }

  function gotoRecods() {
    if (isPlaying) return
    const { search } = location
    history.push(`/recods${search}`)
  }

  return (
    <div className={`${styles.header} ${from ? styles[from] : ''}`}>
      <div className={styles.timebox}>
        {from !== 'egg' && <span onClick={gotoRecods}>我的奖品</span>}
        {(state === 0 || state === 2) && <p>{stateTip}</p>}
      </div>

      <img src={`${baseImg}headline@2x.png`} alt="" />
      <p className={styles.disc}>{activitySubtitle || '百分百中奖'}</p>
    </div>
  )
}
