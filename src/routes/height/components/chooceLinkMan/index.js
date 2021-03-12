import React from 'react'
import propTypes from 'prop-types'
import styles from './chooce.scss'
import closeIcon from '@static/height/icon_close1.png'
import boy from '@static/height/icon_boy.png'
import girl from '@static/height/icon_girl.png'
import selectedIcon from '@static/height/icon_selected1.png'
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
            <img src={closeIcon} onClick={cancel} alt='' />
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
                    <img className={styles.childImg} src={item.sex === 'male' ? boy : girl} alt='' />
                    <span className={styles.name}>{item.linkManName}（宝宝）</span>
                    {
                      item.linkManName === selected.linkManName
                        ? <img className={styles.selectedIcon} src={selectedIcon} alt='' />
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
