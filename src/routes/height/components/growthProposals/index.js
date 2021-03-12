import React from 'react'
import propTypes from 'prop-types'
import styles from './growp.scss'
import { images } from '@src/common/app'
class GrowthProposals extends React.Component {
  state = {
  }
  componentDidMount () {
  }
  handleSetContent = () => {
    const { growthObj } = this.props
    const { title, values, hasMask, goToCurve, invalid, evaluation, isCurve, date } = growthObj || {}
    if (isCurve) {
      return <div className={`${hasMask ? styles.growthCont : styles.growthCont1}`}>
        <p className={styles.growthTitle}>
          <em />
          <span>{title}</span>
        </p>
        {
          values && values.length
            ? values.map((item, index) => {
              return <div
                key={index}
                className={styles.growthTextItem}
              >
                <em>{index < 9 ? `0${index + 1}` : index + 1}</em>
                <span className={styles.growthText} dangerouslySetInnerHTML={{ __html: item }} />
              </div>
            })
            : ''
        }
        {
          hasMask ? <div className={styles.growthMask} /> : ''
        }
      </div>
    } else {
      if (evaluation) { // 测评过了
        if (invalid) { // 过期
          return <div className={styles.growthDetail}>
            <div className={styles.growthCont1}>
              <p className={styles.growthTitle}>
                <em />
                <span>{title}</span>
              </p>
              {
                date && <p className={styles.growthDate}>测评日期：{date}</p>
              }
              <p className={styles.nodata}>距离上次测评已超过30天，请更新{title.substring(title.length - 4)}。</p>
            </div>
            <span className={styles.growthBtn} onClick={goToCurve}>
              重新测评
            </span>
          </div>
        } else { // 未过期
          return <div className={styles.growthDetail}>
            <div className={`${hasMask ? styles.growthCont : styles.growthCont1}`}>
              <p className={styles.growthTitle}>
                <em />
                <span>{title}</span>
              </p>
              {
                date && <p className={styles.growthDate}>测评日期：{date}</p>
              }
              {
                values && values.length
                  ? values.map((item, index) => {
                    return <div
                      key={index}
                      className={styles.growthTextItem}
                    >
                      <em>{index < 9 ? `0${index + 1}` : index + 1}</em>
                      <span className={styles.growthText} dangerouslySetInnerHTML={{ __html: item }} />
                    </div>
                  })
                  : ''
              }
              {
                hasMask ? <div className={styles.growthMask} /> : ''
              }
            </div>
            <span className={styles.growthBtn} onClick={goToCurve}>
              查看完整建议 >
            </span>
          </div>
        }
      } else {
        return <div className={styles.growthDetail}>
          <div className={styles.growthCont1}>
            <p className={styles.growthTitle}>
              <em />
              <span>{title}</span>
            </p>
            <p className={styles.nodata}>告诉我宝宝的睡眠状态，获取健康{title.substring(title.length - 4)}。</p>
          </div>
          <span className={styles.growthBtn} onClick={goToCurve}>
            开始测评
          </span>
        </div>
      }
    }
  }
  render () {
    return (
      <div>
        {this.handleSetContent()}
        {/* {
          evaluation
            ? <div className={styles.growthDetail}>
              <div className={`${hasMask ? styles.growthCont : styles.growthCont1}`}>
                <p className={styles.growthTitle}>
                  <em />
                  <span>{title}</span>
                </p>
                {
                  values && values.length
                    ? values.map((item, index) => {
                      return <div
                        key={index}
                        className={styles.growthTextItem}
                      >
                        <em>{index < 9 ? `0${index + 1}` : index + 1}</em>
                        <span className={styles.growthText} dangerouslySetInnerHTML={{ __html: item }} />
                      </div>
                    })
                    : ''
                }
                {
                  hasMask ? <div className={styles.growthMask} /> : ''
                }
              </div>
              <span className={styles.growthBtn} onClick={goToCurve}>
                查看完整建议 >
              </span>
            </div>
            : ''
        } */}
      </div>

    )
  }
}
GrowthProposals.propTypes = {
  growthObj: propTypes.object,
}
export default GrowthProposals
