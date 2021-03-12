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
    const { resData, curLinkManId, geneTags } = this.props
    const dtList = resData.evaluationDimensionList.slice() || []
    return (
      <React.Fragment>
        <div className={`${styles.inforCard} ${styles.titCard}`}>
          <p dangerouslySetInnerHTML={{ __html: resData.evaluationResultTitle || '' }} />
        </div>

        {dtList.length > 0 && dtList.map((item, index) => {
          if(!item) return
          const {resultDesc, resultIconUrl, solutionDesc, title, subTitle, traitDto, nutritionPlan, dimensionCode} = item
          const traitList = traitDto ? traitDto.slice() : []
          return (
            <div className={`${styles.inforCard} ${styles.resCard}`} key={index}>
              <img className={styles.cardtop} src={images.cardtop} />
              <div className={styles.mainAvice}>
                <h3>{title}</h3>
                <p dangerouslySetInnerHTML={{ __html: resultDesc || '' }} />
                <img src={resultIconUrl} />
              </div>

              <div className={styles.detailAvice}>
                <h3>{subTitle}</h3>
                {traitList.length > 0 &&  traitList.map((rol, ind) => 
                  <React.Fragment key={ind}>
                    <b>{rol.traitName}</b>
                    <p dangerouslySetInnerHTML={{ __html: rol.traitDesc || '' }} />
                  </React.Fragment>
                )}

                {nutritionPlan && <p className={styles.nutrition}>{nutritionPlan}</p>}

                {/* 去解决方案页 */}
                {solutionDesc && <span 
                  className={styles.linkBtn}
                  onClick={() => this.gotoYYGJresultsolutiongoto(curLinkManId, dimensionCode, geneTags)}
                >{`${solutionDesc}>`}
                </span>}

              </div>
              <img className={styles.cardbottom} src={images.cardbottom} />
            </div>)
        })}
      </React.Fragment>
    )
  }
}

export default YinYang
