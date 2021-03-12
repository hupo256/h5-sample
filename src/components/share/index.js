import React from 'react'
import propTypes from 'prop-types'
import styles from './index.scss'
class Share extends React.Component {
  static propTypes = {
    children: propTypes.object.isRequired,
    canvasParams: propTypes.object.isRequired,
    reportDetail: propTypes.object.isRequired,
    onClose: propTypes.func.isRequired,
    base64: propTypes.string
  }

  render() {
    const {
      children,
      base64,
      canvasParams,
      onClose,
      reportDetail = {}
    } = this.props
    const { name = '', cardTypeDesc = '', cardHeadDesc = '' } =
      reportDetail.basicUserInfo || {}
    const { headPic, linkManHeadPic, userName, linkManName } = canvasParams
    const { moduleTraitN = {},tradeProductInfoDTO={} } = reportDetail
    return (
      <div className={styles.flexd}>
        <p>
          <span onClick={onClose} className={`iconfont ${styles.closeIcon}`}>
            &#xe603;
          </span>
        </p>
        {base64 ? (
          <div className={`${styles.repotCard} ${styles.pd}`}>
            <img src={base64} />
          </div>
        ) : (
          <div
            className={styles.repotCard}
            id='canvas'
            style={{
              position: 'relative',
              left: '0%',
              background: `linear-gradient(135deg, ${
                reportDetail.gradation
              } 0%, ${reportDetail.secondGradation} 100%)`
            }}
          >
            <div className={styles.maskBg} />
            <div>
              <div className={styles.userInfo}>
                <img
                  src={
                    linkManHeadPic || headPic
                      ? `data:image/png;base64,${linkManHeadPic || headPic}`
                      : ''
                  }
                />
                <div>
                  {linkManName ? <span>{linkManName}</span> : ''}
                  {!linkManName && userName ? <span>{userName}</span> : ''}
                  {!linkManName && !userName ? (
                    <span>{`${name}${cardTypeDesc}`}</span>
                  ) : (
                    ''
                  )}
                  {/* <p>{`${moduleTraitN.value.length > 8 ? moduleTraitN.value.slice(0, 7) + '...' : moduleTraitN.value}基因检测报告`}</p> */}
                </div>
              </div>
              <div className={styles.reportBox}>{children}</div>
            </div>
          </div>
        )}

        {/* <span>长按保存图片</span> */}
      </div>
    )
  }
}
export default Share
