import React from 'react'
import images from '../images'
import styles from './tags'

class Tag extends React.Component {
  state = {
  }

  render () {
    const { discount } = this.props
    return (
      <ul className={styles.tagbox}>
        <li><img src={images.tagicon_1} alt=""/><span>{discount || ''}折解锁</span></li>
        <li><img src={images.tagicon_2} alt=""/><span>会员专享券</span></li>
        <li><img src={images.tagicon_3} alt=""/><span>专属顾问</span></li>
        <li><img src={images.tagicon_4} alt=""/><span>积分翻倍领</span></li>
      </ul>
    )
  }
}

export default Tag
