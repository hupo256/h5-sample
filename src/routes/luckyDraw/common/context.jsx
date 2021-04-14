/*
 * @Author: tdd
 * @Date: 2021-03-31 11:12:12
 * @Last Modified by: tdd
 * @Last Modified time: 2021-04-22 10:35:12
 * 游戏里的store
 */
import React, { useState, createContext } from 'react'
import luckyApi from '@src/common/api/luckyApi'
import fun from '@src/common/utils'
import { touchToast } from '../tools'
import { interVal } from '../tools/data'

const { urlParamHash } = fun

export const ctx = createContext()
export function Provider({ children }) {
  const [gData, setgData] = useState({})
  const [gameDone, setgameDone] = useState(false)
  const [sucData, setsucData] = useState(null)
  const [actNum, setactNum] = useState(0)
  const [isPlaying, setisPlaying] = useState(false)

  // 获取游戏数据
  function touchprizeData() {
    const { uid = '', phone = '' } = urlParamHash()
    const param = { mobile: phone, uid }
    luckyApi.info(param).then((res) => {
      console.log(res)
      if (!res?.data) return
      const { data } = res
      setgData(data)
      setactNum(data.activityJoinNum)
    })
  }

  // 砸蛋开始
  function toEggLottly(target, callback) {
    if (isPlaying) return //如果正在运行则退出
    setisPlaying(true)
    const { uid = '', phone = '' } = urlParamHash()
    const param = { mobile: phone, uid }
    luckyApi.lottery(param).then((res) => {
      console.log(res)
      if (res?.data) {
        setsucData(res.data)
        callback(target)
        setTimeout(() => {
          setactNum(res.data?.limit)
        }, 1800)
      } else {
        touchToast(res.message)
        setisPlaying(false)
      }
    })
  }

  // 开始抽奖
  function toLottly(Luckyer) {
    if (isPlaying) return //如果正在运行则退出
    setisPlaying(true)
    const { uid = '', phone = '' } = urlParamHash()
    const param = { mobile: phone, uid }
    luckyApi.lottery(param).then((res) => {
      console.log(res)
      if (res?.data) {
        setsucData(res.data)
        Luckyer.current.play()
        setTimeout(() => {
          Luckyer.current.stop(res.data?.sort - 1)
          setactNum(res.data?.limit)
        }, interVal)
      } else {
        touchToast(res.message)
        setisPlaying(false)
      }
    })
  }

  function gameEnd() {
    setgameDone(true)
    setisPlaying(false)
  }

  const value = {
    gData,
    setgData,
    gameDone,
    setgameDone,
    touchprizeData,
    toLottly,
    toEggLottly,
    sucData,
    setsucData,
    actNum,
    setactNum,
    isPlaying,
    setisPlaying,
    gameEnd,
  }

  return <ctx.Provider value={value}>{children}</ctx.Provider>
}
