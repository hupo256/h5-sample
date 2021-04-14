import React from 'react'
import { Toast } from 'antd-mobile'

import styles from '../componets/luckyDraw.scss'

export function touchToast(text) {
  const [p1, p2] = text.split('_')
  Toast.info(
    <div className={styles.toastCon}>
      <p>{p1}</p>
      <p>{p2}</p>
    </div>,
    3,
  )
}
