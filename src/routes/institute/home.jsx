import React, { useState, useEffect } from 'react'
import Page from '@src/components/page/index'
import styles from './institute'

export default function Inst({ history }) {
  const [loading, setLoading] = useState(true)

  function gotoexperts() {
    touchPointInBtn(-1, 'cooperate_experts')
    history.push(`/institute/experts`)
  }

  return (
    <Page title="砸金蛋">
      <p className={styles.more}>——————— sdf ———————</p>
    </Page>
  )
}
