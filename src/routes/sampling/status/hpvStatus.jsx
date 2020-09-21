import React from 'react'
import Page from '@src/components/page'
import fun from '@src/common/utils'
import point from '@src/common/utils/point'
import samplingApi from '@src/common/api/samplingApi'
import images from './images'
import styles from './hpvs.scss'
const { getParams, getSetssion } = fun

const hpvList = [{
  labStage: '绑定',
  createTime: '2020年04月22日',
}, {
  labStage: '回寄中',
  createTime: '2020年04月22日',
}, {
  labStage: '检测中心收到样本',
  createTime: '预计耗时1天',
}, {
  labStage: '样本进入实验',
  createTime: '预计耗时14天',
}, {
  labStage: '报告生成',
  createTime: '',
}]

class Status extends React.Component {
  state = {
    statusList: [],
  }

  componentDidMount() {
    const kitType = getSetssion('kitType')
    console.log(kitType)
    const params = { barCode: getParams().barcode }
    samplingApi.listHPVReportStatusInfoByBarCode(params).then(res => {
      const { code, data } = res
      if (code) return
      const { reportStatusInfoRespList } = data
      const ind = reportStatusInfoRespList.length
      const statusList = reportStatusInfoRespList.concat(hpvList.slice(ind))
      this.setState({ ...data, statusList })
    })
  }

  render() {
    const kitType = getSetssion('kitType')
    const { statusList, productName, title, subTitle, barCode, linkManName, sex, birthDay } = this.state
    return (
      <Page title='样本状态'>
        <div className={styles.hpvbox}>
          <h2>{title}</h2>
          {subTitle && <h3><img src={images.timeImg} /> <span>{subTitle}</span></h3>}
          <div className={styles.infors}>
            <p>样本编号：{barCode}</p>
            <p>产品名称：{productName}</p>
            { kitType === 'INTESTINE_BIND' &&
              <React.Fragment>
                <p>检测人：{linkManName}</p>
                <p>性别：{sex === 'male' ? '男' : '女'}</p>
                <p>出生日期：{birthDay}</p>
              </React.Fragment>
            }
            <p>客服电话：400-682-2288</p>
            { kitType === 'INTESTINE_BIND' &&
              <p>肠道微生物样本进入实验室，进行微生物DNA提取，质检合格的DNA经过PCR扩增及纯化后完成文库构建，在高通量测序平台进行序列测定，测序原始数据经过处理以及多个指标分析解读后会第一时间生成报告推送给您哦，请耐心等待。</p>
            }
          </div>

          { statusList.length > 0 &&
            <ul className={styles.listbox}>
              {statusList.map((item, index) => {
                const { labStage, createTime, labStatus } = item
                return <li key={index} className={`${labStatus ? styles.on : ''}`}>
                  <img src={labStatus ? images.check : images.checkGray} className={styles.tipsimg} alt='' />
                  <img src={images[`hpvgit${index + 1}`]} alt='' />
                  <div className={styles.statusTit}>
                    <p>{labStage}</p>
                    <span>{createTime}</span>
                  </div>
                </li>
              })}
            </ul>
          }
        </div>
      </Page>
    )
  }
}

export default Status
