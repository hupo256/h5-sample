import React from 'react'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import Page from '@src/components/page/index'
import ua from '@src/common/utils/ua'
import memberApi from '@src/common/api/memberApi'
import MemberBtn from './componets/btn/index'
import TagList from './componets/tags/index'
import images from './componets/images'
import { vipBuyPageView, vipBuyPageGoto,} from './componets/BuriedPoint'
import styles from './members'
const { isAndall } = ua



class Payment extends React.Component {
  state = {
    statusBarHeight:'',
    list:[],
    pageObj: {
      pageNum: 1,
      totalPage: 1,
      pageSize: 10
    },
    loadingStatus: true
  }

  componentDidMount() {
    
    this.getStatusBarHeight()
    this.handleQueryRecordList()
    this.addEventListenerSroll()
  }
  
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.handleQueryRecordList)
  }
  handleQueryRecordList = () => {
  
    let { loadingStatus, list, pageObj } = this.state
    const { pageNum, totalPage, pageSize } = pageObj
    const params = {
      pageNum,
      pageSize
    }
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    if (loadingStatus && pageNum <= totalPage && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        memberApi.getUseMemberOrder(params).then(({ data }) => {
          if (data) {
            this.setState({
              list: [...list, ...data.data],
              pageObj: {
                ...pageObj,
                pageNum: data.pageNum + 1,
                totalPage: data.totalPage
              }
            })
          }
          // 页面抖动
          setTimeout(() => {
            this.setState({
              loadingStatus: true
            })
          }, 30)
        })
      })
    }
  }
  getStatusBarHeight(){
    let height = window.localStorage.getItem('statusBarHeight')
    
    let statusBarHeight= height? height+'px': '44px'
    this.setState({
      statusBarHeight
    })
  }
  goBack(){
    history.go(-1);
  }
  linkTo(obj){
    window.location.href=`andall://andall.com/order_detail?orderId=${obj}`
  }
  

  

  render() {
    const {} = this.props
    const {  statusBarHeight,list,logList} = this.state
    return (
      <Page title='省钱记录'>
        <React.Fragment>
          <div className={`${styles.titleBar} ${styles.white}`} style={{paddingTop: `${statusBarHeight}`}}>
            <div className={styles.titleBarCon}>
              <div className={styles.backIcon} onClick={()=>this.goBack()}>
                <img src={images.iconBackBlack} />
              </div>
              <h1>省钱记录</h1>
            </div>  
          </div>
          <div className={styles.recordPanel} style={{paddingTop: `calc(44px + ${statusBarHeight})` ,minHeight: `calc( 100vh - 44px - ${statusBarHeight})`}}>
            <div className={`${styles.recordBox} ${list.length>0? '':styles.active}`} style={{height: list.length>0? `auto` :`calc( 100vh - 44px - ${statusBarHeight})`}}>
              {list && list.length>0?
                <div className={styles.recordContent}>
                  {list.map(item=>{
                    return(
                      <div className={styles.recordField} onClick={()=>this.linkTo(item.tradeId)}>
                        <div className={styles.recordTitle}>
                          <h1>{item.title}：</h1>
                          <p>-{item.price}元</p>
                        </div>
                        <div className={styles.recordDetail}>
                          <div className={styles.recordInfo}>
                            <h1>
                              订单号：
                            </h1>
                            <p className={styles.purpleTxt}>{item.tradeNo}</p> 
                          </div> 
                          <div className={styles.recordInfo}>
                            <h1>
                              付款时间:
                            </h1>
                            <p>{item.payTime}</p> 
                          </div>  
                        </div>    
                      </div>  
                    )
                  })}
                  </div>
                :
                <div className={styles.emptyContent}> 
                  <img src={images.emptyRecord} />
                  <p>您还没有省钱记录哦～</p>
                </div>  
              }
 
            </div>             
          </div>
        </React.Fragment>
      </Page>
    )
  }
}

export default Payment
