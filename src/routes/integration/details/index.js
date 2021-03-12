import React from 'react'
import { Page } from '@src/components'
import images from '../images'
import { MyLoader } from '@src/components/contentLoader'
import styles from './details'
import integrationApi from '@src/common/api/integrationApi'
import { trackPointPointsDetailGoto } from '../buried-point'

class Rules extends React.Component {
  state = {
    loading:false,
    activeKey:0,
    tabs:['全部', '获取', '使用'],
    points:'',
    records:[],
    pageObj: {
      pageNo: 1,
      pageSize: 10,
      totalPage: 1,
    },
    loadingStatus: true,
    isFixedTop:false
  }

  componentDidMount () {
    this.getUserPointDetail()
    this.addEventListenerSroll()
    trackPointPointsDetailGoto({
      Btn_name:'points_all'
    })
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onWindowScroll)
  }
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.getUserPointDetail)
    window.addEventListener('scroll', this.onWindowScroll)
  }
  onWindowScroll = () => {
    let _top = document.getElementById('tabs').offsetTop
    let h = document.body.scrollTop || document.documentElement.scrollTop
    h > _top ? this.setState({
      isFixedTop: true
    }) : this.setState({
      isFixedTop: false
    })
  }
  getUserPointDetail=() => {
    let { loadingStatus, pageObj, records, activeKey } = this.state
    const { pageNo, pageSize, totalPage } = pageObj || {}
    const params = {
      type:activeKey === 0 ? null : activeKey,
      pageNo,
      pageSize
    }
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34 - 163
    // console.log(scrollTop, offsetHeight, bodyHeight)

    if (loadingStatus && pageNo <= totalPage && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        integrationApi.getUserPointDetail(params).then(({ data }) => {
          if (data) {
            console.log(data)
            this.setState({
              records: [...records, ...data.all],
              pageObj: {
                ...pageObj,
                pageNo:data.pages + 1,
                totalPage: data.total
              },
              points:data.point
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
  goBack=() => {
    this.props.history.goBack()
  }
  changeTabs=(index) => {
    this.setState({
      activeKey:index,
      records:[],
      pageObj: {
        pageNo: 1,
        pageSize: 10,
        totalPage: 1,
      },
    }, () => {
      this.getUserPointDetail()
      let { activeKey } = this.state
      trackPointPointsDetailGoto({
        Btn_name:activeKey === 0 ? 'points_all' : activeKey === 1 ? 'points_get' : 'points_use'
      })
    })
  }
  render () {
    const { loading, tabs, activeKey, points, records, isFixedTop, pageObj } = this.state
    return (
      <Page title='积分明细'>
        {
          loading
            ? <MyLoader />
            : <div className={styles.details}>
              <div className={styles.header} id='header'>
                <p className={styles.my}>我的积分</p>
                <p className={styles.count} id='points'>{points}</p>
              </div>
              <div className={styles.lists} id='lists'>
                <div className={`${styles.tabs} ${isFixedTop ? styles.fixTop : ''}`} id='tabs'>
                  {
                    tabs.map((item, index) => (
                      <label key={index} className={`${activeKey === index ? styles.active : ''}`} onClick={() => this.changeTabs(index)}>
                        <span>{item}</span>
                        {
                          activeKey === index
                            ? <span className={styles.borderBottom}>&nbsp;</span>
                            : ''
                        }
                      </label>
                    ))
                  }
                </div>
                <div className={styles.padding20}>
                  {
                    pageObj.totalPage === 0
                      ? <div className={styles.noRecords}>
                        <img src={images.noRecords} />
                        <p>你还没有相关的记录哦</p>
                      </div>
                      : ''
                  }
                  {
                    records.map((v, i) => (
                      <div className={styles.records} key={i}>
                        <div>
                          <span className={styles.span1}>{v.remark}</span>
                          <span className={`${styles.span2} ${+v.pointVal < 0 ? styles.red : ''}`}>{`${+v.pointVal < 0 ? v.pointVal : '+' + v.pointVal}`}</span>
                        </div>
                        <div>
                          <span className={styles.span3}>{v.createTime}</span>
                          <span className={styles.span3}>总计：{v.curRemainPoint}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
        }
      </Page>
    )
  }
}

export default Rules
