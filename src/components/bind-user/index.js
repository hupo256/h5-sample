import React from 'react'
import { DatePicker, Picker, Toast } from 'antd-mobile'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { fun, ua, API, point, filter } from '@src/common/app'
import Page from '@src/components/page'

import styles from './binduser'
import images from './images'
// const { bindSuccess } = images

const { nationMap } = filter
const { fmtDate, getParams, fixScroll, getSetssion, formatAddres } = fun
const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)
const { isIos } = ua
const { allPointTrack } = point
const AddresList = formatAddres()

@inject('user')
@observer
class BindUserNew extends React.Component {
  state = {
    birthday: null,
    relationId: '',
    addres: false,
    nation: false,
    listReation: {},
    sex: '',
    tempsex: '',
    pickerPop: '',
    flag: false,
    expectDate: null,
    height: null,
    weight: null,
    rightEye: null,
    leftEye: null,
    rightEyet: null,
    leftEyet: null,
    linkManType: null
  }
  // relationId对应关系
  // 0 -> R.mipmap.icon_def_icon
  // 1 -> R.mipmap.male_baby_avatar 宝宝男
  // 2 -> R.mipmap.female_baby_avatar 宝宝女
  // 3 -> R.mipmap.male_adult_avatar 成人男
  // 4 -> R.mipmap.female_adult_avatar 成人女
  // 5 -> R.mipmap.oldman_avatar 老人男
  // 6 -> R.mipmap.oldwoman_avatar 老人女
  // 埋点记录输入样本信息
  trackPointSampleBindInput(userInfo) {
    const barcode = getSetssion('barcode')
    let obj = {
      eventName: 'sample_bind_input',
      pointParams: {
        sample_barcode: barcode,
        sample_linkman: userInfo.id,
        sample_name: userInfo.userName.substr(0, 1) + '**',
        relationId: userInfo.relationId,
        sample_sex: userInfo.sex,
        sample_birthday: userInfo.birthday
      }
    }
    allPointTrack(obj)
  }

  componentDidMount() {
    console.log(23)
    this.getData()
    this.getMaxDate()
  }

  // 获取数据
  getData = () => {
    const { getParams } = this.props
    const { id, linkManId, linkManType } = getParams

    if (id || linkManId) {
      API.selectById({ id: id || linkManId, noloading: 1 }).then(res => {
        const { code, data } = res
        if (!code) {
          const { userName, birthday, relationId, sex, expectDate, flag,
            height, weight, leftVision, rightVision } = data
          this.setState({
            bindUserName: userName,
            relationId: +relationId,
            sex,
            birthday: new Date(birthday),
            expectDate: expectDate && new Date(expectDate),
            flag,
            height,
            weight,
            leftEye: leftVision,
            rightEye: rightVision,
            linkManType: relationId == 1 ? 2 : 1
          })
        }
      })
    } else {
      const barcode = getSetssion('barcode').barcode || getParams.barcode
      API.getExpectDateInfo({ barCode: barcode, noloading: 1 }).then(res => {
        const { code, data } = res
        const { flag, expectDate } = data
        if (!code) {
          this.setState({
            flag,
            expectDate: expectDate && new Date(expectDate),
            linkManType,
          })
        }
      })
    }
    if (linkManType == 2) {
      this.setState({
        relationId: 1
      })
    } else if (linkManType == 1) {
      this.setState({
        relationId: 3
      })
    }
  }

