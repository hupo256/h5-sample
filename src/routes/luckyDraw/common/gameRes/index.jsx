import React, { useContext } from 'react'
import { ctx } from '../context'
import styles from './gameRes.scss'

export default function GameRes(props) {
  const { from } = props
  const { gData, setgameDone, sucData } = useContext(ctx)

  const { isPrize, prizeImage, prizeName, limit } = sucData
  const resTex = isPrize ? '恭喜您！获得' : '离中奖就差一点点'
  const pnTex = isPrize ? prizeName : '未中奖'
  const btnTex = isPrize ? '查看我的奖品' : limit ? '再试试手气' : '确定'

  function gotoRecods(e, retry) {
    e.stopPropagation()
    if (retry) return setgameDone(false)
    const { search } = location
    props.history.push(`/recods${search}`)
  }

  return (
    <div className={`${styles.popupbox} ${from === 'grid' ? styles.grid : ''}`}>
      <div className={styles.popupcon}>
        {from === 'grid' && <h3>抽奖结果</h3>}
        <div className={styles.rescon}>
          <img src={prizeImage} alt="" />
          <div>
            <p>{resTex}</p>
            <b>{pnTex}</b>
          </div>
        </div>

        {!!limit && <p className={styles.leftNum}>{`您${gData.activityJoinType === 1 ? '当前' : '今日'}还剩 ${limit} 次抽奖机会`}</p>}
        <a onClick={(e) => gotoRecods(e, !isPrize)}>{btnTex}</a>
      </div>
    </div>
  )
}
