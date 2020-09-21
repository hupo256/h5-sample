import React from 'react'
import { observer, inject } from 'mobx-react'
import { DatePicker, Toast } from 'antd-mobile'
import fun from '@src/common/utils/index'
import ua from '@src/common/utils/ua'
import point from '@src/common/utils/point'
import activeApi from '@src/common/api/activeApi'
import homeApi from '@src/common/api/homeApi'
import samplingApi from '@src/common/api/samplingApi'
import Page from '@src/components/page'
import SexPop from './SexPop'
import EyesPop from './EyePop'
import DiseasePop from './diseasePop'
import HeightWeight from './HeightWeight'
import PlaceDom from './PlaceDom'
import styles from './binduser'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
const { fmtDate, getParams, fixScroll, getSetssion, setSetssion } = fun
const now = new Date(Date.now())
const { isIos } = ua
const { allPointTrack } = point

@inject('user')
@observer
class BindUser extends React.Component {
  state = {
    birthday: null,
    relationId: '',
    list: [],
    sex: '',
    pickerPop: '',
    flag: false,
    expectDate: null,
    height: null,
    weight: null,
    rightEye: null,
    leftEye: null,
    linkManType: NaN,
    sickName:'',
    sickList:[],
    isBlue:'',
    needFlag:''
  }

  // relationId 对应关系
  // 1-本人 3-宝宝

  // linkManType
  // 1-成人 2-宝宝

  // 比较难处理的是，还有从sample list来的 bind-user \ select-user
  // 好在从那边过来的是都在url后带有相应参数
  // 而且，外部目前只有这一个来源
  // 思路：来源从一开始就可以确定，所以在进入时来个总的判断，然后一分为二，好了

  // 埋点记录输入样本信息
  trackPointSampleBindInput(userInfo) {
    const barcode = getParams().barcode || getSetssion('barcode')
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
    this.getData()
  }

  /***
   * 来源id 为采样器、报告列表过来的linkManId
   * barcode 为采样器列表过来，更换新增逻辑
   * linkManId 有url为报告列表过来绑定关系,否则为列表选择过来没有关系id
   * type 标记是否为安小软
   * 没有参数为正常新增
   */
  // id: linkManId, barcode, linkManType, type: 是否为安小软

  // 获取数据
  getData = () => {
    const { id, linkManType } = getParams()
    if (id) {
      console.log(this.state.fromDisease)
      samplingApi.selectById({ id }).then(res => {
        const { code, data } = res
        if (code) return
        const { userName, birthday, relationId, sex, expectDate, flag, height, weight, rightVision, leftVision, sickNames } = data
        this.setState({
          flag,
          sex,
          userName,
          height,
          weight,
          rightEye:rightVision,
          leftEye:leftVision,
          relationId: +relationId,
          birthday: new Date(birthday),
          expectDate: expectDate && new Date(expectDate),
          sickName:sickNames,
          editDisease:!sickNames
        }, () => {
          this.setState({ linkManType: this.state.relationId === 1 ? 2 : 1 })
        })
      })
    } else {
      const barcode = getParams().barcode || getSetssion('barcode')
      activeApi.getExpectDateInfo({ barCode: barcode, noloading: 1 }).then(res => {
        const { code, data } = res
        if (code) return
        const { flag, expectDate } = data
        this.setState({
          flag,
          linkManType,
          expectDate: expectDate && new Date(expectDate),
        })
      })
    }
    samplingApi.relationListAll({ noloading: 1 }).then(res => {
      const { code, data } = res
      if (code) return
      const list = data.map(item => {
        const { id, relationName } = item
        return { value: id, label: relationName }
      })
      this.setState({
        list,
      }, () => {
        this.setState({
          relationId:+linkManType === 1 ? 3 : 1
        })
      })
    })
  }

