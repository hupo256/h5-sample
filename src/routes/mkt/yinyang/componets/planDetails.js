import React from 'react'
import { observer, inject } from 'mobx-react'
import {YYGJsolutiondetailtabgoto, YYGJolutiondetailrecipegoto, YYGJsolutiondetailknowledgegoto} from './BuriedPoint'
import styles from '../yinyang'

@inject('yinyang')
@observer
class Solution extends React.Component {
  state = {
    tabIndex: 0,
  }

  touchTabData = (num) => {
    // YYGJsolutiondetailtabgoto()
    this.setState({
      tabIndex: num,
    })
  }

  gotoArticle = (title, url) => {
    YYGJsolutiondetailknowledgegoto({content_id: title})
    setTimeout(() => {
      window.location.href = url
    },200)
  }

  creatFootPage = (obj) => {
    YYGJolutiondetailrecipegoto({content_id: obj.foodTitle})
    const { yinyang: {touchArticleCon}} = this.props
    touchArticleCon(obj)
    setTimeout(() => {
      this.props.history.push('/article-detail')
    }, 200)
  }

  render () {
    const { yinyang: { data:{solutiondata:{dataInfo}} } } = this.props
    const { tabIndex } = this.state
    let planList
    const dtList = dataInfo[1].data.tabContentDtos.slice() || []
    if(dtList && dtList.length>0){
      planList = dtList[tabIndex].productDtoList.slice()
    }
    return (
      <div className={`${styles.inforCard} ${styles.solutionBox}`}>
        { dtList.length === 1 ? 
        <div className={styles.tabBoxTop}>
          <span>{dtList[0].name}</span>
        </div> : 
        <div className={`${styles.tabBox} ${tabIndex ? styles.on : ''}`}>
          {dtList.map((tab, index) => (
            <span 
              key={index} 
              onClick={() => this.touchTabData(index)} 
              className={`${tabIndex === index ? styles.on : ''}`}
            >
              {tab.name}
            </span>
          ))}
        </div>}
          
        {planList && planList.length > 0 && <ul className={styles.recoBox}>
          {planList.map((plan, index) => {
             if(plan.foodTitle) {
              const {foodTitle, tags, ourFoodImgUrl} = plan
              return <li key={index} onClick={() => this.creatFootPage(plan)}>
                <div className={styles.imgbox}><img src={ourFoodImgUrl} /></div>
                <div className={styles.titBox}>
                  <h3>{foodTitle}</h3>
                  <div className={styles.tagBox}>
                    {tags.map((tag, ind) => <span key={ind}>{tag}</span>)}
                  </div>
                </div>
              </li>
             } else {
              const {imgUrl, jumpUrl, like, title} = plan
              return <li key={index} onClick={() => this.gotoArticle(title, jumpUrl)} className={styles.knowledgeBox}>
                <div className={styles.imgbox}><img src={imgUrl} /></div>
                <div className={styles.titBox}>
                  <h3>{title}</h3>
                  <div className={styles.tagBox}>
                    <span>{like}</span>
                  </div>
                </div>
              </li>
             }
          })}
        </ul>}
      </div>
    )
  }
}

export default Solution
