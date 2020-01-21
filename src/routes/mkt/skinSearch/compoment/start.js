import React from 'react'
import propTypes from 'prop-types'
import styles from '../skinBeauty.scss'
import star from '@static/skinBeauty/star.png'
import suo1 from '@static/skinBeauty/suo1.png'
class Star extends React.Component {
  static propTypes = {
    pfValue:propTypes.number,
    type:propTypes.number,
  }
  state = {
    pfColor: '#f08a69', // 默认选中颜色
    starList:[
      {
        full:true, // 是否充满 true是，false否，null是无
        width:0, // 宽度占比
      }
    ]
  }
  componentDidMount () {
    this.showStar()
  }
  showStar () {
    const { pfValue } = this.props
    let len = 5// 5颗星
    let starArr = []
    // 计算有几颗完整的星星
    let fullNum = parseInt(pfValue / 20)
    // 计算剩下的部分
    let sheng = pfValue % 20 > 0
    // 计算剩下的部分占单个星星的百分比
    let shengZanbi = pfValue % 20 / 20 * 100
    // 算出星星数组
    if (pfValue <= 0) {
      for (let i = 0; i < len; i++) {
        starArr.push({
          full:null, // 是否充满 true是，false否，null是无
          width:0, // 宽度占比
        })
      }
      this.setState({
        starList:starArr
      })
    } else {
      let full = {
        full:true, // 是否充满 true是，false否，null是无
        width:100, // 宽度占比
      }
      let nofull = {
        full:false, // 是否充满 true是，false否，null是无
        width:shengZanbi, // 宽度占比
      }
      let nullfull = {
        full:null, // 是否充满 true是，false否，null是无
        width:0, // 宽度占比
      }
      for (let i = 0; i < len; i++) {
        if (i + 1 <= fullNum) {
          starArr.push(full)
        } else {
          if (sheng) {
            starArr.push(nofull)
            sheng = false
          } else {
            starArr.push(nullfull)
          }
        }
      }
      this.setState({
        starList:starArr
      })
    }
  }
  render () {
    const { starList } = this.state
    const { pfValue, type } = this.props
    return (
      <div className={styles.pfBox}>
        <span>匹配度</span>
        {
          +localStorage.reportStatus !== 3
            ? <img src={suo1} className={styles.suo1} />
            : pfValue === null
              ? '--'
              : <div className={styles.pfStarBox}>
                {
                  starList.map((item, index) => (
                    <div key={index} className={`${type === 1 ? styles.pfStarList : styles.pfStarList2}`}>
                      <img className={`${type === 1 ? styles.pfStar : styles.pfStar2}`} src={star} />
                      {
                        item.full === true
                          ? <div className={styles.pfStarLine} style={{ 'background':this.state.pfColor }} />
                          : item.full === null
                            ? <div className={styles.pfStarLine} />
                            : item.full === false
                              ? <div className={styles.pfStarLine} style={{ 'background':this.state.pfColor, 'width':item.width + '%' }} />
                              : <div className={styles.pfStarLine} />
                      }
                    </div>
                  ))
                }
              </div>
        }
        {
          +localStorage.reportStatus !== 3
            ? ''
            : pfValue === null ? ''
              : <span className={`${type === 1 ? styles.pfValue : styles.pfValue2}`}>{pfValue}%</span>
        }

      </div>

    )
  }
}
export default Star
