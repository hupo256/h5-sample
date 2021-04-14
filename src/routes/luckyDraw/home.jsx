import React, { useState, useEffect, useContext } from 'react'
import Page from '@src/components/page/index'
import { Provider, ctx } from './common/context'
import LuckyWheel from './componets/luckyWheel'
import LuckEgg from './componets/luckEgg'
import LuckyGrid from './componets/luckyGrid'

function LuckyDraw(props) {
  const { gData, touchprizeData } = useContext(ctx)
  const [actTit, setactTit] = useState('请稍后...')

  const { activityType = 0 } = gData

  useEffect(() => {
    touchprizeData()
  }, [])

  useEffect(() => {
    setactTit(gData?.activityTitle)
  }, [gData])

  return (
    <Page title={actTit}>
      {!!activityType && (
        <>
          {activityType === 1 && <LuckyWheel gInfor={gData} {...props} />}
          {activityType === 2 && <LuckEgg gInfor={gData} {...props} />}
          {activityType === 3 && <LuckyGrid gInfor={gData} {...props} />}
        </>
      )}
    </Page>
  )
}

export default (props) => (
  <Provider>
    <LuckyDraw {...props} />
  </Provider>
)
