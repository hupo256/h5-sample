import React from 'react'
import { observer, inject } from 'mobx-react'
import images from './images'
import LinkMans from './linkMans'
import {YYGJlandingpageview, YYGJlandingpageinputgoto} from './BuriedPoint'
import styles from '../yinyang'
import { ua, fun } from '@src/common/app'

const { getParams } = fun

@inject('user')
@observer
class YinYang extends React.Component {
  state={
    isAndall: ua.isAndall()
  }

  componentDidMount() {
    const pointPara = {view_type: getParams().viewType}
    YYGJlandingpageview(pointPara)

    const { user: {setUserInfo} } = this.props
    setUserInfo({noloading: 1, nonomsg: 1})
  }

  toQsPage = () => {
    const { user: {data: {userInfo}}, qnaireUrl } = this.props
    const { isAndall } = this.state
    if(userInfo.userId){  //已登录
      if(qnaireUrl) {
        YYGJlandingpageinputgoto({view_type: 'update'})
        setTimeout(() => {
          isAndall && (location.href = `andall://andall.com/inner_webview?url=${qnaireUrl}`)
          isAndall || (location.href = qnaireUrl)
        }, 200)
        return
      }
      YYGJlandingpageinputgoto({view_type: 'first'})
      setTimeout(() => {
        this.props.history.push('/yinyang/yinyang-bbinfor')
      }, 200)
    } else {  //未登录
      if (isAndall) {
        andall.invoke('login', {}, (res) => {
          window.localStorage.setItem('token', res.result.token)
          window.location.reload()
        })
      } else {
        const { origin, pathname, search } = location
        window.location.href =`${origin}/mkt/login/mobileLogin?url=${pathname}${search}`
      }
    }
  }

  render () {
    const {curLinkManId} = this.props
    const banbg = curLinkManId ? images.headuserbg : images.headbg
    return (
      <React.Fragment>
        <div className={styles.imgbannerBox}>
          <img src={banbg} />

          <div className={styles.bannerCon}>
            <LinkMans noRes={true} />
            <span 
              onClick={this.toQsPage}
              className={styles.toChecker}
            >
              开始测评
            </span>
          </div>
        </div>
          
        <img src={images.img1} />
        <img src={images.img2} />
        <img src={images.img3} />
        <img src={images.img4} />
      </React.Fragment>
    )
  }
}

export default YinYang
