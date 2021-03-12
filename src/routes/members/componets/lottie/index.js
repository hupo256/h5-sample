import React, { useEffect, useRef } from 'react'
import styles from './toast.scss'
import bodymovin from 'bodymovin'
import animationData from './lottie.json'

export default function LotAnimte() {
  const couterRef = useRef()
  useEffect(() => {
    runAni()
  }, [])

  function runAni() {
    bodymovin.loadAnimation({
      container: couterRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData
    })
  }

  return (
    <div className={styles.toast} ref={couterRef} />
  )
}