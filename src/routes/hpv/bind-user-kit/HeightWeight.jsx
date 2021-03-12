import React from 'react'
import ua from '@src/common/utils/ua'
import fun from '@src/common/utils'
import styles from './binduser'

class HeightWeight extends React.Component {
  numberTagChange = (name, e, limit) => {
    const { runSetState } = this.props
    let val = e.target.value
    if (/^\d{1,}$/.test(val) || val === '') {
      val = val > limit ? limit : (val < 0 ? 0 : val)
      runSetState(name, val)
    }
  }

  render() {
    const { linkManId, height, weight } = this.props
    const domArr = ['height', 'weight']
    return (
      <React.Fragment>
        {domArr.map((item, index) => {
          const placeTex = index ? '体重' : '身高'
          const limit = index ? 150 : 200
          const valueTag = index ? weight : height
          return <li className={`${styles[item]} ${styles.mustInput}`} key={index}>
            <div className={`${linkManId ? 'disabled' : ''}`}>
              <span>*</span>
              <input
                disabled={!!(linkManId)}
                placeholder={placeTex}
                type='tel'
                value={valueTag}
                onBlur={e => {
                  ua.isIos() && window.scrollBy(0, fun.fixScroll().top)
                }}
                onChange={e => { this.numberTagChange(item, e, limit) }} value={valueTag || ''} />
            </div>
          </li>
        })}
      </React.Fragment>
    )
  }
}
export default HeightWeight
