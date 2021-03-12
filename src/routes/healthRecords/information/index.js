import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './information.scss'
import images from '../images'
import { Carousel, Toast } from 'antd-mobile'
import { fun, ua } from '@src/common/app'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
import { myLinkmanPageView, myRelativesFriendsPageView, myLinkmanPageGoto, myRelativesFriendsPageGoto, diseaseProfileGoto } from '../buried-point'
import ShowModal from '../components/showModal'
import BottomPicker from '../components/bottomPicker'

const { getParams } = fun
class Mine extends React.Component {
  state = {
    loading:true,
    userName:'',
    linkManInfo:{},
    authList:[],
    reportList:[],
    rlPointList:[],
    linkManId:getParams().linkManId.split('#')[0],
    pageType:+getParams().pageType,
    editAuth:'',
    diseaseObj:{},
    pickerPop:'',
    modalFlag:'',
  }
  componentDidMount () {
    this.pageInit()
    this.doPopstateEvent()
    andall.on('onVisibleChanged', (res) => {
      res.visibility && this.pageInit()
    })
  }
  componentWillUnmount() {
    window.removeEventListener('popstate', this.touchHistory, false)
  }
  doPopstateEvent = () => {
    const state = { title: 'title', url: '#' }
    window.history.pushState(state, 'title', '#')
    window.addEventListener('popstate', this.touchHistory, false)
  }
  touchHistory = () => {
    // alert('我监听到了浏览器的返回按钮事件啦12') // 根据自己的需求实现自己的功能
    window.history.go(-1)
  }