  // 绑定用户
  bindUser = () => {
    const { birthday, sex, userName, relationId, expectDate, height, weight, rightEye, leftEye, sickList } = this.state
    const type = getParams().kitType || getSetssion('kitType')
    const bcode = getParams().barcode || getSetssion('barcode')
    const { id, linkManId } = getParams()

    let dataConfig = {
      sex,
      relationId,
      userName,
      height,
      weight,
      type,
      id: id || linkManId || '',
      birthday: fmtDate(birthday),
      expectDate: fmtDate(expectDate),
      leftVision: leftEye,
      rightVision: rightEye,
      personalSickList:sickList
    }
    let dataApi = null

    if (getParams().barcode) { // 处理 sampling 过来的逻辑
      const tagName = id ? 'barCode' : 'barcode'
      dataConfig = { ...dataConfig, [tagName]: bcode }

      // operateType 0 新增  1修改  2更换
      if (linkManId) { // 更新人的信息
        dataApi = API.userupdate
      } else if (id) { // 更新绑定人
        dataConfig = { ...dataConfig, operateType: 1, barcode:bcode }
        dataApi = samplingApi.updateBindLinkMan
      } else { // 更新绑定人
        const barObj = { barCode: bcode }
        delete dataConfig.barcode
        dataConfig = { ...dataConfig, operateType: 0, ...barObj, barcode:bcode }
        dataApi = samplingApi.updateBindLinkMan
      }
    } else { // 主流程逻辑
      dataConfig = { ...dataConfig, barcode: bcode }
      dataApi = samplingApi.listAdd
    }
    !!type && (dataApi = samplingApi.updateBindLinkManKit) // 如果是小安则统一api

    dataApi(dataConfig).then(res => {
      const { code, data } = res
      if (code) return
      if (getParams().barcode) { // 处理 sampling 过来的逻辑
        if (linkManId) {
          const query = { linkManId, userName }
          this.toSaveUserLindManId(query, '/mkt/binding/select-user-kit') // 为什么要回到人员选择 ？
        // } else if (id) {
        } else {
          const { userName, linkManId } = data || {}
          samplingApi.confirmGender({ barCode: bcode }).then(() => {
            Toast.success('操作成功', 1.5, () => {
              this.goBackThePage({ userName, linkManId }, '/mkt/sampling')
            })
          })
        }
      } else {
        this.trackPointSampleBindInput(dataConfig)

        setSetssion('relationId', relationId)
        this.props.history.push({
          pathname: `/binding/protocol-kit`,
          state: {
            ...dataConfig,
            linkManId: res.data.id,
          }
        })
      }
    })
  }

  // 保存切换关系人linkManId
  toSaveUserLindManId = (obj = {}, url) => {
    const { linkManId = '' } = obj
    linkManId && homeApi.saveLastUserLindManId({ linkManId, noloading: 1 }).then(res => {
      const { code } = res
      if (code) return
      this.goBackThePage(obj, url)
    })
  }

  goBackThePage = (obj, url) => {
    const { user: { upLindManId } } = this.props
    const sType = getParams()
    const bType = getSetssion('kitType')
    const type = sType || bType(type !== 'INTESTINE_BIND') && upLindManId(obj)
    window.location.href = window.location.origin + url
  }

  tagChange = (item, name) => {
    console.log(item, name)
    const { linkManType } = getParams()
    if (linkManType && linkManType !== 'null' && name === 'relationId') return
    let { sex } = this.state
    if (name === 'sex' && item.value !== sex) {
      this.setState({
        sickName:'',
        needFlag:true
      })
    }
    this.setState({
      [name]: item.value,
    })
  }

  showPicker = (name) => {
    const { relationId, sex, sickList, needFlag, editDisease } = this.state
    if (name === 'birthday' && !relationId) return Toast.info('请先选择关系')
    if (getParams().id && getParams().barcode && name === 'sex') {
      return // 编辑检测人性别不可修改
    }
    if (getParams().id && getParams().barcode && name === 'disease' && !editDisease) {
      return Toast.info('请在【健康档案】-【我的检测人】-【疾病管理】中修改具体信息哦！')
    }
    if (name === 'disease' && !sex) return Toast.info('请先选择性别')
    document.getElementById('top').scrollIntoView()
    this.setState({ pickerPop: name })
    if (name === 'disease' && (sickList.length === 0 || needFlag)) {
      this.getSickList()
      this.setState({ needFlag:false })
    }
  }

  getSickList=() => {
    const { relationId, sex, linkManId } = this.state
    healthRecordsApi.getSickList({
      relationId,
      sex,
      linkManId
    }).then(res => {
      if (res) {
        this.setState({
          sickList:res.data.sickList,
          isBlue:res.data.sickList.filter(item => item.selectFlag === 0 || item.selectFlag === 1 || item.selectFlag === 2).length === res.data.sickList.length
        })
      }
    })
  }

  pickerOk = (value, tag) => {
    this.setState({ [tag]: value })
    this.hidePicker()
  }

