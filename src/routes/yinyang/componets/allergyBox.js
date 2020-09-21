import React from 'react'
import images from './images'
import {YYGJresultsolutiongoto} from './BuriedPoint'

import styles from '../yinyang'

class YinYang extends React.Component {
  gotoYYGJresultsolutiongoto = (curLinkManId, dimensionCode, geneTags) => {
    YYGJresultsolutiongoto({view_type: dimensionCode})
    setTimeout(() => {
      this.props.history.push(`/yinyang/yinyang-solution?linkManId=${curLinkManId}&dimensionCode=${dimensionCode}&geneTags=${geneTags}`)
    }, 200)
  }

  render () {
    const { allergyData, curLinkManId, geneTags } = this.props
    const {solutionDesc, dimensionCode} = allergyData
    return (
      <div className={`${styles.inforCard} ${styles.resCard}`}>
        <img className={styles.cardtop} src={images.cardtop} />
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
          <img src={images.cry} />

          {/* 去解决方案页 */}
          <span 
            className={styles.linkBtn}
            onClick={() => this.gotoYYGJresultsolutiongoto(curLinkManId, dimensionCode, geneTags)}
          >{`${solutionDesc}>`}
          </span>
        </div>
        <img className={styles.cardbottom} src={images.cardbottom} />
      </div>
    )
  }
}

export default YinYang
