import React from 'react'
import { Toast } from 'antd-mobile'
import propTypes from 'prop-types'
import wx from 'weixin-js-sdk'
import Page from '@src/components/page'
import Modal from '@src/components/modal/index'
import Setp from '../components/setp'
import fun from '@src/common/utils/index'
import ua from '@src/common/utils/ua'
import reg from '@src/common/utils/regExp'
import point from '@src/common/utils/point'
import userApi from '@src/common/api/userApi'
import samplingApi from '@src/common/api/samplingApi'
import integrationApi from '@src/common/api/integrationApi'
import img from '@static/sl.png'
import errorbg from '@static/hpv/errorbg.png'
import andall from '@src/common/utils/andall-sdk'
import styles from '../binding'

const { setSetssion, getSetssion, getParams, isTheAppVersion, fixScroll } = fun
const { allPointTrack } = point
const { isIos } = ua

class Binding extends React.Component {
  state = {
    barcode: '',
    scanSuccees: false,
    isRepeat: false,
    entry: false,
    scan: false,
    orderInput: '',
    viewJd: false,
    jdAcountInput: '',
    repeatInfo: {},
    errorCode: false,
    tipsTit: '',
    pointTip: '', // 积分提示
  }
  // 埋点记录访问绑定页面
  trackPointSampleBindView() {
    let obj = {
      eventName: 'sample_bind_goto',
      pointParams: {}
    }
    allPointTrack(obj)
  }
  // 埋点记录识别样本
  trackPointSampleBindIdentify(bindType) {
    let obj = {
      eventName: 'sample_bind_identify',
      pointParams: {
        sample_bind_type: bindType
      }
    }
    allPointTrack(obj)
  }
  /**
   * 判断是否带有渠道信息
   * 有就请求授权接口，有授权信息就展示授权进度
   */
  componentDidMount() {
    this.getPointTip()
    this.trackPointSampleBindView()
    const { search } = window.location
    setSetssion('searchUrl', search || '')

    const { barcode, barCode, channelCode, source, medium, form } = getParams()
    const infoPara = { noloading: 1 }
    ua.isAndall() && Object.assign(infoPara, { clientType: 'app' })
    userApi.myInfo(infoPara).then(res => {
      const { code, data } = res
      if (!code && +data.checkMobileFlag === 2) {
        setSetssion('isAuthorized', { isAuthorized: 0 })
        if (!(channelCode && source && medium)) return
        samplingApi.validIsAuthorized({ noloading: 1, channelCode, source, medium }).then(res => {
          res.code || setSetssion('isAuthorized', { isAuthorized: res.data })
        })
      }
    })

    const bcode = barcode || barCode
    if (!bcode) return
    this.touchCollectorType(bcode)
  }

  // 获取产品类型
  touchCollectorType = (bcode) => {
    samplingApi.checkCollectorType({ barcode: bcode, noloading: 1 }).then(res => {
      const { code, data, msg } = res
      if (code) return this.setState({ scan: true, tipsTit: msg, entry: false })

      // data.type = 'INTESTINE_BIND'
      const { type, collectorId } = data
      this.gotoColletorUser(bcode, data.type)
      setSetssion('barcode', bcode)
      setSetssion('kitType', type)
      setSetssion('sampling', [collectorId]) // 存到storage里，发货时会用到
    })
  }

  // 获取barcode相关信息
  getBarcodeInfo = (bcode, input) => {
    if (!bcode || bcode.length !== 14) return this.setState({ errorCode: true })
    this.touchCollectorType(bcode)

    //  手动点击打开输入barcode埋点
    this.trackPointSampleBindIdentify(input ? 'input' : 'scan')
    input &&
      window._paq.push([
        'trackEvent', 'bind_scanModal_click',
        'bind_scanCode_click', `barcode=${bcode}`
      ])
  }

