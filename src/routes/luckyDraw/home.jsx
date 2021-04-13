import React, { useState, useEffect, useRef } from 'react'
import Page from '@src/components/page/index'
import { LuckyWheel, LuckyGrid } from 'react-luck-draw'
import luckyApi from '@src/common/api/luckyApi'
import styles from './luckyDraw.scss'
// import styles from './luckyDraw.less'

export default function Lucky({ props }) {
  const [count, setcount] = useState(0)
  const myWheel = useRef()
  const myGrid = useRef()

  useEffect(() => {
    const param = { activityCode: 'AC210412000011', noloading: 1 }
    luckyApi.info(param).then((res) => {
      console.log(res)
    })
  }, [])

  const Wconfig = {
    blocks: [{ padding: '13px', background: '#d64737' }],
    prizes: [
      { background: '#f9e3bb', fonts: [{ text: '1元红包WW', top: '18%' }] },
      { background: '#f8d384', fonts: [{ text: '100元红包', top: '18%' }] },
      { background: '#f9e3bb', fonts: [{ text: '0.5元红包', top: '18%' }] },
      { background: '#f8d384', fonts: [{ text: '2元红包', top: '18%' }] },
      { background: '#f9e3bb', fonts: [{ text: '10元红包', top: '18%' }] },
      { background: '#f8d384', fonts: [{ text: '50元红包', top: '18%' }] },
    ],
    buttons: [
      { radius: '50px', background: '#d64737' },
      { radius: '45px', background: '#fff' },
      { radius: '41px', background: '#f6c66f', pointer: true },
      { radius: '35px', background: '#ffdea0', fonts: [{ text: '开始\n抽奖', fontSize: '18px', top: -18 }] },
    ],
    defaultStyle: { fontColor: '#d64737', fontSize: '14px' },
  }

  let luckyNum = 1
  const Gconfig = {
    blocks: [
      { padding: '15px', background: '#ffc27a', borderRadius: 28 },
      { padding: '4px', background: '#ff4a4c', borderRadius: 23 },
      { padding: '4px', background: '#ff625b', borderRadius: 20 },
    ],
    buttons: [
      {
        x: 1,
        y: 1,
        background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
        shadow: '0 5 1 #e89b4f',
        fonts: [{ text: `${luckyNum} 次`, fontColor: '#fff', top: '73%', fontSize: '11px' }],
        imgs: [
          { src: imgs.button, width: '65%', top: '12%' },
          { src: imgs.btn, width: '50%', top: '73%' },
        ],
      },
    ],
    activeStyle: {
      background: 'linear-gradient(270deg, #FFDCB8, #FDC689)',
      shadow: '',
    },
    defaultConfig: {
      gutter: 5,
    },
    defaultStyle: {
      borderRadius: 15,
      fontColor: '#DF424B',
      fontSize: '14px',
      textAlign: 'center',
      background: '#fff',
      shadow: '0 5 1 #ebf1f4',
    },
    prizes: getList(),
  }

  // 模拟接口异步请求奖品列表
  function getList() {
    const prizes = []
    const { img0, img1, img2, img3, img4, img5, img6, img7 } = imgs
    const data = [
      { name: '1元红包', img: img0 },
      { name: '100元红包', img: img1 },
      { name: '0.5元红包', img: img2 },
      { name: '2元红包', img: img3 },
      { name: '10元红包', img: img4 },
      { name: '50元红包', img: img5 },
      { name: '0.3元红包', img: img6 },
      { name: '5元红包', img: img7 },
    ]
    let axis = [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
      [1, 2],
      [0, 2],
      [0, 1],
    ]
    for (let i = 0; i < 8; i++) {
      let item = data[i]
      prizes.push({
        name: item.name,
        index: i,
        x: axis[i][0],
        y: axis[i][1],
        fonts: [{ text: item.name, top: '70%' }],
        imgs: [{ src: item.img, width: '53%', top: '8%' }],
      })
    }
    return prizes
  }

  return (
    <Page title="大转盘">
      <div className={styles.luckybox}>
        {/* <div className={styles.btn}>click me</div> */}
        <LuckyWheel
          ref={myWheel}
          width="300px"
          height="300px"
          blocks={Wconfig.blocks}
          prizes={Wconfig.prizes}
          buttons={Wconfig.buttons}
          defaultStyle={Wconfig.defaultStyle}
          onStart={() => {
            // 点击抽奖按钮会触发star回调
            // 调用抽奖组件的play方法开始游戏
            myWheel.current.play()
            // 模拟调用接口异步抽奖
            setTimeout(() => {
              // 假设拿到后端返回的中奖索引
              const index = (Math.random() * 6) >> 0
              // 调用stop停止旋转并传递中奖索引
              myWheel.current.stop(index)
            }, 2500)
          }}
          onEnd={(prize) => {
            // 抽奖结束会触发end回调
            console.log(prize)
            alert('恭喜获得大奖:' + prize.title)
          }}
        />

        <br />

        <LuckyGrid
          ref={myGrid}
          width="300px"
          height="300px"
          blocks={Gconfig.blocks}
          prizes={Gconfig.prizes}
          buttons={Gconfig.buttons}
          defaultStyle={Gconfig.defaultStyle}
          onStart={() => {
            if (!luckyNum) return alert('还剩0次抽奖机会')
            myGrid.current.play()
            setTimeout(() => {
              myGrid.current.stop((Math.random() * 8) >> 0)
            }, 2000)
          }}
          onEnd={(prize) => {
            alert(`恭喜你获得大奖: ${prize.name}`)
            luckyNum--
            console.log(myGrid.current.props)
            myGrid.current.props.buttons[0].fonts[0].text = `${luckyNum} 次`
          }}
        />
      </div>
    </Page>
  )
}
