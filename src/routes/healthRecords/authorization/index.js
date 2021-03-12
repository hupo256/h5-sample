import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './authorization.scss'
import images from '../images'
import { fun } from '@src/common/app'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
import { Toast } from 'antd-mobile'
const { getParams } = fun
class Authorization extends React.Component {
  state = {
    loading:false,
    userList:[],
    nodata:'',
    viewList:[],
    linkManReportList:[],
    pageType:+getParams().pageType,
    titleName:'',
    activeKey:0,
  }
  componentDidMount () {
    this.pageInit()
  }
  pageInit=() => {
    let { pageType } = this.state
    if (pageType === 1) {
      healthRecordsApi.getHealthDocLinkManAuthDetails({ linkManId:getParams().linkManId }).then(res => {
        if (res) {
          console.log(res.data)
          res.data.userList.map((item, index) => {
            item.reportList = res.data.reportList
          })
          this.setState({
            titleName:(res.data.linkManName.length > 5 ? res.data.linkManName.substring(0, 5) + '...' : res.data.linkManName) + '的报告阅读权限',
            userList:res.data.userList,
          })
        }
      })
    } else if (pageType === 2) {
      healthRecordsApi.queryAuthToFriendReport({ otherUserId:getParams().otherUserId }).then(res => {
        if (res) {
          console.log(res.data)
          res.data.linkManReportList.map((item, index) => {
            item.authBarcodeList = []
            if (item.reportList.length) {
              item.reportList.map((v, i) => {
                if (v.selectFlag === 1) {
                  item.authBarcodeList.push(v.barCode)
                }
              })
            }
          })
          this.setState({
            titleName:(res.data.name.length > 5 ? res.data.name.substring(0, 5) + '...' : res.data.name) + '的报告阅读权限',
            userList:res.data.linkManReportList
          }, () => {
            console.log(this.state.userList)
          })
        }
      })
    } else {
      healthRecordsApi.getBrowseLog({ linkManId:getParams().linkManId }).then(res => {
        if (res) {
          console.log(res.data)
          this.setState({
            viewList:res.data,
            nodata:res.data.length === 0 ? true : ''
          })
        }
      })
    }
  }
  handleCheck = (barCode) => {
    let { userList, activeKey } = this.state
    userList[activeKey].authBarcodeList = (userList[activeKey].authBarcodeList.includes(barCode)
      ? userList[activeKey].authBarcodeList.filter(item => item !== barCode)
      : [...userList[activeKey].authBarcodeList, barCode])
    this.setState({ userList })
  }
  selectAll = () => {
    let { userList, activeKey } = this.state
    let _authBarcodeList = []
    userList[activeKey].reportList.map((item, index) => {
      _authBarcodeList.push(item.barCode)
    })
    userList[activeKey].authBarcodeList = userList[activeKey].authBarcodeList.length === userList[activeKey].reportList.length ? [] : _authBarcodeList
    this.setState({ userList })
  }
  saveBtn=() => {
    let { userList, activeKey, pageType } = this.state
    let obj = getParams()
    console.log(userList)
    if (pageType === 1) {
      let authList = []
      authList.push({
        otherUserId:userList[activeKey].id,
        barCodeList:userList[activeKey].authBarcodeList
      })
      let params = {
        linkManId:getParams().linkManId,
        authList,
      }
      console.log(params)
      healthRecordsApi.updateHealthDocLinkManAuthDetails(params).then(res => {
        if (res) {
          console.log(res.data)
          Toast.info('授权成功！')
          setTimeout(() => {
            this.props.history.replace(`/healthRecords/information?pageType=${obj.pageType}&linkManId=${obj.linkManId}`)
          }, 1500)
        }
      })
    } else {
      let _authList = []
      _authList.push({
        linkManId:userList[activeKey].linkManId,
        barCodeList:userList[activeKey].authBarcodeList
      })
      let params = {
        otherUserId:getParams().otherUserId,
        authList:_authList
      }
      console.log(params)
      healthRecordsApi.authReportToFriend(params).then(res => {
        if (res) {
          Toast.info('授权成功！')
          setTimeout(() => {
            this.props.history.replace(`/healthRecords/information?pageType=${obj.pageType}&otherUserId=${obj.otherUserId}&type=${obj.type}&linkManId=${obj.linkManId}`)
          }, 1500)
        }
      })
    }
  }
  render () {
    const { nodata, titleName, pageType, userList, viewList, activeKey } = this.state
    return (
      <Page title={`${pageType < 3 ? `${titleName}` : '谁看过我'}`}>
        {
          <div>
            {
              pageType < 3 && userList.length
                ? <div className={styles.authorization}>
                  <div className={styles.linkman}>
                    {
                      userList.map((item, index) => (
                        <div onClick={() => this.setState({ activeKey:index })} key={index}
                          className={`${activeKey === index ? styles.activeOne : ''}`}>
                          <img src={`${activeKey === index
                            ? item.headImgType === 1 ? images.blue1 : item.headImgType === 2 ? images.blue2 : item.headImgType === 3 ? images.blue3 : images.blue4
                            : item.headImgType === 1 ? images.grey1 : item.headImgType === 2 ? images.grey2 : item.headImgType === 3 ? images.grey3 : images.grey4}`} />
                          <div className={styles.relationName}><span>{item.relationName.length > 2 ? item.relationName.substring(0, 2) : item.relationName}</span></div>
                          <p className={styles.userName}>{
                            pageType === 1
                              ? item.userName.length > 5 ? item.userName.substring(0, 5) + '...' : item.userName
                              : item.name.length > 5 ? item.name.substring(0, 5) + '...' : item.name
                          }</p>
                          {activeKey === index && <p className={styles.bottomLine} />}
                        </div>
                      ))
                    }
                  </div>
                  <div className={styles.totalCount}><span style={{ color:'#38395B' }}>共有</span>{ userList[activeKey].reportList.length}个</div>
                  <div className={styles.tabText}>
                    {
                      userList[activeKey].reportList.map((item, index) => (
                        <div key={index}
                          className={`${styles.sunKind} ${index === userList[activeKey].reportList.length - 1 ? styles.bottom0 : ''}`}
                          onClick={() => this.handleCheck(item.barCode)}>
                          <img src={`${userList[activeKey].authBarcodeList.includes(item.barCode) ? images.choosed : images.choose}`} />
                          <div>
                            <h5>{item.name}</h5>
                            <p>{item.desc}</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  {/* {
                    userList.map((item, index) => (
                      item.reportList.length
                        ? <div className={`${styles.choose} ${index === userList.length - 1 ? styles.bottom120 : ''}`} key={index}>
                          <div className={styles.top}>
                            <div className={styles.left}>
                              <img src={`${item.headImgType === 1 ? images.userImg1 : item.headImgType === 2 ? images.userImg2 : item.headImgType === 3 ? images.userImg3 : images.userImg4}`} />
                              {
                                pageType === 1
                                  ? `${item.userName.length > 6 ? item.userName.substr(0, 6) + '...' : item.userName}（${item.relationName}）`
                                  : `${item.name.length > 6 ? item.name.substr(0, 6) + '...' : item.name}`
                              }
                            </div>
                            <div className={styles.right} onClick={() => this.selectAll(index, item)}>
                              <img src={`${item.authBarcodeList.length && item.authBarcodeList.length === item.reportList.length ? images.choosed : images.choose}`} />
                              <span>全选</span>
                            </div>
                          </div>
                          <div className={`${styles.chooseThis} `}>
                            {item.reportList.map((v, i) => (
                              <div key={i}
                                className={`${styles.sunKind} ${i === item.reportList.length - 1 ? styles.bottom0 : ''}`}
                                onClick={() => this.handleCheck(index, v.barCode)}>
                                <div>
                                  <img src={`${item.authBarcodeList.includes(v.barCode) ? images.choosed : images.choose}`} />
                                  <span>{v.name}</span>
                                </div>
                                <p>{v.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        : ''
                    ))
                  } */}
                  <div className={styles.saveBtn}>
                    <div onClick={() => this.selectAll()}>
                      <img src={`${userList[activeKey].authBarcodeList.length && userList[activeKey].authBarcodeList.length === userList[activeKey].reportList.length ? images.radio1 : images.radio2}`} />
                      <span>全选</span>
                    </div>
                    <p onClick={this.saveBtn}>确认授权</p>
                  </div>
                </div>
                : nodata
                  ? <div className={styles.nodata}>
                    <img src={images.nodata} />
                    <p>还没有人看过你哦</p>
                  </div>
                  : <div className={styles.viewMe}>
                    {
                      viewList.map((item, index) => (
                        <div key={index}>
                          <img src={`${item.headImgType === 1 ? images.userImg1 : item.headImgType === 2 ? images.userImg2 : item.headImgType === 3 ? images.userImg3 : images.userImg4}`} />
                          <div>
                            <p>{`${item.userName}（${item.relationName}）`}</p>
                            <span>最近：{item.lastBrowseTime}</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
            }
          </div>
        }
      </Page>
    )
  }
}
Authorization.propTypes = {
  history: propTypes.object,
}
export default Authorization
