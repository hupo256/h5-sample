import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { API, fun, point } from '@src/common/app'
import { Page } from '@src/components'
import Setp from '../components/setp'
import toBottom from '@static/bindOnly/tobottom.png'
import styles from '../binding'
const { getSetssion, getParams } = fun
const { allPointTrack } = point

@inject('user')
@observer
class Protocol extends React.Component {
  state={
    running: false,
    showTips: false,
    kitType: ''
  }

  componentDidMount() {
    const { state } = this.props.location
    this.setState({
      kitType: state.type
    })
    window.addEventListener('scroll', () => {
      this.isArriveBottom() && this.setState({ showTips: false })
    }, false)
  }

  // 判断是否显示授权书,有就跳授权书，没有直接绑定
  handelSubmit = () => {
    const isBtm = this.isArriveBottom()
    if (!isBtm) {
      this.setState({ showTips: true })
      return
    }

    this.setState({ showTips: false })
    const { location, history } = this.props
    const jdAccountNum = getSetssion('JDACOUNT') || ''
    const barcode = getSetssion('barcode')
    const thirdPartyOrderNo = getSetssion('ORDERINPUT') || ''
    const searchUrl = getSetssion('searchUrl')
    const { isAuthorized } = getSetssion('isAuthorized')
    const params = +isAuthorized ? getParams(searchUrl) || {} : {}
    if (+isAuthorized) {
      API.getUserAuthorizedInfo({ barCode: barcode.barcode, ...params }).then(response => {
        if (!response.code) {
          const { isAuthorized, ...params } = response.data
          history.push({
            pathname: '/authorization',
            state: {
              params: location.state,
              info: params
            }
          })
        }
      })
      return
    }
    // 授权样本检测权限
    allPointTrack({ eventName: 'sample_bind_grant', pointParams: { sample_barcode: barcode } })
    API.bindCollectorUser({ ...location.state, ...barcode, ...jdAccountNum, ...thirdPartyOrderNo, ...params }).then(res => {
      if (!res.code) {
        this.trackPointSampleBindComplete({ ...location.state, ...barcode })
        const { linkManId, bindUserName } = location.state
        this.saveLastUserLindManId({ linkManId, userName: bindUserName }, '/binding-success', res.data)
      }
    })

    this.setState({ running: true })
  }
  // 埋点记录完成绑定样本
  trackPointSampleBindComplete(userInfo) {
    let obj = {
      eventName: 'sample_bind_complete',
      pointParams: {
        sample_barcode: userInfo.barcode,
        sample_linkman: userInfo.linkManId,
        sample_name: userInfo.bindUserName.substr(0, 1) + '**',
        relationId: userInfo.relationId,
        sample_sex: userInfo.sex,
        sample_birthday: userInfo.birthday
      }
    }
    allPointTrack(obj)
  }
  /**
   * 保存切换关系人linkManId
   */
  saveLastUserLindManId = (obj = {}, url, data) => {
    const { user:{ upLindManId }, history } = this.props
    const { linkManId = '' } = obj
    linkManId && API.saveLastUserLindManId({ linkManId, noloading: 1 }).then(res => {
      const { code } = res
      if (!code) {
        upLindManId(obj)
      }
      // history.push(url)
      history.push({
        pathname: url,
        state: { ...data }
      })
    })
  }

  isArriveBottom = () => {
    return getScrollHeight() < getDocumentTop() + getWindowHeight() + 100

    // 文档滚动高度
    function getDocumentTop() {
      let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0
      if (document.body) bodyScrollTop = document.body.scrollTop
      if (document.documentElement) documentScrollTop = document.documentElement.scrollTop
      scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
      // console.log("scrollTop:"+scrollTop);
      return scrollTop
    }

    // 可视窗口高度
    function getWindowHeight() {
      const windowHeight = document.compatMode == 'CSS1Compat'
        ? document.documentElement.clientHeight : document.body.clientHeight
        // console.log("windowHeight:"+windowHeight);
      return windowHeight
    }

    // 滚动条滚动高度
    function getScrollHeight() {
      let scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0
      if (document.body) bodyScrollHeight = document.body.scrollHeight
      if (document.documentElement) documentScrollHeight = document.documentElement.scrollHeight
      scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight
      // console.log("scrollHeight:"+scrollHeight);
      return scrollHeight
    }
  }