  // type 标产品的种类
  // KIT_BIND 盒子  INTESTINE_BIND 安小软  HPV_BIND HPV  null 为默认
  gotoColletorUser = (bcode, type) => {
    const apitTag = !type ? 'preBindCollectorUser' : 'preBindCollectorUserKit'
    const nameTag = !type ? 'barCode' : 'barcode'
    const params = { [nameTag]: bcode, noloading: 1 }

    !!type && Object.assign(params, { type })
    samplingApi[apitTag](params).then(res => {
      const { code, data } = res
      this.setState({ entry: false, scan: false })
      code || this.collectorUserWithOutCode(bcode, data)
      code && this.collectorUserWithCode(res)
    })
  }

  collectorUserWithOutCode = (bcode, data) => { // 扫码成功
    const { form } = getParams()
    const bindOnly = form === 'bindOnly'
    if (!bindOnly) { // 从唯一绑定过来的就不再跳转了
      const { limitType, limitDesc } = data
      if (limitType === 3) return Toast.info(`重采样本仅支持绑定原检测者 (${limitDesc})`)
      if (limitType === 2) {
        window.history.replaceState({}, '', `/mkt/binding/bindOnly?barcode=${bcode}`)
        window.location.reload()
        return
      }
    }

    this.setState({
      scanSuccees: true,
      repeatInfo: data,
    })

    this.setBarcode(bcode) // code先存进来
    this.touchBindingList() // 获取绑定人关系
  }

  collectorUserWithCode = (res) => { // 扫码失败
    const { code, data, msg } = res
    this.setState({ barcode: '' })
    switch (code) {
    case 501003:
      this.setState({
        isRepeat: true,
        repeatInfo: data,
        tipsTit: '您已完成绑定，不能重复绑定'
      })
      break
    case 800004:
      Toast.fail('该类型采集器仅限新户使用', 4)
      break
    case 2023:
      this.setState({ scan: true, tipsTit: msg })
      break
    default:
      this.setState({ scan: true, tipsTit: '采样器无法使用' })
    }
  }

  touchBindingList = () => {
    const type = getParams().type || getSetssion('kitType')
    const bcode = getParams().barcode || getSetssion('barcode')

    const apitTag = !type ? 'listOptionalLinkMan' : 'listOptionalLinkManKit'
    const params = { barcode: bcode, noloading: 1 }
    !!type && Object.assign(params, { type })
    samplingApi[apitTag](params).then(res => {
      const { code, data } = res
      if (code) return
      this.setState({ linkManType: data.linkManType })
    })
  }

  getPointTip = () => {
    integrationApi.getPointTip({ position: 4, noloading: 1 }).then(res => {
      this.setState({ pointTip: res.data && res.data.tip })
    })
  }

  handleSubmit = (isNeedNo, isJdInput, barcode) => {
    const { jdAcountInput, orderInput } = this.state
    console.log(isNeedNo, jdAcountInput, orderInput)
    isJdInput && setSetssion('JDACOUNT', { jdAccountNum: jdAcountInput })
    isNeedNo && setSetssion('ORDERINPUT', { thirdPartyOrderNo: orderInput })

    if (orderInput !== '') {
      const params = {
        barcode,
        thirdPartyOrderNo: orderInput
      }
      samplingApi.validateThirdOrderNo(params).then(res => {
        const { code, msg } = res
        code && Toast.fail(msg, 2)
        code || this.gotoNextStep()
      })
      return
    }

    // return
    this.gotoNextStep()
  }

  gotoNextStep = () => {
    const { history } = this.props
    const { repeatInfo: { hasLinkManFlag }, linkManType } = this.state
    const nextUrl = hasLinkManFlag ? '/binding/select-user-kit' : `/binding/bind-user-kit?linkManType=${linkManType}`
    !hasLinkManFlag && setSetssion('addNewFlag', 1)
    history.push(nextUrl)
  }

