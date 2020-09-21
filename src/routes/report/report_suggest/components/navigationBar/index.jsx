import React from 'react'
import images from './images'
import styles from './style'
import propTypes from 'prop-types'
import ua from '@src/common/utils/ua'
const { isAndall } = ua

class NavigationBar extends React.Component {
  state = {
    statusBarHeight:'',
    scrollTop:'',
    titleBar:''
  }
  
  static propTypes = {
    title: propTypes.string.isRequired, //title文字
    back: propTypes.func.isRequired, //返回的方法
    type: propTypes.string.isRequired, //字体颜色
    background: propTypes.string.isRequired //背景颜色
  }

  componentDidMount() {
    let statusBarHeight = window.localStorage.getItem('statusBarHeight') 
    console.log(window.localStorage);
    this.setState({
      statusBarHeight:statusBarHeight+'px',
      //titleBar:isAndall() ? +(document.getElementById('titleBar').offsetHeight + statusBarHeight - 1) + 'px' : ''
    })
    const{scrollTop}=this.props
    if(scrollTop){
      this.handleScroll()
    }
  }
  getScrollTop=()=> {
    let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0
    if (document.body) bodyScrollTop = document.body.scrollTop
    if (document.documentElement) documentScrollTop = document.documentElement.scrollTop
    scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
    return scrollTop
  }
  handleScroll=()=>{   
    window.addEventListener('scroll', (e) => {
      this.setState({
        scrollTop:this.getScrollTop()
      })
    }, false)
  }
 


  render () {
    const { title,back,type,background } = this.props
    const { statusBarHeight ,scrollTop} = this.state
    
    
    return ( 
      isAndall()&&<div className={styles.titleBarPanel} >
        {/* <div className={`${type==="black"? '':`${styles.white}`} ${styles.titleBar}`} style={{paddingTop: `${statusBarHeight}`,background:`${background}`}}> */}
        <div id='titleBar' className={ `${styles.titleBar} ${type!=="black"?`${styles.white}`:scrollTop?`${styles.scroll}`:''}` } style={{paddingTop: `${statusBarHeight}`,background:`${background}`}}>
          <div className={styles.titleBarCon} >
            <div className={styles.backIcon} onClick={()=>back()}>
              {type==='black'?<img src={images.iconBackBlack} />:<img src={images.iconBackWhite} />}
            </div>
            <h1>{title}</h1>
          </div>  
        </div>
        <div className={styles.titleBarBlank} style={{ height: `calc(44px + ${statusBarHeight})` }}>111</div>
      </div>
     )
    }
  }
  
export default NavigationBar