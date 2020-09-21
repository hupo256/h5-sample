import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { API, point, fun } from '@src/common/app'
import { Toast } from 'antd-mobile'
import Page from '@src/components/page'
import Modal from '@src/components/modal'
import Setp from '../components/setp'
import images from '../image'
import selected from '@static/bindOnly/selected.png'
import addnew from '@static/bindOnly/addnew.png'
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
    kitType: '',
    replaceBomb: false,
    forbiddenDesc: '',
    linkManType: '',
    id: ''
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
  // 访问重复产品绑定提示弹窗	埋点
  trackPointBindProductRebindView(values) {
    let obj = {
      eventName: 'bind_product_rebind_view',
      pointParams: {
        barcode_id: values.barcode,
        product_id: values.productId,
        product_name: values.productName
      }
    }
    allPointTrack(obj)
  }
  // 重复产品绑定提示弹窗点击	埋点
  trackPointBindProductRebindGoto(name) {
    let obj = {
      eventName: 'bind_product_rebind_goto',
      pointParams: {
        Btn_name: name,
      }
    }
    allPointTrack(obj)
  }
  componentDidMount() {
    const { state } = this.props.location
    const { barcode, type } = getParams()
    state && state.data &&
      this.setState({
        kitType: state.type || type,
        list: state.data.list,
        addNewFlag: state.data.addNewFlag,
        limitLinkManId: state.data.limitLinkManId,
        linkManType: state.data.linkManType
      })

    barcode && this.touchBindingList(barcode, type)
  }

  touchBindingList = (bcode, kitType) => {
    API.listOptionalLinkManKit({ barcode: bcode, type: kitType }).then(res => {
      const { code, data } = res
      if (!code) {
        data.list && this.setState({
          list: data.list,
          addNewFlag: true,
          limitLinkManId: data.limitLinkManId,
          kitType,
          linkManType: data.linkManType
        })
      }
    })
  }

  chooseUser = (item, index) => {
    const { id, relationId, userName, birthday, sex } = item
    const { limitLinkManId, kitType } = this.state
    // this.setState({...item, index})
    if (limitLinkManId !== -1 && limitLinkManId === id) { // 有值时，则只能选择匹配的
      this.setState({ id, relationId, userName, birthday, sex, index }, () => this.gotoNextPage())
    } else { // 为 -1时，作下一步限定
      let { barcode } = getSetssion('barcode')
      this.trackPointSampleBindInput({ relationId, userName, birthday, sex, ...barcode }) // 埋点
      API.validationKit({ barcode: barcode, linkManId: id, type: kitType }).then(res => {
        const { msg, code, data } = res
        if (code !== 0) {
          Toast.info(msg, 2)
        } else {
          const { overrideFlag, forbiddenDesc, overrideProductNames, overrideProductIds } = data
          if (overrideFlag === 1) {
            this.setState({
              forbiddenDesc,
              replaceBomb: true,
              relationId, userName, birthday, sex,
              index,
              popFlag: item.popFlag,
              id
            })
            // 访问重复产品绑定提示弹窗	埋点
            this.trackPointBindProductRebindView({
              barcode,
              productId: overrideProductIds && overrideProductIds.join(','),
              productName: overrideProductNames && overrideProductNames.join(',')
            })
            return
          } else if (overrideFlag === 2) {
            return Toast.info('overrideFlag')
          }
          this.setState({ relationId, userName, birthday, sex, index, popFlag: item.popFlag, id }, () => this.gotoNextPage())

        }
      })
    }
  }

  gotoNextPage = () => {
    const { limitLinkManId, popFlag } = this.state
    if (limitLinkManId !== -1) {
      this.linktoProtocol()
    } else {
      if (popFlag === 0) {
        this.toUnlock()
        return
      }
      this.setState({
        showTips: true
      })
    }
  }

  toUnlock = () => {
    this.linktoProtocol()
  }

  cancelTips = () => {
    this.setState({
      showTips: false
    })
  }

  linktoProtocol = () => {
    const { id, relationId, userName, birthday, sex, kitType } = this.state
    let { barcode } = getSetssion('barcode')
    if (kitType) {
      this.props.history.push({
        pathname: '/binding/protocol-kit',
        state: {
          linkManId: id,
          birthday,
          sex,
          relationId,
          bindUserName: userName,
          type: kitType,
          barcode
        }
      })
    }
  }

  justUrl = data => {
    const { id, relationId, userName, birthday, sex } = data
    const { history } = this.props
    const { kitType } = this.state
    if (relationId) {
      // 用户第一次进来
      let { barcode } = getSetssion('barcode')
      this.trackPointSampleBindInput({ ...data, ...barcode }) // 埋点
      API.validationKit({ barcode: barcode, linkManId: id, type: kitType }).then(res => {
        const { msg, code, data } = res
        if (code !== 0) {
          Toast.info(msg, 2)
        } else {
          const { overrideFlag } = data
          console.log(overrideFlag)
          history.push({
            pathname: '/binding/protocol',
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
      history.push(`/binding/bind-user?linkManId=${id}`)
    }
  }

  // 变更选中状态
  handelChange = (data, index) => {
    const { kitType } = this.state
    const { id } = data
    let { barcode } = getParams()
    API.validationKit({ barcode: barcode, linkManId: id, type: kitType }).then(res => {
      const { msg, code, data } = res
      if (code !== 0) {
        Toast.info(msg, 2)
      } else {
        const { overrideFlag } = data
        console.log(overrideFlag)
        this.setState({ index })
      }
    })
  }

  //  更新检测者关系
  handleSubmit = () => {
    const { list, index } = this.state
    let { barcode, url, ids, type } = getParams()
    if (url && ids) {
      url += `?linkManId=${list[index].id}`
    }
    if (index < 0) {
      Toast.info('请选择检测者')
    }
    const item = list[index]
    let data = {
      ...item,
      operateType: 2,
      barcode: barcode
    }
    if (type) {
      data = {
        ...data,
        type
      }
      API.updateBindLinkManKit(data).then(res => {
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
    } else {
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
  }

  /**
   * 保存切换关系人linkManId
   */
  saveLastUserLindManId = (obj = {}, url) => {
    const { kitType } = this.state
    const { history, user: { upLindManId } } = this.props
    const { linkManId = '' } = obj
    linkManId &&
      API.saveLastUserLindManId({ linkManId, noloading: 1 }).then(res => {
        const { code } = res
        if (!code) {
          if (kitType !== 'INTESTINE_BIND') {
            upLindManId(obj)
          }
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
  handleAddUser = (barcode) => {
    const { history } = this.props
    const { kitType, linkManType } = this.state
    if (barcode) {
      history.push(`/binding/bind-user-kit?barcode=${barcode}&type=${kitType}&linkManType=${linkManType}`)
    } else {
      history.push(`/binding/bind-user-kit?msg=1&type=${kitType}&linkManType=${linkManType}`)
    }
  }
  handleGoToBinding = () => {
    this.trackPointBindProductRebindGoto('continue')
    this.setState({
      replaceBomb: false
    }, () => {
      this.linktoProtocol()
    })
  }
  handleGoToNewUser = () => {
    this.trackPointBindProductRebindGoto('new_account')
    this.props.history.push(`/binding/bindNFrenid`)
  }
  render() {
    const { list, index, addNewFlag, showTips, replaceBomb, forbiddenDesc } = this.state
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
                <div className={`item ${styles.userInfo}`} onClick={() => { barcode ? this.handelChange(item, i) : this.chooseUser(item, i) }}>
                  <img src={images[`userImg${item.headImgType}`]} />
                  <b>{item.relationName || '关系'}</b>
                  <b>{item.userName || '名字'}</b>
                  {index === i && barcode && <img src={selected} className={styles.toSelect} />}
                </div>
              </div>
            ))}
            {addNewFlag &&
              <div
                className={styles.adduser}
                onClick={() => this.handleAddUser(barcode)}>
                <img src={addnew} />
                <span>新建检测者</span>
              </div>}
          </div>

          {barcode && (
            <div className='foot' onClick={this.handleSubmit}>
              <button disabled={index === -1} className={`btn ${styles.foot} ${styles.bg}`}>
                提交修改
              </button>
            </div>
            // ) : (
            //     <div className='foot' onClick={this.gotoNextPage}>
            //       <button disabled={index === -1} className={`btn ${styles.foot}`}>下一步</button>
            //     </div>
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
        {
          replaceBomb
            ? <div className={styles.bombCont}>
              <div className={styles.detailCont}>
                <p className={styles.detailTitle}>{forbiddenDesc}</p>
                {/* <p className={styles.detailDesc}>
                  <img className={styles.bindingImg} src={images.bindingTip} alt='' />
                  若商品有报告内返卡，返卡数据将统一迁移到新报告中。
                </p> */}
                <p className={styles.btnsCont}>
                  <span className={styles.fitstBtns} onClick={this.handleGoToNewUser}>用新账号绑定</span>
                  <span onClick={this.handleGoToBinding} className={styles.btn}>继续绑定</span>
                </p>
              </div>
            </div>
            : ''
        }
      </Page>
    )
  }
}

export default SelectUser
