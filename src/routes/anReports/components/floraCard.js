import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../newDetails/detail'
import CardTitle from './cardTitle'
import images from '../images'

class FloraCard extends Component {
  static propTypes = {
    title: propTypes.string,
    data:propTypes.object,
    detectionDetail:propTypes.func
  }
  state = {

  }

  componentDidMount() {
    console.log(this.props.data)
  }

  render() {
    const { title, detectionDetail, data } = this.props
    return (
      <div className={styles.floraCard}>
        <CardTitle title={title} />
        <div className={`${styles.square} ${styles.flora}`}>
          <div className={styles.kinds}>
            <div>
              <h5>有益菌</h5>
              {
                data.beneficialItems.map((item, index) => (
                  <p key={index}>
                    <span>{item.cname}</span>
                    {
                      item.isUp === 0 || item.isUp === 1
                        ? <img src={images.low} className={`${styles.arrow} ${item.isUp === 1 ? styles.high : ''}`} />
                        : ''
                    }
                  </p>
                ))
              }
            </div>
            <div>
              <h5>中性菌</h5>
              {
                data.neutralItems.map((item, index) => (
                  <p key={index}>
                    <span>{item.cname}</span>
                    {
                      item.isUp === 0 || item.isUp === 1
                        ? <img src={images.low} className={`${styles.arrow} ${item.isUp === 1 ? styles.high : ''}`} />
                        : ''
                    }
                  </p>
                ))
              }
            </div>
            <div>
              <h5>有害菌</h5>
              {
                data.harmfulItems.map((item, index) => (
                  <p key={index}>
                    <span>{item.cname}</span>
                    {
                      item.isUp === 0 || item.isUp === 1
                        ? <img src={images.low} className={`${styles.arrow} ${item.isUp === 1 ? styles.high : ''}`} />
                        : ''
                    }
                  </p>
                ))
              }
            </div>
          </div>
          <div className={`${styles.floraTips} ${styles.margin1}`}>
            说明:
            <img src={images.low} className={styles.high} />
            表示该菌含量偏高,
            <img src={images.low} />
            表示该菌含量偏低或未检出
          </div>
          <div className={styles.detailsBtn} onClick={detectionDetail}>
            <span>点击查看菌群检测详情</span>
            <img src={images.right} />
          </div>
        </div>
      </div >
    )
  }
}

export default FloraCard
