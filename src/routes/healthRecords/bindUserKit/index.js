import React from 'react'
import { DatePicker, Picker, Toast } from 'antd-mobile'
import { fun, ua, filter } from '@src/common/app'
import Page from '@src/components/page'

import styles from './binduser'
import integrationApi from '@src/common/api/integrationApi'
import ShowModal from '../components/showModal'
import PointsToast from '@src/components/pointsToast'
import images from '../images'
const { nationMap } = filter
const { fmtDate, getParams, fixScroll, formatAddres } = fun
const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)
const { isIos } = ua
const AddresList = formatAddres()
class BindUser extends React.Component {
  state = {
    birthday: null,
    relationId: '', // 3 宝宝     成人1 2
    list: [],
    addres: false,
    nation: false,
    listReation: {},
    sex: '',

    pickerPop: '',
    flag: false,
    expectDate: null,
    height: null,
    weight: null,
    rightEye: null,
    leftEye: null,
    rightEyet: null,
    leftEyet: null,
    linkManType: null,
    linkManId:getParams().linkManId,
    validateLinkManInfoRange:true, // 校验身高体重
    infoObj:{},
    finishedPoint:'',
  }

  componentDidMount() {
    this.integrationSelectById()
  }
  integrationSelectById=() => {
    integrationApi.integrationListAll({ noloading:1 }).then(res => {
      const { code, data } = res
      const list = []
      const listReation = {}
      if (!code) {
        data.map((item, i) => {
          const { id, relationName } = item
          list.push({
            label: relationName,
            value: id
          })
          listReation[id] = relationName
        })
        this.setState({ list, listReation })
      }
    })
    integrationApi.integrationSelectById({ id:this.state.linkManId }).then(res => {
      const { code, data } = res
      if (!code) {
        const { userName, birthday, relationId, sex, expectDate, flag, height, weight } = data
        this.setState({
          bindUserName: userName,
          relationId: +relationId === 3 ? 3 : 1,
          sex,
          birthday: new Date(birthday),
          expectDate: expectDate && new Date(expectDate),
          flag,
          height,
          weight,
        })
      }
    })
  }

  // 绑定用户
  bindUser = () => {
    let { birthday, sex, bindUserName, relationId, linkManId,
      expectDate, height, weight, rightEye, leftEye } = this.state
    // const obj = getParams()
    // const { history, user: { upLindManId } } = this.props
    // let { id, linkManId, url, barcode, ids, type } = obj
    birthday = fmtDate(birthday)
    expectDate = fmtDate(expectDate)
    bindUserName && (bindUserName = bindUserName.replace(/(^\s*)|(\s*$)/g, ''))
    if (!relationId) {
      Toast.info('请选择关系')
    }
    if (!bindUserName) {
      Toast.info('请填写姓名')
      return
    }
    if (!birthday) {
      Toast.info('请选择生日')
      return
    }
    if (!sex.length) {
      Toast.info('请选择性别')
      return
    }
    let data = {
      birthday,
      expectDate,
      sex,
      relationId,
      id:linkManId,
      userName: bindUserName,
      height,
      weight,
      leftVision: leftEye,
      rightVision: rightEye
    }
    this.setState({ infoObj:data })
    integrationApi.validateLinkManInfoRange(data).then(res => {
      if (!res.code) {
        this.setState({ validateLinkManInfoRange:res.data })
        if (res.data) {
          this.confirmInfo()
        }
      }
    })
  }

  tagChange = (item, name, index) => {
    console.log(item, name)
    const { linkManType } = getParams()
    if (linkManType && linkManType !== 'null' && name === 'relationId') {
      return
    }
    this.setState({
      [name]: item.value,
    })
    if (name === 'relationId') {
      this.setState({
        bindUserName: '',
        sex: '',
        sextemp: '',
        birthday: '',
        height: null,
        weight: null,
        rightEye: null,
        leftEye: null,
        rightEyet: null,
        leftEyet: null,
        [name]: item.value
      })
    }
  }

  pickerOk = (value, tag) => {
    this.setState({ [tag]: value })
    this.hidePicker()
  }

