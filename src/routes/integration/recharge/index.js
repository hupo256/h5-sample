import React from 'react'
import Page from '@src/components/page'
import propTypes from 'prop-types'
import styles from './recharge'
import integrationApi from '@src/common/api/integrationApi'
import { fun, ua } from '@src/common/app'
import images from '../images'
import BlueBtn from '../components/blueBtn'
import PayNow from '../components/payNow'
import ShowModal from '../components/showModal'
import NavigationBar from '@src/components/navigationBar'
import valueFlash from '@src/common/utils/valueFlash'
import { balancePageView, balancePageGoto } from '../buried-point'

const { getParams } = fun
const { isAndall } = ua

class Recharge extends React.Component {
  state = {
    loading:true,
    activeMoney:0,
    activeWay:3,
    payNowFlag:false,
    detailInfo:{}
  }

  componentDidMount () {
    this.readRechargeConfig()
    balancePageView({ view_type:+getParams().type === 1 ? 'recharge_complete' : +getParams().type === 2 ? 'card_activate_complete' : 'my' })
    andall.on('onVisibleChanged', (res) => {
      res.visibility && this.readRechargeConfig()
    })
  }
  readRechargeConfig=() => {
    integrationApi.readRechargeConfig({ noloading:1 }).then(res => {
      if (res) {
        console.log(res.data)
        this.setState({
          detailInfo:res.data,
          loading:false,
          payNowFlag:false,
          activeWay:3,
          activeMoney:0
        }, () => {
          valueFlash(document.getElementById('remainAccount'), res.data.account, 1)
        })
      }
    })
  }
  confirmThis=() => {
    balancePageGoto({ Btn_name: 'recharge_now' })
    this.modalToggle('payNowFlag')
  }
  modalToggle = (name, status) => {
    if (status) { balancePageGoto({ Btn_name: 'tip' }) }
    this.setState({ [name]: !this.state[name] })
  }
  choosePay=(type) => {
    const { detailInfo, activeMoney } = this.state
    this.setState({ activeWay:type }, () => {
      integrationApi.preRecharge({
        rechargeId:detailInfo.userRechargeDTOList[activeMoney].id,
        payType:type === 0 ? 'WXAPP' : 'ALIPAYAPP'
      }).then(res => {
        if (res) {
          const { data } = res
          if (isAndall()) {
            andall.invoke('gotoThirdPay',
              { payType:type + 1, data }, re => {
                if (+re.isSuccess) {
                  let url = `/mkt/integration/recharge/success?orderId=${data.orderId}`
                  location.href = `andall://andall.com/inner_webview?url=${window.location.origin + url}`
                } else {
                  this.readRechargeConfig()
                }
              })
          }
        }
      })
    })
  }
  goPage=(type) => {
    balancePageGoto({ Btn_name:type === 1 ? 'detailed' : 'card_activate' })
    let url = `${type === 1 ? '/mkt/integration/recharge/details' : '/mkt/integration/recharge/start?type=my'}`
    location.href = ua.isAndall() ? `andall://andall.com/inner_webview?url=${window.location.origin + url}` : url
  }
  goBack=() => {
    isAndall() ? andall.invoke('back') : window.history.go(-1)
  }
  render () {
    const { loading, detailInfo, activeMoney, activeWay, payNowFlag, modalFlag } = this.state
    return (
      <Page title='我的余额'>
        {!loading
          ? <div className={styles.recharge}>
            <NavigationBar title='我的余额' type='black' background='#fff' back={() => this.goBack()} hasRight='明细' tightGo={() => this.goPage(1)} />
            <div className={styles.header}>
              <div className={styles.acount}>
                <span>当前余额（元）</span>
                <p onClick={() => this.modalToggle('modalFlag', 1)}>
                  <span id='remainAccount'>{detailInfo.account}</span><img src={images.dikou} />
                </p>
              </div>
            </div>
            <div className={styles.padding20}>
              <div className={styles.banner} onClick={() => this.goPage(2)}>
                <img src={images.recharge1} />
                <span>在这里激活你的礼品卡</span>
                <img src={images.recharge2} />
              </div>
            </div>
            {
              detailInfo.userRechargeDTOList && detailInfo.userRechargeDTOList.length
                ? <div className={styles.padding15}>
                  <div className={styles.borderBottom} />
                </div>
                : ''
            }
            {
              detailInfo.userRechargeDTOList && detailInfo.userRechargeDTOList.length
                ? <div className={styles.padding20}>
                  <h5>优惠充值</h5>
                  <div className={styles.doRecharge}>
                    {
                      detailInfo.userRechargeDTOList && detailInfo.userRechargeDTOList.map((item, index) => (
                        <div className={`${styles.box} ${activeMoney === index && styles.active}`} key={index}
                          onClick={() => this.setState({ activeMoney:index })}>
                          <p>{item.amount}</p><span>元</span>
                          {item.presentAmount ? <div className={styles.tip}>赠{item.presentAmount}元</div> : ''}
                        </div>
                      ))
                    }
                  </div>
                </div>
                : ''
            }
            {
              detailInfo.userRechargeDTOList && detailInfo.userRechargeDTOList.length
                ? <div className={styles.btn} style={{ paddingBottom:'20px' }}>
                  <BlueBtn
                    name={'立即充值'}
                    confirmThis={this.confirmThis}
                  />
                </div>
                : ''
            }
            {
              modalFlag
                ? <ShowModal
                  type={1}
                  name='recharge'
                  handleToggle={() => this.modalToggle('modalFlag')}
                />
                : null
            }
            {
              payNowFlag && <PayNow
                active={activeWay}
                choosePay={(index) => this.choosePay(index)}
                handleClose={() => this.modalToggle('payNowFlag')}
              />
            }
          </div>
          : ''
        }
      </Page>
    )
  }
}
Recharge.propTypes = {
  history: propTypes.object,
}
export default Recharge
