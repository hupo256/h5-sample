import React, { Component } from 'react'
import propTypes from 'prop-types'
import images from '../images'
import styles from '../integration.scss'
import ClipboardJS from 'clipboard'
import { Toast } from 'antd-mobile'
import { exchangeSuccessPageGoto } from '../buried-point'

class Cards extends Component {
  static propTypes = {
    details:propTypes.object,
    goExchange:propTypes.func,
    from:propTypes.string
  }
  componentDidMount () {
    console.log(this.props.details)
  }
  handleCopyTxt = (type) => {
    const { from, details } = this.props
    let clipboard = null
    clipboard = new ClipboardJS(`.copyBtn${type}`)
    clipboard.on('success', e => {
      Toast.info('复制成功', 1)
      if (from === 'success') {
        exchangeSuccessPageGoto({
          Btn_name:type === 1 ? 'copy_card_number' : 'copy_card_password',
          product_name:details.goodsName,
          item_type:'invented'
        })
      }
      e.clearSelection()
    })
    clipboard.on('error', e => {
      Toast.info('请手动长按复制', 1)
    })
  }

  render () {
    const { details, goExchange, from } = this.props
    return (
      <div className={styles.card}>
        <div className={styles.info}>
          <p>
            <span>卡号：</span>
            <span id='cardNo1'>{details && (from === 'success' ? details.cardResp.cardAccount : details.cardAccount)}</span>
          </p>
          <div className='copyBtn1' onClick={() => this.handleCopyTxt(1)} data-clipboard-target={`#cardNo1`}>
            <img src={images.copy} />
            <label>复制</label>
          </div>
        </div>
        <div className={styles.info}>
          <p>
            <span>密码：</span>
            <span id='cardNo2'>{details && (from === 'success' ? details.cardResp.cardToken : details.cardSecret)}</span>
          </p>
          <div className='copyBtn2' onClick={() => this.handleCopyTxt(2)} data-clipboard-target={`#cardNo2`}>
            <img src={images.copy} />
            <label>复制</label>
          </div>
        </div>
        <p className={styles.more} onClick={goExchange}>兑换更多</p>
        <h5>如何绑定天猫超市卡</h5>
        <div className={styles.cardtips}>
          <p>1. 打开手机天猫APP,点击下方菜单“我”</p>
          <p>2. 点击“红包卡券”，进入页面后选择“其他”类</p>
          <p>3. 找到天猫超市卡，点击进入天猫超市卡页面</p>
          <p>4. 点击左上角“绑定超市卡”，输入卡号及密码</p>
          <p>5. 点击“确定”，确认绑定信息即可。</p>
        </div>
      </div>
    )
  }
}

export default Cards
