import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { API, point, fun } from '@src/common/app'
import { Toast } from 'antd-mobile'
import { Page, Check, Modal } from '@src/components'
import Setp from '../components/setp'
import images from '@src/common/utils/images'
const { bindOnly } = images
import styles from '../binding'

const { allPointTrack } = point
const { getSetssion, getParams } = fun

@inject('user')
@observer
class SelectUser extends React.Component {
  state = {
    list: [],
    index: -1,
    addNewFlag: false,
    limitLinkManId: -1,
    showTips: false,
  }
  // 埋点记录输入样本信息
  trackPointSampleBindInput(userInfo) {
    let obj = {
      eventName: 'sample_bind_input',
      pointParams: {
        sample_barcode: userInfo.barcode,
        sample_linkman: userInfo.linkManId,
        sample_name: userInfo.userName.substr(0, 1) + '**',
        relationId: userInfo.relationId,
        sample_sex: userInfo.sex,
        sample_birthday: userInfo.birthday
      }
    }
    allPointTrack(obj)
  }
  componentDidMount() {
    const { state } = this.props.location
    const { barcode } = getParams()
    state && state.data && 
    this.setState({ 
      list: state.data.list,
      addNewFlag: state.data.addNewFlag,
      limitLinkManId: state.data.limitLinkManId
    })

    barcode && this.touchBindingList(barcode)
  }

  touchBindingList = (bcode) => {
    API.listOptionalLinkMan({barcode: bcode}).then(res => {
      const { code, data } = res
      if (!code) {
        data.list && this.setState({ 
          list: data.list,
          addNewFlag: true,
          // addNewFlag: data.addNewFlag,
          limitLinkManId: data.limitLinkManId
        })
      }
    })
  }

  chooseUser = (item, index) => {
    const { id, relationId, userName, birthday, sex } = item
    const { limitLinkManId } = this.state
    // this.setState({...item, index})
    if(limitLinkManId !== -1 && limitLinkManId === id){ //有值时，则只能选择匹配的
      this.setState({...item, index})
    } else { //为 -1时，作下一步限定
      let { barcode } = getSetssion('barcode')
      this.trackPointSampleBindInput({ ...item, ...barcode }) // 埋点
      API.valiDation({ barcode: barcode, linkmanId: id }).then(res => {
        const { msg, code } = res
        if (code !== 0) {
          Toast.info(msg, 2)
        } else {
          this.setState({...item, index})
        }
      })
    }
  }

  gotoNextPage = () => {
    const { limitLinkManId } = this.state
    if(limitLinkManId !== -1){
      this.linktoProtocol();
    }else{
      this.setState({
        showTips: true
      })
    }
  }

  toUnlock = () => {
    this.linktoProtocol();
  }

  cancelTips = () => {
    this.setState({
      showTips: false
    })
  }

  linktoProtocol = () => {
    const { id, relationId, userName, birthday, sex } = this.state
    this.props.history.push({
      pathname: '/protocol',
      state: {
        linkManId: id,
        birthday,
        sex,
        relationId,
        bindUserName: userName
      }
    })
  }

  justUrl = data => {
    const { id, relationId, userName, birthday, sex } = data
    const { history } = this.props
    if (relationId) {
      // 用户第一次进来
      let { barcode } = getSetssion('barcode')
      this.trackPointSampleBindInput({ ...data, ...barcode }) // 埋点
      API.valiDation({ barcode: barcode, linkmanId: id }).then(res => {
        const { msg, code } = res
        if (code !== 0) {
          Toast.info(msg, 2)
        } else {
          history.push({
            pathname: '/protocol',
            state: {
              linkManId: id,
              birthday,
              sex,
              relationId,
              bindUserName: userName
            }
          })
        }
      })
    } else {
      history.push(`/bind-user?linkManId=${id}`)
    }
  }

  // 变更选中状态
  handelChange = (data, index) => {
    const { id } = data
    let { barcode } = getParams()
    API.valiDation({ barcode: barcode, linkmanId: id }).then(res => {
      const { msg, code } = res
      if (code !== 0) {
        Toast.info(msg, 2)
      } else {
        this.setState({ index })
      }
    })
  }

