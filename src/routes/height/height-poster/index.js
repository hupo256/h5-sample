import React from 'react'
import propTypes from 'prop-types'
import { fun, images } from '@src/common/app'
import styles from './poster.scss'
const { getParams } = fun

class HeightPoster extends React.Component {
  state = {
    linkManListInfos: [],
    linkManName: '',
    dnaHeight: '',
  }
  componentDidMount() {
    let { linkManName, dnaHeight } = getParams()
    linkManName = decodeURIComponent(linkManName)
    this.setState({
      linkManName,
      dnaHeight
    })
  }

  render () {
    const { linkManName, dnaHeight } = this.state
    return (
      <div className={styles.posterCont22}>
        <div className={styles.posterCont}>
          <p className={styles.text1}>根据基因检测的结果</p>
          <p className={styles.text2}>{linkManName}成年后的身高预计为</p>
          <div className={styles.textCont}>
            <p className={styles.text3}>{dnaHeight}cm</p>
            <p className={styles.text4} />
          </div>
          <img className={styles.img} src={images.heightPoster} alt='' />
        </div>
      </div>
    )
  }
}
HeightPoster.propTypes = {
  history: propTypes.object,
}
export default HeightPoster
