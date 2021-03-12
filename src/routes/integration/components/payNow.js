import React, { Component } from 'react'
import propTypes from 'prop-types'
import images from '../images'
import styles from '../integration.scss'

class PayNow extends Component {
  static propTypes = {
    active:propTypes.number,
    choosePay:propTypes.func,
    handleClose: propTypes.func,
  }
  state = {
    payArr:['微信支付', '支付宝支付'],
  }
  choosePayBtn=(index) => {
    this.props.choosePay(index)
  }
  render () {
    const { active, handleClose } = this.props
    return (
      <div className={styles.payPicker} >
        <div>
          <div className={styles.top}>
            <span>支付方式</span>
            <img src={images.close} onClick={handleClose} />
          </div>
          <div className={styles.scrollBox}>
            {
              this.state.payArr.map((item, index) => (
                <div key={index} onClick={() => this.choosePayBtn(index)}>
                  <p>
                    <img src={index === 0 ? images.pay1 : images.pay2} />
                    <span>{item}</span>
                  </p>
                  <img src={active === index ? images.radio4 : images.radio3} />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}
export default PayNow
