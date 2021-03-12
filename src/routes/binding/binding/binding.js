import React from 'react'
import { Toast } from 'antd-mobile'
import propTypes from 'prop-types'
import wx from 'weixin-js-sdk'
import Page from '@src/components/page'
import Modal from '@src/components/modal'
import Setp from '../components/setp'
import img from '@static/sl.png'
import { API, fun, reg, point, ua } from '@src/common/app'
import styles from '../binding'
import andall from '@src/common/utils/andall-sdk'
import cn from 'classnames'

const { setSetssion, getParams, isTheAppVersion } = fun
const { allPointTrack } = point
class Binding extends React.Component {
  state = {
    adult: true,
    children: true,
    result: false,
    repeat: false,
    entry: false,
    scan: false,
    isShowJdInput: false,
    needOrderNo: false,
    channelName: false,
    orderInput: '',
    nextBtnUse: false,
    viewJd: false,
    jdAcountInput: '',
    barCode: '',
    inputBarCode: '',
    repeatInfo: {},
    data: {},
    bool: true,
    index: 0,
    error: false,
    tit: ['儿童版', '成人版'],
    isAndall: ua.isAndall(),
    isKitBarcode: false,
    isKitType: '',
    kitProductNames: [],
    pointTip:'', // 积分提示
    APPVersion:'1.6.9'
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
    andall.on('setManualQR', () => {
      this.setState({ entry: true })
      window.scroll(0, window.scrollY)
    })
    const { search } = window.location
    setSetssion('searchUrl', search || '')
    const params = getParams()
    // Toast.loading('加载中...', 20)
    API.myInfo({ noloading: 1, clientType: `${ua.isAndall() ? 'app' : ''}` }).then(res => {
      const { code, data } = res
      if (!code) {
        if (+data.checkMobileFlag === 2) {
          if (params.channelCode && params.source && params.medium) {
            API.validIsAuthorized({ noloading: 1, ...params }).then(response => {
              Toast.hide()
              if (!response.code) {
                setSetssion('isAuthorized', { isAuthorized: response.data })
                this.setState({ bool: true })
              }
            })
            return
          }
          Toast.hide()
          setSetssion('isAuthorized', { isAuthorized: 0 })
          this.setState({ bool: true })
          return
        }
        ua.isAndall() && andall.invoke('login', {}, function (res) {
          localStorage.setItem('token', res.result.token)
          window.location.reload()
        })
      }
    })
    this.trackPointSampleBindView()
    const { barCode, channelCode, type } = getParams()
    if (barCode) {
      if (type) {
        API.preBindCollectorUserKit({ barcode: barCode, type }).then(res => {
          const { code, data } = res
          console.log(data)
          this.setState({ entry: false, scan: false })
          window.scroll(0, window.scrollY)
          if (!code) {
            this.setState({
              result: true,
              needOrderNo: data.needOrderNo === '1',
              channelName: data.needOrderNo === '1' ? data.channelName : '',
              isShowJdInput: !!((data.orderType || data.orderType === 'JD')),
              repeatInfo: data,
              barCode: barCode,
              kitProductNames: data.productNames,
              isKitBarcode: true
            }, () => {
              setSetssion('barcode', { barcode: this.state.barCode })
            })
          } else {
            Toast.info(res.msg, 2)
          }
        })
      } else {
        API.preBindCollectorUser({ nomsg: 1, barCode }).then(res => {
          const { code, data } = res
          this.setState({ entry: false, scan: false })
          window.scroll(0, window.scrollY)
          if (!code) {
            this.setState({
              result: true,
              needOrderNo: data.needOrderNo === '1',
              channelName: data.needOrderNo === '1' ? data.channelName : '',
              isShowJdInput: !!((data.orderType || data.orderType === 'JD')),
              repeatInfo: data,
              barCode: barCode
            }, () => {
              setSetssion('barcode', { barcode: this.state.barCode })
            })
          } else {
            Toast.info(res.msg, 2)
          }
        })
      }
    }
  }
  getPointTip=() => {
    API.getPointTip({ position:4, noloading:1 }).then(res => {
      console.log(res.data.tip)
      this.setState({ pointTip:res.data.tip })
    })
  }
  handleSubmit = () => {
    const { barCode, jdAcountInput, needOrderNo, orderInput, isShowJdInput, isKitBarcode } = this.state
    if (isKitBarcode) {
      this.touchBindingList(barCode, isKitBarcode)
      return
    }
    if (barCode.length !== 14 || (isShowJdInput && jdAcountInput === '')) return
    if (barCode.length !== 14 || (needOrderNo && orderInput === '')) { return }
    if (isShowJdInput) {
      setSetssion('JDACOUNT', { jdAccountNum: jdAcountInput })
    } else { setSetssion('JDACOUNT', { jdAccountNum: '' }) }
    if (needOrderNo) {
      setSetssion('ORDERINPUT', { thirdPartyOrderNo: orderInput })
    } else {
      setSetssion('ORDERINPUT', { thirdPartyOrderNo: '' })
    }

    if (needOrderNo && orderInput !== '') {
      let params = {
        barcode: barCode,
        thirdPartyOrderNo: orderInput
      }
      API.validateThirdOrderNo(params).then(res => {
        const { code, msg } = res
        if (!code) {
          this.touchBindingList(barCode)
        } else {
          Toast.fail(msg, 2)
        }
      })
    } else {
      this.touchBindingList(barCode)
    }
  }

