import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './recharge.scss'
import integrationApi from '@src/common/api/integrationApi'
import BlueBtn from '../components/blueBtn'
import { Toast } from 'antd-mobile'
import { cardActivatePageView, cardActivatePageGoto } from '../buried-point'
import ua from '@src/common/utils/ua'
import fun from '@src/common/utils'
const { getParams, fixScroll } = fun
const { isIos } = ua

class RechargeStart extends React.Component {
  state = {
    loading:false,
    showError1:false,
    showError2:false,
    cardNo:'',
    cardSecret:'',
    message:''
  }

  componentDidMount () {
    cardActivatePageView({ view_type:getParams().type })
  }
  confirmThis=() => {
    const { cardNo, cardSecret } = this.state
    if (cardNo === '' || cardSecret === '') {
      return this.setState({ noFlag:true })
    }
    cardActivatePageGoto({ Btn_name:'sure' })
    integrationApi.bindCard({
      cardNo:cardNo.replace(/\s/g, ''),
      cardSecret:cardSecret.replace(/\s/g, ''),
    }).then(res => {
      if (res) {
        console.log(res)
        Toast.hide()
        if (res.code === 0 && res.data) {
          this.props.history.push({
            pathname: '/integration/recharge/success',
            state: { ...res.data }
          })
        }
        this.setState({
          showError1:res.code === 40020 || res.code === 40022,
          showError2:res.code === 40021,
          message:res.msg,
          noFlag:false
        })
      }
    })
  }
  render () {
    const { showError1, showError2, message, cardNo, cardSecret, noFlag } = this.state
    return (
      <Page title='激活礼品卡'>
        <div className={`${styles.start} ${styles.padding20}`}>
          <div className={styles.input}>
            <p>卡号</p>
            <input
              placeholder='请输入卡号'
              onChange={(e) => this.setState({ cardNo:e.target.value })}
              onBlur={() => { isIos() && window.scrollBy(0, fixScroll().top) }}
            />
          </div>
          {
            noFlag && cardNo === '' ? <p className={styles.error}>*请输入卡号</p> : ''
          }
          {
            showError1 && !noFlag ? <p className={styles.error}>*{message}</p> : ''
          }
          <div className={styles.input}>
            <p>密码</p>
            <input placeholder='请输入密码'
              onChange={(e) => this.setState({ cardSecret:e.target.value })}
              onBlur={() => { isIos() && window.scrollBy(0, fixScroll().top) }}
            />
          </div>
          {
            noFlag && cardSecret === '' ? <p className={styles.error}>*请输入密码</p> : ''
          }
          {
            showError2 && !noFlag ? <p className={styles.error}>*{message}</p> : ''
          }
          <div className={styles.btn} style={{ marginTop:'50px' }}>
            <BlueBtn
              name={'确定'}
              confirmThis={this.confirmThis}
            />
          </div>
          <p className={styles.tips}>激活后会将金额充值到你的余额</p>
        </div>
      </Page>
    )
  }
}
RechargeStart.propTypes = {
  history: propTypes.object,
}
export default RechargeStart
