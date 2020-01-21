import React from 'react'
import { Picker } from 'antd-mobile'
import PropTypes from 'prop-types'
import addressData from '@src/assets/json/city.json'
class Form extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired
  }
  state = {
    adders:[],
    cityValue:[],
    visible:false
  }
  componentDidMount () {
    this.formatData()
  }
  // 显示隐藏省市区
  handleToggle = (name = 'visible') => {
    const { [name] } = this.state
    this.setState({ [name]:!visible })
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
          value:city[n].name,
          children:[]
        }
        if (city[n].area && city[n].area.length) {
          for (let i = 0, lens = city[n].area.length; i < lens; i++) {
            cityList.children.push({
              label: city[n].area[i],
              value:city[n].area[i],
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
    this.setState({ adders })
  }
  render () {
    const { adders, cityValue, visible } = this.state
    const { onChange } = this.props
    const [province, city, area] = cityValue
    return (
      <div>
        <ul className='white from'>
          <li className='border flex'>
            <label>收件人</label>
            <div className='item'>
              <input placeholder='请填写收件人姓名' onChange={e => { onChange(e.target.value, 'aa') }} />
            </div>
          </li>
          <li className='border flex'>
            <label>联系电话</label>
            <div className='item'>
              <input placeholder='请填写收件人手机号' onChange={e => { onChange(e.target.value, 'aa') }} />
            </div>
          </li>
          <li className='border flex jt'>
            <label>所在地区</label>
            <span className='item'
              onClick={this.handleToggle}
              style={{ color:!province ? '#ccc' : '#333' }}>
              {province ? `${province} ${city} ${area}` : '请选择'}
            </span>
          </li>
          <li className='border flex'>
            <label>详细地址</label>
            <div className='item'>
              <input placeholder='请输入详细地址' onChange={e => { onChange(e.target.value, 'aa') }} />
            </div>
          </li>
        </ul>
        <Picker
          data={adders}
          visible={visible}
          title='选择地区'
          onOk={this.handleToggle}
          onDismiss={this.handleToggle}
          extra='请选择(可选)'
          value={cityValue}
          onChange={cityValue => { this.setState({ cityValue }) }}
        />
      </div>
    )
  }
}
export default Form
