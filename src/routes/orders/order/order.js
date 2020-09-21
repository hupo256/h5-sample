import React from 'react'
import { Toast } from 'antd-mobile'
import wx from 'weixin-js-sdk'
import List from '../component/list'
import { Page, NoData } from '@src/components'
import { API, point } from '@src/common/app'
import andall from '@src/common/utils/andall-sdk'
import ReactDOM from 'react-dom'
import styles from '../order.scss'
import { ListView } from 'antd-mobile';
import ua from '@src/common/utils/ua'
const { isWechat, isIos, isAndall } = ua
const { allPointTrack } = point
let pageIndex = 1;
let pageSize = 5;
// let index = 0;
class Order extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => {row1 !== row2},
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = {
      list: [],
      noData: false,
      dataSource,
      isLoading: true,
      total:1,
      // index:0,
      // only:false,
      data:[]
    }
  }

  // 埋点记录取消订单
  trackPointOrderCancel(orderList) {
    const {
      id,
      createTime,
      originalAmount,
      paymentAmount,
      orderType,
      orderDetails,
      tradeOrderKitRespList
    } = orderList
    let obj = {
      eventName: 'order_cancel',
      pointParams: {
        order_id: id,
        order_time: createTime,
        order_amount: +originalAmount, // 订单原价金额=sum(商品原价)
        order_actual_amount: +paymentAmount, // 实付金额
        order_type: orderType // 订单类型：1线上订单；2第三方订单;3.官方商城,4:FOC,5:现场销售
      }
    }
    allPointTrack(obj)
    if(orderDetails){
      // 取消订单明细
      for (let od of orderDetails) {
        let obj = {
          eventName: 'order_product_cancel',
          pointParams: {
            order_id: id,
            order_amount: +originalAmount,
            order_actual_amount: +paymentAmount,
            order_type: orderType,
            product_id: od.productId,
            product_name: od.productName,
            // product_category_id:'',
            product_category_name: od.categoryName,
            product_type: od.productCode,
            product_price: od.productOriginalPrice
          }
        }
        allPointTrack(obj)
      }
    } else if(tradeOrderKitRespList){
      for (let item of tradeOrderKitRespList) {
        for (let od of item.tradeOrderKitProductRespList){
          let obj = {
            eventName: 'order_product_cancel',
            pointParams: {
              order_id: id,
              order_amount: +originalAmount,
              order_actual_amount: +paymentAmount,
              order_type: orderType,
              product_id: od.productId,
              product_name: od.productName,
              // product_category_name: od.categoryName,
              // product_type: od.productCode,
              product_price: od.productOriginalPrice
            }
          }
          allPointTrack(obj)
        }
      }
    }

  }

  componentDidMount() {
    // console.log(document.documentElement.clientHeight- ReactDOM.findDOMNode(this.lv).parentNode.offsetTop )
   const hei = document.documentElement.clientHeight;

  setTimeout(() => {
    this.getMyOrder(pageIndex);
     this.setState({
         height: hei,
     });
     if (!isAndall() && !isWechat()) {
       var state = {
         title: "title",
         url: "#"
       };
       window.history.pushState(state, "title", '#')
       window.addEventListener("popstate", function(e) {
         if(localStorage.getItem('orderBack')){
           const getLength = +localStorage.getItem('orderBack')
           localStorage.removeItem('orderBack')
           history.go(-1 * (getLength + 4))
         }else{
           history.go(-3)
         }

       }, false);
       let hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
       let visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange')
       let onVisibilityChange = function(){
         if (document[hiddenProperty]) {

         }else{
           window.location.reload()
         }
       }
       document.addEventListener(visibilityChangeEvent, onVisibilityChange)
      }
    }, 600);

  }
  onEndReached = (event) => {
    const {isLoading,total}=this.state;
    if (isLoading || pageIndex>=total) {
      return;
    }

    setTimeout(() => {
      this.setState({ isLoading: true });
      pageIndex++;
      this.getMyOrder(pageIndex);
    }, 200);

}
  getMyOrder=(pageNum)=> {
    let params={
      pageNum:pageNum,
      pageSize:pageSize
    }
    API.myOrder(params).then(res => {
      const { data = {}, code } = res;
      const {tradeOrders}=data;
      this.setState({ noData: true ,isLoading: false,only:true})
      const {list}=this.state;
      tradeOrders.data&&tradeOrders.data.forEach((item)=>{
          item.showMore=false;
      })
      this.dealList(tradeOrders.data)
      code ||tradeOrders.data&&this.setState({
          list:[...list,...tradeOrders.data],
          data:JSON.parse(JSON.stringify(tradeOrders.data)).reverse(),
          dataSource: this.state.dataSource.cloneWithRows([...list,...tradeOrders.data]),
          total:tradeOrders.totalPage
        })
    })
  }

  // 支付
  handlePay = item => {
    const { id, orderDetails,tradeOrderKitRespList } = item

    let order;
    if(orderDetails){
      order = orderDetails[0]
    } else if(tradeOrderKitRespList){
      order = tradeOrderKitRespList&&tradeOrderKitRespList[0].tradeOrderKitProductRespList&&
      tradeOrderKitRespList[0].tradeOrderKitProductRespList[0]
    }
    if (isAndall()) {
      andall.invoke('openPay', {
        platform: 'all',
        orderId: id,
        productName: order.productName,
        payType: order.orderSign === 0 ? 'buy' : 'unlock'
      })
    }
    if (!isAndall() && !isWechat()) {
      API.prepayOrder({ orderId:id, payType : 'MWEB' }).then( res =>{
        if (res.code === 200041) {
          location.reload()
          return
        }
        if (res.code) return
        if (localStorage.getItem('orderBack')) {
          localStorage.setItem('orderBack', +localStorage.getItem('orderBack') + 1)
        } else {
          localStorage.setItem('orderBack', 1)
        }
        window.location.replace(res.data.mwebUrl)
      })
    }
  }
  // 取消订单
  handleCancel = (i, id) => {
    const { list } = this.state
    API.cancelOrder({ id }).then(res => {
      const { code } = res
      if (!code) {
        this.trackPointOrderCancel(list[i])
        Toast.success('操作成功')
        list[i].orderStatus = 'YQX';
        let newList=JSON.parse(JSON.stringify(list))
        const dataSource = new ListView.DataSource({
          rowHasChanged: (row1, row2) => {row1 !== row2},
          sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });
        this.setState({
          list,
          data:newList.reverse(),
          dataSource: dataSource.cloneWithRows(list),
        })

      }
    })
  }
  toggoleList=(item,i)=>{
    const { list,data } = this.state
    if(!item.hasMore)return;
    // console.log(list)
    let listName=item.jumpType==1?'orderDetails':'tradeOrderKitRespList'
    if(item.showMore){
      list[i][listName]=item.allList;
    } else {
      // 截取
      list[i][listName]=item.subList
    }
    list[i].showMore=!list[i].showMore
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => {row1 !== row2},
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.setState({
      list,
      data:JSON.parse(JSON.stringify(list)).reverse(),
      dataSource: dataSource.cloneWithRows(list),
    })
  }
  dealList(item){
    item.forEach(current=>{
      if(current.jumpType==2){
        current.allList=current.tradeOrderKitRespList;
        let dList = JSON.parse(JSON.stringify(current.tradeOrderKitRespList));
        // if(!bool) {
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
                current.subList=dList;
                current.hasMore=true;
                current.showMore=false;
                return;
              }
            })
          })
        // }
        this.setState({detList: dList})
      } else {
        let dList = current.orderDetails.concat([])
        // !bool &&
        if(dList.length > 3) {
          current.allList=current.orderDetails;
          dList = dList.slice(0, 3)
          current.subList=dList;
          current.hasMore=true;
          current.showMore=false;
        } else {
          current.hasMore=false;
          // current.subList=current.allList=current.orderDetails
        }
      }
    })


  }
  render() {
    const { list, noData,dataSource ,isLoading,height,total,data} = this.state
    // console.log(list,data)
    let index = data.length - 1;
    // let index = 0;
    const row = (rowData, sectionID, rowID) => {
      if(index<0)index=data.length-1;
      const obj = data[index--];
      // console.log(obj)
      // if(index>=total-1)index=total-1;
      // const obj = list[index++];
      return (
          (obj?<List
              list={data}
              items={obj}
              i={rowID}
              {...this.props}
              type={1}
              handleCancel={this.handleCancel}
              handlePay={this.handlePay}
              toggoleList={this.toggoleList}
            />:null)
      );
    };
    return (
      <Page title='我的订单'>
        <div className={`${styles.orderWrap}`}>
         {/* <div className={`${styles.orderListWrap}`}> */}
          <ul>
          {list.length > 0 ? (
            <ListView
            {...this.props}
            ref={el => this.lv = el}
            dataSource={dataSource}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
              {isLoading ? '正在加载...' : '---我是有底线的---'}
            </div>)}
            // renderBodyComponent={() => <MyBody />}
            renderRow={row}
            style={{
              height: height,
              // overflow: 'auto',
            }}
            pageSize={5}
            onScroll={() => {  }}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
         />

         ) : (
            noData && <NoData title='暂无订单' icon='&#xe667;' />
          )}
          </ul>
          </div>

        {/* </div> */}
      </Page>
    )
  }
}
export default Order
