import React, { useContext } from 'react'
import moment from 'moment'
import { ctx } from '../context'
import styles from './footer.scss'

export default function Footer() {
  const { gData } = useContext(ctx)
  const { startTime, endTime, telPhone } = gData

  return (
    <div className={styles.footer}>
      <p>
        活动时间：{moment(startTime).format('YYYY-MM-DD HH:mm')} 至 {moment(endTime).format('YYYY-MM-DD HH:mm')}
      </p>
      {telPhone && <p>咨询电话：{telPhone}</p>}
      <p>该活动解释权为当前活动举办方</p>
    </div>
  )
}
