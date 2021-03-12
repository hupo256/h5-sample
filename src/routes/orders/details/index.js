import React from 'react'
import { Link } from 'react-router-dom'
import { Page } from '@src/components'
import List from '../component/goodsList'
import NewList from '../component/goodsListNew'
import { API, fun, point } from '@src/common/app'
import Info from './info'
import styles from '../order'
const { getParams } = fun
const { allPointTrack } = point
class Details extends React.Component {
  state = {
    details:{ },
    logistics:[],
    detList: []
  }
  componentDidMount () {
    const params = getParams()
    const { orderId = '' } = params;
    let currentApi='myOrderInfo';
    if(params.jumpType==2){
      currentApi='myOrderKitInfo'
    }
    API[currentApi]({ orderId: orderId }).then(res => {
      let { code, data } = res
      if (!code) {
        const { orderStatus, id, orderDetails } = data
        // orderDetails.length = 2
        // const Arr = orderDetails.concat(orderDetails)
        // data.orderDetails = Arr
        if (orderStatus === 'YFH' || orderStatus === 'YQS') {
          this.getSfexpress(id)
        }

        this.setState({ details:data || {} }, () => {
          params.jumpType==2?this.touchDetsNew():this.touchDets()
        })
      }
    })
    params.type && this.getPageView()
  }
  // 获取物流信息
  getSfexpress = (id) => {
    API.sfexpress({ id }).then(res => {
      const { code, data } = res
      code || this.setState({ logistics:data.data })
    })
  }
  // 埋点统计pv
  getPageView = () => {
    allPointTrack({ eventName: 'order_detail_view' })
  }

  touchDets = (bool) => {
    const { details } = this.state;
    let dList = details.orderDetails.concat([])
    if(!bool && dList.length > 3) {
      dList = dList.slice(0, 3)
    }
    this.setState({detList: dList})
  }

  touchDetsNew=(bool)=>{
    const { details } = this.state;
    let dList = JSON.parse(JSON.stringify(details.tradeOrderKitRespList));
    if(!bool) {
      let length=0;
      let newList=[];
      let boo=false;

      dList.map((item,index)=>{
        item.tradeOrderKitProductRespList&&item.tradeOrderKitProductRespList.map((item1,index1)=>{
          length++;
          if(length>3&&!boo) {
            boo=true;
            let Li=JSON.parse(JSON.stringify(item.tradeOrderKitProductRespList));
            newList=Li.splice(0,index1);
            dList[index].tradeOrderKitProductRespList=newList
            dList=dList.splice(0,index+1);
            return;
          }
        })
      })
    }
    this.setState({detList: dList})
  }
  render () {
    const { details, logistics, detList } = this.state
    const { orderAddress = {} } = details
    const params = getParams();
    const {jumpType}=params;
    return (
      <Page title='订单详情'>
        <div className={`bg ${orderAddress ? 'pt5' : ''}`}>
          <div className='white mb10'>
            <div className={`${styles.adders}`}>
              <div className='jt' style={{ position:'relative' }}>
                {
                  logistics && logistics.length ? (
                    <Link to={`/logistics?id=${details.id}`} className='flex'>
                      <span className={'iconfont ' + styles.iconfot}>&#xe75f;</span>

                      <div className={'item ' + styles.logistics}>
                        <p>{logistics[0].acceptAddress + logistics[0].remark}</p>
                        <time>{logistics[0].acceptTime}</time>
                      </div>
                    </Link>)
                    : <div className={'flex ' + styles.lhight}>
                      <span className={'iconfont ' + styles.iconfot}>&#xe75f;</span><p>暂无物流信息</p>
                    </div>
                }
              </div>
              {
                orderAddress
                  ? <div className={`flex ${logistics && logistics.length ? 'pt15' : ''}`}>
                    <span className={'iconfont ' + styles.iconfot}>&#xe618;</span>
                    <div className={'item ' + styles.famy}>
                      <span className='fz15'>{orderAddress.name}</span>
                      <span className='fz15'>{orderAddress.mobile}</span>
                      <p className='fz14'>
                        {`${orderAddress.provinces || ''}${orderAddress.city || ''}${orderAddress.area || ''}
                      ${orderAddress.addressDetail || ''}`}
                      </p>
                    </div>
                  </div> : null
              }
            </div>
          </div>
          {
            jumpType&&jumpType==2?<NewList  list={[details]} type={0} dList={detList} touchDets={this.touchDetsNew} />:
            <List list={[details]} type={0} dList={detList} touchDets={this.touchDets}/>

          }
          <Info details={details} />
        </div>
      </Page>
    )
  }
}

export default Details
