import React, { useState, useEffect } from 'react';
import Page from '@src/components/page/index'
import memberApi from '@src/common/api/memberApi'
import styles from './institute'

export default function Counter() {
  const [expertList, setexpertList] = useState([])

  useEffect(() => {
    getExpert()
  }, [])

  function getExpert() {
    const infoPara = { noloading: 1, categoryId: 3110085415829504 }
    memberApi.getExpertInfo(infoPara).then(res => {
      const { code, data } = res
      if (code) return
      setexpertList(data)
    })
  }

  return (
    <Page title='合作专家'>
      <div className={styles.experts}>
        {expertList && expertList.length > 0 && expertList.map((itme, index) =>
          <img key={index} src={itme.contentPictureBig} alt="" />
        )}
      </div>
    </Page>
  )
}