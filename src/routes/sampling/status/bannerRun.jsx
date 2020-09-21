import React from 'react'
import { point } from '@src/common/app'
import styles from '../sampling'

const { allPointTrack } = point

class BannerRun extends React.Component {
  state = {
    indexAd: 0,
  }

  componentDidMount() {
    this.runADBox()
  }

  // 埋点记录查看样本状态
  ComponentBannerGoto = (viewType, url) => {
    allPointTrack({
      eventName: viewType,
      pointParams: {
        url: url,
      }
    })
  }

  runADBox = () => {
    let { indexAd } = this.state
    const { banArr } = this.props
    let lenAd = banArr.length
    setInterval(() => {
      indexAd++
      if(indexAd === lenAd) indexAd = 0
      this.setState({ indexAd })
    }, 4000)
  }

  gotoDdPage = (url) => {
    const {viewType} = this.props
    this.ComponentBannerGoto(viewType, url)
    setTimeout(() => {
      window.location.href = url
    }, 200)
  }

  render () {
    const { banArr } = this.props
    const { indexAd } = this.state
    const banLen = banArr.length
    return (
      <div className={styles.adShowbox}>
        <div className={styles.anibox} style={{width: `${banLen*100}%`, marginLeft: `${-indexAd*100}%`}}>
          {banArr.map((ban, index) => {
            const {bannerPicUrl, bannerJumpUrl} = ban
            return <img 
                key={index}
                style={{width: `${(1/banLen)*100}%`}}
                src={bannerPicUrl} 
                onClick={() => this.gotoDdPage(bannerJumpUrl)} 
              />
          })}
        </div>
      </div>
    )
  }
}
export default BannerRun

