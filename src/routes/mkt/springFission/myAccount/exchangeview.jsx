import React from 'react'
import { observer, inject } from 'mobx-react'
import { Page, Modal, Ruler } from '@src/components'
import { API, fun, point, ua } from '@src/common/app'
import {
  convertpageView,
  convertpageChooseDenomination,
  convertpageConvertNowGoto,
  convertpageSuccessPopupView,
  convertpageSuccessPopupGoto,
} from '../BuriedPoint'
import images from '@src/common/utils/images'
import styles from './myAccout'

const { springFission } = images
const { getParams } = fun
const remark = '提现规则：|1. 账户金额可1:1兑换成京东E卡；|2. 账户余额累计满100元，可申请兑换京东E卡；|3.京东E卡兑换审核周期为7个工作日；|4. 每人每日最多可申请兑换1笔，且上限为500元，单日最多可提现1000人；|5. 京东E卡为电子购物卡，可用于京东自营使用；|6.活动最终解释权归 上海解兮生物有限公司 。'

@inject('springFission')
@observer
class ExchangeView extends React.Component {
  state = {
    rulerPop: false,
    exchageDone: false,
    cardNum: 1,
    cardInd: NaN,
    awardId: 0,
    balance: 0,
  }

  componentDidMount () {
    convertpageView()
    const { balance, activCode } = getParams()
    API.getExchangeInfo({activCode}).then(res => {
      const { code, data } = res
      // data.surplus = 0
      if(code) return
      this.setState({
        ...data, 
        balance: +balance,
      })
    })
  }

  updateCount = (num) => {
    const { cardNum } = this.state
    this.setState({
      cardNum: cardNum + num
    })
  }

  toggleMask = (key) => {
    this.setState({
      [key]: !this.state[key]
    })
  }

  touchExchange = () => {
    convertpageConvertNowGoto()
    const {cardNum, awardId} = this.state

    // 申请兑换
    const param = { 
      awardId: awardId,
      awardCount: cardNum
    }
    API.applicateExchange(param).then(res => {
      const { code } = res
      if(code) return
      this.toggleMask('exchageDone')
      convertpageSuccessPopupView()
    })
  }

  cardClick = (cardInd, awardId, awardAccount) => {
    convertpageChooseDenomination({card_id: awardId})
    this.setState({
      cardNum: 1,
      cardInd, awardId, awardAccount,
    })
  }

  toMyAccount = () => {
    convertpageSuccessPopupGoto()
    setTimeout(() => {
      this.props.history.push(`/myAccount?activCode=fenxiangfanyong&tabInd=1`)
    }, 200)
  }

  render () {
    const { balance, cardInd, awardId, cardNum, awardAccount, exchageDone, surplus, exchangeFlag,
      rulerPop, awardCardList } = this.state
    const maxNum = balance > 500 ? 500 : balance
    const cardCopyNum = Math.floor(maxNum/awardAccount)
    return (
      <Page title='兑换'>
        <div className={styles.toExchange}>
          <div className={styles.tipBox}>今日兑换份额仅剩{surplus}人次，需兑换要抓紧哦～</div>
          
          <div className={styles.ecardOut}>
            <h3>选择你想要的购物卡</h3>
            <ul className={styles.cardBox}>
              {awardCardList && awardCardList.length>0 && awardCardList.map((item, index) => {
                const { awardAccount, awardId} = item
                return <li 
                    key={index} 
                    onClick={() => this.cardClick(index, awardId, awardAccount)} 
                    className={`${cardInd === index ? styles.on : ''}`}>
                    <b>{awardAccount}</b>
                    <span>京东E卡</span>
                  </li>
              })}
            </ul>

            <h3>请输入兑换的份数</h3>
            <div className={styles.numberBox}>
              <button disabled={cardNum === 0} onClick={() => this.updateCount(-1)}>-</button>
              <b>{cardNum}</b>
              <button disabled={cardNum === cardCopyNum} onClick={() => this.updateCount(1)}>+</button>
            </div>
            {awardAccount && <p className={styles.gray}>最多可兑换{cardCopyNum}份</p>}

            <div className={`${styles.btnBox} ${styles.pt40}`}>
              <button
                disabled={!(awardId && cardNum && (balance>=awardAccount*cardNum) && (surplus>0) && exchangeFlag)}
                onClick={this.touchExchange}
              >
                {`${!((surplus>0) && exchangeFlag) ? '明日再来' : '立即兑换' }`}
              </button>
            </div>

            <p className={styles.rulerpop} onClick={() => this.toggleMask('rulerPop')}>兑换规则 ></p>

            {/* 兑换成功 */}
            <Modal
              handleToggle={() => {this.toggleMask('exchageDone')}}
              type
              visible={exchageDone}>
              <div className={styles.doneExchBox}>
                <img src={`${springFission}doneExchange.png`} />
                <h3>申请成功</h3>
                <div className={styles.btnBox}>
                  <button onClick={this.toMyAccount}>返回</button>
                </div>
              </div>
            </Modal>

            {/* 活动规则 */}
            <Modal
              handleToggle={() => {this.toggleMask('rulerPop')}}
              type
              visible={rulerPop}>
              <Ruler remark={remark} />
            </Modal>
          </div>
        </div>
      </Page>
    )
  }
}

export default ExchangeView
