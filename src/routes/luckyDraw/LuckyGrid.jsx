import React, { useState, useEffect, useRef } from 'react'
import Page from '@src/components/page/index'
import { LuckyWheel, LuckyGrid } from 'react-luck-draw'
import { interVal, gridImg, prizeImg, axis, gridPrize } from './tools'
import luckyApi from '@src/common/api/luckyApi'
import styles from './luckyDraw.scss'

export default function Lucky({ props }) {
  const [prizes, setprizes] = useState([])
  const [uid, setuid] = useState('a32f343edebc41faac30142b5af4f92e')
  const myGrid = useRef()

  useEffect(() => {
    // touchprize()
    mockData()
  }, [])

  function mockData() {
    const arr = gridPrize.map((pri, ind) => {
      const { prizeName, prizeImage, prizeCode } = pri
      return {
        x: axis[ind][0],
        y: axis[ind][1],
        index: ind,
        name: prizeName,
        fonts: [{ text: prizeName, fontSize: '12px', top: '72%', prizeCode }],
        imgs: [{ src: prizeImage, width: '53%', top: '6%' }],
      }
    })
    setprizes(arr)
  }

  function touchprize() {
    const param = { uid, noloading: 1 }
    luckyApi.info(param).then((res) => {
      const { data } = res
      console.log(data.prize)
      const arr = data.prize.map((pri, ind) => {
        const { prizeName, prizeImage, prizeCode } = pri
        return {
          x: axis[ind][0],
          y: axis[ind][1],
          index: ind,
          name: prizeName,
          fonts: [{ text: prizeName, top: '75%', prizeCode }],
          imgs: [{ src: `${prizeImg}${ind + 1}@2x.png`, width: '53%', top: '7%' }],
        }
      })
      setprizes(arr)
    })
  }

  let luckyNum = 1
  const Gconfig = {
    blocks: [
      // { padding: '15px', background: '#721DE2', borderRadius: 28 },
      // { padding: '4px', background: '#ff4a4c', borderRadius: 23 },
      { padding: '4px', background: '#721DE2', borderRadius: 20 },
    ],
    buttons: [
      {
        x: 1,
        y: 1,
        background: 'linear-gradient(90deg, #e94c3b, #FF1111)',
        shadow: '0 5 1 #e94c3b',
        imgs: [{ src: `${gridImg}text.png`, width: '70%', top: '35%' }],
      },
    ],
    activeStyle: {
      background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
      shadow: '',
    },
    defaultConfig: {
      gutter: 7,
    },
    defaultStyle: {
      borderRadius: 15,
      fontColor: '#DF424B',
      fontSize: '14px',
      textAlign: 'center',
      background: '#fff',
      // shadow: '0 4 9 #DFA661',
    },
    prizes,
  }

  function toLottly() {
    myGrid.current.play()
    setTimeout(() => {
      const param = {
        mobile: '13543547854',
        uid,
      }
      luckyApi.lottery(param).then((res) => {
        console.log(res)
        const { data } = res
        const num = (Math.random() * 6) >> 0
        myGrid.current.stop(data?.data?.sort || num)
      })
    }, interVal)
  }

  return (
    <Page title="跑马灯">
      <div className={styles.gridbox}>
        <LuckyGrid
          ref={myGrid}
          width="290px"
          height="230px"
          blocks={Gconfig.blocks}
          prizes={Gconfig.prizes}
          buttons={Gconfig.buttons}
          defaultStyle={Gconfig.defaultStyle}
          onStart={toLottly}
          // onStart={() => {
          //   if (!luckyNum) return alert('还剩0次抽奖机会')
          //   myGrid.current.play()
          //   setTimeout(() => {
          //     myGrid.current.stop((Math.random() * 8) >> 0)
          //   }, 2000)
          // }}
          onEnd={(prize) => {
            alert(`恭喜你获得大奖: ${prize.name}`)
            luckyNum--
            console.log(myGrid.current.props)
            myGrid.current.props.buttons[0].fonts[0].text = `${luckyNum} 次`
          }}
        />

        <p className={styles.counter}>您当前还剩 {luckyNum} 次抽奖机会</p>
      </div>
    </Page>
  )
}
