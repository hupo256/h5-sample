import React from 'react'
import { DatePicker } from 'antd-mobile'
import { fun, ua, API } from '@src/common/app'
import { Page } from '@src/components'
import images from '@src/common/utils/images'
import styles from './bbinfor'

const { yinyang } = images
const { fmtDate, getParams, fixScroll} = fun
const now = new Date(Date.now())
const { isIos } = ua
const lists = [
  {
    label: '男宝',
    value: 'male',
    icon: `${yinyang}boy.png`,
    iconOn: `${yinyang}boy1.png`,
  },{
    label: '女宝',
    value: 'female',
    icon: `${yinyang}girl.png`,
    iconOn: `${yinyang}girl1.png`,
  },
]

class BindUser extends React.Component {
  state = {
    pickerPop: '',
    birthday: null,
    userName: '',
    gender: '',
  }

  componentDidMount () {
  }

  tagChange = (item, name, index) => {
    console.log(item, name)
    this.setState({
      [name]: item.value,
    })
  }

  pickerOk = (value, tag) => {
    this.setState({[tag]: value})
    this.hidePicker();
  }

  // 显示隐藏省市区
  showPicker = (name = 'visible') => {
    this.setState({ pickerPop: name })
  }

  hidePicker = () => {
    this.setState({ pickerPop: '' })
  }

  touchQsPage = () => {
    const {birthday, gender, userName} = this.state
    API.saveBaseUser({birthday: fmtDate(birthday), gender, userName}).then(res => {
      const { code, data } = res
      if(code) return
      window.location.href = data.qnaireUrl
    })
  }

  render () {
    const { birthday, pickerPop, gender, userName} = this.state
    return (
      <Page title='宝宝基本信息'>
        <div className={styles.collectbox}>
          <div className={styles.genderbox}>
            {lists.map((rol, index) => {
              const selected = gender === rol.value
              return <div key={index} onClick={() => this.tagChange(rol, 'gender', index)}>
                <img src={selected ? rol.iconOn : rol.icon} />
                {selected && <img src={`${yinyang}checkon.png`} />}
                <span className={selected ? styles.on : ''}>{rol.label}</span>
              </div>
            })}
          </div>

          <ul className={`white from ${styles.from}`}>
            <li>
              <div>
                <input
                  placeholder='宝宝姓名'
                  onBlur={() => {isIos() && window.scrollBy(0, fixScroll().top)}}
                  onChange={e => { this.setState({ userName: e.target.value }) }} value={userName || ''} />
              </div>
            </li>
            <li>
              <div onClick={() => { this.showPicker('birthday') }}>
                <span style={{ color: !birthday ? '#ccc' : '#333' }}>宝宝生日</span>
                <span className={styles.tcr}>{fmtDate(birthday)}</span>
              </div>
            </li>
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

          <div className={styles.submitBox}>
            {birthday && userName && gender &&<p className={styles.warnMsg}>*信息提交后，无法修改</p>}
            <div className={styles.btnBox} onClick={this.touchQsPage} >
              <button disabled={!(birthday && userName && gender)}>确定</button>
            </div>
          </div>
        </div>
      </Page>
    )
  }
}
export default BindUser
