import React from 'react'
import { Toast } from 'antd-mobile'
import Page from '@src/components/page/index'
import Modal from '@src/components/modal/index'
import memberApi from '@src/common/api/memberApi'
import {vipManageView, vipManageGoto,} from './componets/BuriedPoint'
import styles from './members'
import fun from '@src/common/utils'
import images from './componets/images'
const { getSession} = fun

class Renewal extends React.Component {
  state = {
    logList: [],
    closeRene: false,
    statusBarHeight:'',
  }

  componentDidMount() {
    vipManageView()
    this.getStatusBarHeight()

    memberApi.getBuyLogList().then(res => {
      console.log(res)
      const { code, data } = res
      if (code) return
      this.setState({ logList: data || [] })
    })
  }
  getStatusBarHeight(){
    let height = window.localStorage.getItem('statusBarHeight')
    
    let statusBarHeight= height? height+'px': '44px'
    this.setState({
      statusBarHeight
    })
  }
  goBack(){
    history.go(-1);
  }

  runState = (name) => {
    this.setState({
      [name]: !this.state[name],
    })
  }

  touchCloseBtn = () => {
    this.runState('closeRene')
    vipManageGoto({Btn_name: 'cancel_renew'})
  }

  toCloseRene = () => {
    this.runState('closeRene')
    vipManageGoto({Btn_name: 'cancel_renew_sure'})
    
    const { location: {state:{productId, isWxContract}}} = this.props
    // const productId =getSession(productId)
    // const isWxContract=getSession(isWxContract)
    const params = {
      memberProductId: productId,
      payType: +isWxContract ? 1 : 2,
    }
    memberApi.agreementUnSign(params).then(res => {
      console.log(res)
      const { code, data } = res
      if (code) return
      Toast.info("VIP自动续费已取消", 2)
      setTimeout(() => {
        window.history.go(-1)
      }, 2000)
    })
  }

  render() {
    // const contractPrice=getSession(contractPrice)
    // const endTime=getSession(endTime)
    // const isWxContract=getSession(isWxContract)
    // const contract=getSession(contract)

    const { location: {state:{contractPrice, endTime,isWxContract,contract}}} = this.props
    const { logList, closeRene,statusBarHeight } = this.state
    return (
      <Page title={contract ? '管理续费' : '购买记录'}>
        <div className={`${styles.titleBar} ${styles.white}`} style={{paddingTop: `${statusBarHeight}`}}>
          <div className={styles.titleBarCon}>
            <div className={styles.backIcon} onClick={()=>this.goBack()}>
              <img src={images.iconBackBlack} />
            </div>
            <h1>{contract ? '管理续费' : '购买记录'}</h1>
          </div>  
        </div>
        <div className={styles.renewalBox} style={{paddingTop: `calc(44px + ${statusBarHeight})`}}>
          {!!contract &&  <div className={styles.renTit}>
            <h4>
              <span>VIP会员一个月</span>
              <u onClick={this.touchCloseBtn}>取消自动续费</u>
            </h4>
            <ul>
              <li>
                <span>下次续费日期：</span>
                <span>{endTime}</span>
              </li>
              <li>
                <span>下次续费金额：</span>
                <span>￥{contractPrice}</span>
              </li>
              <li>
                <span>默认支付方式：</span>
                <span className={styles.f16a}>{+isWxContract ? '微信' : '支付宝'}</span>
              </li>
            </ul>
          </div>}

          <div className={styles.payRecode}>
            {!!contract && <p>购买记录</p>}
              {logList.length > 0 && <ul>
                {
                  logList.map((log, index) => {
                    const { price, buyTime } = log
                    return <li key={index}>
                      <p>
                        <span>购买安我会员·月卡</span>
                        <span>¥{price}</span>
                      </p>
                      <p>购买日期：{buyTime}</p>
                    </li>
                  })
                }
               </ul>
            }
          </div>

          <Modal
            handleToggle={() => { this.runState('closeRene') }}
            visible={closeRene}>
            <div className={styles.modalCon}>
              <h3>您确认要取消自动续费吗？</h3>

              <div className={styles.btnBox}>
                <button onClick={this.toCloseRene} className={styles.btn}>确认取消</button>
                <button onClick={() => this.runState('closeRene')} className={styles.btn}>暂不取消</button>
              </div>
            </div>
          </Modal>
        </div>
      </Page>
    )
  }
}

export default Renewal
