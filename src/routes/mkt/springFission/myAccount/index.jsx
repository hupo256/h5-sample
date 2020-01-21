import React from 'react'
import { Page } from '@src/components'
import { API, fun } from '@src/common/app'
import Carousel from '../activityDetail/components/carousel'
import images from '@src/common/utils/images'
import { accountpageView, accountpageConvertGoto,  accountpageAwardRecordGoto, accountpageConvertRecordGoto } from '../BuriedPoint'
import { MyLoader } from '../../lego/MyLoader'
import styles from './myAccout'

const { springFission } = images
const tabArr = ['兑换记录', '奖励明细']
const { getParams } = fun

class MyAccount extends React.Component {
  state = {
    sharePop: false,
    tabInd: 0,
    loading: true,
  }

  componentDidMount () {
    accountpageView({ view_type: getParams().viewType })
    // const { tabInd } = getParams()
    // tabInd && this.tabClick(+tabInd)

    // 获取账户信息
    API.getMyAccountInfo().then(res => {
      const { code, data } = res
      if(code) return
      this.setState({
        ...data,
        loading: false
      })
    })
  }

  tabClick = (tabInd) => {
    if(tabInd){
      accountpageConvertRecordGoto()
    }else{
      accountpageAwardRecordGoto()
    }
    this.setState({tabInd})
  }

  toExchangeCard = (code) => {
    const { activCode } = getParams()
    // this.props.history.push(`/openCard?exchangeId=${code}&activCode=${activCode}`)
    window.location.href = `${origin}/andall-sample/openCard?exchangeId=${code}&activCode=${activCode}`
  }

  gotoExchange = (balance) => {
    accountpageConvertGoto()

    const { activCode } = getParams()
    setTimeout(() => {
      window.location.href = `${origin}/andall-sample/toExchange?balance=${balance}&activCode=${activCode}`
    }, 200)
  }

  render () {
    let { loading, tabInd,  redeemedAmount, balance, accumulatedAmount, exchangeList, rewardDetailList, bannerInfoList } = this.state
    return (
      <Page title='我的帐户'>
        {loading ? <MyLoader /> : 
        <div className={styles.myAccout}>
          <div className={styles.subInfor}>
            <div className={styles.anibox}>
              <Carousel 
                bannerInfoList={bannerInfoList}
                color={"#fff"}
                speakerUrl={`${springFission}speaker_white.png`}
                bgclass={"invitedCarousel"}
                backgroundColor={""}
              />
            </div>
            
            <div className={styles.subCon}>
              <p className={styles.subTit}><img src={`${springFission}packer.png`} /><span>累计金额</span></p>
              <p className={styles.subNum}><i>￥</i><b>{accumulatedAmount}</b></p>

              <ul>
                <li>
                  <span>已兑换金额</span><p>{redeemedAmount}</p>
                </li>
                <li>
                  <span>余额</span> <p>{balance}</p>
                  <div onClick={() => this.gotoExchange(balance)} className={styles.doxchange}>
                    <span>兑换</span> <img src={`${springFission}toright.png`} />
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {tabArr && <ul className={styles.listTab}>
            {tabArr.map((tab, index) => 
              <li key={index} onClick={() => this.tabClick(index)}>
                <span className={`${index === tabInd && styles.on}`}>{tab}</span>
              </li>
            )}
            </ul>
          }

          {/* 列表们 */}
          <ul className={styles.dataList}>
            {tabInd === 0 && exchangeList &&
              exchangeList.length>0 && exchangeList.map((item, index) => {
                const { applicateTime, cardAmount, cardCount, status, exchangeId} = item
                return <li key={index} className={`${+status === 4 ? styles.gray : ''}`}>
                      <div><span>兑换</span><p>{applicateTime}</p></div>
                      <div>
                        <span className={styles.num}>{`${cardAmount}x${cardCount}`}</span>
                        { +status <= 2 ? 
                          <React.Fragment><p>审核中</p><p>预计7个工作日到账</p></React.Fragment> :
                          <p className={styles.getDedail} onClick={() => this.toExchangeCard(exchangeId)}>查看详情</p>
                        }
                      </div>
                  </li>
              }) 
            }

            {tabInd === 1 && rewardDetailList && 
              rewardDetailList.length>0 && rewardDetailList.map((item, index) => {
                const { rewardName, arrivalAccount, arrivalTime } = item
                return <li key={index}>
                    <div><span>{rewardName || '提现'}</span> <p>{arrivalTime}</p></div>
                    <div><span>奖励</span> <span className={styles.num}>{arrivalAccount}</span></div>
                  </li>
              }) 
            }
          </ul>
          
          {/* 无记录时提示 */}
          {(tabInd === 0 && (!exchangeList || !exchangeList.length)) && 
            <div className={styles.onData}>
              <img src={`${springFission}ondata.png`} />
              <p>暂无兑换记录</p>
            </div>
          }

          {(tabInd === 1 && (!rewardDetailList || !rewardDetailList.length)) && 
            <div className={styles.onData}>
              <img src={`${springFission}ondata.png`} />
              <p>暂无奖励明细</p>
            </div>
          }
        </div>}
      </Page>
    )
  }
}

export default MyAccount
