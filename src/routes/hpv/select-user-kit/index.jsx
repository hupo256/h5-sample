import React from 'react'
import { observer, inject } from 'mobx-react'
import fun from '@src/common/utils'
import ua from '@src/common/utils/ua'
import point from '@src/common/utils/point'
import samplingApi from '@src/common/api/samplingApi'
import homeApi from '@src/common/api/homeApi'
import { Toast } from 'antd-mobile'
import Page from '@src/components/page'
import Modal from '@src/components/modal'
import Setp from '../components/setp'
import images from './image'
import selected from '@static/bindOnly/selected.png'
import addnew from '@static/bindOnly/addnew.png'
import styles from '../binding'

const { allPointTrack } = point
const { setSetssion, getSetssion, getParams, setSession, getSession } = fun

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
    linkManType: NaN,
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
    this.touchBindingList()
  }

  touchBindingList = () => {
    const type = getParams().type || getSetssion('kitType')
    const bcode = getParams().barcode || getSetssion('barcode')
    this.setState({ kitType: type })

    const apitTag = !type ? 'listOptionalLinkMan' : 'listOptionalLinkManKit'
    const params = { barcode: bcode, noloading: 1 }
    !!type && Object.assign(params, { type })
    samplingApi[apitTag](params).then(res => {
      const { code, data } = res
      if (code) return
      this.setState({ ...data })
    })
  }

  chooseUser = (item, index) => {
    const barcode = getParams().barcode || getSetssion('barcode')
    const { id, relationId, userName, birthday, sex } = item
    const { kitType } = this.state

    this.trackPointSampleBindInput({ relationId, userName, birthday, sex, barcode }) // 埋点
    this.setState({ id, relationId, userName, birthday, sex, index }) // 先设置一下再说

    const apitTag = !kitType ? 'valiDation' : 'validationKit'
    const pName = !kitType ? 'linkmanId' : 'linkManId'
    const params = { barcode, [pName]: id }
    !!kitType && Object.assign(params, { type: kitType })

    samplingApi[apitTag](params).then(res => {
      const { msg, code, data } = res
      if (code) return Toast.info(msg, 2)
      if (data) {
        const { overrideFlag, forbiddenDesc, overrideProductNames, overrideProductIds } = data
        if (overrideFlag === 2) return Toast.info('overrideFlag')
        if (overrideFlag === 1) {
          this.setState({
            forbiddenDesc,
            replaceBomb: true,
            showTips: false
          })
          // 访问重复产品绑定提示弹窗	埋点
          this.trackPointBindProductRebindView({
            barcode,
            productId: overrideProductIds && overrideProductIds.join(','),
            productName: overrideProductNames && overrideProductNames.join(',')
          })
        }
      }

      // this.gotoNextPage(item.popFlag)
      const { limitLinkManId } = this.state
      if (limitLinkManId !== -1 || item.popFlag === 0) {
        this.linktoProtocol()
      } else {
        data && data.overrideFlag === 0 && this.setState({ showTips: true })
        !data && this.setState({ showTips: true })
      }
    })
  }

  linktoProtocol = () => {
    const { id, relationId, userName, birthday, sex } = this.state
    const barcode = getParams().barcode || getSetssion('barcode')
    const stateObj = {
      linkManId: id, birthday, sex, relationId, userName,
    }

    !!barcode && Object.assign(stateObj, { barcode })
    setSetssion('relationId', relationId)
    this.props.history.push({
      pathname: `/binding/protocol-kit`,
      state: stateObj
    })
  }

  // 变更选中状态
  handelChange = (data, index, barcode) => {
    const { kitType } = this.state
    const { id } = data
    const apitTag = !kitType ? 'valiDation' : 'validationKit'
    const pName = !kitType ? 'linkmanId' : 'linkManId'
    const params = { barcode, [pName]: id }
    !!kitType && Object.assign(params, { type: kitType })

    samplingApi[apitTag](params).then(res => {
      const { msg, code } = res
      if (code !== 0) {
        Toast.info(msg, 2)
      } else {
        this.setState({ index })
      }
    })
  }

  handleSubmit = () => {
    const { list, index } = this.state
    if (index < 0) return Toast.info('请选择检测者')

    const type = getParams().type || getSetssion('kitType')
    const bcode = getParams().barcode || getSetssion('barcode')
    const item = list[index]
    const apitTag = !type ? 'updateBindLinkMan' : 'updateBindLinkManKit'
    let dataParams = { ...item, operateType: 2, }

    !type && Object.assign(dataParams, { barCode: bcode, barcode: bcode })
    !!type && Object.assign(dataParams, { type: type }, { bcode, barcode: bcode })
    samplingApi[apitTag](dataParams).then(res => {
      const { code } = res
      if (code) return
      const url = '/mkt/sampling'
      const { id, userName } = dataParams
      const query = { linkManId: id, userName }
      if (getParams().barcode) {
        samplingApi.confirmGender({ barCode: bcode }).then(res => {
          this.todoUserLindManId(query, url)
        })
        return
      }
      this.todoUserLindManId(query, url)
    })
  }

  // 保存切换关系人linkManId
  todoUserLindManId = (obj = {}, url) => {
    const { linkManId = '', userName } = obj
    Toast.success(`已为您切换成${userName}`, 1.5, () => {
      const { kitType } = this.state
      const { user: { upLindManId } } = this.props
      homeApi.saveLastUserLindManId({ linkManId, noloading: 1 }).then(res => {
        const { code } = res
        if (code) return
        if (kitType !== 'INTESTINE_BIND') upLindManId(obj)
        window.location.href = origin + url
      })
    })
  }

  handleToggle = (name) => {
    const bool = this.state[name]
    this.setState({
      [name]: !bool,
      replaceBomb: false,
    })
  }

  cancelTips = () => {
    this.setState({
      showTips: false,
      replaceBomb: false,
    })
  }

  handleAddUser = (barcode) => {
    const { history } = this.props
    const { kitType, linkManType } = this.state
    const barTex = barcode ? '&barcode=' + barcode : ''
    const kitTex = kitType ? '&type=' + kitType : ''
    setSetssion('addNewFlag', 1)
    history.push(`/binding/bind-user-kit?linkManType=${linkManType}${barTex}${kitTex}`)
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
    const { barcode } = getParams() //  barcode为采样器页面带过来的
    return (
      <Page title='选择检测者'>
        <div className={styles.p20}>
          {barcode ? '' : <Setp number={1} />}
          <div className={`${styles.userBox} ${barcode ? '' : styles.pt120}`}>
            {list.map((item, i) => (
              <div className={`${styles.userList} ${index === i ? styles.selectLi : ''}`} key={i}>
                <div
                  className={`item ${styles.userInfo}`}
                  onClick={() => { barcode ? this.handelChange(item, i, barcode) : this.chooseUser(item, i) }}
                >
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

          {barcode && <div className='foot' onClick={this.handleSubmit}>
            <button disabled={index === -1} className={`btn ${styles.foot} ${styles.bg}`}>
              提交修改
            </button>
          </div>}

          <Modal
            handleToggle={() => { this.handleToggle('showTips') }}
            type
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
                <button onClick={this.linktoProtocol} className={`btn item ${styles.foot}`}>同意</button>
              </div>
            </div>
          </Modal>

          {replaceBomb && <div className={styles.bombCont}>
            <div className={styles.detailCont}>
              <p className={styles.detailTitle}>{forbiddenDesc}</p>
              <p className={styles.btnsCont}>
                <span className={styles.fitstBtns} onClick={this.handleGoToNewUser}>用新账号绑定</span>
                <span onClick={this.handleGoToBinding} className={styles.btn}>继续绑定</span>
              </p>
            </div>
          </div>
          }
        </div>
      </Page>
    )
  }
}

export default SelectUser
