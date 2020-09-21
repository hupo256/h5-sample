import React from 'react'
import images from './images'
import styles from './style'
import propTypes from 'prop-types'
import ua from '@src/common/utils/ua'
const { isAndall } = ua

class NavigationBar extends React.Component {
  state = {
    statusBarHeight:''
  }

  static propTypes = {
    title: propTypes.string.isRequired, // title文字
    back: propTypes.func.isRequired, // 返回的方法
    type: propTypes.string.isRequired, // 字体颜色
    background: propTypes.string.isRequired, // 背景颜色
    hasRight:propTypes.string,
    tightGo:propTypes.func,
  }

  componentDidMount() {
    let statusBarHeight = +window.localStorage.getItem('statusBarHeight')
    console.log(window.localStorage)
    this.setState({
      statusBarHeight:statusBarHeight + 'px',
      titleBar:isAndall() ? +(document.getElementById('titleBar').offsetHeight + statusBarHeight - 1) + 'px' : ''
    })
  }

  render () {
    const { title, back, type, background, hasRight, tightGo } = this.props
    const { statusBarHeight, titleBar } = this.state

    return (
      isAndall() &&
      <div className={styles.titleBarPanel}>
        <div id='titleBar' className={`${type === 'black' ? '' : `${styles.white}`} ${styles.titleBar}`} style={{ paddingTop: `${statusBarHeight}`, background:`${background}` }}>
          <div className={styles.titleBarCon} >
            <div className={styles.backIcon} onClick={() => back()}>
              {type === 'black' ? <img src={images.iconBackBlack} /> : <img src={images.iconBackWhite} />}
            </div>
            <h1>{title}</h1>
            {
              hasRight ? <span className={styles.hasRight} onClick={tightGo}>{hasRight}</span> : ''
            }
          </div>
        </div>
        <div className={styles.titleBarBlank} style={{ height: `calc( ${titleBar})` }} />
      </div>
    )
  }
}

export default NavigationBar
