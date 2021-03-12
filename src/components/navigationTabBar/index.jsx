import React from 'react'
import images from './images'
import styles from './style'
import propTypes from 'prop-types'
import ua from '@src/common/utils/ua'
const { isAndall } = ua

class NavigationTabBar extends React.Component {
  state = {
    statusBarHeight:'',
    tabIndex:0,
    isShow:false,
  }
  
  static propTypes = {
    back: propTypes.func.isRequired, //返回的方法
    type: propTypes.string.isRequired, //字体颜色
    background: propTypes.string.isRequired, //背景颜色
    tab: propTypes.array.isRequired, //tab title
    changeTab: propTypes.func.isRequired,//切换tab的方法
    collect: propTypes.func.isRequired,// 收藏方法
    share:propTypes.func.isRequired,//分享
    isCollect:propTypes.bool.isRequired

  }

  componentDidMount() {
    let statusBarHeight = +window.localStorage.getItem('statusBarHeight')
    //alert(statusBarHeight);
    // this.setState({
    //   isCollect: this.props.isCollect,
    //   statusBarHeight:statusBarHeight+'px'
    // })
    
    this.setState({
      isCollect: this.props.isCollect,
      statusBarHeight:isAndall()?+window.localStorage.getItem('statusBarHeight')+'px':'',
      isShow:isAndall()?true:false
    })
   

  }
  changeTitleTab=(num)=>{
    this.setState({
      tabIndex: num
    })

    this.props.changeTab(num)
  }
  collect=()=>{
    // const {isCollect}=this.state
    // this.setState({
    //   isCollect: !isCollect
    // })
    let isCollect=!this.props.isCollect
    this.props.collect(isCollect)
  }
  
 


  render () {
    const { back,type,background,tab,share,isCollect,hideControl} = this.props
    const { statusBarHeight ,tabIndex,isShow} = this.state
    
    
    return ( 
      isShow?<div className={styles.titleBarPanel} >
        <div className={`${type==="black"? '':`${styles.white}`} ${styles.titleBar}`} style={{paddingTop: `${statusBarHeight}`,background:`${background}`}}>
          <div className={styles.titleBarCon} >
            <div className={styles.backIcon} onClick={()=>back()}>
              {type==='black'?<img src={images.iconBackBlack} />:<img src={images.iconBackWhite} />}
            </div>
            <div className={styles.titleTab}>
              {tab.length>0 &&tab.map((item,index)=>{
                  return(
                    <div className={`${styles.titleItem} ${tabIndex===index?`${styles.active}`:''}`} onClick={()=>this.changeTitleTab(index)}>
                      {item}
                    </div>  
                  )
                }) 
              }    
            </div>  
            {!hideControl?
              <div className={styles.control_area}>
                <div className={`${styles.control_item} ${styles.collect} ${!!isCollect?`${styles.active}`:''}`} onClick={()=>this.collect()}></div>
                <div className={`${styles.control_item} ${styles.share}`} onClick={()=>share()}></div>
              </div>:null
            }
          </div>  
        </div>
        <div className={styles.titleBarBlank} style={{height: `calc(44px + ${statusBarHeight})`}}></div>
      </div>:null  
     )
    }
  }
  
export default NavigationTabBar