import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'react-redux'
import { fun, ua } from '@/common/app'
import wxconfig from '@/common/utils/wxconfig'
import { mapDispatchToProps, mapStateToProps } from '@/store/actions/user'
import { Page } from '@/components'
import {
  trackPointToolHeightComparePageView,
  trackPointToolHeightPageBtnClick
} from '../buried-point'
import geneSmile from '@/assets/images/height/gene_smile.png'
import geneYa from '@/assets/images/height/gene_ya.png'
import measureSmile from '@/assets/images/height/measure_smile.png'
import measureYa from '@/assets/images/height/measure_ya.png'
import styles from './contrast.scss'

const { getSession } = fun
const { isAndall, isIos } = ua
class ContrastHeight extends React.Component {
  state = {
    heightData: {},
    heightInfo: {}
  }
  componentDidMount () {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightComparePageView({ os_version: version })
    const heightInfo = getSession('heightInfo') || {}
    heightInfo.linkManName = getSession('heightLinkManName') || ''
    this.setState({
      heightInfo
    })
    const { curHeight, dnaHeight } = heightInfo
    const geneHeight = dnaHeight
    const measureHeight = curHeight
    this.handleComputerHeight(geneHeight, measureHeight)
    this.wxShare(getSession('shareInfo'))
  }
  /**
   * 微信分享
   */
  wxShare = (shareInfo) => {
    const { title, jumpUrl, subTitle, headImg } = shareInfo
    wxconfig({
      showMenu: true,
      params:{
        title,
        link: jumpUrl,
        desc: subTitle,
        imgUrl: headImg,
      }
    })
  }
  handleComputerHeight = (gene, measure) => {
    const geneHeight = parseFloat(gene)
    const measureHeight = parseFloat(measure)
    let heightData = {
      lh: gene,
      rh: measure
    }
    if (geneHeight === measureHeight) {
      // 一样高
      heightData = {
        ...heightData,
        lt: '171px',
        rt: '171px',
        limg: geneSmile,
        rimg: measureSmile
      }
    } else if (geneHeight - measureHeight > 0) {
      // 基因身高比测量身高大
      heightData = {
        ...heightData,
        limg: geneSmile,
        rimg: measureYa
      }
      if (geneHeight - measureHeight <= 10) {
        // 10以内
        heightData = {
          ...heightData,
          lt: '181px',
          rt: '161px'
        }
      } else if (geneHeight - measureHeight > 10 && geneHeight - measureHeight <= 20) {
        // 20以内
        heightData = {
          ...heightData,
          lt: '191px',
          rt: '151px'
        }
      } else if (geneHeight - measureHeight > 20 && geneHeight - measureHeight <= 30) {
        // 30以内
        heightData = {
          ...heightData,
          lt: '201px',
          rt: '141px'
        }
      } else if (geneHeight - measureHeight > 30 && geneHeight - measureHeight <= 40) {
        // 40以内
        heightData = {
          ...heightData,
          lt: '211px',
          rt: '131px'
        }
      // } else if (geneHeight - measureHeight > 40 && geneHeight - measureHeight <= 50) {
      } else if (geneHeight - measureHeight > 40) {
        // 50以内
        heightData = {
          ...heightData,
          lt: '221px',
          rt: '121px'
        }
      }
    } else if (geneHeight - measureHeight < 0) {
      // 基因身高比测量身高小
      heightData = {
        ...heightData,
        limg: geneYa,
        rimg: measureSmile
      }
      if (measureHeight - geneHeight <= 10) {
        // 10以内
        heightData = {
          ...heightData,
          lt: '161px',
          rt: '181px'
        }
      } else if (measureHeight - geneHeight > 10 && measureHeight - geneHeight <= 20) {
        // 20以内
        heightData = {
          ...heightData,
          lt: '151px',
          rt: '191px'
        }
      } else if (measureHeight - geneHeight > 20 && measureHeight - geneHeight <= 30) {
        // 30以内
        heightData = {
          ...heightData,
          lt: '141px',
          rt: '201px'
        }
      } else if (measureHeight - geneHeight > 30 && measureHeight - geneHeight <= 40) {
        // 40以内
        heightData = {
          ...heightData,
          lt: '131px',
          rt: '211px'
        }
      // } else if (measureHeight - geneHeight > 40 && measureHeight - geneHeight <= 50) {
      } else if (measureHeight - geneHeight > 40) {
        // 50以内
        heightData = {
          ...heightData,
          lt: '121px',
          rt: '221px'
        }
      }
    }
    this.setState({
      heightData
    })
  }
  handleJumpBao = () => {
    let version = 'wechat_h5'
    if (isAndall()) {
      if (isIos()) {
        version = 'app_ios'
      } else {
        version = 'app_android'
      }
    }
    trackPointToolHeightPageBtnClick({ Btn_name: 'compare_to_report', os_version: version })
    window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.jxsw.andall'
  }
  render () {
    const { heightData, heightInfo } = this.state
    return (
      <Page title='儿童身高潜力测评'>
        <div className={styles.contrastCont}>
          <p className={styles.title}>根据{heightInfo.linkManName}的基因信息</p>
          <p className={styles.desc}>{heightInfo.linkManName}目前的<i>基因身高</i>预计为<span>{heightInfo.dnaHeight}</span>厘米</p>
          <div className={styles.heightCont}>
            <div className={styles.left}>
              <p className={styles.heightTitle}>基因身高</p>
              <p className={styles.heightNum}>{heightData.lh}</p>
              <p className={styles.heightDesc}>cm</p>
              <div className={styles.imgBox} style={{ height: heightData.lt }}>
                <img src={heightData.limg} alt='' />
              </div>
            </div>
            <div className={styles.right}>
              <p className={styles.heightTitle}>测量身高</p>
              <p className={styles.heightNum}>{heightData.rh}</p>
              <p className={styles.heightDesc}>cm</p>
              <div className={styles.imgBox} style={{ height: heightData.rt }}>
                <img src={heightData.rimg} alt='' />
              </div>
            </div>
          </div>
          <p className={styles.desc1}>*根据数据统计，该年龄段的儿童身高应为{heightInfo.normalHeightRange}厘米</p>
          <p className={styles.text} dangerouslySetInnerHTML={{ __html: heightInfo.testDesc }} />
          <span className={styles.btn} onClick={this.handleJumpBao}>点击查看基因检测报告</span>
        </div>
      </Page>
    )
  }
}
ContrastHeight.propTypes = {
  history: propTypes.object,
}
export default connect(mapStateToProps, mapDispatchToProps)(ContrastHeight)
