import React, { Component } from 'react'
import propTypes from 'prop-types'
import images from '../images'
import styles from '../integration.scss'

class PayWay extends Component {
  static propTypes = {
    active:propTypes.number,
    choosePay:propTypes.func
  }
  state = {
    payArr:['微信支付', '支付宝支付'],
  }
  choosePayBtn=(index) => {
    this.props.choosePay(index)
  }
  render () {
    const { active } = this.props
    return (
      <div className={styles.pay}>
        {
          this.state.payArr.map((item, index) => (
            <div key={index} onClick={() => this.choosePayBtn(index)}>
              <p>
                <img src={index === 0 ? images.pay1 : images.pay2} />
                <span>{item}</span>
              </p>
              <img src={active === index ? images.radio1 : images.radio2} />
            </div>
          ))
        }
      </div>
    )
  }
}
export default PayWay
