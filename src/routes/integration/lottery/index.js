import React from 'react'
import Page from '@src/components/page'
import images from '../images'
import { MyLoader } from '@src/components/contentLoader'
import integrationApi from '@src/common/api/integrationApi'
import ShowModal from '../components/showModal'
import styles from './lottery'
import { Toast } from 'antd-mobile'
import andall from '@src/common/utils/andall-sdk'
import { ua, fun } from '@src/common/app'
import { trackPointLuckyDrawView, trackPointLuckyDrawGoto } from '../buried-point'
const { getParams } = fun
const { isIos } = ua

class RowItem extends React.Component {
  render() {
    const { content, activedId, id, type, count, iconUrl, isRolling, animation } = this.props
    return (
      <div className={`${styles.row__item} ${activedId ? activedId === id ? animation ? styles.active : styles.animation : styles.grey : styles.white}`}>
        <img src={type === 4 ? images.lottieImg1 : type === 2 ? images.lottieImg2 : type === 3 ? images.lottieImg3 : iconUrl} />
        {
          count && count > 0 && type === 2 ? <span className={styles.count1}>{count}</span> : ''
        }
        {
          count && count > 0 && type === 3 ? <p className={styles.count2}><label>¥</label><span>{count}</span></p> : ''
        }
        <p>{type === 3 ? `¥${count}优惠券` : content}</p>
      </div>
    )
  }
}

