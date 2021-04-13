import React, { useState, useEffect, useRef } from 'react'
import Page from '@src/components/page/index'
import { LuckyWheel, LuckyGrid } from 'react-luck-draw'
import { interVal, wheelImg, prizeImg } from './tools'
import luckyApi from '@src/common/api/luckyApi'
import styles from './luckyDraw.scss'

export default function Lucky({ props }) {
  const [prizes, setprizes] = useState([])
  const myWheel = useRef()

  useEffect(() => {
    touchprize()
  }, [])

  function touchprize() {
    const param = { uid: 'a879d7b93ed94a0d8bdef5a1cc4a3eb8', noloading: 1 }
    luckyApi.info(param).then((res) => {
      const { data } = res
      const arr = data.prize.map((pri, ind) => {
        const { prizeName, prizeImage, prizeCode } = pri
        const background = ind % 2 === 1 ? 'rgba(253, 235, 178, 1)' : '#fff'
        return {
          background,
          fonts: [{ text: prizeName, top: '9%', prizeCode }],
          imgs: [{ src: prizeImage || `${prizeImg}${ind + 1}@2x.png`, width: '35%', top: '35%' }],
        }
      })
      setprizes(arr)
    })
  }

  const Wconfig = {
    blocks: [
      {
        padding: '34px',
        imgs: [{ src: `${wheelImg}turntable@2x.png`, width: '300px' }],
      },
    ],
    buttons: [
      {
        radius: '35px',
        background: '#ffdea0',
        imgs: [{ src: `${wheelImg}begain.png`, width: '96px', top: -65 }],
      },
    ],
    defaultStyle: { fontColor: '#d64737', fontSize: '13px' },
    prizes,
  }

  function toLottly() {
    myWheel.current.play()
    setTimeout(() => {
      const param = {
        mobile: '13543547854',
        uid: 'a879d7b93ed94a0d8bdef5a1cc4a3eb8',
      }
      luckyApi.lottery(param).then((res) => {
        console.log(res)
        const { data } = res
        const num = (Math.random() * 6) >> 0
        myWheel.current.stop(data?.data?.sort || num)
      })
    }, interVal)
  }

  return (
    <Page title="大转盘">
      <div className={styles.luckybox}>
        <LuckyWheel
          ref={myWheel}
          width="300px"
          height="300px"
          blocks={Wconfig.blocks}
          prizes={Wconfig.prizes}
          buttons={Wconfig.buttons}
          defaultStyle={Wconfig.defaultStyle}
          onStart={toLottly}
          onEnd={(prize) => {
            console.log(prize)
            alert('恭喜获得大奖:' + prize.fonts[0].text)
          }}
        />
      </div>
    </Page>
  )
}