  //  更新检测者关系
  handleSubmit = () => {
    const { list, index } = this.state
    let { barcode, url, ids } = getParams()
    if (url && ids) {
      url += `?linkManId=${list[index].id}`
    }
    if (index < 0) {
      Toast.info('请选择检测者')
    }
    const item = list[index]
    const data = {
      ...item,
      operateType: 2,
      barCode: barcode
    }
    API.updateBindLinkMan(data).then(res => {
      const { code } = res
      if (!code) {
        let query = {
          linkManId: data.id,
          userName: data.userName
        }
        let _url = url || '/'
        if (barcode) {
          API.confirmGender({ barCode: barcode }).then(response => {
            Toast.success(`已为您切换成${data.userName}`, 1.5, () => {
              this.saveLastUserLindManId(query, _url)
            })
          })
          return
        }
        Toast.success(`已为您切换成${data.userName}`, 1.5, () => {
          this.saveLastUserLindManId(query, _url)
        })
      }
    })
  }

  /**
   * 保存切换关系人linkManId
   */
  saveLastUserLindManId = (obj = {}, url) => {
    const { upLindManId, history } = this.props
    const { linkManId = '' } = obj
    linkManId &&
      API.saveLastUserLindManId({ linkManId, noloading: 1 }).then(res => {
        const { code } = res
        if (!code) {
          upLindManId(obj)
          history.push(url)
        }
      })
  }

  handleToggle = (name) => {
    const bool = this.state[name]
    this.setState({
      [name]: !bool
    })
  }

  render() {
    const { list, index, addNewFlag, showTips } = this.state
    const { history } = this.props
    //  barcode为采样器页面带过来的，跟绑定逻辑前端缓存的不是一个
    const { barcode } = getParams()
    return (
      <Page title='选择检测者'>
        <div className={styles.p20}>
          {barcode ? '' : <Setp number={1} />}
          <div className={`${styles.userBox} ${barcode ? '' : styles.pt120}`}>
            {list.map((item, i) => (
              <div className={`${styles.userList} ${index === i ? styles.selectLi : ''}`} key={i}>
                <div className={`item ${styles.userInfo}`} onClick={() => {barcode ? this.handelChange(item, i) : this.chooseUser(item, i)}}>
                  <img src={`${bindOnly}userImg${item.headImgType}.png`} />
                  <b>{item.relationName || '关系'}</b>
                  <b>{item.userName || '名字'}</b>
                  {index === i && <img src={`${bindOnly}selected.png`} className={styles.toSelect} />}
                </div>
              </div>
            ))}
           {addNewFlag && 
            <div 
              className={styles.adduser}
              onClick={() => {history.push(`/bind-user${barcode ? '?barcode=' + barcode : '?msg=1'}`)}}>
                <img src={`${bindOnly}addnew.png`} />
                <span>新建检测者</span>
            </div>}
          </div>

          {barcode ? (
            <div className='foot' onClick={this.handleSubmit}>
              <button disabled={index === -1} className={`btn ${styles.foot} ${styles.bg}`}>
                提交修改
              </button>
            </div>
          ) : (
            <div className='foot' onClick={this.gotoNextPage}>
              <button disabled={index === -1} className={`btn ${styles.foot}`}>下一步</button>
            </div>
          )}
          <Modal
            handleToggle={() => { this.handleToggle('showTips') }}
            type
            // visible
            visible={showTips}
          >
            <div className={`${styles.scanModal} ${styles.tipsModal}`}>
              <h3>温馨提示</h3>
              <p>您是否同意授权「安我」使用该检测者的原始数据进行再次分析？</p>
              <p className={styles.fcc}>*同意，无需再次采样和回寄即可快速获得报告</p>
              <p className={styles.fcc}>*不同意，需使用新账号进行绑定</p>
              <div className={`flex ${styles.modalBtn}`}>
                <button onClick={this.cancelTips} className={`btn item ${styles.foot}`}>不同意</button>
                <span />
                <button onClick={this.toUnlock} className={`btn item ${styles.foot}`}>同意</button>
              </div>
            </div>
          </Modal>
        </div>
      </Page>
    )
  }
}

export default SelectUser