  // 弹窗显示隐藏
  handleToggle = (name, empty) => {
    if (name === 'entry') {
      empty && this.setState({ barcode: '' })
      window._paq.push(['trackEvent', 'bind_scanCode_error', 'bind_scanCode_click'])
    }
    this.setState({ [name]: !this.state[name] })
  }

  // 切换扫码
  backToApp = (name) => {
    this.handleScan()
    this.setState({ [name]: !this.state[name] })
  }

  // 扫一扫
  handleScan = () => {
    if (isTheAppVersion('1.7.1')) {
      andall.invoke('back')
      return
    }

    this.setState({ errorCode: false, scan: false })
    if (ua.isAndall()) {
      andall.invoke('scanQRCode', {}, res => {
        this.getBarcodeInfo(res.result.qr_code)
      })
    } else {
      wx.scanQRCode({
        needResult: 1,
        success: res => {
          const bcode = res.resultStr.split(',')[1] || res.resultStr.split(',')[0]
          this.getBarcodeInfo(bcode)
        },
        error: res => {
          if (res.errMsg.indexOf('function_not_exist') > 0) {
            alert('版本过低请升级')
          }
        }
      })
    }
  }

  handleTel = () => {
    window.location.href = `tel:400-682-2288`
  }
  onJdAcountChange = (e) => {
    this.setState({
      jdAcountInput: e.target.value.replace(/\s/g, '')
    })
  }
  orderChange = (e) => {
    const val = e.target.value
    this.setState({
      orderInput: val.replace(/\s/g, ''),
    })
  }
  setBarcode = (code) => {
    this.setState({ barcode: code })
  }

