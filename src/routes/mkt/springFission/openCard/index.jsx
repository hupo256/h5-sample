import React from 'react'
import { Page } from '@src/components'
import { Toast } from 'antd-mobile'
import ClipboardJS from 'clipboard'
import { API, fun } from '@src/common/app'
import { DHEKView, DHEKScrapeGoto } from '../BuriedPoint'
import images from '@src/common/utils/images'
import { Lottery } from './lottery'
import { img } from './img'
import styles from './getCard'

const { springFission } = images
const { getParams } = fun

class GetCard extends React.Component {
  state = {
    scrapingArea: false,
    cardIndex: 0,
    cardArr: [],
    cardLen: 0,
    loading: true
  }

  componentDidMount () {
    DHEKView()
    const { exchangeId, activCode } = getParams()
    
    // 获取卡密
    const param = { 
      activCode,
      exchangeId: +exchangeId
    }
    API.getCdKeyList(param).then(res => {
      let { code, data } = res
      if(code) return

      this.setState({
        cardArr: data,
        cardLen: data.length,
        loading: false
      })

      this.addTouchEvent()
      // this.createCanvas(data[0], `canvas_0`)
      this.batchCanvas(data)
    })
  }

  batchCanvas = (Arr) => {
    for(let i=0, k=Arr.length; i<k; i++){
      this.createCanvas(Arr[i], `canvas_${i}`)
    }
  }

  createCanvas = (cardObj, id) => {
    const { cardSecret, cdKeyId, status } = cardObj
    if (+status === 2) return
    setTimeout(() => {
      const el = document.querySelector(`#${id}`)
      const { offsetHeight, offsetWidth } = el
      const config = {
        id, 
        cover: img, 
        coverType: 'image', 
        width: offsetWidth, 
        height: offsetHeight, 
        drawPercentCallback: this.drawPercentCallback
      }
      const lottery = new Lottery(config)
      lottery.init(`${cardSecret || 1111}`, 'text')
      // lottery.init(`兑换码：${cardSecret || 1111}`, 'text')

      document.querySelector(`#${id}`).addEventListener('touchend', (e) => {
        e.stopPropagation()
        if(this.state.scrapingArea) {
          // 设置卡密状态
          API.setCardStatus({cdKeyId}).then(res => {
            const { code } = res
            if(code) return
            // cardIndex
            const { cardIndex, cardArr } = this.state
            cardArr[cardIndex].status = 2;
            this.setState({cardArr}, () => {
              this.hideCanvas(document.querySelector(`#${id}`))
              this.handleCopyTxt()
            })
            DHEKScrapeGoto()
          })
        }
      }, false);
    }, 200)
  }

  addTouchEvent = () => {
    const { cardArr } = this.state
    let initPageX = 0
    let initPageY = 0
    let distance = 5
    let touchEvent = 'scroll'
    document.querySelector('#aniBox').addEventListener("touchstart", (e) => {
      initPageX = e.targetTouches[0].pageX
      initPageY = e.targetTouches[0].pageY
    }, false)

    document.querySelector('#aniBox').addEventListener("touchmove", (e) => {
      let disX = e.targetTouches[0].pageX - initPageX;
      let disY = e.targetTouches[0].pageY - initPageY;
      if (Math.abs(disX) - Math.abs(disY) > distance) {
        touchEvent = 'switch';
      } else {
        touchEvent = 'scroll'
      }
    }, false)

    document.querySelector('#aniBox').addEventListener("touchend", (e) => {
      let { cardIndex, cardLen } = this.state
      if (e.changedTouches[0].pageX - initPageX > distance) {  // to right
        cardIndex -= 1
      } else if (e.changedTouches[0].pageX - initPageX < distance) {  // to left
        cardIndex += 1
      }
      if(cardIndex > -1 && cardIndex < cardLen && touchEvent === 'switch'){
        this.setState({cardIndex}, () => {
          this.createCanvas(cardArr[cardIndex], `canvas_${cardIndex}`)
        })
      }
    }, false)

    document.querySelector('#root').addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, false);
  }

  hideCanvas = (dom) => {
    setTimeout(() => {
      const can = dom.querySelectorAll('.canvas')
      for (let n = 0; n < can.length; n++) {
        can[n].style.display = 'none'
      }

      this.setState({
        scrapingArea: false,
        showCard: true,
      })
    }, 1000)
  }

  handleCopyTxt = () => {
    setTimeout(() => {
      let clipboard = null
      clipboard = new ClipboardJS('.copyBtn')
      clipboard.on('success', e => {
        Toast.info('复制成功!')
        e.clearSelection()
      })
      clipboard.on('error', e => {
        Toast.info('请手动长按复制')
      })
    }, 200)
  }

  drawPercentCallback = (percent) => {
    if (+percent > 60){ this.setState({scrapingArea: true})}
  }

  render () {
    const { cardIndex, cardLen, cardArr } = this.state
    return (
      <Page title='京东E卡'>
        <div className={styles.getCard}>
          <img src={`${springFission}redbg.png`} />
          <div className={styles.redpopbox}>
            <ul 
              id="aniBox" 
              style={{
                transform: `translateX(-${cardIndex/cardLen*100}%)`, 
                width: `${cardLen*100}%`,
                transition: 'all .2s ease'
              }}
            >
            {cardArr && cardArr.length && cardArr.map((item, index) => {
              const {amount, cardSecret, status, cdKeyId} = item
              return <li key={index} style={{width: `${1/cardLen*100}%`}}>
                <div className={styles.popcon}>
                  <img src={`${springFission}redpack.png`} />

                  <div className={styles.cashBox}>
                    <div className={styles.numBox}>
                      <span>￥</span>
                      <span>{amount}</span>
                    </div>
                  </div>

                  <div className={styles.cardIdBox}>
                    <div className={styles.canvasBox} id={`canvas_${index}`}>
                      {/* {+status === 2 ?  */}
                      {+status === 2 && 
                        <div className={styles.copyBox}>
                          <p>您的兑换码为</p>
                          <p id={`cardNo_${index}`}>{cardSecret}</p>
                          <span 
                            data-clipboard-target={`#cardNo_${index}`}
                            className='copyBtn'
                            onClick={this.handleCopyTxt}
                          >复制</span>
                        </div> 
                        // : 
                        // <img className={styles.markimg} src={img} />
                      }
                    </div>
                  </div>
                </div>
              </li>
            })}
            </ul>

            <p className={styles.indexBox}>
              <span>{cardIndex+1}</span>
              {`/${cardLen}`}
            </p>
          </div>
        </div>
      </Page>
    )
  }
}

export default GetCard
