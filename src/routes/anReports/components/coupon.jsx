import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../newDetails/detail'
import images from '../images'
class Coupon extends Component {
    static propTypes = {
      data:propTypes.object,
      receive:propTypes.func
    }
    componentDidMount() {

    }
    receive=(item) => {
      this.props.receive(item)
    }
    render() {
      const { data } = this.props
      return (
        <div>
          <div className={styles.coupon} onClick={() => this.receive(data)}>
            <div>￥<span>{data.amount}</span></div>
            <img src={`${data.isGet === 1 ? images.couponTwo : images.couponOne}`} />
            <div className={styles.text}>
              <h2>{data.head}</h2>
              <p dangerouslySetInnerHTML={{ __html:data.des }} />
            </div>
          </div>
        </div>
      )
    }
}

export default Coupon
