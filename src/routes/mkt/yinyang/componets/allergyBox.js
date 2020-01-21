import React from 'react'
import images from '@src/common/utils/images'
import {YYGJresultsolutiongoto} from './BuriedPoint'

import styles from '../yinyang'
const { yinyang } = images

class YinYang extends React.Component {
  gotoYYGJresultsolutiongoto = (curLinkManId, dimensionCode, geneTags) => {
    YYGJresultsolutiongoto({view_type: dimensionCode})
    setTimeout(() => {
      this.props.history.push(`/yinyang-solution?linkManId=${curLinkManId}&dimensionCode=${dimensionCode}&geneTags=${geneTags}`)
    }, 200)
  }

  render () {
    const { allergyData, curLinkManId, geneTags } = this.props
    const {solutionDesc, dimensionCode} = allergyData
    return (
      <div className={`${styles.inforCard} ${styles.resCard}`}>
        <img className={styles.cardtop} src={`${yinyang}cardtop.png`} />
        <div className={styles.mainAvice}>
          <h3>{allergyData.title}</h3>
          { allergyData.allergyItemDtoList && allergyData.allergyItemDtoList.length > 0 &&
            allergyData.allergyItemDtoList.map((item, index) => (
              <React.Fragment key={index}>
                <h4>{item.title}</h4>
                <p>{item.resultDesc}</p>
              </React.Fragment>
            ))
          }
          <img src={`${yinyang}cry.png`} />

          {/* 去解决方案页 */}
          <span 
            className={styles.linkBtn}
            onClick={() => this.gotoYYGJresultsolutiongoto(curLinkManId, dimensionCode, geneTags)}
          >{`${solutionDesc}>`}
          </span>
        </div>
        <img className={styles.cardbottom} src={`${yinyang}cardbottom.png`} />
      </div>
    )
  }
}

export default YinYang
