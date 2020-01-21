import React from 'react'
import { observer, inject } from 'mobx-react'
import images from '@src/common/utils/images'
import LinkMans from './linkMans'
import {YYGJlandingpageview, YYGJlandingpageinputgoto} from './BuriedPoint'
import styles from '../yinyang'
import { ua, fun } from '@src/common/app'

const { yinyang } = images
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
    setUserInfo({noloading: 1})
  }

  toQsPage = () => {
    const { user: {data: {userInfo}}, qnaireUrl } = this.props
    const { isAndall } = this.state
    if(userInfo.userId){  //已登录
      if(qnaireUrl) {
        YYGJlandingpageinputgoto({view_type: 'update'})
        setTimeout(() => {
          isAndall && andall.invoke('openNewWindow', {url: qnaireUrl.split('dnatime.com')[1]})
          isAndall || (window.location.href = qnaireUrl)
        }, 200)
        return
      }
      YYGJlandingpageinputgoto({view_type: 'first'})
      setTimeout(() => {
        this.props.history.push('/yinyang-bbinfor')
      }, 200)
    } else {  //未登录
      if (isAndall) {
        andall.invoke('login', {}, (res) => {
          window.localStorage.setItem('token', res.result.token)
          window.location.reload()
        })
      } else {
        const { origin, pathname, search } = location
        window.location.href =`${origin}/login?url=${pathname}${search}`
      }
    }
  }

  render () {
    const {curLinkManId, qnaireUrl} = this.props
    const banbg = curLinkManId ? 'headuserbg.png' : 'headbg.png'
    return (
      <React.Fragment>
        <div className={styles.imgbannerBox}>
          <img src={`${yinyang}${banbg}`} />

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
          
        <img src={`${yinyang}1.png`} />
        <img src={`${yinyang}2.png`} />
        <img src={`${yinyang}3.png`} />
        <img src={`${yinyang}4.png`} />
      </React.Fragment>
    )
  }
}

export default YinYang
