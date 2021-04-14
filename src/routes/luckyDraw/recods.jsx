import React, { useState, useEffect } from 'react'
import Page from '@src/components/page/index'
import { wheelImg } from './tools/data'
import luckyApi from '@src/common/api/luckyApi'
import fun from '@src/common/utils'
import styles from './recods.scss'

const { urlParamHash } = fun

export default function Recods({ props }) {
  const [recList, setrecList] = useState(null)

  useEffect(() => {
    touchList()
  }, [])

  function touchList() {
    const { uid = '', phone = '' } = urlParamHash()
    const param = { mobile: phone, uid }
    luckyApi.reward(param).then((res) => {
      console.log(res)
      if (!res?.data) return setrecList(true)
      setrecList(res.data)
    })
  }

  return (
    <Page title="我的奖品">
      {recList && (
        <>
          {recList?.length > 0 ? (
            <div className={styles.recbox}>
              <h3>
                <span>奖品</span>
                <span>中奖时间</span>
                <span>领取手机号</span>
              </h3>
              <ul>
                {recList?.map((rec, ind) => {
                  const { lotteryTime, mobile, prizeName } = rec
                  return (
                    <li key={ind}>
                      <span>{prizeName}</span>
                      <span>{lotteryTime.slice(0, 16)}</span>
                      <span>{mobile}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : (
            <div className={styles.noRec}>
              <img src={`${wheelImg}ic_gift@2x.png`} alt="" />
              <h3>您还未抽到奖品</h3>
              <p>快去抽奖试试</p>
            </div>
          )}
        </>
      )}
    </Page>
  )
}
