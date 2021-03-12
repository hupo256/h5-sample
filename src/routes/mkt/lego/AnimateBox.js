import React from 'react'
import images from '@src/common/utils/images'
import PropTypes from 'prop-types'
import styles from './yunchan.scss'

const { lego } = images
const INTERVAL = 3000

class AnimateBox extends React.Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
  }

  state = {
    boxDeg: 0,
    recordRes: []
  }

  //组件卸载时，取消倒计时
  componentWillUnmount() {
    clearInterval(this.shareResTimer);
    clearInterval(this.updateDeg);
  }

  componentDidMount () {
    const { list } = this.props
    this.createRecordRes(list)
    this.updateBoxDeg()
  }

  createRecordRes = (list) => {
    let rseArr = []
    for(let i=0, k=4; i<k; i += 1){
      rseArr = rseArr.concat(list);
    }
    let count = 1
    const resLen = rseArr.length
    this.setState({ recordRes: rseArr.slice((count * 4 - 4), count * 4)})
    this.shareResTimer = setInterval(() => {
      if(resLen <= count * 4) count = 0
      count += 1
      this.setState({ recordRes: rseArr.slice((count * 4 - 4), count * 4)})
    }, INTERVAL*4);
  }

  updateBoxDeg = () => {
    let num = 0;
    this.updateDeg = setInterval(() => {
      this.setState({ boxDeg: num }, () => {
        if(num === 1000) num = 0
        num += 1
      })
    }, INTERVAL);
  }


  render () {
    const { boxDeg, recordRes } = this.state
    return (
      <div className={styles.animbox}>
        <ul className={styles.itembox} style={{ transform: `rotateX(${90*boxDeg}deg)` }}>
          {recordRes.length > 0 && recordRes.map((item, index) => {
            const {nickName, text} = item
            const tex = nickName.length > 6 ? `${nickName.slice(0, 5)}...` : nickName
            return (<li key={index}>
              <img src={item.url ? item.url : `${lego}defaultImg.png`} />
              <span>{`${tex} ${text}`}</span>
            </li>)
          })}
        </ul>
      </div>
    )
  }
}
export default AnimateBox

