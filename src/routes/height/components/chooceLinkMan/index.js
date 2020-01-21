import React from 'react'
import propTypes from 'prop-types'
import styles from './chooce.scss'
import { images } from '@src/common/app'
class ChooceLinkMan extends React.Component {
  state = {
  }
  componentDidMount () {
  }
  render () {
    const { linkmans, selected, choiceLinkman, cancel } = this.props
    return (
      <div className={styles.maskCont}>
        <div className={styles.bombCont}>
          <p className={styles.bombTitle}>
            切换检测人
            <img src={images.closeIcon} onClick={cancel} alt='' />
          </p>
          <div className={styles.linkmanCont}>
            {
              linkmans && linkmans.length
                ? linkmans.map((item, index) => {
                  return <div
                    className={`${styles.list} ${item.linkManName === selected.linkManName ? styles.actived : ''}`}
                    key={index}
                    onClick={() => choiceLinkman(item)}
                  >
                    <img className={styles.childImg} src={item.sex === 'male' ? images.boy : images.girl} alt='' />
                    <span className={styles.name}>{item.linkManName}（宝宝）</span>
                    {
                      item.linkManName === selected.linkManName
                        ? <img className={styles.selectedIcon} src={images.selectedIcon} alt='' />
                        : ''
                    }
                  </div>
                })
                : ''
            }
          </div>
        </div>
      </div>
    )
  }
}
ChooceLinkMan.propTypes = {
  linkmans: propTypes.array,
  selected: propTypes.object,
  choiceLinkman: propTypes.func,
  cancel: propTypes.func,
}
export default ChooceLinkMan
