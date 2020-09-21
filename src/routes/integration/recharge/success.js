import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './recharge.scss'
import images from '../images'
import { fun } from '@src/common/app'
import integrationApi from '@src/common/api/integrationApi'
import { rechargeCompletePageView, activateCompletePageView, activateCompletePageGoto } from '../buried-point'
const { getParams } = fun

class RechargeSuccess extends React.Component {
  state = {
    loading:false,
    pageType:getParams().orderId ? 1 : 2
  }

  componentDidMount () {
    if (getParams().orderId) {
      rechargeCompletePageView()
      this.rechargePaySuccess()
    } else {
      activateCompletePageView()
      this.setState({
        descObj:this.props.location.state
      })
      console.log(this.props.location.state)
    }
  }
  rechargePaySuccess=() => {
    integrationApi.rechargePaySuccess({
      orderId:getParams().orderId
    }).then(res => {
      if (res) {
        console.log(res)
        this.setState({ descObj:res.data })
      }
    })
  }
  confirmThis=(type) => {
    if (this.state.pageType === 2) {
      activateCompletePageGoto({ Btn_name:type === 3 ? 'go_on' : 'view_balance' })
    }
    let url = `${type === 3 ? '/mkt/integration/recharge/start?type=balance_page' : `/mkt/integration/recharge?hideTitleBar=1&type=${type}`}`
    location.href = `andall://andall.com/inner_webview?url=${window.location.origin + url}`
  }
  render () {
    const { descObj, pageType } = this.state
    return (
      <Page title='充值'>
        {
          descObj
            ? <div className={styles.success}>
              <div className={styles.title}>
                <img src={images.success3} />
                <span>{pageType === 1 ? '充值成功' : '激活成功'}</span>
              </div>
              <div className={styles.account}><label>¥</label><span>{descObj.totalAmount}</span></div>

              {
                pageType === 1
                  ? <p>{descObj.presentAmount ? `实付¥${descObj.amount} 赠送¥${descObj.presentAmount}` : ''}</p>
                  : <p> {descObj.presentAmount ? `（实付¥${descObj.amount} 赠送¥${descObj.presentAmount}）已为您充值到余额` : '已为您充值到余额' } </p>
              }
              {
                pageType === 1
                  ? <div className={styles.oneBtn}>
                    <p className={styles.btn0} onClick={() => this.confirmThis(1)}>确定</p>
                  </div>
                  : <div className={`${styles.twoBtn}`}>
                    <p className={styles.btn1} onClick={() => this.confirmThis(2)}>查看余额</p>
                    <p className={styles.btn2} onClick={() => this.confirmThis(3)}>继续激活</p>
                  </div>
              }
            </div>
            : ''
        }
      </Page>
    )
  }
}
RechargeSuccess.propTypes = {
  history: propTypes.object,
}
export default RechargeSuccess
