import React from 'react'
import { Page } from '@src/components'
import images from '../images'
import styles from './recharge.scss'
import integrationApi from '@src/common/api/integrationApi'
import { detailedPageView } from '../buried-point'

class RechargeDetails extends React.Component {
  state = {
    loading:true,
    activeKey:0,
    tabs:['全部', '获取', '使用'],
    points:'',
    records:[],
    pageObj: {
      pageNum: 1,
      pageSize: 10,
      totalPage: 1,
    },
    loadingStatus: true,
  }

  componentDidMount () {
    this.userRechargeDetail()
    this.addEventListenerSroll()
    detailedPageView()
  }
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.userRechargeDetail)
  }
  userRechargeDetail=() => {
    let { loadingStatus, pageObj, records, activeKey } = this.state
    const { pageNum, pageSize, totalPage } = pageObj || {}
    const params = {
      type:activeKey + 1,
      pageNum,
      pageSize
    }
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    // console.log(pageNum + '=======')
    if (loadingStatus && pageNum <= totalPage && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        integrationApi.userRechargeDetail(params).then(({ data }) => {
          if (data) {
            console.log(data.data)
            this.setState({
              records: [...records, ...data.data || []],
              pageObj: {
                ...pageObj,
                pageNum:data.pageNum + 1,
                totalPage: data.totalPage
              },
              loading:false
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

  changeTabs=(index) => {
    this.setState({
      activeKey:index,
      records:[],
      pageObj: {
        pageNum: 1,
        pageSize: 10,
        totalPage: 1,
      },
    }, () => {
      this.userRechargeDetail()
    })
  }
  render () {
    const { loading, tabs, activeKey, records, pageObj } = this.state
    return (
      <Page title='明细'>
        {
          !loading
            ? <div className={styles.details}>
              <div className={`${styles.tabs}`}>
                {
                  tabs.map((item, index) => (
                    <div key={index} className={`${activeKey === index ? styles.active : ''}`} onClick={() => this.changeTabs(index)}>
                      <span>{item}</span>
                      { activeKey === index ? <span className={styles.borderBottom}>&nbsp;</span> : ''}
                    </div>
                  ))
                }
              </div>
              <div className={`${styles.listBox}`}>
                {
                  pageObj.totalPage === 0
                    ? <div className={styles.noRecords}>
                      <img src={images.noRecords} />
                      <p>暂无记录</p>
                    </div>
                    : records.map((v, i) => (
                      <div className={styles.records} key={i}>
                        <div>
                          <span className={styles.span1}>{v.type}</span>
                          <span className={`${styles.span2} ${v.count.indexOf('+') > -1 ? styles.red : ''}`}>{v.count}</span>
                        </div>
                        <div>
                          <span className={styles.span3}>{v.createTime}</span>
                          <span className={styles.span4}>{v.message}</span>
                        </div>
                        {v.cardNo ? <p className={styles.cardNo}>卡号：{v.cardNo}</p> : ''}
                      </div>
                    ))
                }
              </div>
            </div>
            : ''
        }
      </Page>
    )
  }
}

export default RechargeDetails