  touchBindingList = (bcode, isKitBarcode) => {
    const { history } = this.props
    const { type } = getParams()
    const _type = this.state.isKitType || getParams().type
    this.hadleStop()
    if (_type) {
      API.listOptionalLinkManKit({ barcode: bcode, type: _type }).then(res => {
        const { code, data, msg } = res
        if (!code) {
          data.list ? history.push({
            pathname: `/binding/select-user-kit`,
            state: { data, type: type || _type }
          }) : history.push(`/binding/bind-user-kit?type=${type || _type}`)
        }
      })
    } else {
      API.listOptionalLinkMan({ barcode: bcode }).then(res => {
        const { code, data } = res
        if (!code) {
          data.list ? history.push({
            pathname: '/binding/select-user',
            state: { data }
          }) : history.push('/binding/bind-user')
        }
      })
    }
  }

  // 暂停视频
  hadleStop = (show) => {
    const el = document.getElementById(show)
    const bool = this.state[show]
    if (show === 'adult') {
      document.getElementById('children').pause()
      this.setState({ children: true })
    }
    if (show === 'children') {
      document.getElementById('adult').pause()
      this.setState({ adult: true })
    }
    if (!show) {
      document.getElementById('adult').pause()
      document.getElementById('children').pause()
      this.setState({ adult: true, children: true })
      return
    }
    bool ? el.play() : el.pause()
    this.setState({
      [show]: !bool
    })
  }

  // 弹窗显示隐藏

  handleToggle = (name) => {
    const bool = this.state[name]
    window.scroll(0, window.scrollY)
    if (name === 'entry') {
      this.hadleStop()
      this.setState({
        inputBarCode: ''
      })
      window._paq.push([
        'trackEvent',
        'bind_scanCode_error',
        'bind_scanCode_click'
      ])
    }
    this.setState({
      [name]: !bool
    })
  }

  checkBindLimit = (barcode) => {
    API.checkCollectorBindLimit({ barcode }).then(res => {
      const { code, data } = res
      if (!code) {
        this.setState({ entry: false })
        return data
      } else {
        Toast.fail(res.msg, 2)
      }
    })
  }

  // 获取barCode信息
  getBarcodeInfo = (type) => {
    let { barCode, inputBarCode } = this.state
    barCode && (barCode = barCode.replace(reg.space, ''))
    inputBarCode && (inputBarCode = inputBarCode.replace(reg.space, ''))
    barCode = type ? inputBarCode : barCode
    if (barCode.length !== 14) {
      this.setState({ error: true })
      return
    }
    //  手动点击打开输入barcode埋点
    if (type) {
      window._paq.push([
        'trackEvent',
        'bind_scanModal_click',
        'bind_scanCode_click',
        `barcode=${barCode}`
      ])
    }
    this.trackPointSampleBindIdentify(type ? 'input' : 'scan')

    this.touchColletorUser(barCode, type)
  }

