import React from 'react'
import PropTypes from 'prop-types'
import styles from '../pages/goods.scss'
import home from '@static/skinBeauty/home.png'
import collect from '@static/skinBeauty/collect.png'
import collected from '@static/skinBeauty/collected.png'
import share from '@static/skinBeauty/share.png'
class Bottom extends React.Component {
  static propTypes = {
    isCollect: PropTypes.bool,
    collectBtn:PropTypes.func,
    shareBtn:PropTypes.func,
  }
  collect=() => {
    this.props.collectBtn()
  }
  share=() => {
    this.props.shareBtn()
  }

  render () {
    const { isCollect } = this.props
    return <div className={styles.bottomBar}>
      <span><a href='/mkt/skinSearch/homePage'><img src={home} /><label>主页</label></a></span>
      <span onClick={() => this.collect()}>
        {isCollect ? <img src={collected} /> : <img src={collect} />}
        {isCollect ? <label>已收藏</label> : <label>收藏<i style={{ color:'#ffffff' }}>未</i></label>}
      </span>
      <span onClick={() => this.share()}>
        <img src={share} /><label>分享</label>
      </span>
    </div>
  }
}

export default Bottom