  // 绑定用户
  bindUser = () => {
    let { birthday, sex, bindUserName, relationId, addres,
      nation, expectDate, height, weight, rightEye, leftEye } = this.state

    const { getParams } = this.props
    const obj = getParams

    const { history, user: { upLindManId } } = this.props
    let { id, linkManId, url, barcode, ids } = obj
    birthday = fmtDate(birthday)
    expectDate = fmtDate(expectDate)
    bindUserName && (bindUserName = bindUserName.replace(/(^\s*)|(\s*$)/g, ''))
    if (!relationId) {
      Toast.info('请选择关系')
      return
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

    // if (!addres.length) {
    //   Toast.info('请选择户籍')
    //   return
    // }
    // if (!nation.length) {
    //   Toast.info('请选择民族')
    //   return
    // }

    let data = {
      birthday,
      // nation,
      // addres,
      expectDate,
      sex,
      relationId,
      id: id || linkManId,
      userName: bindUserName,
      height,
      weight,
      leftVision: leftEye,
      rightVision: rightEye
    }
    let getData = null
    if (linkManId) {
      data = {
        ...data,
        barcode: barcode || getSetssion('barcode').barcode || '',
      }
      getData = API.userupdate
    } else if (barcode || id) {
      data = {
        ...data,
        barCode: barcode,
        operateType: id ? 1 : 0,
      }
      getData = API.updateBindLinkMan
    } else {
      const { barcode } = getSetssion('barcode')
      data = {
        ...data,
        barcode: barcode,
      }
      getData = API.listAdd
    }
    /***
     * 来源id 为采样器、报告列表过来编辑
     * linkManId 有url为报告列表过来绑定关系,否则为列表选择过来没有关系id
     * barcode 为采样器列表过来，更换新增逻辑
     * 没有参数为正常新增
     */
    getData(data).then(res => {
      const { code } = res

      if (!code) {
        const { userName, ...params } = data
        let query = {
          linkManId: data.id,
          userName: data.userName
        }
        if (barcode || id) {
          if (barcode) {
            const { userName } = res.data || {}
            API.confirmGender({ barCode: barcode }).then(response => {
              Toast.success(id ? '操作成功' : `已为您切换成${userName}`, 1.5, () => {
                if (url && ids) {
                  url += `?linkManId=${res.data.id}`
                }
                upLindManId({ userName, linkManId: res.data.id })
                if (id) {
                  ua.isAndall() && andall.invoke('openNewWindow', { url: (url || '/mkt/sampling') })
                  ua.isAndall() || (window.location.href = window.location.origin + (url || '/mkt/sampling'))
                } else {
                  this.saveLastUserLindManId({ userName, linkManId: res.data.id }, url || '/mkt/sampling')
                }
              })
            })
            return
          }

          Toast.success('操作成功', 1.5, () => {
            if (url && ids) {
              url += `?linkManId=${ids}`
            }
            upLindManId({ userName, linkManId: res.data.id })
            ua.isAndall() && andall.invoke('openNewWindow', { url: (url || '/mkt/sampling') })
            ua.isAndall() || (window.location.href = window.location.origin + (url || '/mkt/sampling'))
          })
          return
        }
        if (linkManId) {
          const jumitUrl = url ? `${url}?linkManId=${linkManId}` : '/select-user'
          this.saveLastUserLindManId(query, jumitUrl)
          return
        }
        this.trackPointSampleBindInput(data)
        history.push({
          pathname: '/binding/protocol',
          state: {
            ...params,
            linkManId: res.data.id,
            bindUserName: userName
          }
        })
      }
    })
  }

  hadnleToast = () => {
    const { getParams } = this.props
    const { linkManId } = getParams

    if (linkManId) {
      Toast.info('无法修改', 1)
    }
  }

  /**
   * 保存切换关系人linkManId
   */
  saveLastUserLindManId = (obj = {}, url) => {
    const { user: { upLindManId }, history } = this.props
    const { linkManId = '' } = obj
    linkManId && API.saveLastUserLindManId({ linkManId, noloading: 1 }).then(res => {
      const { code } = res
      if (!code) {
        upLindManId(obj)
        ua.isAndall() && andall.invoke('openNewWindow', { url: url })
        ua.isAndall() || (window.location.href = window.location.origin + url)
      }
    })
  }

  tagChange = (item, name, index) => {
    console.log(item, name)
    const { linkManType } = this.state
    // 当linkManType存在时，不能修改relationId
    if (linkManType && linkManType != 'undefined' && name == 'relationId') {
      return
    }
    if (name == 'relationId') {
      this.setState({
        bindUserName: '',
        sex: '',
        birthday: '',
        height: null,
        weight: null,
        rightEye: null,
        leftEye: null,
        rightEyet: null,
        leftEyet: null,
        [name]: item.value
      })
    } else {
      this.setState({
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
    const { relationId } = this.state
    if (name == 'birthday' && !relationId) {
      return Toast.info('请先选择关系！')
    }
    document.getElementById('top').scrollIntoView()
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
  isLeapYear = (first, end) => {
    let length = 0
    for (let i = first; i < end; i++) {
      if ((i % 4 == 0 && i % 100 != 0) || (i % 400 == 0)) {
        length++
      }
    }
    return length
  }
  getCurrent() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + '-' + month + '-' + day
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

  render() {
    const { birthday, addres, nation, expectDate, pickerPop, flag, sex, tempsex, relationId, maxDate,
      bindUserName, height, weight, rightEye, leftEye, rightEyet, leftEyet, linkManType } = this.state

    const { getParams, list, lists } = this.props
    const { linkManId, id, barcode } = getParams

    let date = new Date()

    let leapYear1 = this.isLeapYear(date.getFullYear() - 18, date.getFullYear())// 闰年个数 -18-now
    let leapYear2 = this.isLeapYear(date.getFullYear() - 150, date.getFullYear())// 闰年个数 -150-now
    let during = 18 * 365 * 24 * 60 * 60 * 1000 + (leapYear1 * 24 * 60 * 60 * 1000)
    let currentDate = new Date(date.getTime() - during)// 当前日期-18周岁

    let duringEnd = 18 * 365 * 24 * 60 * 60 * 1000 + (leapYear1 * 24 * 60 * 60 * 1000)
    let duringStart = 150 * 365 * 24 * 60 * 60 * 1000 + (leapYear2 * 24 * 60 * 60 * 1000)
    let preDate = new Date(date.getTime() - duringStart)// 当前日期-150周岁
    let nextDate = new Date(date.getTime() - duringEnd)// 当前日期-18周岁
    return (
      <Page title='填写检测者信息' class={styles.page}>
        <div className={styles.collectbox} id={'top'}>
          {/* <div className={styles.genderbox}>
            {lists.map((rol, index) => (
              <div key={index} onClick={() => this.tagChange(rol, 'sex', index)}>
                <img className={sex === rol.value ? styles.on : ''} src={rol.icon} /><span>{rol.label}</span>
              </div>
            ))}
          </div> */}

          <ul className={styles.relationbox}>
            {list.length > 0 && list.map((rol, index) => (
              <li
                className={relationId === rol.value ? styles.on : styles.off}
                onClick={(linkManType && linkManType != 'undefined') ? () => null : () => this.tagChange(rol, 'relationId', index)}
                key={index}>
                {rol.label}
              </li>
            ))}
          </ul>

          <ul className={`white from ${styles.from}`}>

            <li onClick={this.hadnleToast}>
              <div className={`${linkManId ? 'disabled' : ''}`} onClick={() => { this.showPicker('sex') }}>
                <span style={{ color: !sex ? '#ccc' : '#333' }}>{sex ? (sex == 'male' ? '男' : '女') : '性别'}</span>
              </div>
            </li>

            <li onClick={this.hadnleToast}>
              <div className={`${linkManId ? 'disabled' : ''}`}>
                <input
                  disabled={!!(linkManId)}
                  placeholder='你的姓名'
                  onBlur={() => {
                    isIos() && window.scrollBy(0, fixScroll().top)
                  }}
                  onChange={e => { this.setState({ bindUserName: e.target.value }) }}
                  value={bindUserName || ''}
                />
              </div>
            </li>
            <li onClick={this.hadnleToast}>
              <div className={`${linkManId ? 'disabled' : ''}`} onClick={() => { this.showPicker('birthday') }}>
                <span style={{ color: !birthday ? '#ccc' : '#333' }}>你的生日</span>
                <span className={styles.tcr}>{fmtDate(birthday)}</span>
              </div>
            </li>

            {
              relationId == 3 &&
              <li onClick={this.hadnleToast} className={styles.height}>
                <div className={`${linkManId ? 'disabled' : ''}`}>
                  <input
                    disabled={!!(linkManId)}
                    placeholder='身高（选填）'
                    type='tel'
                    onBlur={() => {
                      isIos() && window.scrollBy(0, fixScroll().top)
                    }}
                    onChange={e => { this.numberTagChange('height', e, 200) }} value={height || ''} />
                </div>
              </li>
            }

            {
              relationId == 3 &&
              <li onClick={this.hadnleToast} className={styles.weight}>
                <div className={`${linkManId ? 'disabled' : ''}`}>
                  <input
                    disabled={!!(linkManId)}
                    placeholder='体重（选填）'
                    type='tel'
                    onInput="value=value.replace(/[^\d]/g,'')"
                    onBlur={() => {
                      isIos() && window.scrollBy(0, fixScroll().top)
                    }}
                    onChange={e => { this.numberTagChange('weight', e, 150) }} value={weight || ''} />
                </div>
              </li>
            }
            {
              relationId == 3 &&
              <li onClick={this.hadnleToast}>
                <div className={`${linkManId ? 'disabled' : ''}`} onClick={() => { this.showPicker('leftEye') }}>
                  <span style={{ color: !leftEye ? '#ccc' : '#333' }}>{leftEye || '左眼视力（选填）'}</span>
                </div>
              </li>
            }
            {
              relationId == 3 &&
              <li onClick={this.hadnleToast}>
                <div className={`${linkManId ? 'disabled' : ''}`} onClick={() => { this.showPicker('rightEye') }}>
                  <span style={{ color: !rightEye ? '#ccc' : '#333' }}>{rightEye || '右眼视力（选填）'}</span>
                </div>
              </li>
            }
            {/* <li>
              <div className='item' onClick={() => { this.showPicker('addres') }}>
                <span style={{ color: !addres ? '#ccc' : '#333' }}>
                  {addres ? addres.join('-'): '你的户籍'}
                </span>
              </div>
            </li>
            <li>
              <div className='item' onClick={() => { this.showPicker('nation') }}>
                <span style={{ color: !nation ? '#ccc' : '#333' }}>
                  {nation ? nation[0] : '你的民族'}
                </span>
              </div>
            </li> */}

            {flag && <li onClick={this.hadnleToast} className={styles.pickerIcon}>
              <div className={`${linkManId ? 'disabled' : ''}`} onClick={() => { this.showPicker('expectDate') }}>
                <span style={{ color: !expectDate ? '#ccc' : '#333' }}>你的预产期</span>
                <span className={styles.tcr}>{fmtDate(expectDate)}</span>
              </div>
            </li>}
          </ul>

          <DatePicker
            mode='date'
            visible={pickerPop === 'birthday'}
            maxDate={relationId == 3 ? now : nextDate}
            minDate={relationId == 3 ? currentDate : preDate}
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
            <button className={`${styles.foot} ${id || barcode ? styles.bg : ''}`}
              style={(sex && bindUserName && birthday)
                ? {} : { backgroundColor: '#C3C3CD', backgroundImage: 'unset' }}>
              {barcode ? '提交' : '确定创建'}</button>
          </div>
          {
            pickerPop === 'sex' && <div className={styles.picker}>
              <div>
                <p>
                  <span onClick={() => this.hidePicker('sex')}>取消</span>
                  <span>性别</span>
                  <span onClick={() => this.hidePicker('sex', tempsex)}>确定</span>
                </p>
                <div className={styles.sexPicker}>
                  <div onClick={() => this.tagChange({ value: 'male' }, 'tempsex', 0)}>
                    <img src={tempsex == 'male' ? `${relationId === 1 ? images.maleH : images.boyH}` : `${relationId === 1 ? images.male : images.boy}`} />
                    <p style={tempsex == 'male' ? { color: '#38395B' } : {}}>男</p>
                  </div>
                  <div onClick={() => this.tagChange({ value: 'female' }, 'tempsex', 1)}>
                    <img src={tempsex == 'female' ? `${relationId === 1 ? images.femaleH : images.girlH}` : `${relationId === 1 ? images.female : images.girl}`} />
                    <p style={tempsex == 'female' ? { color: '#38395B' } : {}}>女</p>
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
export default BindUserNew
