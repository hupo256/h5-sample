import React from 'react'
import { Picker } from 'antd-mobile'
import PropTypes from 'prop-types'
import fun from '@src/common/utils'
import ua from '@src/common/utils/ua'
import addressData from '@src/assets/json/city.json'
const { fixScroll, isPoneAvailable } = fun
const { isIos } = ua
let addersList = []

class Form extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    type: PropTypes.number,
    hasSpace: PropTypes.string
  }
  state = {
    adders:[],
    cityValue:[],
    show:false,
    visible:false,
    timeList:[],
    preReturnTime:''
  }
  componentDidMount () {
    this.formatData()
  }
  // 显示隐藏省市区
  handleToggle = (name = 'visible') => {
    const bool = this.state[name]
    if (name === 'show') {
      this.getDayList(3)
      return
    }
    this.setState({ [name]:!bool })
  }
  // 预约时间包装
  getDayList = (n) => {
    const { show } = this.state
    const date = new Date()
    const curTime = date.getTime()
    const hours = date.getHours() + 1
    const dayList = []
    const bool = hours >= 17
    // 获取时间段
    let hoursList = []
    for (let i = 10; i < 17; i++) {
      const nowTime = i + ':00-' + (i + 1) + ':00'
      hoursList.push({ value:nowTime, label:nowTime, bool:hours > i })
    }
    // 获取天数
    for (let i = bool ? 1 : 0; i < (bool ? n + 1 : n); i++) {
      let date = curTime + (i * 3600 * 24 * 1000)
      date = new Date(date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const time = `${year}-${month}-${day}`
      dayList.push({
        value:time,
        label:time,
        children:!bool && !i ? hoursList.filter(item => !item.bool) : hoursList
      })
    }
    this.setState({
      timeList:dayList,
      show:!show
    })
  }

  // 省市区三级联动数据包装
  formatData = () => {
    const adders = []
    for (let province in addressData) {
      const label = addressData[province].name
      const city = addressData[province].city
      const children = []
      for (let n = 0, len = city.length; n < len; n++) {
        const cityList = {
          label:city[n].name,
          value:`a${n}-${city[n].name}`,
          children:[]
        }
        if (city[n].area && city[n].area.length) {
          for (let i = 0, lens = city[n].area.length; i < lens; i++) {
            cityList.children.push({
              label: city[n].area[i],
              value:`b${i}-${city[n].area[i]}`,
            })
          }
        }
        children.push(cityList)
      }
      const data = {
        label,
        value:label,
        children
      }
      adders.push(data)
    }
    addersList = adders
  }

  formBlur = (value, key) => {
    const isPhone = isPoneAvailable(+value);
    if(!isPhone){
      Toast.fail('电话号码不符合规范', 2);
      this.setState({phoneNum: false})
    }else{
      this.setState({phoneNum: true})
    }
  }
  
  render () {
    const { cityValue, visible, show, timeList, preReturnTime } = this.state
    const { onChange, type, hasSpace = 'Y' } = this.props
    const [province, city, area] = cityValue
    const label = type ? '寄件人' : '收件人'
    return (
      <div>
        <ul className={`white from ${hasSpace === 'N' ? 'noSpace' : ''}`}>
          <li className='border flex'>
            <label>{label}</label>
            <div className='item'>
              <input
                placeholder={`请填写${label}姓名`}
                onChange={e => {
                  onChange(e.target.value, 'name')
                }}
                onBlur={() => {
                  isIos() && window.scrollBy(0, fixScroll().top)
                }}
              />
            </div>
          </li>
          <li className='border flex'>
            <label>联系电话</label>
            <div className='item'>
              <input type='tel'
                placeholder={`请填写${label}手机号`}
                onBlur={(e) => {
                  isIos() && window.scrollBy(0, fixScroll().top)
                  // onBlur(e.target.value, 'mobile')
                  this.formBlur(e.target.value)
                }}
                onChange={e => { onChange(e.target.value, 'mobile') }} />
            </div>
          </li>
          <li className='border flex jt'>
            <label>所在地区</label>
            <span className='item'
              onClick={() => { 
                isIos() && window.scrollBy(0, fixScroll().top)
                this.handleToggle()
              }}
              style={{ color:!province ? '#ccc' : '#333' }}>
              {province ? `${province} ${city.split('-')[1]} ${area.split('-')[1]}` : '请选择'}
            </span>
          </li>
          <li className='border flex textarea'>
            <label>详细地址</label>
            <div className='item'>
              <textarea rows="3" placeholder='请输入详细地址'
                onBlur={() => {
                  isIos() && window.scrollBy(0, fixScroll().top)
                }}
                onChange={e => { onChange(e.target.value, 'addressDetail') }} />
            </div>
          </li>
          {
            type ? (
              <li className='border flex jt'>
                <label>预约时间</label>
                <span className='item'
                  onClick={() => { this.handleToggle('show') }}
                  style={{ color:!preReturnTime ? '#ccc' : '#333' }}>
                  {preReturnTime ? ` ${preReturnTime[0]} ${preReturnTime[1]}` : '请选择'}
                </span>
              </li>
            ) : ''
          }
        </ul>
        <Picker
          data={addersList}
          visible={visible}
          title='选择地区'
          onOk={() => { this.handleToggle() }}
          onDismiss={() => { this.handleToggle() }}
          extra='请选择(可选)'
          value={cityValue}
          onChange={cityValue => {
            this.setState({ cityValue })
            onChange(cityValue, 'adders')
          }}
        />
        <Picker
          data={timeList}
          visible={show}
          cols={2}
          title='选择预约时间'
          onOk={() => { this.handleToggle('show') }}
          onDismiss={() => { this.handleToggle('show') }}
          extra='请选择(可选)'
          value={cityValue}
          onChange={preReturnTime => {
            this.setState({ preReturnTime })
            onChange(preReturnTime, 'preReturnTime')
          }}
        />
      </div>
    )
  }
}
export default Form