  getNewArr=(arr) => {
    let baseArray = arr
    let len = baseArray.length
    let n = 2 // 假设每行显2个
    let lineNum = len % n === 0 ? len / n : Math.floor((len / n) + 1)
    let res = []
    for (let i = 0; i < lineNum; i++) {
    // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
      let temp = baseArray.slice(i * n, i * n + n)
      res.push(temp)
    }
    return res
  }
  pageInit=() => {
    let { linkManId } = this.state
    if (this.state.pageType === 1) {
      healthRecordsApi.getHealthDocLinkManDetails({ linkManId }).then(res => {
        if (res) {
          let { linkManInfo, authList, reportList, rlPointList, editAuth, editBase } = res.data
          this.setState({
            linkManInfo,
            authList,
            reportList,
            rlPointList:rlPointList ? this.getNewArr(rlPointList) : [],
            editAuth,
            editBase,
            loading:false
          }, () => {
            healthRecordsApi.checkDataIsImproved({ linkManId, noloading:1 }).then(res => {
              if (res) {
                this.setState({ diseaseObj:res.data })
                setTimeout(() => {
                  myLinkmanPageView({
                    sample_linkmanid:linkManId,
                    record_status:(!res.data.personalFlag && !res.data.familyFlag) ? 0 : 1
                  })
                }, 200)
              }
            })
          })
        }
      })
    } else {
      myRelativesFriendsPageView()
      healthRecordsApi.queryFriendDetail({
        type:+getParams().type,
        otherUserId:+getParams().otherUserId,
        linkManId,
      }).then(res => {
        if (res) {
          let { friendInfo, authList, reportList, rlPointList, editAuth, editBase } = res.data
          this.setState({
            linkManInfo:friendInfo,
            authList,
            reportList,
            rlPointList:rlPointList ? this.getNewArr(rlPointList) : [],
            editAuth,
            editBase,
            loading:false
          })
        }
      })
    }
  }
  goPage=(type, info) => {
    let obj = getParams()
    let { linkManId, editAuth } = this.state
    if (type < 3 && !editAuth) {
      Toast.info(type === 1 ? '您还没有基因检测报告或亲友可授权' : '您还没有基因检测报告可以授权亲友查看')
      return
    }
    if (type === 1 || type === 3) {
      myLinkmanPageGoto({ viewtype:type === 1 ? 'my_linkman_reports_authorize' : 'visit_log' })
      this.props.history.push(`/healthRecords/authorization?pageType=${type}&linkManId=${info.id}`)
    } else {
      myRelativesFriendsPageGoto({ viewtype:'my_linkman_reports_authorize' })
      this.props.history.push(`/healthRecords/authorization?pageType=${type}&otherUserId=${obj.otherUserId}&type=${obj.type}&linkManId=${linkManId}`)
    }
  }
  editInfo=() => {
    let obj = getParams()
    let { linkManInfo, linkManId, pageType } = this.state
    if (pageType === 1) {
      myLinkmanPageGoto({ viewtype: 'edit_my_linkman_information' })
      this.props.history.push(`/healthRecords/myInfo?linkManId=${linkManInfo.id}`)
    } else {
      this.props.history.push(`/healthRecords/invite/info?pageType=edit&otherUserId=${obj.otherUserId}&type=${obj.type}&linkManId=${linkManId}`)
    }
  }
  goReportDetail=(v) => {
    let { pageType } = this.state
    pageType === 1 ? myLinkmanPageGoto({ viewtype: 'my_linkman_reports_view' }) : myRelativesFriendsPageGoto({ viewtype: 'my_relatives_friends_reports_view' })
    let url =
    pageType === 1
      ? `${location.origin}/mkt/report4_2?reportType=${v.reportType}&code=${v.code}&traitId=${v.traitId}&barCode=${v.barCode}&linkManId=${v.linkManId}`
      : `${location.origin}/mkt/report4_2?reportType=${v.reportType}&code=${v.code}&traitId=${v.traitId}&barCode=${v.barCode}&linkManId=${v.linkManId}&isAuthority=1`
    location.href = ua.isAndall() ? `andall://andall.com/report_detail?url=${url}` : url
  }
  goReport=(v) => {
    let { linkManId, pageType } = this.state
    pageType === 1 ? myLinkmanPageGoto({ viewtype: 'my_linkman_reports_view' }) : myRelativesFriendsPageGoto({ viewtype: 'my_relatives_friends_reports_view' })
    if (pageType === 2) {
      healthRecordsApi.recordBrowseLog({
        linkManId,
        otherUserId:getParams().otherUserId
      }).then(res => {
        if (res) {
          // console.log(res.data)
        }
      })
    }
    let _url =
     v.redirectH5 === 1
       ? v.h5Url
       : v.myself === 0 ? `andall://andall.com/open_report?reportType=${v.reportType}&linkManId=${linkManId}&barCode=${v.barCode}&code=${v.code}&isAuthority=1`
         : `andall://andall.com/open_report?reportType=${v.reportType}&linkManId=${linkManId}&barCode=${v.barCode}&code=${v.code}`
    location.href = _url
  }
  goDisease=(type, flag) => {
    let { linkManId, diseaseObj } = this.state
    diseaseProfileGoto({
      sample_linkmanid:linkManId,
      disease_type:type === 1 ? 'personal' : 'family',
      record_status:!diseaseObj.personalFlag && !diseaseObj.familyFlags ? 0 : 1
    })
    let url = flag
      ? `${location.origin}/mkt/healthRecords/diseaseRecords?hideTitleBar=1&linkManId=${linkManId}&tab=${type}`
      : `${location.origin}/mkt/healthRecords/disease?hideTitleBar=1&type=${type}&linkManId=${linkManId}`
    location.href = ua.isAndall() ? `andall://andall.com/inner_webview?url=${url}` : url
  }
  modalToggle=(name) => {
    this.setState({
      [name]: !this.state[name],
    })
  }
  // 解除绑定
  removeRelation=() => {
    healthRecordsApi.updateFriendInfo({
      otherUserId:getParams().otherUserId,
      unBind:true
    }).then(res => {
      if (res) {
        this.setState({
          modalFlag:false,
          pickerPop:false
        })
        Toast.info('解除成功')
        setTimeout(() => {
          this.props.history.push(`/healthRecords/chooseOne?closeWebViewFlag=1`)
        }, 1000)
      }
    })
  }
  render () {
    const { pageType, linkManInfo, authList, reportList, rlPointList, loading, editBase, diseaseObj, pickerPop, modalFlag } = this.state
    return (
      <Page title={`${pageType === 1 ? linkManInfo.name ? (linkManInfo.name + '的健康档案') : '' : '亲友信息'}`}>
        {
          !loading
            ? <div className={styles.mine}>
              {
                linkManInfo.name
                  ? <div className={styles.info}>
                    <div className={styles.left}>
                      <img src={`${linkManInfo.headImgType === 1 ? images.userImg1 : linkManInfo.headImgType === 2 ? images.userImg2 : linkManInfo.headImgType === 3 ? images.userImg3 : images.userImg4}`} />
                      <div>
                        <p>{linkManInfo.name}</p>
                        <span>亲友关系：{pageType === 1 ? linkManInfo.relationName : linkManInfo.friendRelationName}</span>
                      </div>
                    </div>
                    {
                      editBase
                        ? pageType === 1
                          ? <div className={styles.right} onClick={() => this.editInfo()}>编辑</div>
                          : <div className={styles.right} onClick={() => this.setState({ pickerPop:'manage' })}>管理</div>
                        : ''
                    }
                  </div>
                  : ''
              }
              {
                pageType === 2 && +getParams().type === 2
                  ? ''
                  : <div className={styles.authorization} onClick={() => this.goPage(pageType, linkManInfo)}>
                    <p>{`${pageType === 1 ? '报告被查看授权' : '授权给TA的报告'}`}</p>
                    {
                      authList && authList.length
                        ? <div>
                          {
                            authList.map((item, index) => (
                              index < 4
                                ? <img key={index} className={`${authList.length > 3 ? styles.more : ''}`}
                                  src={`${item.headImgType === 1 ? images.userImg1 : item.headImgType === 2 ? images.userImg2 : item.headImgType === 3 ? images.userImg3 : images.userImg4}`} />
                                : ''
                            ))
                          }
                          {
                            authList.length > 4 ? <span>等{authList.length}人</span> : ''
                          }
                        </div>
                        : <div className={styles.noAuthList}>无</div>
                    }
                  </div>
              }
              {
                rlPointList.length
                  ? <div className={styles.top30}>
                    <div className={styles.title}>
                      <p>重点注意项</p>
                    </div>
                    <div className={`${styles.square} ${styles.highOrLow}`}>
                      <Carousel className='my-carousel'
                        vertical
                        dots={false}
                        dragging={false}
                        swiping={false}
                        autoplay
                        infinite
                      >
                        {
                          rlPointList.map((item, index) => (
                            <div className={styles.demo} key={index} >
                              {
                                item.map((v, i) => (
                                  <p key={i} onClick={() => this.goReportDetail(v)}>
                                    <label className={`${v.type === 2 ? styles.label1 : styles.label2}`}>{v.type === 1 ? '红点' : '亮点'}</label>
                                    <span>{v.desc}</span>
                                  </p>
                                ))
                              }
                            </div>
                          ))
                        }
                      </Carousel>
                    </div>
                  </div>
                  : ''
              }
              {
                reportList && reportList.length
                  ? <div className={styles.top30}>
                    <div className={styles.title} >
                      <p>检测报告</p>
                      {pageType === 1
                        ? <span className={styles.goRight} onClick={() => this.goPage(3, linkManInfo)}>谁来看过</span>
                        : ''}
                    </div>
                    <div className={`${styles.square} ${styles.reports}`}>
                      {
                        reportList.map((item, index) => (
                          <div key={index}>
                            <div className={styles.left}>
                              <img src={item.pictureUrl} />
                              {item.star && <label>&nbsp;</label>}
                              <div>
                                <h5>{item.name}</h5>
                                <p>{item.desc}</p>
                              </div>
                            </div>
                            <p onClick={() => this.goReport(item)} className={styles.thisBtn}>去查看</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  : <div className={styles.noReport}>
                    <img src={images.nodata2} />
                    <p>{pageType === 1 ? '你还没有报告可查看' : 'TA还没有报告对你展示'}</p>
                  </div>
              }
              {
                pageType === 1 && <div className={styles.top30}>
                  <div className={styles.title} >
                    <p>
                      <span>疾病管理</span>
                      <label className={styles.diseaseRec}>
                        {!diseaseObj.personalFlag && !diseaseObj.familyFlag ? '（待完善）' : `（已记录${diseaseObj.recordNum}项）`}
                      </label>
                    </p>
                  </div>
                  <div className={`${styles.square} ${styles.disease}`}>
                    <div className={styles.diseaseDiv} onClick={() => this.goDisease(1, diseaseObj.personalFlag)}>
                      <div>
                        <h5 className={`${diseaseObj.personalFlag && styles.maxWidth}`}>
                          {diseaseObj.personalFlag ? diseaseObj.personalScikname.substr(0, diseaseObj.personalScikname.length - 1) || '无' : '待完善'}
                        </h5>
                        <span>个人疾病史</span>
                      </div>
                      {
                        diseaseObj.personalFlag
                          ? <span className={styles.goRight} />
                          : <p className={styles.thisBtn}>完善档案</p>
                      }
                    </div>
                    <div className={styles.diseaseDiv} onClick={() => this.goDisease(2, diseaseObj.familyFlag)}>
                      <div>
                        <h5 className={`${diseaseObj.familyFlag && styles.maxWidth}`}>{diseaseObj.familyFlag ? diseaseObj.familyScikname.substr(0, diseaseObj.familyScikname.length - 1) || '无' : '待完善'}</h5>
                        <span>家族疾病史</span>
                      </div>
                      {
                        diseaseObj.familyFlag
                          ? <span className={styles.goRight} />
                          : <p className={styles.thisBtn}>完善档案</p>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
            : ''
        }
        {
          pickerPop === 'manage' && <BottomPicker
            handleClose={() => this.modalToggle('pickerPop')}
            handleEditInfo={() => this.editInfo()}
            handleRemove={() => this.modalToggle('modalFlag')}
            type={1}
          />
        }
        {
          modalFlag && <ShowModal
            friendName={linkManInfo.name}
            handleToggle={() => this.modalToggle('modalFlag')}
            confirmBtn={() => this.removeRelation()}
            type={4}
          />
        }
      </Page>
    )
  }
}
Mine.propTypes = {
  history: propTypes.object,
}
export default Mine
