import React from 'react'
import { observer, inject } from 'mobx-react'
import fun from '@src/common/utils'
import ua from '@src/common/utils/ua'
import point from '@src/common/utils/point'
import samplingApi from '@src/common/api/samplingApi'
import homeApi from '@src/common/api/homeApi'
import Page from '@src/components/page'
import Setp from '../components/setp'
import AgreeCon from './AgreeCon'
import AgreeConAn from './AgreeConAn'
import AgreeConHPV from './AgreeConHPV'
import AgreeBreastCancer from './AgreeBreastCancer'
import toBottom from '@static/bindOnly/tobottom.png'
import styles from '../binding'
const { getSetssion, getParams, setSetssion, getSession } = fun
const { allPointTrack } = point

@inject('user')
@observer
class Protocol extends React.Component {
  state = {
    running: false,
    showTips: false,
  }

  componentDidMount() {
    console.log(this.props)
    window.addEventListener('scroll', () => {
      this.isArriveBottom() && this.setState({ showTips: false })
    }, false)
  }

  // 埋点记录完成绑定样本
  trackPointSampleBindComplete(userInfo) {
    let obj = {
      eventName: 'sample_bind_complete',
      pointParams: {
        sample_barcode: userInfo.barcode,
        sample_linkman: userInfo.linkManId,
        sample_name: userInfo.userName.substr(0, 1) + '**',
        relationId: userInfo.relationId,
        sample_sex: userInfo.sex,
        sample_birthday: userInfo.birthday
      }
    }
    allPointTrack(obj)
  }

  // 判断是否显示授权书,有就跳授权书，没有直接绑定
  handelSubmit = () => {
    const isBtm = this.isArriveBottom()
    if (!isBtm) {
      this.setState({ showTips: true })
      return
    }

    this.setState({ showTips: false, running: true })
    const { location, history } = this.props
    const jdAccountNum = getSetssion('JDACOUNT') || ''
    const thirdPartyOrderNo = getSetssion('ORDERINPUT') || ''
    const searchUrl = getSetssion('searchUrl')
    const { isAuthorized } = getSetssion('isAuthorized')
    const { linkManId, barcode, userName, height, weight } = location.state
    const params = +isAuthorized ? getParams(searchUrl) : {}
    if (+isAuthorized) {
      samplingApi.getUserAuthorizedInfo({ barCode: barcode, ...params }).then(response => {
        if (!response.code) {
          const { isAuthorized, ...params } = response.data
          history.push({
            pathname: '/binding/authorization',
            state: { params: location.state, info: params }
          })
        }
      })
      return
    }
    allPointTrack({ eventName: 'sample_bind_grant', pointParams: { sample_barcode: barcode } })

    // const whTex = `${height ? '&height='+height : ''}${weight ? '&weight='+weight : ''}`
    // history.push(`/binding/question?linkManId=${linkManId}&barCode=${barcode}&type=${kitType}${whTex}`)
    // return

    // 授权样本检测权限
    const kitType = getSetssion('kitType')
    const addNewFlag = getSetssion('addNewFlag')
    if (kitType === 'INTESTINE_BIND') {
      const whTex = addNewFlag ? `${height ? '&height=' + height : ''}${weight ? '&weight=' + weight : ''}` : ''
      history.push(`/binding/question?linkManId=${linkManId}&barCode=${barcode}&type=${kitType}${whTex}`)
      return
    }

    const apitTag = !kitType ? 'bindCollectorUser' : 'bindCollectorUserKit'
    let paramsObj = { ...location.state, barcode, ...jdAccountNum, ...thirdPartyOrderNo, ...params }
    !!kitType && (paramsObj = { barcode, linkManId, type: kitType })
    samplingApi[apitTag](paramsObj).then(res => {
      if (!res.code) {
        this.trackPointSampleBindComplete({ ...location.state, barcode })
        this.toLastUserLindManId({ linkManId, userName, barCode: barcode }, '/binding/binding-success', res.data)
      }
    })
  }

  /**
   * 保存切换关系人linkManId
   */
  toLastUserLindManId = (obj = {}, url, data) => {
    const { user: { upLindManId }, history } = this.props
    const { linkManId = '', barCode } = obj || {}
    linkManId && homeApi.saveLastUserLindManId({ linkManId, noloading: 1 }).then(res => {
      const { code } = res
      code || upLindManId(obj)
      setSetssion('bindSuccess', { linkManId, barcode: barCode })

      history.push({
        pathname: url,
        state: { ...data },
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
      return scrollHeight
    }
  }

  render() {
    const kitType = getSetssion('kitType')
    const { showTips, running } = this.state
    return (
      <Page title='知情同意书'>
        <React.Fragment>
          <Setp number={2} />
          <div className={styles.protocol}>
            <div className={`pd55 ${styles.pt120}`}>
              { kitType === 'INTESTINE_BIND' && <AgreeConAn />}
              { kitType === 'HPV_BIND' && <AgreeConHPV />}
              { kitType === 'BREAST_CANCER_BIND' && <AgreeBreastCancer />}
              { (kitType === 'KIT_BIND' || !kitType) && <AgreeCon />}

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
        </React.Fragment>
      </Page>
    )
  }
}

export default Protocol