  // 显示隐藏省市区
  showPicker = (name = 'visible') => {
    document.getElementById('top').scrollIntoView()
    if (name === 'sex' && this.state.sex) {
      return
    }
    setTimeout(() => {
      this.setState({ pickerPop: name, leftEyet: 0, rightEyet: 0 })
    }, 300)
  }

  hidePicker = (name, value) => {
    this.setState({ pickerPop: '' })
    if (value) {
      this.setState({ [name]: value })
    }
  }

  addMonth = (date, offset) => {
    if (date instanceof Date && !isNaN(offset)) {
      let givenMonth = date.getMonth()
      let newMonth = givenMonth + offset
      date.setMonth(newMonth)
      return date
    }
    throw Error('argument type error')
  }

  getMaxDate = () => {
    this.setState({
      maxDate: this.addMonth(new Date(), 10)
    })
  }

  eyeCtrl = (e, name) => {
    // console.log(e.nativeEvent);
    const offsetWidth = e.nativeEvent.target.offsetWidth
    const scrollLeft = e.nativeEvent.target.scrollLeft
    if ((scrollLeft / 20 * 21) < 0) {
      // e.nativeEvent.target.scrollLeft = 0
      this.setState({
        [name]: '0.0'
      })
    } else if ((scrollLeft / 20 * 21) > offsetWidth) {
      // e.nativeEvent.target.scrollLeft = offsetWidth
      this.setState({
        [name]: '2.0'
      })
    } else {
      this.setState({
        [name]: (Math.round((scrollLeft / 20 * 21) / offsetWidth * 20) / 10).toFixed(1)
      })
    }
  }
  numberTagChange = (name, e, limit) => {
    var reg = /^\d{1,}$/
    var pattern = new RegExp(reg)
    if (pattern.test(e.target.value) || !e.target.value) {
      this.setState({ [name]: e.target.value > limit ? limit : (e.target.value < 0 ? 0 : e.target.value) })
    }
  }
  // 返回修改
  editInfo=() => {
    this.setState({ validateLinkManInfoRange:true })
  }
  // 确认提交
  confirmInfo=() => {
    let { infoObj } = this.state
    integrationApi.perfectLinkManInfo(infoObj).then(res => {
      if (res) {
        this.setState({
          validateLinkManInfoRange:true,
          finishedPoint:res.data ? res.data.point : ''
        })
        setTimeout(() => {
          window.location.href = window.location.origin + '/mkt/integration/home?closeWebViewFlag=1'
        }, 2000)
      }
    })
  }
  isLeapYear = (first, end) => {
    let length = 0
    for (let i = first; i < end; i++) {
      if ((i % 4 === 0 && i % 100 !== 0) || (i % 400 === 0)) {
        length++
      }
    }
    return length
  }
  getDates = () => {
    const date = new Date()
    const leapYear1 = this.isLeapYear(date.getFullYear() - 18, date.getFullYear())// 闰年个数 -18-now
    const leapYear2 = this.isLeapYear(date.getFullYear() - 150, date.getFullYear())// 闰年个数 -150-now
    const during = 18 * 365 * 24 * 60 * 60 * 1000 + (leapYear1 * 24 * 60 * 60 * 1000)
    const duringEnd = 18 * 365 * 24 * 60 * 60 * 1000 + (leapYear1 * 24 * 60 * 60 * 1000)
    const duringStart = 150 * 365 * 24 * 60 * 60 * 1000 + (leapYear2 * 24 * 60 * 60 * 1000)

    const currentDate = new Date(date.getTime() - during)// 当前日期-18周岁
    const preDate = new Date(date.getTime() - duringStart)// 当前日期-150周岁
    const nextDate = new Date(date.getTime() - duringEnd)// 当前日期-18周岁

    return { currentDate, preDate, nextDate }
  }
  render() {
    const dates = this.getDates()
    const { birthday, expectDate, pickerPop, flag,
      sex, sextemp, relationId, maxDate, bindUserName, list, height,
      weight, rightEye, rightEyet, leftEye, leftEyet, validateLinkManInfoRange, finishedPoint } = this.state
    const { id, barcode } = getParams()
    return (
      <Page title='填写检测者信息' class={styles.page}>
        <div className={styles.collectbox} id={'top'}>
          <ul className={styles.relationbox}>
            {list.length > 0 && list.map((rol, index) => (
              <li
                className={relationId === rol.value ? styles.on : styles.off}
                key={index}>
                {rol.label}
              </li>
            ))}
          </ul>
          <ul className={`white from ${styles.from}`}>
            <li>
              <div onClick={() => { this.showPicker('sex') }}>
                <span style={{ color: !sex ? '#ccc' : '#333' }}>{sex ? (sex === 'male' ? '男' : '女') : '性别'}</span>
              </div>
            </li>

            <li>
              <div >
                <input
                  placeholder='你的姓名'
                  onBlur={() => {
                    isIos() && window.scrollBy(0, fixScroll().top)
                  }}
                  onChange={e => { this.setState({ bindUserName: e.target.value }) }} value={bindUserName || ''} />
              </div>
            </li>
            <li>
              <div onClick={() => { this.showPicker('birthday') }}>
                <span style={{ color: !birthday ? '#ccc' : '#333' }}>你的生日</span>
                <span className={styles.tcr}>{fmtDate(birthday)}</span>
              </div>
            </li>

            {
              <li className={styles.height}>
                <div >
                  <input
                    placeholder='身高（必填）'
                    type='tel'
                    onBlur={e => {
                      isIos() && window.scrollBy(0, fixScroll().top)
                    }}
                    onChange={e => { this.numberTagChange('height', e, 200) }} value={height || ''} />
                </div>
              </li>
            }

            {
              <li className={styles.weight}>
                <div>
                  <input
                    type='tel'
                    placeholder='体重（必填）'
                    onBlur={() => {
                      isIos() && window.scrollBy(0, fixScroll().top)
                    }}
                    onChange={e => { this.numberTagChange('weight', e, 150) }} value={weight || ''} />
                </div>
              </li>
            }
            {
              <li>
                <div onClick={() => { this.showPicker('leftEye') }}>
                  <span style={{ color: !leftEye ? '#ccc' : '#333' }}>{leftEye || '左眼视力（选填）'}</span>
                </div>
              </li>
            }
            {
              <li>
                <div onClick={() => { this.showPicker('rightEye') }}>
                  <span style={{ color: !rightEye ? '#ccc' : '#333' }}>{rightEye || '右眼视力（选填）'}</span>
                </div>
              </li>
            }
            {flag && <li>
              <div onClick={() => { this.showPicker('expectDate') }}>
                <span style={{ color: !expectDate ? '#ccc' : '#333' }}>你的预产期</span>
                <span className={styles.tcr}>{fmtDate(expectDate)}</span>
              </div>
            </li>}
          </ul>
          <DatePicker
            mode='date'
            visible={pickerPop === 'birthday'}
            maxDate={relationId === 3 ? now : dates.nextDate}
            minDate={relationId === 3 ? dates.currentDate : dates.preDate}
            format='YYYY-MM-DD'
            onOk={(e) => this.pickerOk(e, 'birthday')}
            onDismiss={this.hidePicker}
          />

          <DatePicker
            mode='date'
            visible={pickerPop === 'expectDate'}
            minDate={now}
            maxDate={maxDate}
            value={expectDate}
            format='YYYY-MM-DD'
            onOk={(e) => this.pickerOk(e, 'expectDate')}
            onDismiss={this.hidePicker}
          />
          <Picker
            visible={pickerPop === 'addres'}
            data={AddresList}
            cols={3}
            onOk={(e) => this.pickerOk(e, 'addres')}
            onDismiss={this.hidePicker}
          />
          <Picker
            visible={pickerPop === 'nation'}
            data={nationMap}
            cols={1}
            onOk={(e) => this.pickerOk(e, 'nation')}
            onDismiss={this.hidePicker}
          />
          <div onClick={(!!sex && !!bindUserName && !!birthday) ? this.bindUser : () => null} >
            <button className={`btn ${styles.foot} ${id || barcode ? styles.bg : ''}`}
              style={(sex && bindUserName && birthday)
                ? {} : { backgroundColor: '#C3C3CD', backgroundImage: 'unset' }}>
              提交</button>
          </div>
          {
            finishedPoint
              ? <PointsToast value={finishedPoint} />
              : ''
          }
          {
            !validateLinkManInfoRange
              ? <ShowModal
                type={20}
                editInfo={() => this.editInfo()}
                confirmInfo={() => this.confirmInfo()}
              />
              : ''
          }
          {
            pickerPop === 'sex' && <div className={styles.picker}>
              <div>
                <p>
                  <span onClick={() => this.hidePicker('sex')}>取消</span>
                  <span>性别</span>
                  <span onClick={() => this.hidePicker('sex', sextemp)}>确定</span>
                </p>
                <div className={styles.sexPicker}>
                  <div onClick={() => this.tagChange({ value: 'male' }, 'sextemp', 0)}>
                    <img src={sextemp === 'male' ? `${relationId === 1 ? images.maleH : images.boyH}` : `${relationId === 1 ? images.male : images.boy}`} />
                    <p style={sextemp === 'male' ? { color: '#38395B' } : {}}>男</p>
                  </div>
                  <div onClick={() => this.tagChange({ value: 'female' }, 'sextemp', 1)}>
                    <img src={sextemp === 'female' ? `${relationId === 1 ? images.femaleH : images.girlH}` : `${relationId === 1 ? images.female : images.girl}`} />
                    <p style={sextemp === 'female' ? { color: '#38395B' } : {}}>女</p>
                  </div>
                </div>
              </div>
            </div>
          }
          {
            pickerPop === 'leftEye' && <div className={styles.picker}>
              <div>
                <p>
                  <span onClick={() => this.hidePicker('leftEye')}>取消</span>
                  <span>左眼视力</span>
                  <span onClick={() => this.hidePicker('leftEye', leftEyet)}>确定</span>
                </p>
                <div className={styles.vision}>
                  <img src={images.arrow} />
                  <div onScroll={e => this.eyeCtrl(e, 'leftEyet')} id='leftEye'>
                    <div className={styles.dashed} />
                    <div className={styles.scale}>
                      <div />
                      <span className={styles.long}><p>0.1</p></span>
                      <span />
                      <span />
                      <span />
                      <span><p>0.5</p></span>
                      <span className={styles.long} />
                      <span />
                      <span />
                      <span />
                      <span><p>1.0</p></span>
                      <span className={styles.long} />
                      <span />
                      <span />
                      <span />
                      <span><p>1.5</p></span>
                      <span className={styles.long} />
                      <span />
                      <span />
                      <span />
                      <span><p>2.0</p></span>
                      <span className={styles.long} />
                      <div />
                    </div>
                  </div>
                  <p>{leftEyet || '0.0'}</p>
                </div>
              </div>
            </div>
          }
          {
            pickerPop === 'rightEye' && <div className={styles.picker}>
              <div>
                <p>
                  <span onClick={() => this.hidePicker('rightEye')}>取消</span>
                  <span>右眼视力</span>
                  <span onClick={() => this.hidePicker('rightEye', rightEyet)}>确定</span>
                </p>
                <div className={styles.vision}>
                  <img src={images.arrow} />
                  <div onScroll={e => this.eyeCtrl(e, 'rightEyet')} id='rightEye'>
                    <div className={styles.dashed} />
                    <div className={styles.scale}>
                      <div />
                      <span className={styles.long}><p>0.1</p></span>
                      <span />
                      <span />
                      <span />
                      <span><p>0.5</p></span>
                      <span className={styles.long} />
                      <span />
                      <span />
                      <span />
                      <span><p>1.0</p></span>
                      <span className={styles.long} />
                      <span />
                      <span />
                      <span />
                      <span><p>1.5</p></span>
                      <span className={styles.long} />
                      <span />
                      <span />
                      <span />
                      <span><p>2.0</p></span>
                      <span className={styles.long} />
                      <div />
                    </div>
                  </div>
                  <p>{rightEyet || '0.0'}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </Page >
    )
  }
}
export default BindUser
