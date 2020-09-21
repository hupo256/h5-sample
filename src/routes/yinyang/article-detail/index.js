import React from 'react'
import propTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import ua from '@src/common/utils/ua'
import Page from '@src/components/page'
import styles from './detail.scss'

@inject('yinyang')
@observer
export default class ArticleDetail extends React.Component {
  state = {
    detail: {},
    isVideo: false,
    isGood: false,
    content: '',
    isAndall: ua.isAndall(),
    isPlay: false
  }
  componentDidMount () {
    // console.log(this.props)
    // this.handleGetArticle()
    // this.handleAddBrowseNumber()
  }
  
  render () {
    const { yinyang: { data:{articleCon} } } = this.props
    const { foodMakings, foodSteps, foodTitle, ourFoodImgUrl, summary} = articleCon
    const { head, foodContent=[] } = foodSteps
    const fmaks = foodMakings.split('</b></br>')[1].split(';')
    return (
      <Page title={foodTitle || ''}>
        <React.Fragment>
        <img src={ourFoodImgUrl} />
        <div className={styles.detailCont}>
          <h3>{foodTitle}</h3>
          {/* <p className={styles.summaryTex} dangerouslySetInnerHTML={{ __html: summary || '' }} /> */}
          <br />
          {/* <p dangerouslySetInnerHTML={{ __html: foodMakings || '' }} /> */}
          {fmaks.length > 0 && <p>
            <b>原材料:</b><br />
            {fmaks.map((item, index) => 
              <span key={index} dangerouslySetInnerHTML={{ __html: item + '<br />' || '' }} />
            )}
          </p>
          }
          <p dangerouslySetInnerHTML={{ __html: head || '' }} />
          {foodContent.length > 0 && foodContent.map((item,index) => (
            <React.Fragment key={index}>
              <p>{item.text}</p>
              <img src={item.img} />
            </React.Fragment>
          ))}

          <br />
          <p style={{textAlign: 'center'}}>版权归原作者所有，如有侵权请与我们联系</p>
        </div>
        </React.Fragment>
      </Page>
    )
  }
}
ArticleDetail.propTypes = {
  history: propTypes.object,
}
