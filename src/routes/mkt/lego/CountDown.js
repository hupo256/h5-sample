import React from 'react'
import PropTypes from 'prop-types'

export default class CountDown extends React.Component {
  static propTypes = {
    timeOver: PropTypes.func,
    discountValue: PropTypes.number,
    timeLen: PropTypes.string.isRequired
  }

  state = {
    texArr: []
  }
  
  componentDidMount() {
    if (this.props.timeLen) {
      this.countFun(this.getTheMs());
    }
  }

  //组件卸载时，取消倒计时
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getTheMs = () => {
    const { timeLen } = this.props
    const timeArr = timeLen.split(':')
    const seconds = +timeArr[0]*24*60*60 + +timeArr[1]*60*60 + +timeArr[2]*60 + +timeArr[3]
    return seconds*1000
  }

  countFun = (sys_second) => {
    this.timer = setInterval(() => {
      //防止倒计时出现负数
      if (sys_second > 1000) {
        sys_second -= 1000;
        let day = Math.floor((sys_second / 1000 / 3600) / 24);
        let hour = Math.floor((sys_second / 1000 / 3600) % 24);
        let minute = Math.floor((sys_second / 1000 / 60) % 60);
        let second = Math.floor(sys_second / 1000 % 60);
        day = day + '天',
        hour = hour < 10 ? "0" + hour : hour + '',
        minute = minute < 10 ? "0" + minute : minute + '',
        second = second < 10 ? "0" + second : second + ''
        const texArr = [day, hour, minute, second].map(arr => arr.split(''))
        this.setState({texArr})
      } else {
        clearInterval(this.timer);
        this.props.timeOver && this.props.timeOver()
      }
    }, 1000);
  }
  render() {
    const { texArr } = this.state
    return (
      <ul>
        {texArr.length > 0 && texArr.map((item, index) => 
          <li key={index}>
            <span>{item[0]}</span>
            <span>{item[1]}</span>
          </li>
        )}
      </ul>
    )
  }
}