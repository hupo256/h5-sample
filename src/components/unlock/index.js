import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { fun, point } from '@src/common/app'
import Modal from '../modal'

import styles from './index.scss'

const { setSetssion } = fun
const { allPointTrack } = point

class Unlock extends React.Component {
  state = {
    pro: {}
  }
  // 查看产品详情
  viewProductDetail=(pro, linkManId) => {
    const { id } = pro
    this.props.history.push(`/commodity?id=${id}&linkManId=${linkManId}`)
  }

  handleallPointTrack = () => {
    const { pro } = this.state
    const { type, barCode } = this.props
    const { productName, id } = pro
    const obj = {
      eventName:'report_unlock_goto',
      pointParams:{
        sample_barcode:barCode || '',
        product_id:id,
        product_name:productName,
        page_name:document.title,
        view_type:type ? 'report_home' : 'report_list'
      }
    }
    allPointTrack(obj)
  }

  // 报告直接解锁
  handleSubmit = () => {
    const { productDetail, id, productName, unlockPrice, productPrice } = this.state.pro
    const { list } = this.props
    const { linkManName, linkManId } = list

    const ordeList = {
      productPrice:unlockPrice || productPrice,
      productName,
      linkManId,
      prodId:id,
      linkManUserName:linkManName,
      cartProdPath:productDetail.headPicUrl,
      fromCartFlag:1,
      seriesId: '',
      lockCards: [{ prodId: id }]
    }
    setSetssion('unlockList', [ordeList])
    this.props.history.push(`/unlock-submit?buyType=2`)
  }

  render () {
    const { list, handleToggle, visible } = this.props
    const { tradeProductList = [], linkManName, linkManId } = list
    const { pro } = this.state

    return (
      <div>
        <ul>
          {tradeProductList.map((item, i) => (
            <li className={`white flex ${styles.list}`} key={i}>
              <div
                onClick={() => {
                  this.setState({ pro:item })
                  this.handleToggle()
                }}
                className={`img imgCenter ${styles.img} ${styles.unlockImg}`}>
                <img src={item.productDetail && item.productDetail.headPicUrl} />
              </div>
              <div className='item content'>
                <span className='nowrap'>{item.productName}</span>
                <p className={`nowrap ${styles.through}`}>原价：¥{item.productPrice}</p>
                <p className={`nowrap ${styles.redColor}`}>解锁价：¥{item.unlockPrice}</p>
                <a
                  href='javascript:;'
                  onClick={() => {
                    this.setState({ pro:item }, () => {
                      handleToggle()
                      this.handleallPointTrack()
                    })
                  }}
                  className={styles.btn}>
                  <button className={styles.redBtns}>立即解锁</button>
                </a>
              </div>
            </li>
          ))
          }
        </ul>
        <Modal
          visible={visible}
          type
          handleToggle={() => { handleToggle() }}
        >
          <div className={styles.modalTxt}>
            <span>检测人：{linkManName}</span>
            <span>解读产品：{pro.productName}</span>
            <p>选择解锁即授权安我基因提取当前检测者的原始数据以再次解读，为其生成对应产品的检测报告。未经你的授权，我们不会对数据做其他产品的分析解读。</p>
            <div className={`flex ${styles.modalBom}`}>
              <span onClick={() => this.viewProductDetail(pro, linkManId)} className='item'>
                查看详情
              </span>
              <span onClick={this.handleSubmit} className='item redBtn'>直接解锁</span>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

Unlock.propTypes = {
  list: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  barCode: PropTypes.string,
  type: PropTypes.number
}

export default withRouter(Unlock)
