import React from 'react'
import propTypes from 'prop-types'
import styles from './noData.scss'
import heightClose3 from '@static/height/icon_close3.png'
import noDataBg from '@static/height/noDataBg.png'
class NoDataBomb extends React.Component {
  state = {
  }
  componentDidMount () {
  }
  handleSetContent = () => {
    const { hasReport, invalidFlag, code } = this.props
    const { nutritionInvalidFlag, nutritionEvaluationFlag, sportInvalidFlag, sportEvaluationFlag, sleepInvalidFlag, sleepEvaluationFlag } = invalidFlag || {}
    if (code === 'Nutrition') {
      if ((hasReport && !nutritionEvaluationFlag) || (hasReport && nutritionInvalidFlag)) {
        return (<p className={styles.desc}>
          {
            (hasReport && !nutritionEvaluationFlag)
              ? '填写测评问卷后，查看测评结果与基因检测结果的综合专家建议。'
              : '距离上次测评已超过30天，请重新测评，给出更符合现状的评估。'
          }
        </p>)
      }
    } else if (code === 'Sport') {
      if ((hasReport && !sportEvaluationFlag) || (hasReport && sportInvalidFlag)) {
        return (<p className={styles.desc}>
          {
            (hasReport && !sportEvaluationFlag)
              ? '填写测评问卷后，查看测评结果与基因检测结果的综合专家建议。'
              : '距离上次测评已超过30天，请重新测评，给出更符合现状的评估。'
          }
        </p>)
      }
    } else if (code === 'Sleep') {
      if ((hasReport && !sleepEvaluationFlag) || (hasReport && sleepInvalidFlag)) {
        return (<p className={styles.desc}>
          {
            (hasReport && !sleepEvaluationFlag)
              ? '填写测评问卷后，查看测评结果与基因检测结果的综合专家建议。'
              : '距离上次测评已超过30天，请重新测评，给出更符合现状的评估。'
          }
        </p>)
      }
    }
  }
  render () {
    const { goToTest, buyFun, hasReport, evaluationFlag, closeFn, invalidFlag } = this.props
    return (
      <div className={styles.noDataCont}>
        <div className={styles.detailCont}>
          <img className={styles.close} onClick={closeFn} src={heightClose3} alt='' />
          <img className={styles.img} src={noDataBg} alt='' />
          {
            !hasReport
              ? <p className={styles.desc}>宝宝还没有基因检测数据，无法结合评测问卷给出专家建议。</p>
              : ''
          }
          {
            this.handleSetContent()
          }
          {
            !hasReport
              ? <span className={styles.btn} onClick={buyFun} >了解基因检测</span>
              : ''
          }
          {
            (hasReport && !evaluationFlag) || (hasReport && invalidFlag)
              ? <span className={styles.btn} onClick={goToTest} >立即测评</span>
              : ''
          }
        </div>
      </div>
    )
  }
}
NoDataBomb.propTypes = {
  closeFn: propTypes.func,
  goToTest: propTypes.func,
  buyFun: propTypes.func,
  hasReport: propTypes.bool,
  evaluationFlag: propTypes.bool,
  invalidFlag: propTypes.bool,
  code: propTypes.String
}
export default NoDataBomb
