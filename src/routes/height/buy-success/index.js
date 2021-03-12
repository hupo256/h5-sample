import React from 'react'
import propTypes from 'prop-types'
import { fun, images } from '@src/common/app'
import wxconfig from '@src/common/utils/wxconfig'
import { Page } from '@src/components'
import {
  trackPointToolHeightOrdersuccessPageView,
  trackPointToolHeightPageBtnClick
} from '../buried-point'
import styles from './buy.scss'

const { getSession } = fun
class Nodata extends React.Component {
  state = {
    stepList: [{
      title: '第一步',
      desc: 'IOS用户进“应用商店”，搜索“安我生活”，下载并安装。<br />安卓用户进“应用宝”，搜索“安我生活”，下载并安装。',
      imageUrl: images.step1,
      className: styles.first
    }, {
      title: '第二步',
      desc: '打开APP， 进入“首页”，点击“绑定样本”按钮，未绑定用户根据绑定流程，绑定自己的样本。已绑定用户，输入手机号与验证码，登陆自己的账号。',
      imageUrl: images.step2,
      className: styles.second
    }, {
      title: '第三步',
      desc: '在“我的”的界面找到“身高检测工具”，点击进入，就可以使用“身高自测”小工具了。',
      imageUrl: images.step3,
      className: styles.third
    }]
  }
  componentDidMount () {
    trackPointToolHeightOrdersuccessPageView({ os_version: 'wechat_h5' })
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
  handleJumpBao = () => {
    trackPointToolHeightPageBtnClick({ Btn_name: 'ordersuccess_to_app', os_version: 'wechat_h5' })
    window.location.href = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.jxsw.andall'
  }
  render () {
    const { stepList } = this.state
    return (
      <Page title='支付成功页'>
        <div className={styles.successCont}>
          <img className={styles.topimg} src={images.buysuccessBg} />
          <div className={styles.stepsBox}>
            <div className={styles.bigTitle}>简单3步</div>
            <div className={`${styles.bigTitle} ${styles.mb30}`}>查看自己的报告</div>
            {
              stepList.map((item, index) => {
                return (<div key={index} className={styles.item}>
                  <div className={styles.title}>
                    <text className={styles.span}>{item.title}</text>
                  </div>
                  <div className={styles.desc} dangerouslySetInnerHTML={{ __html: item.desc }} />
                  <img className={item.className} src={item.imageUrl} />
                </div>)
              })
            }
            <span className={styles.btn} onClick={this.handleJumpBao}>打开安我APP</span>
          </div>
        </div>
      </Page>
    )
  }
}
Nodata.propTypes = {
  history: propTypes.object,
}
export default Nodata
