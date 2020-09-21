import React from 'react'
import PropTypes from 'prop-types'
import { API, fun, point } from '@src/common/app'
import Page from '@src/components/page'
import Setp from '../components/setp'
import styles from '../binding'
const { getSetssion, getParams } = fun
const { allPointTrack } = point
class Authorization extends React.Component {
  // 提交
  handelSubmit = () => {
    const { location, history } = this.props
    const { state } = location
    const params = state ? state.params : {}
    const jdAccountNum = getSetssion('JDACOUNT') || ''
    const barcode = getSetssion('barcode')
    const searchUrl = getSetssion('searchUrl')
    const urlParams = getParams(searchUrl) || {}
    // 授权样本检测权限
    allPointTrack({ eventName: 'sample_bind_grant', pointParams: { sample_barcode: barcode } })
    API.bindCollectorUser({ ...params, barcode, ...jdAccountNum, ...urlParams }).then(res => {
      if (!res.code) {
        this.trackPointSampleBindComplete({ ...location.state, barcode })
        history.push('/binding/binding-success')
      }
    })
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
  render() {
    const { state } = this.props.location
    const obj = state ? state.info : {}
    return (
      <Page title='报告同意授权书'>
        <div>
          <Setp number={3} show />
          <div className={styles.protocol}>
            <div className={`pd55 ${styles.pt120}`}>
              <h2>报告授权同意书</h2>
              <p>本人使用了上海解兮生物科技有限公司的<span>{obj.productName || ''}</span>基因检测产品服务，该服务将生成有关本人的<span>{obj.productName || ''}</span>基因检测报告（“检测报告”）。</p>
              <p>鉴于本人自愿参加<span>{obj.projectName || ''}</span>研究项目，本人在此授权并指示上海解兮生物科技有限公司将本人检测报告全文提供给如下方：</p>
              <p>1. 接收方：<span>{obj.receiveName || ''}</span>；所属医院：<span>{obj.hospitalName || ''}</span>。</p>
              <p>2. 报告提供形式可以通过纸质形式或电子文件形式提供。</p>
              <p>本人已明确知悉并同意，接收方对检测报告的使用目的和范围，愿意承担检测报告的披露可能导致的后果。</p>
            </div>
          </div>
          <div onClick={this.handelSubmit} className='foot' >
            <button className={`btn ${styles.foot}`}>同意授权</button>
          </div>
        </div>
      </Page>

    )
  }
}
Authorization.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}
export default Authorization
