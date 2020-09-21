import React from 'react'
import Page from '@src/components/page/index'
import MemberBtn from './componets/btn/index'
import images from './componets/images'
import { vipPaidPageView, vipPaidPageBoto} from './componets/BuriedPoint'
import styles from './members'

class Success extends React.Component {
  state = {
    statusBarHeight:''
  }
  componentDidMount() {
    this.doPopstateEvent()
    vipPaidPageView()
    this.getStatusBarHeight()
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.touchHistory, false);
  }
  // 获取手机状态栏高度
  getStatusBarHeight(){
    let height = window.localStorage.getItem('statusBarHeight')
    
    let statusBarHeight= height? height+'px': '44px'
    this.setState({
      statusBarHeight
    })
  }
  doPopstateEvent = () => {
    const state = { title: "title", url: "#" };
    window.history.pushState(state, "title", "#")
    window.addEventListener("popstate", this.touchHistory, false);
  }

  touchHistory = () => {
    // alert("我监听到了浏览器的返回按钮事件啦12") //根据自己的需求实现自己的功能
    window.history.go(-2)
  }

  gotoback = () => {
    vipPaidPageBoto({Btn_name: 'my_vip'})
    // window.history.go(-3)
    // let url=`${origin}/mkt/members?hideTitleBar=1&view_type=vip_paid`
    // window.location.href=`andall://andall.com/inner_webview?url=${url}`
    //this.props.history.replace(`/members?hideTitleBar=1&view_type=vip_paid`)
    andall.invoke('back')
  }

  toTheServer = () => {
    vipPaidPageBoto({Btn_name: 'customer_service'})
  }
  goBack(){
    // let url=`${origin}/mkt/members?hideTitleBar=1&view_type=vip_paid`
    // window.location.href=`andall://andall.com/inner_webview?url=${url}`
    //this.props.history.replace('/members?hideTitleBar=1')
    andall.invoke('back')
  }

  render() {
    const {  statusBarHeight} = this.state
    return (
      <Page title='安我会员'>
        <div className={`${styles.titleBar} ${styles.dark}`} style={{paddingTop: `${statusBarHeight}`}}>
          <div className={styles.titleBarCon}>
            <div className={styles.backIcon} onClick={()=>this.goBack()}>
              <img src={images.iconBackWhite} />
            </div>
            <h1>安我会员</h1>
          </div>  
        </div>
        <div className={styles.successBox} style={{paddingTop: `calc(44px + ${statusBarHeight})`, height:`calc( 100vh - 44px - ${statusBarHeight})`,minHeight: `calc( 100vh - 44px - ${statusBarHeight})`}}>
          <img src={images.paysuc} alt="" />

          <div className={styles.sucBtn}>
            <MemberBtn
              userState={1}
              conTex='立即享受特权'
              togglefunc={this.gotoback}
            />
          </div>

          <p className={styles.toring} onClick={this.toTheServer}>
            <a href='tel:400-682-2288'>联系客服</a> <img src={images.ringright} alt="" />
          </p>
        </div>
      </Page>
    )
  }
}

export default Success
