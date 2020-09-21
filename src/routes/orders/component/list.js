import React from 'react'
import propTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { filter } from '@src/common/app'
import styles from '../order'
import {Icon} from 'antd-mobile'
import toup from '@static/detail/toup.png'
import todown from '@static/detail/todown.png'
import ua from "@src/common/utils/ua";
const { isWechat, isIos, isAndall } = ua
const { orderStatus } = filter
let onlyThree=0;
let sign=true;
export default class List extends React.Component {
  static propTypes = {
    list: propTypes.array.isRequired,
    handlePay: propTypes.func,
    handleCancel: propTypes.func,
    type: propTypes.number
  }
  state = {
    visible:false,
    id:'',
    index:'',

    currentList:[],
    overThree:false,
    open:false,
    shortList:[]
  }

  handleShowModal = (id, index) => {
    this.setState({
      visible:true,
      id,
      index
    })
  }

  componentWillMount(){
    const {items,i } = this.props
    this.props.toggoleList(items,i);
  }


  computerNumber = () => {
    const { list } = this.props
    let allNum = 0
    list[0].orderDetails && list[0].orderDetails.map(item => {
      allNum += item.buyNum
    })
    return allNum
  }
  switchOne(items,indexTo) {
    if(items.jumpType==2){
      // 新订单

      return <div>
      {
        items.tradeOrderKitRespList && items.tradeOrderKitRespList.map((item1, index1) => (


          <div  key={index1}>
            <div className={`${styles.kitName} mb10`}>{item1.kitName}</div>
            {
              item1.tradeOrderKitProductRespList&&item1.tradeOrderKitProductRespList.map((item,index)=>(
                 <div key={`odtl${index}`}
                  className={`${styles.listCon} mb14`}
                >
                  <div className={`${styles.listLeft}`}>
                    <img src={item.indexPicUrl} />
                  </div>
                  <div className={`${styles.listMedia}`}>
                    <h3 className={`${styles.productName}`}>
                      {item.productName}
                    </h3>
                    <p className={`${styles.ellipsis}`}>
                      {item.productBuyDesc}
                    </p>
                    <div className={`${styles.priceLand}`}>
                      <div className={`${styles.price}`}>￥{item.productPrice||0}</div>
                      <span className={`${styles.num}`}>x1</span>
                    </div>
                  </div>
                </div>
              ))
            }

          </div>

        ))
      }
      {
        items.tradeOrderKitRespList && items.tradeOrderKitRespList.length
          ? <div className={`${styles.total}`}>
          合计&nbsp;&nbsp;￥{items.paymentAmount}
          </div> : null
      }
    </div>

    } else if(items.buyType && +items.buyType === 4){
      return <div key={`odtl${indexTo}`}
      className={`${styles.listCon} ${indexTo === items.orderDetails.length - 1 ? '' : 'mb14'}`}
        >
      <div className={`${styles.listLeft}`}>
        <img src={items.indexPicUrl} />
      </div>
      <div className={`${styles.listMedia}`}>
        <h3 className={`${styles.productName}`}>
          {items.productName}
        </h3>
        <p className={`${styles.ellipsis}`} />

        <div className={`${styles.priceLand}`}>
          <div className={`${styles.price}`}>￥{items.originalAmount}</div>

          <span className={`${styles.num}`}>x1</span>
        </div>
        <div className={`${styles.total}`}>
        合计&nbsp;&nbsp;￥{items.paymentAmount}
        </div>
      </div>
    </div>
    } else {
      return <div>
      {
        items.orderDetails && items.orderDetails.map((item, index) => (
          <div key={`odtl${index}`}
            className={`${styles.listCon} mb14`}
          >
            <div className={`${styles.listLeft}`}>
              <img src={item.indexPicUrl} />
            </div>
            <div className={`${styles.listMedia}`}>
              <h3 className={`${styles.productName}`}>
                {item.productName}
              </h3>
              <p className={`${styles.ellipsis}`}>
                {item.categoryName}
              </p>
              <div className={`${styles.priceLand}`}>
                <div className={`${styles.price}`}>￥{item.productOriginalPrice}</div>
                <span className={`${styles.num}`}>x{item.buyNum}</span>
              </div>
            </div>
          </div>
        ))
      }
      {
        items.orderStatus != 'DFK'&&items.orderDetails && items.orderDetails.length
          ? <div className={`${styles.total}`}>
          合计&nbsp;&nbsp;￥{items.paymentAmount}
          </div> : null
      }
    </div>
    }

  }
  toDetail=(items) => {
    if (!isAndall() || !isWechat()) {
      window.location.href = window.location.origin + (`/mkt/orders/${+items.orderSign === 1 ? 'unlock-details'
        : 'order-details'}?orderId=${items.id}&jumpType=${items.jumpType}`)
    }
    if (isAndall() || isWechat()) {
      this.props.history.push(`/orders/${+items.orderSign === 1 ? 'unlock-details'
        : 'order-details'}?orderId=${items.id}&jumpType=${items.jumpType}`);
    }
  }
  toggleList=(item,i)=>{
      this.props.toggoleList(item,i);
  }
  render () {
    const { type, handlePay, handleCancel,i,items } = this.props
    const { visible, index, id} = this.state
    return (
            <li className={`${styles.orderItem}`} key={`order${i}`}>
              <div className={`${styles.listHead} ${items.orderStatus === 'DFK' ? styles.redBg : ''}`}>
                <div className={`${styles.headCon}`}>订单号：{items.orderNo}</div>
                <span>{orderStatus(items.orderStatus)}</span>
              </div>
              <div className={`${styles.listConWrap}`}>
                {
                  this.switchOne(items,i)
                }
              </div>


              {items.hasMore&&(items.buyType && +items.buyType != 4)&&<p className={styles.showtac} onClick={()=>this.toggleList(items,i)}>
                  {!items.showMore ? '收起' : '展开更多'} <img src={!items.showMore ? toup : todown} />
                </p>}

              {
                type
                  ? items.orderStatus !== 'YQX' ? (
                    items.orderStatus === 'DFK' ? (

                      <div className={`${styles.listFoot}`}>
                        <a className={`flex ${styles.btn} ${styles.red}`}
                          onClick={() => handlePay(items)}
                        >
                          立即付款
                        </a>
                        <a className={`flex ${styles.btn}`}
                          onClick={() => { this.handleShowModal(items.id, i) }}
                        >
                          取消订单
                        </a>
                      </div>

                    )
                      : (
                        <div className={`${styles.listFoot}`}>
                          {/* <Link
                            to={`/${+items.orderSign === 1 ? 'unlock-details'
                              : 'order-details'}?orderId=${items.id}&jumpType=${items.jumpType}`}> */}
                            <span className={`flex ${styles.btn}`} onClick={()=>this.toDetail(items)}>
                            订单详情
                            </span>
                          {/* </Link> */}
                        </div>
                      )

                  ) : ''
                  : ''
              }


                <div style={{ display:visible ? 'block' : 'none' }}>
                  <div className='weui-mask' />
                  <div className='weui-dialog'>
                    <div className='weui-dialog__hd'><strong className='weui-dialog__title'>提示</strong></div>
                    <div className='weui-dialog__bd'>您确定要取消订单吗？</div>
                    <div className='weui-dialog__ft'>
                      <a
                        onClick={() => { this.setState({ visible:false }) }}
                        className='weui-dialog__btn weui-dialog__btn_default'>取消</a>
                      <a
                        onClick={() => {
                          this.setState({ visible:false })
                          handleCancel(index, id)
                        }}
                        className='weui-dialog__btn weui-dialog__btn_primary'>确定</a>
                    </div>
                  </div>
                </div>
            </li>

    )
  }
}