  render() {
    const { showTips, running } = this.state
    return (
      <Page title='知情同意书'>
        <div>
          <Setp number={2} />
          <div className={styles.protocol}>
            <div className={`pd55 ${styles.pt120}`}>
              <h2>安我基因检测知情同意书</h2>
              <p>欢迎您选用上海解兮生物科技有限公司（“服务机构”）提供的“安我”品牌基因检测服务（“本检测”）。</p>
              <p>为了保证您（“受检者”）在充分知情同意的情况下参加本检测，请仔细阅读本《安我基因检测知情同意书》（“知情同意书”）。请您亲自阅读，或请其他人阅读给您听，以确保您已充分了解本知情同意书所有条款， 包括免除或者限制服务机构责任的免责条款及对用户的权利限制，并决定是否接受本知情同意书（无民事行为能力人或限制民事行为能力人由其法定监护人作出相应决定）。如您对本知情同意书的任何内容持有异议，应停止使用或主动取消服务机构提供的服务。</p>
              <span>样本采集：</span>
              <p>在本测试中，受检者需按照说明书，使用服务机构提供的采集套装采集受检者本人口腔内组织及唾液样本，所采集的样本仅用于提取DNA供本检测使用。</p>
              <p>如受检者在确认接受本检测后的两年内未将检测样本交付于公司或者未交付符合检测要求的检测样本，则视为服务机构已提供并完成本检测。</p>
              <span>检测目的：</span>
              <p>本检测通过对受检者提供的检测样本进行基因检测，评估受检者受基因影响的遗传特征，从而帮助受检者更好地理解自己的遗传特征，采取科学的生活方式、膳食规划等健康管理措施。</p>
              <span>检测局限性：</span>
              <p>1. 本检测不具有医学临床诊断或治疗的目的，在任何情况下均不应将其代替医学临床诊断或分析或者作为医学临床诊断或分析的依据。</p>
              <p>2. 本检测仅从基因层面对受检者的相关检测项进行分析，而受检者的当前状况受多种内外界因素共同影响，检测结果不代表受检者的当前实际状况，且不建议受检者根据自身状况以及本检测结果进行自我诊断得出结论。如受检者有任何疑问，请务必结合本检测结果向临床医生或权威健康专家进行咨询，以获得有针对性的建议。</p>
              <p>3. 本检测仅针对科学研究已知的与检测项有关联的基因进行检测，不包含任何未经充分科学研究证实或尚未发现的与检测项可能相关的潜在基因。同时，受限于现有科学技术发展水平，本检测可能未能覆盖所有与检测项相关联的基因或位点。</p>
              <p>4. 本检测仅针对人类基因组上有关单核苷酸多态性位点进行检测，不包含包括DNA片段插入/缺失/倒位，拷贝数变异，染色质/染色体结构核型异常，基因表达异常，表观遗传异常等在内的任何非单核苷酸多态性的遗传变异。</p>
              <p>5. 本检测相关检测项结果中出现的任何“风险较低”或“风险中等”等类似描述，并不代表完全没有风险，不应认为受检者完全免疫某种健康风险。“风险较高”及类似描述，并不代表一定会出现某种健康或疾病问题，亦不应将此结果作为任何临床诊断或分析的判断依据。</p>
              <p>6. 由于当前科学发展技术水平有限、受检者个体情况存在差异或受检者提供检测样本不符合规范等原因，即使在服务机构和相关检测人员已经完全履行了工作职责和规范操作程序的前提下，仍有可能出现无法检测、检测失败或检测结果不准确的情况。</p>
              <p>7. 随着基因研究水平的发展，在未来可能出现对本检测结果的重新解读的情况。</p>
              <span>保密原则：</span>
              <p>受检者个人身份所包括的姓名、年龄、联系方式、身份证号等信息，服务机构或其委托检测机构将进行严格保密，除法律规定或政府机关要求外，在未征得受检者同意前，不会以任何形式披露给除服务机构或其委托检测机构之外的第三方。服务机构及其工作人员仅在提供本检测所必须的范围内访问并使用受检者的个人信息。</p>
              <p>受检者应妥善保管个人信息，避免将其泄露给其他个人或机构，并及时向服务机构告知任何泄露风险。因受检者自身原因造成的个人信息泄露，服务机构不承担任何责任。</p>
              <span>其他条款：</span>
              <p>1. 受检者需要通过服务机构提供的样本采集套装采集本人唾液，并保证样本属于受检者本人，服务机构或其委托检测机构对样本的真实性不承担任何责任。</p>
              <p>2. 在任何情况下，服务机构都不对受检者或任何第三方因使用服务机构提供的信息或服务导致的直接或间接后果承担任何责任。</p>
              <p>3. 受检者（或其监护人）授权服务机构或其委托检测机构对采集的样本进行基因检测，并授权服务机构或其委托检测机构对所获取的实验数据和剩余样本出于科学研究目的在事先去除可识别个人信息的情况下依据现行有效的法律法规进行保存和使用。对于任何在本检测过程中产生或与提供本检测相关的成果，包括但不限于数据、文章、图片、音频、视频、专利以及产品等，受检者并不享有任何所有权或知识产权。</p>
              <p>4. 考虑到检测的复杂性和可能产生的影响，在检测过程中及知晓检测结果后，受检者可能会出现不同程度的精神压力和负担，服务机构不为此承担任何责任。受检者不应将本检测结果作为临床诊断的依据，也不应将其作为受检者生活和工作中重大决策的唯一依据。</p>
              <span>受检者声明：</span>
              <p>我勾选以下“我同意《安我基因检测知情同意书》”表明我已经阅读并知晓以上信息，同意并接受《安我基因检测知情同意书》所有内容。我已经了解了关于本检测中我想要知道的全部信息，并理解本检测的内容及可能的风险，且没有任何进一步的疑问。我自愿参加本次基因检测。</p>
            </div>
          </div>
          <div onClick={this.handelSubmit} className='foot'>
            <div className={`${styles.tobtmBox} ${showTips && styles.fadeIn}`}>
              <span>请向下滑动</span>
              <img src={toBottom} />
              <span>阅读完整内容</span>
            </div>
            <button disabled={running} className={`btn ${styles.foot}`}>我已阅读并同意上述内容</button>
          </div>
        </div>
      </Page>

    )
  }
}

export default Protocol
