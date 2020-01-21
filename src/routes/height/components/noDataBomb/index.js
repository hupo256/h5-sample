import React from 'react'
import propTypes from 'prop-types'
import styles from './noData.scss'
import { images } from '@src/common/app'
class NoDataBomb extends React.Component {
  state = {
  }
  componentDidMount () {
  }
  render () {
    const { goToTest, buyFun, hasReport, evaluationFlag, closeFn, invalidFlag } = this.props
    return (
      <div className={styles.noDataCont}>
        <div className={styles.detailCont}>
          <img className={styles.close} onClick={closeFn} src={images.heightClose3} alt='' />
          <img className={styles.img} src={images.noDataBg} alt='' />
          {
            !hasReport
              ? <p className={styles.desc}>宝宝还没有基因检测数据，无法结合评测问卷给出专家建议。</p>
              : ''
          }
          {
            (hasReport && !evaluationFlag) || (hasReport && invalidFlag)
              ? <p className={styles.desc}>
                {
                  (hasReport && !evaluationFlag)
                    ? '填写测评问卷后，查看测评结果与基因检测结果的综合专家建议。'
                    : '距离上次测评已超过30天，请重新测评，给出更符合现状的评估。'
                }
              </p>
              : ''
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
}
export default NoDataBomb
