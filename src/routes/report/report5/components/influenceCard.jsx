import React, { Component } from 'react'
import styles from '../style.scss'
import images from '../images'

class InfluenceCard extends Component {
  static propTypes = {

  }
  componentDidMount() {

  }

  render() {
    const { data, username, isAuthority } = this.props
    let star = Math.round(data.congenitalValue / 20)
    if (isAuthority === 2) { // 授权给他人看的报告不可点击
      if (document.getElementsByTagName('a').length) {
        for (let i = 0; i <= document.getElementsByTagName('a').length; i++) {
          if (document.getElementsByTagName('a')[i]) {
            document.getElementsByTagName('a')[i].removeAttribute('onclick', '')
            document.getElementsByTagName('a')[i].href = 'javascript:;'
          }
        }
      }
    }

    // console.log(star);
    if (data.congenitalValue / 20 == 2.5) {
      star = '2_5'
    }
    return (
      <div className={styles.card}>
        <div className={styles.influence}>
          <div>
            <img src={data.moduleIconUrl} alt='' />
            <div>{data.title && data.title.replace(/\$name/g, username)}</div>
          </div>
          <div />
          {
            data.congenitalValue &&
            <div className={styles.influTipBox}>
              <div style={{ backgroundImage: `url(${images.influTip1})` }}
              >{parseInt(data.congenitalValue)}<p>%</p></div>
              <img src={images[`character${data.linkManRoleType}`]} alt='' />
              <div style={{ backgroundImage: `url(${images.influTip2})` }}
              >{parseInt(data.acquiredValue)}<p>%</p></div>
              <p className={styles.gene}>基因影响</p>
              <p className={styles.env}>环境影响</p>
            </div>
          }
          {
            data.congenitalValue && <div className={styles.divline} />
          }
          <div>
            <div className={styles.influSec}>
              <div>基因影响</div>
              {
                data.congenitalValue && <div>影响程度 <img src={images[`starGene${star}`]} alt='' /></div>
              }
              <div
                className={styles.influText}
                dangerouslySetInnerHTML={{ __html: data.congenitalGeneDescription && data.congenitalGeneDescription.replace(/\$name/g, username) }} />
            </div>
            <div className={styles.influSec}>
              <div>环境影响</div>
              {
                data.congenitalValue && <div>影响程度 <img src={star == '2_5' ? images.starEnv2_5 : images[`starEnv${5 - star}`]} alt='' /></div>
              }
              <div
                className={styles.influText}
                dangerouslySetInnerHTML={{ __html: data.acquiredGeneDescription && data.acquiredGeneDescription.replace(/\$name/g, username) }} />
            </div>
          </div>
          {data.tipDesc && <div className={styles.tipDesc}>
            <div><img src={data.tipIconUrl} alt='' /></div>
            <div>{data.tipDesc.split('|').map((item, index) => {
              return (
                <p key={index}>{item && item.replace(/\$name/g, username)}</p>
              )
            })}</div>
          </div>
          }
        </div>
      </div>
    )
  }
}

export default InfluenceCard
