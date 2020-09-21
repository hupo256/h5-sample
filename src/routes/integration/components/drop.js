import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../integration.scss'
import images from '@src/common/utils/images'
const { integration } = images

class Drop extends Component {
  static propTypes = {

  }
  componentDidMount() {
    this.fn()
  }
fn=() => {
  var wh = window.innerHeight
  function drop() {
    var allImg = document.getElementById('bboo').getElementsByTagName('img')
    if (allImg.length <= 0) {
      clearTimeout(timer)
    }
    for (let i = 0; i < allImg.length; i++) {
      let ot = Number(allImg[i].style.top.replace('px', ''))
      var rnd = Math.round(Math.random() * 80)
      var rnd2 = Math.round(Math.random() * 25)
      if (ot <= wh) { // 如果掉到窗口以下
        allImg[i].style.top = (ot + rnd + rnd2) + 'px'
      } else {
        allImg[i].remove()
      }
    }
  }
  var timer = setInterval(drop, 100)
}
render () {
  return (
    <div>
      <div id='bboo' className={styles.bboo}>
        <img src={`${integration}points.png`} className={styles.point1} />
        <img src={`${integration}points.png`} className={styles.point2} />
        <img src={`${integration}points.png`} className={styles.point3} />
        <img src={`${integration}points.png`} className={styles.point4} />
        <img src={`${integration}points.png`} className={styles.point5} />
        <img src={`${integration}points.png`} className={styles.point6} />
        <img src={`${integration}points.png`} className={styles.point7} />
      </div>
    </div>
  )
}
}
export default Drop
