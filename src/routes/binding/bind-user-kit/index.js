import React from 'react'
import { DatePicker, Picker, Toast } from 'antd-mobile'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { fun, ua, API, point, filter } from '@src/common/app'
import { Page, WxUpload } from '@src/components'

import manIcon from '@static/bindOnly/manIcon.png'
import womanIcon from '@static/bindOnly/womanIcon.png'
import styles from './binduser'

const { nationMap } = filter
const { fmtDate, getParams, fixScroll, getSetssion, formatAddres } = fun
const nowTimeStamp = Date.now()
const now = new Date(nowTimeStamp)
const { isIos } = ua
const { allPointTrack } = point
const AddresList = formatAddres()
const lists = [
  {
    label: '男',
    value: 'male',
    icon: manIcon
  }, {
    label: '女',
    value: 'female',
    icon: womanIcon,
  },
]

@inject('user')
@observer
class BindUser extends React.Component {
  state = {
    birthday: null,
    relationId: '',
    list: [],
    addres: false,
    nation: false,
    listReation: {},
    sex: '',

    pickerPop: '',
    flag: false,
    expectDate: null,
  }
  // 埋点记录输入样本信息
  trackPointSampleBindInput (userInfo) {
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

  componentDidMount () {
    this.getData()
    this.getMaxDate()
  }

  // 获取数据
  getData = () => {
    const { id, linkManId } = getParams()
    if (id || linkManId) {
      API.selectById({ id: id || linkManId }).then(res => {
        const { code, data } = res
        if (!code) {
          const { userName, birthday, relationId, sex, expectDate, flag } = data
          this.setState({
            bindUserName: userName,
            relationId: +relationId,
            sex,
            birthday: new Date(birthday),
            expectDate: expectDate && new Date(expectDate),
            flag,
          })
        }
      })
    } else {
      const barcode = getSetssion('barcode').barcode || getParams().barcode
      API.getExpectDateInfo({ barCode: barcode }).then(res => {
        const { code, data } = res
        const { flag, expectDate } = data
        if (!code) {
          this.setState({
            flag,
            expectDate: expectDate && new Date(expectDate)
          })
        }
      })
    }

    API.relationListAll().then(res => {
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
  }

  // 绑定用户
  bindUser = () => {
    let { birthday, sex, bindUserName, relationId, addres, nation, expectDate } = this.state
    const obj = getParams()
    const { history, user: { upLindManId } } = this.props
    let { id, linkManId, url, barcode, ids, type } = obj
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
      id: id || linkManId,
      userName: bindUserName,
      type
    }
    let getData = null
    if (linkManId) {
      data = {
        ...data,
        barcode: barcode || getSetssion('barcode').barcode || '',
      }
      getData = API.updateBindLinkManKit
    } else if (barcode || id) {
      data = {
        ...data,
        barcode: barcode,
        operateType: id ? 1 : 0,
      }
      getData = API.updateBindLinkManKit
    } else {
      const { barcode } = getSetssion('barcode')
      data = {
        ...data,
        barcode: barcode,
      }
      getData = API.updateBindLinkManKit
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
                const { type } = getParams()
                if (type !== 'INTESTINE_BIND') {
                  upLindManId({ userName, linkManId: res.data.id })
                }
                id ? history.push(url || '/')
                  : this.saveLastUserLindManId({ userName, linkManId: res.data.id }, url || '/')
              })
            })
            return
          }

          Toast.success('操作成功', 1.5, () => {
            if (url && ids) {
              url += `?linkManId=${ids}`
            }
            const { type } = getParams()
            if (type !== 'INTESTINE_BIND') {
              upLindManId({ userName, linkManId: res.data.id })
            }
            history.push(url || '/')
          })
          return
        }
        if (linkManId) {
          const jumitUrl = url ? `${url}?linkManId=${linkManId}` : '/select-user'
          this.saveLastUserLindManId(query, jumitUrl)
          return
        }
        this.trackPointSampleBindInput(data)
        const { type } = getParams()
        history.push({
          pathname: '/protocol-kit',
          state: {
            ...params,
            linkManId: res.data.id,
            bindUserName: userName,
            type
          }
        })
      }
    })
  }

  hadnleToast = () => {
    const { linkManId } = getParams()
    if (linkManId) {
      Toast.info('无法修改', 1)
    }
  }

  /**
   * 保存切换关系人linkManId
   */
  saveLastUserLindManId = (obj = {}, url) => {
    const { user:{ upLindManId }, history } = this.props
    const { linkManId = '' } = obj
    linkManId && API.saveLastUserLindManId({ linkManId, noloading: 1 }).then(res => {
      const { code } = res
      if (!code) {
        const { type } = getParams()
        if (type !== 'INTESTINE_BIND') {
          upLindManId(obj)
        }
        history.push(url)
      }
    })
  }

  tagChange = (item, name, index) => {
    console.log(item, name)
    this.setState({
      [name]: item.value,
    })
  }

  pickerOk = (value, tag) => {
    this.setState({ [tag]: value })
    this.hidePicker()
  }

  // 显示隐藏省市区
  showPicker = (name = 'visible') => {
    this.setState({ pickerPop: name })
  }

  hidePicker = () => {
    this.setState({ pickerPop: '' })
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

  render () {
    const { birthday, addres, nation, expectDate, pickerPop, flag, sex, relationId, maxDate,
      bindUserName, list } = this.state
    const { linkManId, id, barcode } = getParams()
    return (
      <Page title='填写检测者信息'>
        <div className={styles.collectbox}>
          <div className={styles.genderbox}>
            {lists.map((rol, index) => (
              <div key={index} onClick={() => this.tagChange(rol, 'sex', index)}>
                <img className={sex === rol.value ? styles.on : ''} src={rol.icon} /><span>{rol.label}</span>
              </div>
            ))}
          </div>

          <ul className={`white from ${styles.from}`}>
            <li onClick={this.hadnleToast}>
              <div className={`${linkManId ? 'disabled' : ''}`}>
                <input
                  disabled={!!(linkManId)}
                  placeholder='你的姓名'
                  onBlur={() => {
                    isIos() && window.scrollBy(0, fixScroll().top)
                  }}
                  onChange={e => { this.setState({ bindUserName: e.target.value }) }} value={bindUserName || ''} />
              </div>
            </li>
            <li onClick={this.hadnleToast}>
              <div className={`${linkManId ? 'disabled' : ''}`} onClick={() => { this.showPicker('birthday') }}>
                <span style={{ color: !birthday ? '#ccc' : '#333' }}>你的生日</span>
                <span className={styles.tcr}>{fmtDate(birthday)}</span>
              </div>
            </li>

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

            {flag && <li onClick={this.hadnleToast}>
              <div className={`${linkManId ? 'disabled' : ''}`} onClick={() => { this.showPicker('expectDate') }}>
                <span style={{ color: !expectDate ? '#ccc' : '#333' }}>你的预产期</span>
                <span className={styles.tcr}>{fmtDate(expectDate)}</span>
              </div>
            </li>}
          </ul>

          <ul className={styles.relationbox}>
            {list.length > 0 && list.map((rol, index) => (
              <li
                className={relationId === rol.value ? styles.on : ''}
                onClick={() => this.tagChange(rol, 'relationId', index)}
                key={index}>
                {rol.label}
              </li>
            ))}
          </ul>

          <DatePicker
            mode='date'
            visible={pickerPop === 'birthday'}
            maxDate={now}
            minDate={new Date(1900, 1, 1, 0, 0, 0)}
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
          <div className='foot' onClick={this.bindUser} >
            <button className={`btn ${styles.foot} ${id || barcode ? styles.bg : ''}`}>
              提交</button>
          </div>
        </div>
      </Page>
    )
  }
}
export default BindUser
