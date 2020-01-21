import React from 'react'
import { observer, inject } from 'mobx-react'
import images from '@src/common/utils/images'
import {YYGJresultinfogoto, YYGJresultinputgoto, YYGJpageview, YYGJresultbuyNutrition} from './BuriedPoint'
import { ua } from '@src/common/app'
import ImgTips from './imgTips'
import styles from '../yinyang'

const { yinyang } = images

@inject('yinyang')
@observer
class SiweiBox extends React.Component {
  componentDidMount () {
    YYGJpageview({view_type: 'result'})
  }

  toTouchImgPoint = () => {
    YYGJresultinfogoto()
  }

  toTouchSpanPoint = (url, view, type) => {
    YYGJresultinputgoto({view_type: view, view_Ltype:type})
    setTimeout(() => {
      ua.isAndall() && andall.invoke('openNewWindow', {url: url.split('dnatime.com')[1]})
      ua.isAndall() || (window.location.href = url)
    }, 200)
  }

  gotoProduct = (obj) => {
    if(!obj) return
    const { productId, linkManId, productType } = obj
    const pointPara = {
      product_id: productId
    }
    YYGJresultbuyNutrition(pointPara)

    setTimeout(() => {
      ua.isAndall() ? 
        andall.invoke('goProductDetail', { productType, productId } ) :
        window.location.href = `${origin}/commodity?id=${productId}&linkManId=${linkManId}`
    }, 200)
  }

  render () {
    const { siweiData } = this.props
    const { reEvaluationDto, summaryResultDesWarp, upTitle, evaluationTime, illustrationDto } = siweiData
    // upTitle.productInfo = { productId: 1, linkManId: 1235234512312345, productType: 2 }
    return (
      <React.Fragment>
      <div className={styles.inforCard}>
        <div className={styles.siweiOut}>
          <div className={styles.siweiBox}>
            <p className={styles.timeGray}>{evaluationTime}</p>
            <div className={styles.tipsBox} onClick={this.toTouchImgPoint}><ImgTips illustrationDto={illustrationDto} /></div>
            <div className={styles.jiyingBox}>
              <p>
                <u>{upTitle && upTitle.gene }</u>
                {upTitle.geneUrl && 
                  <i onClick={() => this.gotoProduct(upTitle.productInfo)}>
                    {`${upTitle.geneUrl}`}
                  </i>
                }
              </p>
              <ul>
                {siweiData.histogramDataList && siweiData.histogramDataList.length && 
                  siweiData.histogramDataList.map((item, index) => {
                    const {geneValue} = item
                    return <li key={index}>
                      <b>{item.name}</b>
                      <span>
                        {(geneValue || geneValue === 0) ?
                         <span style={{width: `${(geneValue/110)*100}%`}} /> : <img src={`${yinyang}qicon.png`} />
                        }
                      </span>
                    </li>
                  })
                }
              </ul>
            </div>

            <div className={styles.wenjuanBox}>
              <p>
                <u>{upTitle && upTitle.evaluation}</u>
                {upTitle.evaluationUrl && 
                  <i onClick={() => this.toTouchSpanPoint(reEvaluationDto.evaluationUrl, 'first', 'up')}>
                    {`${upTitle.evaluationUrl}`}
                  </i>
                }
              </p>
              <ul>
                {siweiData.histogramDataList && siweiData.histogramDataList.length && 
                  siweiData.histogramDataList.map((item, index) => {
                    const { resultMsg, evaluationValue, resultIconUrl } =  item
                    const tex = resultMsg.length > 3 ? resultMsg.slice(0, 2) + '...' : resultMsg
                    return <li key={index}>
                      <span>
                        {(evaluationValue || evaluationValue === 0) ? 
                          <span style={{width: `${(evaluationValue/110*100)}%`}} /> : <img src={`${yinyang}qicon.png`} />
                        }
                      </span>
                      <div>
                        <img src={resultIconUrl || `${yinyang}smile.png`} />
                        <b>{tex}</b>
                      </div>
                    </li>
                  })
                }
              </ul>
            </div>
          </div>
          <p className={styles.tac}>{`- ${siweiData.bottomTitle} -`}</p>
          <div className={styles.mainReport}>
            <img src={`${yinyang}yy_topbg.png`} />
            <div className={styles.pcon}>
              {summaryResultDesWarp.head && <h3 dangerouslySetInnerHTML={{ __html: summaryResultDesWarp.head || '' }} />}
              {summaryResultDesWarp.monthDes && <p dangerouslySetInnerHTML={{ __html: summaryResultDesWarp.monthDes || '' }} />}
              {summaryResultDesWarp.evaluationDes && <p dangerouslySetInnerHTML={{ __html: summaryResultDesWarp.evaluationDes || '' }} />}
              {summaryResultDesWarp.geneDes &&<p dangerouslySetInnerHTML={{ __html: summaryResultDesWarp.geneDes || '' }} />}
            </div>
          </div>
          <p className={styles.gray}>{reEvaluationDto.tips}</p>
          <span 
            className={styles.linkBtn}
            onClick={() => this.toTouchSpanPoint(reEvaluationDto.evaluationUrl, (upTitle.evaluationUrl?'first':'update'), 'down')}
          >{`${reEvaluationDto.name}`}</span>
        </div>
      </div>
      
      {upTitle.productInfo && 
        <div className={styles.footBtn}>
          <button onClick={() => this.gotoProduct(upTitle.productInfo)}>立即购买宝宝营养基因检测</button>
        </div>
      }
      </React.Fragment>
    )
  }
}

export default SiweiBox
