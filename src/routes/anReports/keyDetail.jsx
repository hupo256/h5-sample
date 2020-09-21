import React, { Component } from 'react'
import Page from '@src/components/page'
import styles from './newDetails/detail'
import images from './images'
import { ua } from '@src/common/app'
import andall from '@src/common/utils/andall-sdk'
import { babyBacteriumCreateKeypointGoto } from './buried-point'
class KeyDetail extends Component {
  state = {
    isAndall: ua.isAndall(),
  }
  componentDidMount () {
    document.body.scrollIntoView()
    function onBridgeReady() {
      WeixinJSBridge.call('hideOptionMenu')
    }
    if (typeof WeixinJSBridge === 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
      }
    } else {
      onBridgeReady()
    }
  }
shareBtn = () => {
  const { isAndall } = this.state
  if (isAndall) {
    babyBacteriumCreateKeypointGoto({
      share_btn:'share_top'
    })
    setTimeout(() => {
      andall.invoke('share', {
        type: 'link',
        title:'肠道菌群建立的关键期',
        text:'把握这几点，宝宝少生病',
        url: `${window.location.origin}/mkt/anReports/keyDetail`,
        thumbImage:`${window.location.origin}/mkt/anReports/images/shareimg.png`,
        image:`${window.location.origin}/mkt/anReports/images/shareimg.png`,
      })
    }, 100)
  }
}
render () {
  return (
    <Page title={'肠道菌群建立的关键期'}>
      <div className={styles.keyDetail}>
        {
          ua.isAndall()
            ? <div className={styles.shareBtn} onClick={this.shareBtn} >
              <img src={images.share} />
            </div> : ''
        }
        <div className={`${styles.square} ${styles.desc}`}>
          <div className={styles.words}>
               宝宝的肠道菌群变化受很多人为因素影响，比如出生方式。科学研究表明，顺产的宝宝出生后肠道中双歧杆菌等有益菌的数量普遍远远超出剖腹产出生的宝宝。
          </div>
          <div className={`${styles.words} ${styles.bottom0}`}>
            <p>1. 断奶期</p>
                母乳中天然含有双歧杆菌等有益菌，并且含有低聚糖、双歧因子等利于有益菌生长、辅助消化的有益物质。断奶后宝宝吃到的有益菌及免疫活性物质会大幅度减少，消化能力也会相应下降，营养吸收变差，这也是宝宝断奶后容易免疫力下降的重要原因之一。
          </div>
          <img src={images.keyDetail3} />
          <div className={`${styles.words} ${styles.bottom0}`}>
            <p>2.换奶粉</p>
              如果宝宝换奶粉时的肠道菌群环境恶劣，不能很好的消化新奶粉，就可能会出现吐奶、腹胀腹泻或者便秘的情况。
          </div>
          <img src={images.keyDetail1} />
          <div className={`${styles.words} ${styles.bottom0}`}>
            <p>3.加辅食</p>
              初次添加辅食，宝宝肠道中还没有建立起能够完全满足消化辅食营养成分需求的菌群结构，很容易出现过敏、消化不良等症状。
          </div>
          <img src={images.keyDetail2} />
          <div className={`${styles.words} ${styles.bottom0}`}>
            <p>4.慎用抗生素</p>
            抗生素具有抑菌或杀菌的作用，广谱抗生素如青霉素、头孢不会识别有益菌和有害菌，对所有细菌都有杀伤力，因此使用抗生素可能会导致肠道菌群毁灭性的破坏，从而引起过敏、腹泻、消化不良等病症发生。
          </div>
          <img src={images.keyDetail4} />
        </div>
      </div>
    </Page>
  )
}
}

export default KeyDetail