  render() {
    const { barcode, scan, entry, isRepeat, errorCode, scanSuccees, repeatInfo,
      viewJd, jdAcountInput, orderInput, tipsTit } = this.state
    const { productName = null, productNames = [], userName = '', channelName = '', orderType, needOrderNo } = repeatInfo
    const isNeedOrder = needOrderNo === '1'
    const prodNameArr = (productName || productName === '') ? [productName] : productNames
    return (
      <Page title='绑定采样器'>
        <div className={styles.pt}>
          <Setp number={0} />
          <div className={`pt50 ${styles.pd15} `}>
            {!isTheAppVersion('1.7.1') && <React.Fragment>
              <div className={`flex ${styles.title} ${styles.m10}`}>
                <h2 className={`item ${styles.bindTit}`}>绑定采样器</h2>
                {!scanSuccees && <span onClick={() => { this.handleToggle('entry', 1) }}>扫码有问题</span>}
              </div>

              {!scanSuccees &&
                <div className={`imgCenter ${styles.scanBox}`}>
                  <div><span onClick={this.handleScan} /> <p>点击扫码绑定</p></div>
                </div>
              }
            </React.Fragment>
            }

            {scanSuccees &&
              <div className={styles.scanResult}>
                <div className={styles.scanResult1}>
                  <div className={styles.lineBox}>
                    <span className={styles.span}>识别成功</span>
                    <p>样本号：{barcode}</p>
                  </div>
                  <p className={styles.productName}>产品名称</p>
                  <span className={styles.productCont22}>
                    {prodNameArr.length > 0 && prodNameArr.map((item, ind) =>
                      <em key={ind} className={styles.productItem}>{item}</em>
                    )}
                  </span>
                </div>
              </div>
            }

            {isTheAppVersion('1.7.1') && tipsTit &&
              <div className={styles.errorbox}>
                <img src={errorbg} alt='' />
                <p>{tipsTit}</p>
              </div>
            }

            <Modal
              handleToggle={() => { this.handleToggle('isRepeat') }}
              closeFun={() => { this.backToApp('isRepeat') }}
              type
              visible={isRepeat}>
              <div className={styles.scanModal}>
                <h3>{tipsTit}</h3>
                <div className={styles.pt17}>检测人：{userName}</div>
                <div>如需修改信息，<a href='tel:400-682-2288'>请联系客服</a></div>
                <button onClick={() => { this.backToApp('isRepeat') }}
                  className={`btn mt30 ${styles.foot}`}>我知道了</button>
              </div>
            </Modal>

            <Modal
              handleToggle={() => { this.handleToggle('scan') }}
              closeFun={() => { this.backToApp('scan') }}
              type
              visible={scan}>
              <div className={styles.scanModal}>
                <h3>{tipsTit}</h3>
                <div className={`flex ${styles.modalBtn}`}>
                  <button onClick={this.handleScan} className={`btn item ${styles.foot}`}>重新扫码</button>
                  <span />
                  <button className={`btn item ${styles.foot} ${styles.footTel}`} onClick={this.handleTel}>联系客服</button>
                </div>
              </div>
            </Modal>

            <Modal
              handleToggle={() => { this.handleToggle('entry') }}
              type
              visible={entry}>
              <div className={styles.scanModal}>
                <h3>试试手动输入吧</h3>
                <input value={barcode} type='text' placeholder='输入条形码下方的14位编号'
                  onChange={e => this.setBarcode(e.target.value.replace(reg.space, ''))}
                />
                <button
                  disabled={barcode.length !== 14}
                  onClick={() => this.getBarcodeInfo(barcode, 1)}
                  className={`btn ${styles.foot}`}>
                  确认
                </button>
              </div>
            </Modal>

            {!!orderType &&
              <div className={styles.jdContent}>
                <div className={styles.jdHeader}>
                  <span className={styles.jdHeaderTitle}>填京东用户名，领京东E卡</span>
                  <span className={styles.jdHeaderHelp} onClick={() => { this.handleToggle('viewJd') }}>
                    如何查看京东账号</span>
                </div>
                <div className={styles.jdAcountInput}>
                  <input
                    placeholder='请填写京东用户名'
                    onChange={this.onJdAcountChange}
                    onBlur={() => { isIos() && window.scrollBy(0, fixScroll().top) }}
                  />
                </div>
                <div className={styles.qaHelp}>如有疑问，联系客服 400-682-2288</div>
              </div>
            }

            {isNeedOrder &&
              <div className={styles.jdContent}>
                <div className={styles.jdHeader}>
                  <span className={styles.jdHeaderTitle}>{channelName}订单号</span>
                </div>
                <div className={styles.jdAcountInput}>
                  <input placeholder={`${channelName}订单详情里可复制订单号`} onChange={this.orderChange} />
                </div>
                <div className={styles.qaHelp}>如有疑问，咨询现场服务人员或联系客服</div>
              </div>
            }
          </div>

          <Modal
            handleToggle={() => { this.handleToggle('viewJd') }}
            type
            visible={viewJd}>
            <div className={styles.jdModal}>
              <div className={styles.jdTipTitle}>登录京东APP，点击“我的”菜单 右上角“设置”查看您的京东用户名</div>
              <div className={styles.jdTipPic} />
            </div>
          </Modal>

          <Modal
            handleToggle={() => { this.handleToggle('errorCode') }}
            type
            visible={errorCode}>
            <div className={styles.errorBox}>
              <h3>请重新扫描</h3>
              <p>正确的采样器条码如下</p>
              <img src={img} />
              <button onClick={this.handleScan} className={`btn item ${styles.foot}`}>重新扫码</button>
            </div>
          </Modal>

          {
            this.state.pointTip && isTheAppVersion('1.6.9')
              ? <p className={styles.integration}>{this.state.pointTip}</p>
              : ''
          }

          <div className={styles.bottomBtn} onClick={() => this.handleSubmit(!!orderType, isNeedOrder, barcode)} >
            <button
              disabled={barcode.length !== 14 || (!!orderType && jdAcountInput === '') || isNeedOrder && orderInput === ''}
              className={`btn ${styles.foot}`}
            >
              下一步
            </button>
          </div>
        </div>
      </Page >
    )
  }
}
Binding.propTypes = {
  history: propTypes.object.isRequired
}

export default Binding
