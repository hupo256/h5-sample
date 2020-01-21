import React, { Component } from 'react'
import { Page, Bomb } from '@src/components'
import { API, fun } from '@src/common/app'
import styles from './../salebox.scss'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import saleStart from '@static/salebox/saleStart.png'
const { getParams } = fun

class SaleSelect extends Component {
  state = {
    bodyCont: '',
    bombState: false,
    seriesFree: [],
    seriesPay: [],
    standardFree: [],
    standardPay: [],
    vipFree: [],
    vipPay: [],
    standardFlag: 1, // 1代表标品，2代表系列，3代表VIP
    proId: '',
    seriesId: '',
    vipId: ''
  }
  componentDidMount () {
    this.querySaleMsg()
  }
  /*
   * 列表产品分类: tradeProduct存在，标品
   *tradeProductSeriesEntity存在，系列产品
   * tradeVipEntity存在，vip产品
   */
  querySaleMsg = () => {
    const { channelCode } = getParams()
    API.listReportSellBoxProduct({ channelCode }).then(res => {
      const [seriesFree, seriesPay, standardFree, standardPay, vipFree, vipPay] = [[], [], [], [], [], []]
      const { data } = res
      for (var item of data) {
        if (item.tradeProduct) {
          item.showType === 0 ? standardFree.push(item) : standardPay.push(item)
        } else if (item.tradeProductSeriesEntity) {
          item.showType === 0 ? seriesFree.push(item) : seriesPay.push(item)
        } else if (item.tradeVipEntity) {
          item.showType === 0 ? vipFree.push(item) : vipPay.push(item)
        }
      }
      this.setState({
        seriesFree,
        seriesPay,
        standardFree,
        standardPay,
        vipFree,
        vipPay
      })
    })
  }
  // 点击立即选择, 弹窗提醒
  // freeType = 1, 免费， =2代表跳转购买
  handelSelect = (item, kindType, id, freeType) => {
    const { channelCode, barCode } = getParams()
    if (freeType === 1) {
      this.setState({
        bodyCont: `<div style="font-size: 16PX">
        <p>确认选择</p><p>${item}?</p>
        <p style="color:#007AFF;font-size: 13PX;margin-top: 9px">一经选择，不能更改</p></div>`,
        bombState: true
      })
    } else {
      if (kindType === 'tradeVipEntity') {
        this.props.history.push(`/landmember?channelCode=${channelCode}&barCode=${barCode}`)
      } else if (kindType === 'tradeProduct') {
        this.props.history.push(`/commodity?id=${id}&barCode=${barCode}&channelCode=${channelCode}`)
      } else {
        this.props.history.push(`/card-list?seriesIds=${id}&barCode=${barCode}&channelCode=${channelCode}`)
      }
    }
    // 1代表标品，2代表系列，3代表VIP，如果不是标品要请求getCommomProduct获取到productId
    if (kindType === 'tradeProduct') {
      this.setState({
        standardFlag: 1,
        proId: id
      })
    } else if (kindType === 'tradeProductSeriesEntity') {
      this.setState({
        standardFlag: 2,
        seriesId: id
      })
    } else {
      this.setState({
        standardFlag: 3,
        vipId: id
      })
    }
  }
  handleCancle = () => {
    this.setState({
      bombState: false
    })
  }
  handleConfirm = () => {
    let { standardFlag } = this.state
    let { barCode, channelCode } = getParams()
    if (standardFlag === 2 || standardFlag === 3) {
      API.getCommomProduct({}).then(res => {
        const { data } = res
        this.setState({
          proId: data.id
        }, () => {
          const { proId, seriesId, vipId } = this.state
          let params = {}
          if (standardFlag === 2) {
            params = {
              barCode: barCode,
              productId: proId,
              seriesId: seriesId,
              vipId: '',
            }
          } else if (standardFlag === 3) {
            params = {
              barCode: barCode,
              productId: proId,
              seriesId: '',
              vipId: vipId,
            }
          }
          API.userConfirmSelect(params).then(res => {
            const { code } = res
            if (!code) {
              this.props.history.push(`/binding?channelCode=${channelCode}&barCode=${barCode}`)
            }
          })
        })
      })
    } else {
      const { proId } = this.state
      let params = {
        barCode: barCode,
        productId: proId,
        seriesId: '',
        vipId: '',
      }
      API.userConfirmSelect(params).then(res => {
        const { code } = res
        if (!code) {
          this.props.history.push(`/binding?channelCode=${channelCode}&barCode=${barCode}`)
        }
      })
    }
  }
  /*
   *type=1, 跳系列; type=2, 跳标品
   */
  getToDetail = (id, type) => {
    const { barCode, channelCode } = getParams()
    if (type === 1) {
      this.props.history.push(`/card-list?seriesIds=${id}&barCode=${barCode}&channelCode=${channelCode}`)
    } else if (type === 2) {
      this.props.history.push(`/commodity?id=${id}&barCode=${barCode}&channelCode=${channelCode}`)
    }
  }
  // type = 1, 免费； type = 2, 付费
  showList = (seriesArr, standardArr, vipArr, type) => {
    let listArr = []
    const { barCode, channelCode } = getParams()
    seriesArr.map(item => {
      let { tradeProductSeriesEntity = {} } = item
      let info = (
        <li key={item.id}>
          <div className={styles.leftImg}
            onClick={() => this.getToDetail(tradeProductSeriesEntity.id, 1)}>
            <img src={tradeProductSeriesEntity.seriesPicUrl} />
          </div>
          <div className={styles.rightCont}>
            <h3>{tradeProductSeriesEntity.seriesName}</h3>
            <p>{tradeProductSeriesEntity.seriesDesc}</p>
            <div className={styles.bottomCont}>
              <p>共{tradeProductSeriesEntity.cardNum}张卡片</p>
              <div className={styles.invite}
                onClick={() => {
                  this.handelSelect(tradeProductSeriesEntity.seriesName,
                    'tradeProductSeriesEntity', tradeProductSeriesEntity.id, type)
                }}>
                <span>{type === 1 ? '立即选择' : '立即抢购'}</span>
              </div>
            </div>
          </div>
        </li>
      )
      listArr.push(info)
    })
    standardArr.map(item => {
      let { tradeProduct = {} } = item
      let { productDetail = {} } = tradeProduct
      let info = (
        <li className={type === 2 ? styles.recommendCont : ''} key={item.id}>
          <div className={styles.leftImg}
            onClick={() => this.getToDetail(tradeProduct.id, 2)}>
            <img src={productDetail.indexPicUrl} />
          </div>
          <div className={styles.rightCont}>
            <h3>{tradeProduct.productName}</h3>
            <p>{productDetail.productSubhead}</p>
            <div className={styles.bottomCont}>
              {
                type === 2 ? (
                  <div className={styles.describe}>
                    <span className={styles.cardNum}>{productDetail.productDesc}</span>
                    <div>
                      <span className={styles.recommendPrice}>¥{tradeProduct.productPrice}</span>
                      {
                        tradeProduct.productOriginPrice ? (
                          <span className={styles.originPrice}>原价¥{tradeProduct.productOriginPrice}</span>
                        ) : ''
                      }
                    </div>
                  </div>
                ) : (
                  <p>{productDetail.productDesc}</p>
                )
              }
              <div className={styles.invite}
                onClick={() => {
                  this.handelSelect(tradeProduct.productName, 'tradeProduct', tradeProduct.id, type)
                }}>
                <span>{type === 1 ? '立即选择' : '立即抢购'}</span>
              </div>
            </div>
          </div>
        </li>
      )
      listArr.push(info)
    })
    vipArr.map(item => {
      let { tradeVipEntity = {} } = item
      let info = (
        <li className={type === 2 ? styles.recommendCont : ''} key={item.id}>
          <Link className={styles.leftImg} to={`/landmember?channelCode=${channelCode}&barCode=${barCode}`}>
            <img src={tradeVipEntity.indexPicUrl} />
          </Link>
          <div className={styles.rightCont}>
            <h3>{tradeVipEntity.vipName}</h3>
            <p>每个宝宝的潜能，都不应该被埋没</p>
            <div className={styles.bottomCont}>
              {
                type === 2 ? (
                  <div className={styles.describe}>
                    <span className={styles.cardNum}>共{tradeVipEntity.cardNum}张卡片</span>
                    <div>
                      <span className={styles.recommendPrice}>¥{tradeVipEntity.newPrice}</span>
                      <span className={styles.originPrice}>原价¥{tradeVipEntity.originNewPrice}</span>
                    </div>
                  </div>
                ) : (
                  <p>共{tradeVipEntity.cardNum}张卡片</p>
                )
              }
              <div className={styles.invite} onClick={
                () => { this.handelSelect(tradeVipEntity.vipName, 'tradeVipEntity', tradeVipEntity.id, type) }} >
                <span>{type === 1 ? '立即选择' : '立即抢购'}</span>
              </div>
            </div>
          </div>
        </li>
      )
      listArr.push(info)
    })
    return listArr
  }
  render () {
    const { bodyCont, seriesFree, seriesPay, standardFree, standardPay, vipFree, vipPay, bombState } = this.state
    const btns = [{
      name: '取消',
      event: this.handleCancle,
      color: '#212121'
    }, {
      name: '确定',
      event: this.handleConfirm,
      color: '#007AFF'
    }]
    return (
      <Page title='选择产品'>
        <div className={styles.selectBg}>
          <div className={styles.selectAny}>以下项目任选1个 进行基因检测</div>
          <ul className={styles.selectList}>
            {
              this.showList(seriesFree, standardFree, vipFree, 1)
            }
          </ul>
          <div className={styles.recommend}>
            <span>——</span>
            <img src={saleStart} alt='' />
            <span>为你推荐</span>
            <span>——</span>
          </div>
          <ul className={styles.selectList}>
            {
              this.showList(seriesPay, standardPay, vipPay, 2)
            }
          </ul>
          {
            bombState ? <Bomb bodyCont={bodyCont} footers={btns} /> : ''
          }
        </div>
      </Page>
    )
  }
}
SaleSelect.propTypes = {
  history: PropTypes.object.isRequired
}

export default SaleSelect
