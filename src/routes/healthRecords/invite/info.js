import React from 'react'
import Page from '@src/components/page'
import styles from './invite.scss'
import images from '../images'
import { ua, fun } from '@src/common/app'
import { DatePicker, Toast } from 'antd-mobile'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
import { invitationImproveInformationPageView, invitationImproveInformationPageGoto } from '../buried-point'
import BottomPicker from '../components/bottomPicker'

const { fmtDate, fixScroll, getParams } = fun
const { isIos } = ua

class Info extends React.Component {
  state = {
    loading:false,
    pickerPop:'',
    bindUserName:'',
    sex:getParams().pageType === 'edit' ? '' : +localStorage.sex, // 1男 2女
    birthday:getParams().pageType === 'edit' ? '' : localStorage.birthday,
    relationship:'',
    relationshipId:getParams().pageType === 'edit' ? '' : +localStorage.relationshipId,
    shipList:[],
    pageType:getParams().pageType,
    otherName:'', // 其他关系输入
  }

  componentDidMount () {
    let { pageType } = this.state
    let obj = getParams()
    if (!obj.pageType) {
      invitationImproveInformationPageView()
    }
    healthRecordsApi.getAllRelationDic().then(res => {
      if (res) {
        this.setState({
          shipList:res.data,
          otherFlag:23,
          relationship:pageType === 'edit' ? '' : this.state.relationshipId ? res.data.filter(item => item.id === this.state.relationshipId)[0].relationName : ''
        })
      }
    })
    setTimeout(() => {
      if (pageType === 'edit') {
        healthRecordsApi.queryFriendInfo({
          linkManId:obj.linkManId,
          otherUserId:obj.otherUserId,
          type:obj.type
        }).then(res => {
          if (res) {
            console.log(res.data)
            let { nickName, birthday, friendRelationId, friendRelationName } = res.data
            this.setState({
              bindUserName:nickName,
              sex:res.data.sex,
              birthday,
              relationshipId:friendRelationId,
              relationship:friendRelationName,
              otherName:friendRelationId === 23 ? friendRelationName : ''
            })
          }
        })
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
  showPicker = (name = 'visible') => {
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
  tagChange = (item, name) => {
    this.setState({
      [name]: item.value,
    })
  }
  pickerOk = (value, tag) => {
    this.setState({ [tag]: fmtDate(value) })
    this.hidePicker()
  }
  // 关系其他
  chooseThisShip=(item) => {
    this.setState({
      relationship:item.relationName,
      relationshipId:item.id,
      pickerPop:'',
    })
  }
  submitBtn=() => {
    let { shipList, relationship, bindUserName, relationshipId, sex, birthday, pageType, otherName } = this.state
    let obj = getParams()
    if (!bindUserName) {
      Toast.info('请输入昵称')
      return
    }
    if (!sex) {
      Toast.info('请选择性别')
      return
    }
    if (!birthday) {
      Toast.info('请选择出生日期')
      return
    }
    if (!relationshipId) {
      Toast.info('请选择关系')
      return
    }
    if (relationshipId === 23 && !otherName) {
      Toast.info('您必须输入关系名称后才能提交')
      return
    }
    if (pageType === 'edit') {
      let params = {
        friendRelationId:relationshipId,
        sex,
        nickName:bindUserName,
        friendRelationName:+relationshipId !== 23 ? shipList.filter(item => item.id === relationshipId)[0].relationName : otherName,
        birthday,
        otherUserId:obj.otherUserId
      }
      console.log(params)
      healthRecordsApi.updateFriendInfo(params).then(res => {
        if (res) {
          console.log(res.data)
          this.props.history.replace(`/healthRecords/information?pageType=2&otherUserId=${obj.otherUserId}&type=${obj.type}&linkManId=${obj.linkManId}`)
        }
      })
    } else {
      let params = {
        jwt:obj.jwt,
        acceptToken:obj.acceptToken,
        friendRelationId:relationshipId,
        sex,
        nickName:bindUserName,
        friendRelationName:+relationshipId !== 23 ? shipList.filter(item => item.id === relationshipId)[0].relationName : otherName,
        birthday,
      }
      console.log(params)
      healthRecordsApi.acceptShareInvite(params).then(res => {
        if (res) {
          invitationImproveInformationPageGoto({ viewtype:'accept' })
          console.log(res.data)
          this.props.history.push(`/healthRecords/invite/success?mobile=${res.data.mobile}`)
          localStorage.setItem('startUserName', res.data.startUserName)
        }
      })
    }
  }
  render () {
    const { pageType, pickerPop, sextemp, bindUserName, sex, birthday, shipList, relationshipId, relationship, } = this.state
    const dates = this.getDates()
    return (
      <Page title={`${pageType ? '修改亲友信息' : '完善亲友信息'}`}>
        <div className={styles.integration} id='top'>
          <div className={styles.info}>
            <label>昵称</label>
            <input
              placeholder='请输入姓名'
              onBlur={() => { isIos() && window.scrollBy(0, fixScroll().top) }}
              onChange={e => { this.setState({ bindUserName: e.target.value }) }}
              value={bindUserName}
            />
          </div>
          <div className={styles.info}>
            <label>性别</label>
            {
              pageType === 'edit'
                ? <span className={styles.grey}>{sex === 1 ? '男' : '女'}</span>
                : <span onClick={() => { this.showPicker('sex') }} className={`${sex && sex !== 'null' ? styles.black : styles.grey}`}>
                  {sex && sex !== 'null' ? (sex === 1 ? '男' : '女') : '请选择性别'}
                </span>
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
                    <div onClick={() => this.tagChange({ value: 1 }, 'sex')}>
                      <img src={sex === 1 ? images.maleH : images.male} />
                      <p >男</p>
                    </div>
                    <div onClick={() => this.tagChange({ value: 2 }, 'sex')}>
                      <img src={sex === 2 ? images.femaleH : images.female} />
                      <p >女</p>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
          {
            pageType === 'edit' ? ''
              : <div className={styles.info}>
                <label>出生日期</label>
                {
                  pageType === 'edit'
                    ? <span className={styles.grey}>{birthday}</span>
                    : <span onClick={() => { this.showPicker('birthday') }} className={`${birthday ? styles.black : styles.grey}`}>
                      {birthday || '请选择出生日期'}
                    </span>
                }
                {
                  <DatePicker
                    mode='date'
                    value={birthday ? new Date(birthday) : ''}
                    visible={pickerPop === 'birthday'}
                    maxDate={dates.nextDate}
                    minDate={dates.preDate}
                    format='YYYY-MM-DD'
                    onOk={(e) => this.pickerOk(e, 'birthday')}
                    onDismiss={this.hidePicker}
                  />
                }
              </div>
          }
          <div className={styles.info}>
            <label>{pageType === 'edit' ? 'TA是我的' : '我是TA的'}</label>
            <span onClick={() => { this.showPicker('relationship') }}
              className={`${relationshipId ? styles.black : styles.grey}`}>
              { relationshipId === 23 ? '其他' : relationship }
              <img src={images.right} />
            </span>
            {
              pickerPop === 'relationship' && <BottomPicker
                shipList={shipList}
                relationshipId={relationshipId}
                handleClose={() => this.setState({ pickerPop:'' })}
                handleChooseThisShip={(item) => this.chooseThisShip(item)}
                type={2}
              />
            }
          </div>
          {
            relationshipId === 23
              ? <div className={styles.info}>
                <label>其他关系</label>
                <input
                  maxLength='6'
                  placeholder='请输入关系'
                  onBlur={() => {
                    isIos() && window.scrollBy(0, fixScroll().top)
                  }}
                  value={this.state.otherName}
                  onChange={e => { this.setState({ otherName: e.target.value }) }} />
              </div>
              : ''
          }
          <div className={styles.submitBtn} onClick={this.submitBtn}>
            <p>{`${pageType === 'edit' ? '保存修改' : '接收邀请'}`}</p>
          </div>
        </div>
      </Page>
    )
  }
}

export default Info