  touchColletorUser = (barCode, type1) => {
    const { inputBarCode } = this.state
    API.checkCollectorType({ barcode: barCode }).then((res) => {
      const { data, msg } = res
      if (!data) return Toast.info(msg)
      const { newFlag, type } = data
      if (newFlag) {
        this.setState({
          isKitBarcode: true,
          isKitType: type
        })
        API.preBindCollectorUserKit({ barcode: barCode, type }).then(res => {
          const { code, data } = res
          this.setState({ entry: false, scan: false })
          window.scroll(0, window.scrollY)
          if (!code) {
            const { limitType, limitDesc } = data
            if (limitType === 3) {
              Toast.info(`重采样本仅支持绑定原检测者 (${limitDesc})`)
              return
            } else if (limitType === 2) {
              this.props.history.push(`/binding/bindOnly?barCode=${barCode}&type=${type}`)
              return
            }

            this.setState({
              result: true,
              needOrderNo: data.needOrderNo === '1',
              channelName: data.needOrderNo === '1' ? data.channelName : '',
              isShowJdInput: !!((data.orderType || data.orderType === 'JD')),
              repeatInfo: data,
              barCode: type1 ? inputBarCode : barCode,
              kitProductNames: data.productNames
            }, () => {
              setSetssion('barcode', { barcode: type1 ? inputBarCode : barCode })
              type1 && this.setState({ inputBarCode: '' })
            })
          } else {
            this.setState({ barCode: '' })
            if (+code === 501003) {
              this.setState({
                repeat: true,
                data
              })
            } else if (+code === 800001) {
              let channelCode = res.data
              this.props.history.push(`/sale-select?channelCode=${channelCode || ''}&barCode=${barCode}`)
            } else if (+code === 800004) {
              Toast.fail('该类型采集器仅限新户使用', 4)
            } else {
              this.setState({
                scan: true
              })
            }
          }
        })
      } else {
        API.preBindCollectorUser({ nomsg: 1, barCode }).then(res => {
          const { code, data } = res
          this.setState({ entry: false, scan: false })
          window.scroll(0, window.scrollY)
          if (!code) {
            const { limitType, limitDesc } = data
            if (limitType === 3) {
              Toast.info(`重采样本仅支持绑定原检测者 (${limitDesc})`)
              return
            } else if (limitType === 2) {
              this.props.history.push(`/binding/bindOnly?barCode=${barCode}`)
              return
            }

            this.setState({
              result: true,
              needOrderNo: data.needOrderNo === '1',
              channelName: data.needOrderNo === '1' ? data.channelName : '',
              isShowJdInput: !!((data.orderType || data.orderType === 'JD')),
              repeatInfo: data,
              barCode: type1 ? inputBarCode : barCode
            }, () => {
              setSetssion('barcode', { barcode: type1 ? inputBarCode : barCode })
              type1 && this.setState({ inputBarCode: '' })
            })
          } else {
            this.setState({ barCode: '' })
            if (+code === 501003) {
              this.setState({
                repeat: true,
                data
              })
            } else if (+code === 800001) {
              let channelCode = res.data
              this.props.history.push(`/sale-select?channelCode=${channelCode || ''}&barCode=${barCode}`)
            } else if (+code === 800004) {
              Toast.fail('该类型采集器仅限新户使用', 4)
            } else {
              this.setState({
                scan: true
              })
            }
          }
        })
      }
    })
  }

