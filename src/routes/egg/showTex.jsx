import React, { useState, useEffect } from 'react'
import { Button } from 'antd-mobile'
import styles from './show'

export default function ShowTex() {
  const [name, setname] = useState('JACK')

  useEffect(() => {
    setname('Smith')
  }, [])

  function btnClick() {
    setname('Smith is first name')
  }

  return (
    <h3 className={styles.titlebox}>
      <span>I am come form h5-sample</span>
      <span>Name: {name}</span>

      <Button type="primary" onClick={btnClick}>
        click me
      </Button>
    </h3>
  )
}

// export default App
