import React, { useState, useEffect, useRef } from 'react'
import Page from '@src/components/page/index'
import $ from 'jquery'
import luckyApi from '@src/common/api/luckyApi'
import Success from './success'
import imgs from './componets/images'
import styles from './egg'

const eggLen = 1
const prizeLen = 5
const brokenList = []

export default function Inst() {
  const [eggList, seteggList] = useState([])
  const [prizeList, setprizeList] = useState([])
  const [count, setcount] = useState(1)
  const [isSuc, setisSuc] = useState(false)

  useEffect(() => {
    seteggList(getData())
    setprizeList(touchPrize())
  }, [])

  function getData() {
    const list = []
    const { egg, base } = imgs
    for (let i = 0; i < eggLen; i++) {
      const item = { egg, base }
      list.push(item)
    }
    return list
  }

  function touchPrize() {
    // luckyApi.query().then((res) => {
    //   console.log(res)
    // })
    luckyApi.items().then((res) => {
      console.log(res)
    })
    console.log(44)
    const list = []
    const { p100 } = imgs
    for (let i = 0; i < prizeLen; i++) {
      const item = { p100, disc: '100元红包' }
      list.push(item)
    }
    return list
  }

  // 砸金蛋
  function hitEgg(e) {
    const { currentTarget } = e
    const $this = $(currentTarget)
    if (!$this.hasClass('broken') && count > 0) {
      $this.addClass('broken')
      brokenList.push($this.index())
      setcount(count - 1)
      $('#hammer').removeClass('shake') // 清除锤子晃动动画

      const position = $this.position()
      const width = $this.width()

      $('#hammer').css({
        left: `${position.left + width - 100}px`,
        top: `${position.top + 50}px`,
      })

      $('#hammer').addClass('hit')

      const params = { activityId: 1, openId: 'sdad' }
      luckyApi.lottery(params).then((res) => {
        console.log(res)
      })

      setTimeout(function () {
        $this.find('img:eq(0)').prop('src', imgs.BrokenEgg).addClass('broken')
      }, 1200)

      setTimeout(function () {
        $('#hammer').removeClass('hit').addClass('shake')
        $('#hammer').css({
          left: `${665 / rem}rem`,
          top: `${30 / rem}rem`,
        })

        setisSuc(true)
      }, 1800)
    }
  }

  return (
    <Page title="砸金蛋11">
      <div id="container" className={styles.eggCon}>
        <div className={styles.header}>
          <p className={styles.rules}>规则</p>
          <a className={styles.personal}>我的</a>
        </div>

        <div className={styles.main}>
          <div className={styles.tips}>
            今天剩余免费<span>{count}</span>次
          </div>
          <div id="hammer" className={`${styles.hammer} ${styles.shake}`}></div>
          <ul className={styles.eggsWrap}>
            {eggList.length > 0 &&
              eggList.map((item, ind) => {
                const { egg, base } = item
                return (
                  <li key={ind} onClick={(e) => hitEgg(e)}>
                    <img src={egg} className={styles.goldEgg} />
                    <img src={base} />
                    <div className="info"></div>
                  </li>
                )
              })}
          </ul>

          <div className={styles.awards}>
            {/* <img src={imgs.prize} className={styles.prize} /> */}
            <div className={styles.swiperContainer}>
              <ul className={styles.swiperWrapper}>
                {prizeList.length > 0 &&
                  prizeList.map((item, ind) => {
                    const { p100, disc } = item
                    return (
                      <li key={ind} className={styles.swiperSlide}>
                        <img src={p100} />
                        <p>{disc}</p>
                      </li>
                    )
                  })}
              </ul>
            </div>
          </div>
        </div>

        {isSuc && <Success togglePopup={() => setisSuc(!isSuc)} />}
      </div>
    </Page>
  )
}