  // 扫一扫
  handleScan = () => {
    const _this = this
    this.hadleStop()
    this.setState({ error: false })
    if (ua.isAndall()) {
      console.log('h5调用原生摄像头')
      andall.invoke('scanQRCode', {}, function (res) {
        console.log('原生数据返回', res)
        // if (ua.isAndroid()) res = JSON.parse(res)
        _this.setState({ barCode: res.result.qr_code }, () => {
          _this.getBarcodeInfo()
        })
      })
    } else {
      wx.scanQRCode({
        needResult: 1,
        success: function (res) {
          const barCode = res.resultStr.split(',')[1] || res.resultStr.split(',')[0]
          _this.setState({ barCode }, () => {
            _this.getBarcodeInfo()
          })
        },
        fail: function (res) {
        },
        error: function (res) {
          if (res.errMsg.indexOf('function_not_exist') > 0) {
            alert('版本过低请升级')
          }
        }
      })
    }
  }
  onJdAcountChange = (e) => {
    this.setState({
      jdAcountInput: e.target.value.replace(/\s/g, '')
    })
  }
  onBlur = () => {
    window.scroll(0, window.scrollY)
  }
  componentWillUpdate() {
    window.scroll(0, window.scrollY)
  }
  componentWillUnmount() {
    window.scroll(0, window.scrollY)
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
    const { repeatInfo: { needOrderNoLength } } = this.state
    const val = e.target.value
    this.setState({
      orderInput: val.replace(/\s/g, ''),
      nextBtnUse: val.length === (+needOrderNoLength)
    })
  }
  render() {
    const {
      children, barCode, scan, entry, repeat, inputBarCode, error, isAndall, nextBtnUse,
      result, bool, adult, repeatInfo, data, viewJd, isShowJdInput, jdAcountInput, needOrderNo, channelName, orderInput, isKitBarcode, kitProductNames
    } = this.state
    return (
      <Page title='绑定采样器'>
        <div style={{ height: entry ? '100vh' : 'auto' }} className={cn('sss', isAndall ? styles.antall : '')}>
          {
            bool ? (
              <div className={`pd55 ${styles.pt}`}>
                <Setp number={0} />
                <div className='pt50'>
                  <div className={`border ${styles.pd15} ${styles.borderBom}`}>
                    {/* <h2 className={`${styles.m10} ${styles.bindTit}`}>观看采样指导视频</h2> */}
                    <h2 className={`${styles.m10} ${styles.bindTit}`}>观看唾液采样视频<span>（肠道检测采样方法见采样器包装）</span></h2>
                    <div className={`flex ${styles.videoBox}`}>
                      <div
                        className={`item ${children ? '' : styles.noBg}`}
                        onClick={() => { this.hadleStop('children') }}>
                        <video
                          id='children'
                          style={{ display: children ? 'none' : 'block' }}
                          controls src='//static.andall.com/shop/video/caiyang1.mp4' />
                      </div>
                      <span />
                      <div
                        className={`item ${adult ? '' : styles.noBg}`}
                        onClick={() => { this.hadleStop('adult') }}>
                        <video
                          id='adult'
                          style={{ display: adult ? 'none' : 'block' }}
                          controls src='//static.andall.com/shop/video/caiyang2.mp4' />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.pd15}>
                  <div className={`flex ${styles.title} ${styles.m10}`}>
                    <h2 className={`item ${styles.bindTit}`}>绑定采样器</h2>
                    {
                      result ? '' : (
                        <span onClick={() => { this.handleToggle('entry') }}>扫码有问题</span>
                      )
                    }
                  </div>
                  {
                    result ? '' : (
                      <div className={`imgCenter ${styles.scanBox}`}>
                        <div>
                          <span onClick={this.handleScan} />
                          <p>点击扫码绑定</p>
                        </div>
                      </div>
                    )
                  }
                  {
                    result ? (
                      <div>
                        <div className={`${styles.scanResult}`}>
                          {
                            isKitBarcode
                              ? <div className={styles.scanResult1}>
                                <p className={styles.lineBox}>
                                  <span className={styles.span}>扫码成功</span>
                                  <p>样本号：{barCode}</p>
                                </p>
                                <p className={styles.productName}>产品名称：</p>
                                <p>
                                  <span className={styles.productCont22}>
                                    {
                                      kitProductNames && kitProductNames.length
                                        ? kitProductNames.map((item, index) => {
                                          return <em key={index} className={styles.productItem}>{item}</em>
                                        })
                                        : ''
                                    }
                                  </span>
                                </p>
                              </div>
                              : <div className={styles.scanResult1}>
                                <p className={styles.lineBox}>
                                  <span className={styles.span}>扫码成功</span>
                                  <p>样本号：{barCode}</p>
                                </p>
                                <p className={styles.productName}>产品名称：</p>
                                <p>
                                  <span className={styles.productCont22}>
                                    <em className={styles.productItem}>{repeatInfo.productName}</em>
                                  </span>
                                </p>
                              </div>
                          }
                        </div>
                        {isShowJdInput
                          ? <div className={styles.jdContent}>
                            <div className={styles.jdHeader}>
                              <span className={styles.jdHeaderTitle}>
                                填京东用户名，领京东E卡
                              </span>
                              <span className={styles.jdHeaderHelp}
                                onClick={() => { this.handleToggle('viewJd') }}>
                                如何查看京东账号
                              </span>
                            </div>
                            <div className={styles.jdAcountInput}>
                              <input placeholder='请填写京东用户名' onChange={this.onJdAcountChange} />
                            </div>
                            <div className={styles.qaHelp}>
                              如有疑问，联系客服 400-682-2288
                            </div>
                          </div>
                          : needOrderNo ? <div className={styles.jdContent}>
                            <div className={styles.jdHeader}>
                              <span className={styles.jdHeaderTitle}>
                                {channelName}订单号
                              </span>
                            </div>
                            <div className={styles.jdAcountInput}>
                              <input placeholder={`${channelName}订单详情里可复制订单号`} onChange={this.orderChange} />
                            </div>
                            <div className={styles.qaHelp}>
                              如有疑问，咨询现场服务人员或联系客服
                              {/* 如有疑问，咨询现场服务人员或<a style={{ color:'#315dcf' }} href="tel:400-6822-288">联系客服</a> */}
                            </div>
                          </div> : null}
                      </div>
                    ) : ''
                  }

                </div>
                {
                  entry ? (
                    <Modal
                      handleToggle={() => { this.handleToggle('entry') }}
                      type
                      visible={entry}>
                      <div className={styles.scanModal}>
                        <p>试试手动输入吧</p>
                        <input
                          value={inputBarCode}
                          type='text'
                          onBlur={this.onBlur}
                          onChange={e => {
                            this.setState({ inputBarCode: e.target.value })
                          }}
                          placeholder='输入条形码下方的14位编号'
                        />
                        <button
                          onClick={() => { inputBarCode.length === 14 && this.getBarcodeInfo(1) }}
                          className={`btn ${styles.foot}  ${inputBarCode.length !== 14 ? styles.grren : ''}`}>
                          确认
                        </button>
                      </div>
                    </Modal>
                  ) : ''
                }

                {
                  repeat ? (
                    <Modal
                      handleToggle={() => { this.handleToggle('repeat') }}
                      type
                      visible={repeat}>
                      <div className={styles.scanModal}>
                        <p>您已完成绑定，不能重复绑定</p>
                        <div className={styles.pt17}>检测人：{data.userName || ''}</div>
                        <div>如需修改信息，<a href='tel:400-682-2288'>请联系客服</a></div>
                        <button onClick={() => { this.handleToggle('repeat') }}
                          className={`btn mt30 ${styles.foot}`}>我知道了</button>
                      </div>
                    </Modal>
                  ) : ''
                }
                {
                  scan ? (
                    <Modal
                      handleToggle={() => { this.handleToggle('scan') }}
                      type
                      visible={scan}>
                      <div className={styles.scanModal}>
                        <p>采样器无法使用</p>
                        <div className={`flex ${styles.modalBtn}`}>
                          <button onClick={this.handleScan} className={`btn item ${styles.foot}`}>重新扫码</button>
                          <span />
                          <button className={`btn item ${styles.foot} ${styles.footTel}`} onClick={this.handleTel}>联系客服</button>
                        </div>
                      </div>
                    </Modal>
                  ) : ''
                }
                {
                  viewJd ? (
                    <Modal
                      handleToggle={() => { this.handleToggle('viewJd') }}
                      type
                      visible={viewJd}>
                      <div className={styles.jdModal}>
                        <div className={styles.jdTipTitle}>
                          登录京东APP，点击“我的”菜单 右上角“设置”查看您的京东用户名
                        </div>
                        <div className={styles.jdTipPic} />
                      </div>
                    </Modal>
                  ) : ''
                }

                <Modal
                  handleToggle={() => { this.handleToggle('error') }}
                  type
                  visible={error}>
                  <div className={styles.errorBox}>
                    <h3>请重新扫描</h3>
                    <p>正确的采样器条码如下</p>
                    <img src={img} />
                    <button onClick={this.handleScan} className={`btn item ${styles.foot}`}>重新扫码</button>
                  </div>
                </Modal>
                {
                  this.state.pointTip && isTheAppVersion(this.state.APPVersion)
                    ? <p className={styles.integration}>{this.state.pointTip}</p>
                    : ''
                }
                <div className='foot' onClick={this.handleSubmit} >
                  <button
                    className={`btn ${styles.foot} ${barCode.length !== 14 || ((isShowJdInput && jdAcountInput === '') || (needOrderNo && orderInput === ''))
                      ? styles.grren : ''}`}>
                    下一步
                  </button>
                </div>
              </div>
            ) : ''
          }
        </div>
      </Page>
    )
  }
}
Binding.propTypes = {
  history: propTypes.object.isRequired
}
export default Binding
