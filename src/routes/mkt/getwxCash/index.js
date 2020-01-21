import React from 'react'
import { Page } from '@src/components'
import { Modal } from '@src/components'
import { API, fun, point, ua } from '@src/common/app'
import images from '@src/common/utils/images'
import styles from './getcash'

const { getParams } = fun
const { getwxCash } = images

class GetwxCash extends React.Component {
  state = {
    sharePop: false,
    noscroll: false,
    // statusFlag: 10,
    // isBingWechatFlag: 1,
  }

  componentDidMount () {
    this.getPages()
  }

  getPages = () => {
    const {isActive, barCode} = getParams()
    const params = {};
    isActive && Object.assign(params, {isActive})
    barCode && Object.assign(params, {barCode})
    API.getCashWithdrawalInfo(params).then(res => {
      console.log(res)
      const {code, data} = res
      if(code) return
      // data.statusFlag = 40
      // data.isBingWechatFlag = 0
      this.setState({...data})
    })
  }

  toggleMask = (key) => {
    this.setState({
      [key]: !this.state[key]
    })
  }

  toOpenwx = () => {
    andall.invoke('weChatBindUser', {}, () => {
      this.getPages()
      this.setState({sharePop: false})
    })
  }

  touchCashWithdrawal = () => {
    const {barCode} = getParams()
    const {openId, isBingWechatFlag} = this.state
    if(!isBingWechatFlag){
      this.toggleMask('sharePop')
      return
    }
    API.cashWithdrawal({barCode, openId}).then(res => {
      console.log(res)
      const {code, data} = res
      if(code) return
      this.setState({...data})
    })
  }

  render () {
    const { title, amount, statusFlag, isBingWechatFlag, sharePop, customerServicePhone } = this.state
    const imgBg = (statusFlag === 10 || statusFlag === 30) ? 'lightbg.jpg' : 'darkbg.jpg'
    return (
      <Page title={title || '奖金'}>
        <div className={styles.getwxCash}>
          <img src={`${getwxCash}${imgBg}`} />
          <div className={styles.redpopbox}>
            <div className={styles.popcon}>
              <img src={`${getwxCash}redpack.png`} />

              <div className={styles.cashBox}>
                <p>
                  <span>/////</span> 
                  <b>{title}</b>
                  <span>/////</span>
                </p>
                <div className={`${styles.numBox} ${statusFlag===50 ? styles.grayNum : ''}`}>
                  <span>￥</span>
                  <span>{amount}</span>
                </div>
              </div>

              {statusFlag === 10 && <div className={styles.getNow}>
                <img src={`${getwxCash}getBtn.png`} onClick={this.touchCashWithdrawal} />
                <p>
                  <b>- 每日限领1000份 -</b>
                  <span>奖金预计在提现后2小时内转入<br />您的微信零钱中</span>
                </p>
              </div>}

              {statusFlag === 30 && <div className={styles.reachCeiling}>
                <p>每日限领1000份</p>
                <p>明日再来吧～</p>
                <p><span>{`咨询客服：${customerServicePhone}`}</span></p>
              </div>}

              {statusFlag === 20 && <div className={styles.reachCeiling}>
                <p>提现审核中…</p>
              </div>}

              {statusFlag === 40 && <div className={styles.reachCeiling}>
                <p>提现成功</p>
                <p>
                  <span>奖金预计在提现后2小时内转入 <br />您的微信零钱中</span>
                </p>
              </div>}

              {statusFlag === 50 && <div className={styles.reachCeiling}>
                <p>红包已失效</p>
              </div>}

              <div className={styles.botmTex}>
                {(statusFlag === 10 || statusFlag === 30) ? 
                  <u onClick={() => { this.toggleMask('sharePop')}}>
                    {`${isBingWechatFlag === 1 ? '' : '未绑定微信？'}`}
                  </u> :
                  <span>{`咨询客服：${customerServicePhone}`}</span>
                }
              </div>
            </div>
          </div>

          <Modal
            handleToggle={() => { this.toggleMask('sharePop')}}
            // type
            visible={sharePop}>
            <div>
              <p className={styles.reachH3}>提现需绑定你的微信，<br />“安我生活”想要打开“微信”</p>

              <div className={styles.modalBtn}>
                <button onClick={() => { this.toggleMask('sharePop')}} className={styles.btnCan}>取消</button>
                <button onClick={this.toOpenwx}>打开</button>
              </div>
            </div>
          </Modal>
        </div>
      </Page>
    )
  }
}

export default GetwxCash