class Lottery extends React.Component {
  state = {
    loading:false,
    activedId: '', // 被选中的格子的ID
    prizeId: null, // 中奖ID
    times: 0, // 获得prizeId之后计算出的动画次数
    actTimes: 0, // 当前动画次数
    isRolling: false, // 是否正在抽奖
    animation:false, // 中奖后闪烁效果
    noLottie:false, // 未中奖
    couponLottie:false, // 中了优惠券
    pointsLottie:false, // 中了积分
    giftsLottie:false, // 中了礼物
    modalFlag:false, // 活动规则
    remainPoint:'', // 我的积分
    remainAwardCount:'', // 剩余抽奖次数
    awardList:[],
    onceConsume:'', // 每次消耗积分
    free:true, // 首次免费or本次消耗几积
    pointEnough:'',
    rulesInfo:{},
    registerPoint:'', // 注册送积分
    registerFlag:'',
    hasBindMobile:''
  }
  componentDidMount () {
    // if (!ua.isAndall()) {
    //   integrationApi.myInfo().then(res => {
    //     if (res && res.data.checkMobileFlag !== 2) {
    //        slocation.href = window.location.origin + '/mkt/login/mobileLogin?url=/mkt/integration/lottery?queryType=1&viewtype=wechat1'
    //     }
    //   })
    // }
    this.getAwardHomeInfo()
    this.getAwardRule()
    trackPointLuckyDrawView({
      view_type: getParams().viewtype,
      user_state:ua.isAndall() ? localStorage.getItem('token') ? 1 : 0 : getParams().queryType ? 1 : 0
    })
  }
  getAwardRule=() => {
    integrationApi.getAwardRule().then(res => {
      if (res) {
        console.log(res)
        this.setState({ rulesInfo:res.data })
      }
    })
  }
  getAwardHomeInfo=(noloading) => {
    integrationApi.getAwardHomeInfo(noloading
      ? { noloading:1 }
      : { queryType:getParams().queryType ? getParams().queryType : '' }
    ).then(res => {
      if (res) {
        console.log(res.data)
        if (!noloading && res.data.pointTip) {
          this.setState({
            registerPoint:res.data.pointTip.point,
            registerFlag:true
          })
          setTimeout(() => {
            this.setState({ registerFlag:false })
          }, 3000)
        }
        let { awardList } = this.state
        this.setState({
          hasBindMobile:res.data.hasBindMobile,
          remainPoint:res.data.remainPoint,
          remainAwardCount:res.data.remainAwardCount,
          free:res.data.free,
          onceConsume:res.data.onceConsume,
          pointEnough:res.data.pointEnough,
          awardList: [...awardList, ...res.data.awardList],
        }, () => {
          let H = (window.innerHeight - document.getElementById('detailsBg').offsetHeight - document.getElementById('lottery3').offsetHeight) / 3
          document.getElementById('lottery3').style.marginTop = H + 'px'
          document.getElementById('lottery4').style.marginTop = H + 'px'
          document.getElementById('detailsBg').style.marginTop = (document.getElementById('lottery3').offsetHeight + 2 * H) + 'px'
        })
      }
    })
  }
   // 未登录
   goLogin=() => {
     andall.invoke('login', {}, (res) => {
       window.localStorage.setItem('token', res.result.token)
       window.location.reload()
     })
   }
   handleBegin(remainAwardCount) {
     if (!ua.isAndall() && !this.state.hasBindMobile) {
       location.href = window.location.origin + '/mkt/login/mobileLogin?url=/mkt/integration/lottery?queryType=1&viewtype=wechat1'
       return false
     }
     if (ua.isAndall() && !localStorage.getItem('token')) {
       this.goLogin()
       return false
     }
     setTimeout(() => {
       if (!this.state.pointEnough && !this.state.free) {
         trackPointLuckyDrawGoto({
           Btn_name:'play',
           btn_state:3
         })
         Toast.info('您的积分不够啦，先去获取积分吧~')
         return false
       }
       if (remainAwardCount === 0) {
         Toast.info('今日抽奖机会已用完，明天再来吧～')
         return false
       }
       trackPointLuckyDrawGoto({
         Btn_name:'play',
         btn_state:this.state.free ? 1 : 2
       })
       // this.state.isRolling为false的时候才能开始抽，不然会重复抽取，造成无法预知的后果
       if (!this.state.isRolling) {
         // 点击抽奖之后，我个人做法是将于九宫格有关的状态都还原默认
         this.setState({
           activedId: '',
           prizeId: null,
           times: 0,
           actTimes: 0,
           isRolling: true,
           animation:true
         }, () => {
           // 状态还原之后才能开始真正的抽奖
           integrationApi.doAwardAction().then(res => {
             if (res.data) {
               console.log(res.data)
               this.setState({
                 prizeObj:res.data,
                 free:res.data.free,
                 pointEnough:res.data.pointEnough,
               })
               this.handlePlay(res.data.awardId, res.data.remainPoint, res.data.remainAwardCount)
             }
           })
         })
       }
     }, 100)
   }
   handlePlay(awardId, remainPoint, remainAwardCount) {
     this.setState({
       prizeId: awardId,
       activedId: 1
     }, () => {

     })
     // 随机算出一个动画执行的最小次数，这里可以随机变更数值，按自己的需求来
     let times = this.state.awardList.length * Math.floor(Math.random() * 5 + 4)
     console.log(times + '=====')
     this.setState({
       times: 24
     })
     // 抽奖正式开始↓↓
     this.begin = setInterval(() => {
       let num
       let { awardList } = this.state
       let thisPosition = awardList.filter(item => item.awardId === this.state.prizeId)[0].position
       let thisType = awardList.filter(item => item.awardId === this.state.prizeId)[0].type
       if (this.state.activedId === thisPosition && this.state.actTimes > this.state.times) {
         console.log('中奖位置=' + thisPosition)
         console.log('中奖id====' + this.state.prizeId)
         // 符合上述所有条件时才是中奖的时候，两个ID相同并且动画执行的次数大于(或等于也行)设定的最小次数
         clearInterval(this.begin)
         this.setState({
           animation:false,
           remainPoint:remainPoint,
           remainAwardCount:remainAwardCount
         })
         setTimeout(() => {
           this.setState({ isRolling: false })
           switch (thisType) {
           case 1:
             this.setState({ giftsLottie:true })
             break
           case 2:
             this.setState({ pointsLottie:true })
             break
           case 3:
             this.setState({ couponLottie:true })
             break
           case 4:
             this.setState({ noLottie:true })
             break
           }
         }, 1000)
         return
       }
       // 以下是动画执行时对id的判断
       if (this.state.activedId === '') {
         num = 1
         this.setState({
           activedId: awardList[num - 1].position
         })
       } else {
         num = this.state.activedId
         if (num === 8) {
           num = 1
           this.setState({
             activedId:  awardList[num - 1].position
           })
         } else {
           num = num + 1
           this.setState({
             activedId: awardList[num - 1].position
           })
         }
       }
       this.setState({
         actTimes: this.state.actTimes + 1
       })
     }, 80)
   }
  modalToggle=(name) => {
    if (name === 'modalFlag' && !this.state[name]) {
      trackPointLuckyDrawGoto({
        Btn_name:'rules'
      })
    }
    this.setState({
      [name]: !this.state[name],
    })
  }
  goTry=() => {
    this.setState({
      noLottie:false,
      activedId:''
    })
    this.getAwardHomeInfo(1)
  }
  goOk=() => {
    this.setState({
      couponLottie:false,
      pointsLottie:false,
      activedId:''
    })
    this.getAwardHomeInfo(1)
  }
  goHave=() => {
    const { prizeObj } = this.state
    console.log(prizeObj)
    trackPointLuckyDrawGoto({
      Btn_name:'get_reward'
    })
    this.props.history.push('/integration/receive?awardRecordId=' + prizeObj.awardRecordId + '&viewType=lucky_draw')
  }
  // 我的奖品
  goGifts=() => {
    if (!ua.isAndall() && !this.state.hasBindMobile) {
      location.href = window.location.origin + '/mkt/login/mobileLogin?url=/mkt/integration/lottery?queryType=1&viewtype=wechat1'
      return false
    }
    if (ua.isAndall() && !localStorage.getItem('token')) {
      this.goLogin()
      return false
    }
    setTimeout(() => {
      trackPointLuckyDrawGoto({
        Btn_name: 'my_rewards'
      })
      this.props.history.push('/integration/gifts')
    }, 100)
  }
  render () {
    const { loading, remainPoint, remainAwardCount, free, onceConsume, awardList, activedId, noLottie, couponLottie,
      modalFlag, pointsLottie, giftsLottie, prizeObj, isRolling, animation, rulesInfo } = this.state
    return (
      <Page title='积分抽奖'>
        {
          loading
            ? <MyLoader />
            : <div className={`${styles.lottery}`}>
              {
                awardList.length
                  ? <div className={styles.details}>
                    <img className={styles.lottery3} src={images.lottery3} id='lottery3' />
                    <img className={styles.lottery4} src={images.lottery4} id='lottery4' />
                    <div className={styles.detailsBg} id='detailsBg' >
                      <label className={styles.my}>我的积分</label>
                      <span className={styles.points}>{remainPoint}</span>
                      <div className={`${styles.circle} ${styles.rules}`} onClick={() => this.modalToggle('modalFlag')}>
                        <span>活动</span>
                        <span>规则</span>
                      </div>
                      <div className={`${styles.lotteryBtn} ${remainAwardCount === 0 ? styles.lotteryBtn2 : ''}`} onClick={() => this.handleBegin(remainAwardCount)}>
                        <span>{free ? '免费抽奖' : remainAwardCount > 0 ? '立即抽奖' : '明日再来～'}</span>
                      </div>
                      <div className={`${styles.circle} ${styles.things}`} onClick={this.goGifts}>
                        <span>我的</span>
                        <span>奖品</span>
                      </div>
                      <p className={styles.bottom}>*  今日还有{remainAwardCount}次抽奖机会哦～</p>
                      <div className={styles.prize}>
                        <div className={styles.prize__container}>
                          <div className={styles.container__area}>
                            <div className={styles.begin__btn} onClick={() => this.handleBegin(remainAwardCount)}>
                              {free ? '每日首次抽奖免费' : `本次消耗${onceConsume}积分`}
                            </div>
                            <div>
                              <div className={`${styles.area__row} ${styles.area__row1}`}>
                                <RowItem content={awardList[0].awardName} activedId={activedId} id={awardList[0].position} type={awardList[0].type} iconUrl={awardList[0].iconUrl} isRolling={isRolling} animation={animation} />
                                <RowItem content={awardList[1].awardName} activedId={activedId} id={awardList[1].position} type={awardList[1].type} count={awardList[1].faceValue} iconUrl={awardList[1].iconUrl} isRolling={isRolling} animation={animation} />
                                <RowItem content={awardList[2].awardName} activedId={activedId} id={awardList[2].position} type={awardList[2].type} count={awardList[2].faceValue} iconUrl={awardList[2].iconUrl} isRolling={isRolling} animation={animation} />
                              </div>
                              <div className={`${styles.area__row} ${styles.area__row2}`}>
                                <RowItem content={awardList[7].awardName} activedId={activedId} id={awardList[7].position} type={awardList[7].type} count={awardList[7].faceValue} iconUrl={awardList[7].iconUrl} isRolling={isRolling} animation={animation} />
                                <RowItem content={awardList[3].awardName} activedId={activedId} id={awardList[3].position} type={awardList[3].type} count={awardList[3].faceValue} iconUrl={awardList[3].iconUrl} isRolling={isRolling} animation={animation} />
                              </div>
                              <div className={`${styles.area__row} ${styles.area__row3}`}>
                                <RowItem content={awardList[6].awardName} activedId={activedId} id={awardList[6].position} type={awardList[6].type} count={awardList[6].faceValue} iconUrl={awardList[6].iconUrl} isRolling={isRolling} animation={animation} />
                                <RowItem content={awardList[5].awardName} activedId={activedId} id={awardList[5].position} type={awardList[5].type} count={awardList[5].faceValue} iconUrl={awardList[5].iconUrl} isRolling={isRolling} animation={animation} />
                                <RowItem content={awardList[4].awardName} activedId={activedId} id={awardList[4].position} type={awardList[4].type} count={awardList[4].faceValue} iconUrl={awardList[4].iconUrl} isRolling={isRolling} animation={animation} />
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                      {
                        isIos()
                          ? <p className={styles.statement}>该积分抽奖活动与苹果公司无关</p>
                          : ''
                      }
                    </div>
                  </div>
                  : ''
              }

              {
                modalFlag
                  ? <ShowModal
                    type={10}
                    rulesInfo={rulesInfo}
                    handleToggle={() => this.modalToggle('modalFlag')}
                  />
                  : noLottie // 未中奖
                    ? <ShowModal
                      type={11}
                      handleToggle={() => this.modalToggle('noLottie')}
                      goTry={this.goTry}
                    />
                    : couponLottie // 优惠券
                      ? <ShowModal
                        type={12}
                        prizeObj={prizeObj}
                        handleToggle={() => this.modalToggle('couponLottie')}
                        goOk={this.goOk}
                      />
                      : pointsLottie // 积分
                        ? <ShowModal
                          type={13}
                          prizeObj={prizeObj}
                          handleToggle={() => this.modalToggle('pointsLottie')}
                          goOk={this.goOk}
                        />
                        : giftsLottie // 实物
                          ? <ShowModal
                            type={14}
                            prizeObj={prizeObj}
                            handleToggle={() => this.modalToggle('giftsLottie')}
                            goHave={this.goHave}
                          />
                          : ''
              }
              {
                this.state.registerFlag
                  ? <div className={styles.register}>
                  +{this.state.registerPoint}积分<br />注册成功
                  </div>
                  : ''
              }
            </div>
        }
      </Page>
    )
  }
}

export default Lottery
