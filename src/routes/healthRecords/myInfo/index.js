import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './my.scss'
import images from '../images'
import { fun, ua } from '@src/common/app'
import { Toast, DatePicker } from 'antd-mobile'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
const { getParams, fmtDate, fixScroll } = fun
const now = new Date(Date.now())
const { isIos } = ua

class MyInfo extends React.Component {
  state = {
    loading:true,
    information:{},
    inputFlag:'',
    userName:'',
    height:'',
    weight:'',
    pickerPop:''
  }
  componentDidMount () {
    healthRecordsApi.getLinkManInfo({ id:(getParams().linkManId) }).then(res => {
      if (res) {
        console.log(res.data)
        let { userName, height, weight, birthday, expectDate } = res.data
        this.setState({
          information:res.data,
          userName,
          height,
          weight,
          birthday,
          expectDate,
          loading:false
        })
      }
    })
  }

  submitBtn=() => {
    let { userName, height, weight, birthday, expectDate } = this.state
    let params = {
      id:getParams().linkManId,
      height,
      weight,
      userName,
      birthday,
      expectDate,
    }
    console.log(params)
    healthRecordsApi.updateLinkManInfo(params).then(res => {
      if (res) {
        Toast.info('修改成功！')
        setTimeout(() => {
          this.props.history.replace(`/healthRecords/information?pageType=1&linkManId=${getParams().linkManId}`)
        }, 1000)
      }
    })
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
  pickerOk = (value, tag) => {
    this.setState({ [tag]: fmtDate(value) })
    this.hidePicker()
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
  addMonth = (date, offset) => {
    if (date instanceof Date && !isNaN(offset)) {
      let givenMonth = date.getMonth()
      let newMonth = givenMonth + offset
      date.setMonth(newMonth)
      return date
    }
    throw Error('argument type error')
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
  render () {
    const { loading, information, userName, height, weight, birthday, expectDate, pickerPop } = this.state
    const dates = this.getDates()
    return (
      <Page title={'个人资料'}>
        {
          !loading
            ? <div className={styles.myInfo} id='top'>
              <div className={styles.info}>
                <label>头像</label>
                <img src={`${information.headImgType === 1 ? images.userImg1 : information.headImgType === 2 ? images.userImg2 : information.headImgType === 3 ? images.userImg3 : images.userImg4}`} />
              </div>
              <div className={styles.info}>
                <label>姓名</label>
                <input
                  placeholder='请输入'
                  onBlur={() => {
                    isIos() && window.scrollBy(0, fixScroll().top)
                  }}
                  onChange={e => { this.setState({ userName: e.target.value }) }}
                  value={userName}
                />
              </div>
              <div className={styles.info}>
                <label>性别</label>
                <span className={styles.grey}>{information.sex === 'male' ? '男' : information.sex === 'female' ? '女' : ''}</span>
              </div>
              <div className={styles.info} onClick={() => { this.showPicker('birthday') }} >
                <label>出生日期</label>
                <span className={`${birthday ? styles.black : styles.grey}`}>{birthday || '请选择'}</span>
              </div>
              {
                <DatePicker
                  visible={pickerPop === 'birthday'}
                  mode='date'
                  maxDate={dates.nextDate}
                  minDate={dates.preDate}
                  format='YYYY-MM-DD'
                  value={new Date(birthday)}
                  onOk={(e) => this.pickerOk(e, 'birthday')}
                  onDismiss={this.hidePicker}
                />
              }
              <div className={styles.info}>
                <label>身高(cm)</label>
                <input
                  placeholder='请输入'
                  type='number'
                  onBlur={() => {
                    isIos() && window.scrollBy(0, fixScroll().top)
                  }}
                  onChange={e => { this.setState({ height: e.target.value }) }}
                  value={height}
                />
              </div>
              <div className={styles.info}>
                <label>体重(kg)</label>
                <input
                  placeholder='请输入'
                  type='number'
                  onBlur={() => {
                    isIos() && window.scrollBy(0, fixScroll().top)
                  }}
                  onChange={e => { this.setState({ weight: e.target.value }) }}
                  value={weight}
                />
              </div>
              {
                // +information.relationId !== 3 && information.sex === 'female'
                //   ? <div className={styles.info} onClick={() => { this.showPicker('expectDate') }} >
                //     <label>预产期</label>
                //     <span className={`${expectDate ? styles.black : styles.grey}`}>{expectDate || '请选择'}</span>
                //   </div>
                //   : ''
              }
              {
                <DatePicker
                  mode='date'
                  visible={pickerPop === 'expectDate'}
                  minDate={now}
                  maxDate={this.addMonth(new Date(), 10)}
                  value={new Date(expectDate)}
                  format='YYYY-MM-DD'
                  onOk={(e) => this.pickerOk(e, 'expectDate')}
                  onDismiss={this.hidePicker}
                />
              }
              <div className={styles.submitBtn} onClick={this.submitBtn}>
                <p>保存</p>
              </div>
            </div>
            : ''
        }
      </Page>
    )
  }
}
MyInfo.propTypes = {
  history: propTypes.object,
}
export default MyInfo