  hidePicker = (name, value) => {
    this.setState({ pickerPop: '' })
    value && this.setState({ [name]: value })
    name && name.includes('Eye') && this.setState({ eyeTemp: '0.0' })
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

  isLeapYear = (first, end) => {
    let length = 0
    for (let i = first; i < end; i++) {
      if ((i % 4 == 0 && i % 100 != 0) || (i % 400 == 0)) {
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

  runSetState = (name, value) => {
    this.setState({ [name]: value })
  }

  chooseThis=(index, i) => {
    let { sickList } = this.state
    sickList[index].selectFlag = i
    this.setState({
      sickList,
    }, () => {
      this.setState({
        isBlue:sickList.filter(item => item.selectFlag === 0 || item.selectFlag === 1 || item.selectFlag === 2).length === sickList.length
      })
    })
  }
  handleSaveBtn=() => {
    let { sickList, sickName, isBlue } = this.state
    sickName = ''
    // let allFlag = true
    // sickList.map((item, index) => {
    //   if (item.selectFlag === undefined) {
    //     allFlag = false
    //     // Toast.info('还有题目未选！')
    //   }
    // })
    if (isBlue) {
      if (sickList.filter(item => item.selectFlag === 1).length) {
        sickList.filter(item => item.selectFlag === 1).map((item, index) => {
          sickName += item.sickName + '、'
        })
        sickName = sickName.substr(0, sickName.length - 1)
      } else {
        sickName = '无'
      }
      this.setState({
        pickerPop: '',
        sickName
      })
    }
  }
  render() {
    const { birthday, expectDate, pickerPop, flag, sex, height, weight, relationId, userName, list, sickName, sickList, isBlue } = this.state
    const { linkManId, barcode } = getParams()
    const dates = this.getDates()

    return (
      <Page title='填写检测者信息' class={styles.page}>
        <div className={styles.collectbox} id={'top'}>
          <ul className={styles.relationbox}>
            {list.length > 0 && list.map((rol, index) => (
              <li
                className={relationId === rol.value ? styles.on : styles.off}
                onClick={() => this.tagChange(rol, 'relationId', index)}
                key={index}>
                {rol.label}
              </li>
            ))}
          </ul>

          <ul className={`white from ${styles.from}`}>
            <PlaceDom RunShowPicker={this.showPicker} domArr={['sex']} {...this.state} />

            <li className={styles.mustInput}>
              <div className={`${linkManId ? 'disabled' : ''}`}>
                <span>*</span>
                <input
                  disabled={!!(linkManId)}
                  placeholder='你的姓名'
                  onBlur={() => {
                    isIos() && window.scrollBy(0, fixScroll().top)
                  }}
                  onChange={e => { this.setState({ userName: e.target.value }) }} value={userName || ''} />
              </div>
            </li>

            <li>
              <div className={`${linkManId ? 'disabled' : ''}`} onClick={() => { this.showPicker('birthday') }}>
                <span style={{ color: !birthday ? '#ccc' : '#333' }} className={styles.mustDo}>你的生日</span>
                <span className={styles.tcr}>{fmtDate(birthday)}</span>
              </div>
            </li>

            <HeightWeight runSetState={this.runSetState} {...this.state} />
            <div className={`${styles.disease}`}
              style={{ background:getParams().id && getParams().barcode && !this.state.editDisease && '#f5f5f5' }}
              onClick={() => { this.showPicker('disease') }}>
              <label className={styles.mustDo} style={{ color:!sickName ? '#ccc' : '#333' }}>个人疾病史</label>
              <span>{sickName || '待完善'}</span>
            </div>

            {
              relationId == 3 &&
              <PlaceDom RunShowPicker={this.showPicker} domArr={['leftEye', 'rightEye']} {...this.state} />
            }

            {flag && <li className={styles.pickerIcon}>
              <div className={`${linkManId ? 'disabled' : ''}`} onClick={() => { this.showPicker('expectDate') }}>
                <span style={{ color: !expectDate ? '#ccc' : '#333' }}>你的预产期</span>
                <span className={styles.tcr}>{fmtDate(expectDate)}</span>
              </div>
            </li>}

          </ul>

          <div onClick={this.bindUser}>
            <button
              disabled={!(relationId && sex && userName && birthday && height && weight && sickName)}
              className={`btn ${styles.foot}`}
            >
              {barcode ? '提交' : '确定创建'}</button>
          </div>

          <DatePicker
            mode='date'
            visible={pickerPop === 'birthday'}
            maxDate={relationId == 3 ? now : dates.nextDate}
            minDate={relationId == 3 ? dates.currentDate : dates.preDate}
            format='YYYY-MM-DD'
            onOk={(e) => this.pickerOk(e, 'birthday')}
            onDismiss={this.hidePicker}
          />
          <DatePicker
            mode='date'
            visible={pickerPop === 'expectDate'}
            minDate={now}
            maxDate={this.addMonth(new Date(), 10)}
            value={expectDate}
            format='YYYY-MM-DD'
            onOk={(e) => this.pickerOk(e, 'expectDate')}
            onDismiss={this.hidePicker}
          />

          {/* 姓别 */}
          {pickerPop === 'sex' &&
            <SexPop hidePicker={this.hidePicker} tagChange={this.tagChange} {...this.state} />
          }

          {/* 视力 */}
          {(pickerPop === 'leftEye' || pickerPop === 'rightEye') &&
            <EyesPop hidePicker={this.hidePicker} runSetState={this.runSetState} {...this.state} />
          }

          {/* 个人疾病史 */}
          {pickerPop === 'disease' &&
          <DiseasePop
            hidePicker={this.hidePicker}
            chooseThis={this.chooseThis}
            sickList={sickList}
            isBlue={isBlue}
            handleSaveBtn={this.handleSaveBtn}
            {...this.state} />
          }
        </div>
      </Page >
    )
  }
}

export default BindUser
