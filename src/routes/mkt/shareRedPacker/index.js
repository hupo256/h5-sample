import React from 'react'
import { Page } from '@src/components'
import { MyLoader } from '../lego/MyLoader'
import { Toast } from 'antd-mobile'
import { ua, API, fun } from '@src/common/app'
import { Modal } from '@src/components'
import { ActivityShareCouponLandingpage1View,
  ActivityShareCouponLandingpage1ButtonGoto,
  ActivityShareCouponLandingpage2View,
  ActivityShareCouponLandingpage2GetButtonGoto,
  ActivityShareCouponLandingpage2UseButtonGoto} from './BuriedPoint'
import images from '@src/common/utils/images'
import toDoShare from '@src/common/utils/toDoShare'
import Ruler from './ruler'
import styles from './sharered'

const { shareRedPacker } = images
const { getParams } = fun

class RedPacker extends React.Component {
  state = {
    rulePop: false,
    sharePop: false,
    // status: 0,
    loading: true,
    isAndall: ua.isAndall()
  }

  componentDidMount () {
    const infoPara = {noloading: 1}
    ua.isAndall() && Object.assign(infoPara, {clientType: 'app'})
    API.myInfo(infoPara).then(res => {
      const {code, data} = res
      if(code) return
      this.setState({
        ...data
      })
    })

    const { activCode='SHARE', attendRecordId } = getParams()
    const params = {noloading: 1};
    activCode && Object.assign(params, {activCode})
    attendRecordId && Object.assign(params, {attendRecordId})
    API.getActivShareActivityInfo(params).then(res => {
      const {code, data} = res
      if(code) return
      // data.status = 2
      this.setState({
        ...data,
        loading: false,
      })

      data.status === 1 ? 
        ActivityShareCouponLandingpage2View() : 
        ActivityShareCouponLandingpage1View()

      toDoShare(data.activShareConfig)
    })
  }

  toShare = () => {
    ActivityShareCouponLandingpage1ButtonGoto()

    const {activShareConfig, isAndall} = this.state
    if(isAndall){
      toDoShare(activShareConfig, true)
    } else {
      this.setState({sharePop: true})
    }
  }

  toggleMask = (key) => {
    this.setState({
      [key]: !this.state[key]
    })
  }

  createRuleInfor = (json) => {
    const texArr = json.split('|')
    return texArr.map(tex => tex.trim())
  }

  toTouchPacker = () => {
    ActivityShareCouponLandingpage2UseButtonGoto()
    
    const {mobileNo} = this.state
    if(!mobileNo){
      const { origin, pathname, search } = location
      window.location.href =`${origin}/mkt/login/mobileLogin?url=${pathname}${search}`
      return
    }
    ActivityShareCouponLandingpage2GetButtonGoto(mobileNo)

    const { attendRecordId } = getParams()
    API.sendShareActivCoupon({attendRecordId}).then(res => {
      if(res.code) return
      Toast.success('领取成功', 1.5)
      setTimeout(() => {
        this.setState({status: -1})
      }, 1500)
    })
  }

  toTouchProduct = () => {
    const { origin } = location
    ua.isAndall() ? 
      andall.invoke('goProductList') :
      window.location.href = origin + '/download-app'
  }

  render () {
    const { loading, status, rulePop, sharePop, mobileNo, remark, activUserAssistRecordRespList } = this.state
    const imgBg = status === -1 ? 'redhead1.png' : 'redhead.png'
    const btnTex = status === 1 ? '立即领取' : '分享得红包' 
    return (
      <Page title='分享有礼'>
        {loading ? <MyLoader /> : 
        <div className={ `${rulePop ? styles.noscroll : ''} ${styles.shareRedPacker}`}>
          <div className={styles.banBox}>
            <img src={`${shareRedPacker}${imgBg}`} />
            <div className={styles.headBox}>
              {(status === 0 || status === 2) &&
                <React.Fragment>
                  <span onClick={() => {this.toggleMask('rulePop')}}>活动规则</span>
                  <b onClick={this.toShare}>{btnTex}</b>
                </React.Fragment> 
              }
              {status === 1 && <b onClick={this.toTouchPacker}>{btnTex}</b>}
              {status === -1 &&  
                <React.Fragment>
                  <b className={styles.phoneNum}>{`优惠券已放入账号：${mobileNo}`}</b>
                  <b className={styles.touchPacker} onClick={this.toTouchProduct}>立即使用</b>
                </React.Fragment>
              }
            </div>
          </div>

          {(status || status === 0 ) && <div className={styles.moreInfor}>
            {(status === 0 || status === 2) ? 
              <React.Fragment>
                <h3><span>好友领取记录</span></h3>
                {activUserAssistRecordRespList && activUserAssistRecordRespList.length > 0 ? 
                  <ul>
                    {activUserAssistRecordRespList.map((item, index) => {
                      const {creatTime, nickName, url} = item
                      return <li key={index}>
                          <div>
                            <img src={url} />
                            <span>{nickName}</span>
                          </div>
                          <p>{creatTime.slice(0, 10)}</p>
                        </li>
                    })}
                  </ul> :
                  <div className={styles.nobodyShare}>
                    <img src={`${shareRedPacker}listdefault.png`} />
                    <p>还没有好友领取哦，<br />快去分享给好友吧！</p>
                  </div>
                }
              </React.Fragment> :
              <Ruler remark={remark} />
            }
          </div>}

          {/* 引导分享 */}
          {sharePop && <div className={styles.sharebox1} onClick={() => this.toggleMask('sharePop')}>
            <img src={`${shareRedPacker}nfriend_share1.png`} alt="nfriend_share"/>
          </div>}
          
          {/* 活动规则 */}
          <Modal
            handleToggle={() => { this.toggleMask('rulePop')}}
            type
            visible={rulePop}>
            <Ruler remark={remark} />
          </Modal>
        </div>}
      </Page>
    )
  }
}

export default RedPacker
