import React from 'react'
import propTypes from 'prop-types'
import { fun } from '@src/common/app'
import styles from '../binding'
const { getSetssion, isTheAppVersion } = fun
class Step extends React.Component {
  static propTypes = {
    number: propTypes.number.isRequired
  }
  state = {
    list: [
      {
        setp: 1,
        dsc: '扫描条形码'
      },
      {
        setp: 2,
        dsc: '选择检测者'
      },
      {
        setp: 3,
        dsc: '知情同意书'
      },
      {
        setp: 4,
        dsc: '授权同意书'
      },
      {
        setp: '\ue602',
        dsc: '绑定成功并采样'
      }
    ]
  }
  componentDidMount() {
    const { list } = this.state
    const { isAuthorized } = getSetssion('isAuthorized')
    if (!+isAuthorized) {
      list.splice(3, 1)
      this.setState({ list })
    }
  }
  render() {
    const { list } = this.state
    const { number } = this.props
    return (
      <div 
        className={`flex ${styles.setpBox}`}
        style={{borderBottom: isTheAppVersion('1.7.1') ? 'none' : '1px solid #f6f6f6'}}
      >
        {
          list.map((item, i) => (
            <div className={`item ${styles.stepNum} 
              ${i <= number ? styles.setpActive : i - 1 === number ? styles.stepNext : ''}`} key={i}>
              <span className={i === list.length - 1 ? 'iconfont' : ''}>{item.setp}</span>
              <p>{item.dsc}</p>
            </div>
          ))
        }
      </div>
    )
  }
}

export default Step
