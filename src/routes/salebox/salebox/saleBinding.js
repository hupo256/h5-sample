import React, { Component } from 'react'
import { Page } from '@src/components'
import { API, fun } from '@src/common/app'
import styles from './../salebox.scss'
import { Toast } from 'antd-mobile'
import PropTypes from 'prop-types'
import saleBind from '@static/salebox/saleBind.png'
const { getParams } = fun

class SaleBinding extends Component {
  state = {
    bindState: '', // 1代表已绑定产品，2代表未选择
    isNewUser: false,
    productName: ''
  }
  componentDidMount () {
    this.userJudge()
  }
  userJudge = () => {
    API.getIsNewOrOldUser().then(res => {
      const { code, data } = res
      if (!code) {
        if (data) {
          this.setState({
            isNewUser: data
          }, () => {
            API.getReportUserSelect({}).then(res => {
              const { data } = res
              if (data.productName) {
                this.setState({
                  bindState: 1,
                  productName: data.productName
                })
              } else {
                this.setState({
                  bindState: 0
                })
              }
            })
          })
        } else {
          Toast.info('抱歉，该活动仅限新用户参与', 3)
        }
      }
    })
  }
  handleBind = (type) => {
    const channelCode = getParams().channelCode
    if (type === 1) {
      // 做用户注册判断，新户跳注册，老户跳绑定
      const { isNewUser } = this.state
      if (isNewUser) {
        API.myInfo({ noloading:1 }).then(res => {
          const { data } = res
          if (data.checkMobileFlag === 2) {
            this.props.history.push(`/binding?channelCode=${channelCode}`)
          } else {
            // this.props.history.push(`/login?url=/binding&channelCode=${channelCode}`)
          }
        })
      } else {
        Toast.info('抱歉，该活动仅限新用户参与', 3)
      }
    } else {
      this.props.history.push(`/binding?channelCode=${channelCode}`)
    }
  }
  render () {
    const { bindState, productName } = this.state
    let bingCont = ''
    if (bindState === 1) {
      bingCont = (
        <div className={styles.outbox}>
          <div className={styles.bindCont}>
            <p>你已成功领取</p>
            <p>{productName}</p>
          </div>
          <div className={styles.bindBtn} onClick={() => this.handleBind(2)}>去绑定</div>
        </div>
      )
    } else if (bindState === 0) {
      bingCont = (
        <div className={styles.outbox}>
          <div className={styles.bindCont}>
            <p>你有1个免费</p>
            <p>基因检测项目待领取</p>
          </div>
          <div className={styles.scan}>请扫描采样器条形码绑定后领取</div>
          <div className={styles.bindBtn} onClick={() => this.handleBind(1)}>立即领取</div>
        </div>
      )
    }
    return (
      <Page title='安我基因'>
        <div className={styles.bindBg}>
          <img src={saleBind} alt='' />
          {
            bingCont
          }
          <div className={styles.contactUs}>
            <p>本次活动最终解释权归安我基因所有</p>
            <p>客服电话：400-682-2288</p>
          </div>
        </div>
      </Page>
    )
  }
}
SaleBinding.propTypes = {
  history: PropTypes.object.isRequired
}

export default SaleBinding
