import React from 'react'
import Page from '@src/components/page'
import { MyLoader } from '@src/components/contentLoader'
import styles from './gifts'
import integrationApi from '@src/common/api/integrationApi'
import ShowModal from '../components/showModal'
import images from '../images'
import { Toast } from 'antd-mobile'
import { trackPointMyRewardsView, trackPointMyRewardsGoto } from '../buried-point'
import { ua } from '@src/common/app'

class Gifts extends React.Component {
  state = {
    loading:false,
    records:[],
    pageObj: {
      pageNo: 1,
      pageSize: 10,
      totalPage: 1,
    },
    loadingStatus: true,
    false:true,
    otherName:'',
    iconUrl:'',
    thisGoodAwardRecordId:'',
  }

  componentDidMount () {
    trackPointMyRewardsView({
      view_type: 'lucky_draw'
    })
    this.getAwardList()
    this.addEventListenerSroll()
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.addEventListenerSroll)
  }
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.getAwardList)
  }
  getAwardList=() => {
    let { loadingStatus, pageObj, records } = this.state
    const { pageNo, pageSize, totalPage } = pageObj || {}
    const params = {
      pageNo,
      pageSize
    }
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    if (loadingStatus && pageNo <= totalPage && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        integrationApi.getAwardList(params).then(({ data }) => {
          if (data) {
            console.log(data)
            this.setState({
              records: [...records, ...data.awardList],
              pageObj: {
                ...pageObj,
                pageNo:data.pages + 1,
                totalPage: data.total
              },
            }, () => {
              console.log(this.state.pageObj)
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
  goReceive=(item) => {
    console.log(item)
    if (item.btnText === '已领取') {
      trackPointMyRewardsGoto({
        Btn_name:'have_reward'
      })
      Toast.info('您已成功领取奖品，我们会在7个工作日内发货哦～请耐心等待')
      return
    }
    if (item.btnText === '已失效') {
      trackPointMyRewardsGoto({
        Btn_name:'expire_reward'
      })
      Toast.info('抱歉，您未在有效期内领取奖')
      return
    }
    trackPointMyRewardsGoto({
      Btn_name:'get_reward'
    })
    integrationApi.getDrawAwardInfo().then(res => {
      if (res) {
        console.log(res.data.list)
        if (res.data.list.length > 1) {
          console.log(res.data.list.filter(v => v.awardRecordId !== item.awardRecordId))
          let otherName = []
          res.data.list.filter(v => v.awardRecordId !== item.awardRecordId).map((item, index) => {
            otherName.push(item.awardName)
          })
          this.setState({
            together:true,
            thisGoodAwardRecordId:item.awardRecordId,
            otherName: Array.from(new Set(otherName)).join(','),
            iconUrl:item.iconUrl
          })
        } else {
          this.props.history.push('/integration/receive?awardRecordId=' + item.awardRecordId + '&viewType=my_rewards')
        }
      }
    })
  }
  // 不用了只领取当前的
  goOne=() => {
    const { thisGoodAwardRecordId } = this.state
    this.props.history.push('/integration/receive?awardRecordId=' + thisGoodAwardRecordId + '&viewType=my_rewards')
  }
  // 一起领
  goTogether=() => {
    this.props.history.push('/integration/receive?viewType=my_rewards_together')
  }
  modalToggle=(name) => {
    this.setState({
      [name]: !this.state[name],
    })
  }
  goCouponList=() => {
    if (ua.isAndall()) {
      trackPointMyRewardsGoto({
        Btn_name:'view_coupon'
      })
      window.location.href = 'andall://andall.com/coupon_list'
    } else {
      window.location.href = window.location.origin + '/download-app'
    }
  }
  render () {
    const { loading, records, pageObj, together, otherName, iconUrl } = this.state
    return (
      <Page title='我的奖品'>
        {
          loading
            ? <MyLoader />
            : <div className={styles.lists} id='lists'>
              {
                pageObj.totalPage > 0
                  ? records.map((item, index) => (
                    item.type === 1
                      ? <div className={styles.padding} key={index}>
                        <div className={`${styles.records} ${styles.goods}`}>
                          {
                            <img src={item.btnText === '去领取' ? images.gifts1 : item.btnText === '已领取' ? images.gifts2 : images.gifts3}
                              className={styles.status} />
                          }
                          <div className={styles.desc}>
                            <img src={item.iconUrl} className={`${styles.leftImg} ${styles.marginTop}`} />
                            <div className={styles.middle}>
                              <p>{item.awardName}</p>
                              <p>{item.desc}</p>
                              <p>{item.pickTime}</p>
                            </div>
                          </div>
                          {
                            item.btnText
                              ? <div className={`${styles.taskBtn} ${item.btnText === '已失效' ? styles.whiteBtn : ''}`} onClick={() => this.goReceive(item)}>
                                {item.btnText}
                              </div>
                              : ''
                          }
                        </div>
                        <p className={styles.date}>{item.expireTime} 奖品到期</p>
                      </div>
                      : <div className={styles.padding} key={index}>
                        <div className={`${styles.records} ${styles.points}`}>
                          <div className={styles.desc}>
                            <img src={item.type === 2 ? images.gifts4 : images.gifts5} className={styles.leftImg} />
                            <div className={styles.middle}>
                              <p>{item.awardName}</p>
                              <p>{item.desc}</p>
                              <p>{item.pickTime}</p>
                            </div>
                          </div>
                          {
                            item.btnText
                              ? <div className={`${styles.taskBtn}`} onClick={() => this.goCouponList()}>{item.btnText}</div>
                              : ''
                          }
                        </div>
                      </div>
                  ))
                  : <div className={styles.noRecords}>
                    <img src={images.noRecords} />
                    <p>您还没有奖品哦，快去抽奖吧～</p>
                  </div>
              }
              {
                together
                  ? <ShowModal
                    type={15}
                    handleToggle={() => this.modalToggle('together')}
                    otherName={otherName}
                    iconUrl={iconUrl}
                    goOne={this.goOne}
                    goTogether={this.goTogether}
                  />
                  : ''
              }
            </div>
        }
      </Page>
    )
  }
}

export default Gifts
