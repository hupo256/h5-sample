import React from 'react'
import { Page } from '@src/components'
import List from '../component/goodsList'
import { API, fun, point } from '@src/common/app'
import NewList from '../component/goodsListNew'
import Info from './info'
const { getParams } = fun
const { allPointTrack } = point
class Details extends React.Component {
  state = {
    details:{ },
    logistics:[]
  }
  componentDidMount () {
    const params = getParams()
    const { orderId = '' } = params
    let currentApi='myOrderInfo';
    if(params.jumpType==2){
      currentApi='myOrderKitInfo'
    }

    API[currentApi]({ orderId: orderId }).then(res => {
      const { code, data } = res
      if (!code) {
        this.setState({ details:data || {} }, () => {
          params.jumpType==2?this.touchDetsNew():this.touchDets()
        })
      }

    })
   
    params.type && this.getPageView()
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
    let dList = details.tradeOrderKitRespList;
    if(!bool) {
      let length=0;
      let newList=[];
      let boo=false;
      dList.map((item,index)=>{
        item.tradeOrderKitProductRespList&&item.tradeOrderKitProductRespList.map((item1,index1)=>{
          length++;
          if(length>3&&!boo) {
            boo=true;
            let Li=item.tradeOrderKitProductRespList;
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
  // 埋点统计pv
  getPageView = () => {
    allPointTrack({ eventName: 'order_detail_view' })
  }
  render () {
    const { details,detList } = this.state;
    const params = getParams();
    const {jumpType}=params;

    return (
      <Page title='订单详情'>
        <div className='bg'>
          <div className='white mb10'>
            {/* <List list={[details]} type={0} unlock={1} jumpType={jumpType} /> */}

            {
            jumpType==1?<List list={[details]} type={0} unlock={1} dList={detList}  touchDets={this.touchDets} />:
            <NewList list={[details]} type={0} unlock={1} dList={detList} touchDets={this.touchDetsNew}  />
            }
          </div>
          <Info details={details} />
        </div>
      </Page>
    )
  }
}

export default Details
