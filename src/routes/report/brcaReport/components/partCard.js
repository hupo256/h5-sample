import React, { Component } from 'react'
import propTypes from 'prop-types'
import CardTitle from './cardTitle.js'
import ShowModal from './showModal'
import styles from '../style.scss'
import images from '../images'
import { observer, inject } from 'mobx-react'
import { trackPointHpvPdfReportGoto, HpvPdfReportInfoConfirmGoto } from '../buried-point'
import { fun } from '@src/common/app'
import hpvReportApi from '@src/common/api/hpvReportApi'
import andall from '@src/common/utils/andall-sdk'
const { getParams } = fun
@inject('hpvReport')
@observer

class PartCard extends Component {
    static propTypes = {
      data:propTypes.object,
    }
      state = {
        modalFlag:false,
        downLoad:false,
        flag:1, // 1高危 2低危
        highCount:0,
        lowCount:0,
      }
      componentDidMount() {
        const { data } = this.props
        this.setState({
          highCount: data.highRiskList.filter(item => item.flag === 1).length,
          lowCount:data.lowRiskList.filter(item => item.flag === 1).length,
        })
      }
      modalToggle = (name, flag) => {
        console.log(name, this.state[name])
        const { hpvReport: { toggleNoscroll } } = this.props
        if (!this.state[name]) {
          sessionStorage.setItem('scrollY', window.scrollY)
        } else {
          if (sessionStorage.scrollY) {
            setTimeout(() => {
              window.scrollTo(0, sessionStorage.scrollY)
            })
          }
        }
        toggleNoscroll()
        this.setState({
          [name]: !this.state[name],
          flag
        })
      }
      downReportBtn=() => {
        if (getParams().shareToken) {
          return
        }
        const { hpvReport: { toggleNoscroll } } = this.props
        // sessionStorage.setItem('scrollY', window.scrollY)
        this.downReport(0)
        // setTimeout(() => {
        //   toggleNoscroll()
        // }, 400)
        trackPointHpvPdfReportGoto({
          sample_linkmanid: +localStorage.linkManId,
          sample_barcode:getParams().barCode,
          report_code:localStorage.productCode,
          basic_info:this.state.downLoad ? 0 : 1, // 0未确认 1确认
          report_result:localStorage.reprotResult === '阴性' ? 0 : 1
        })
      }
      // 确认报告信息
      goConfirm=(userName, age) => {
        console.log(userName, age)
        this.downReport(1, userName, age)
        HpvPdfReportInfoConfirmGoto({
          sample_linkmanid: +localStorage.linkManId,
          sample_barcode:getParams().barCode,
          report_code:localStorage.productCode,
          report_result:localStorage.reprotResult === '阴性' ? 0 : 1
        })
      }
      downReport=(operateType, userName, age) => {
        const { hpvReport: { toggleNoscroll } } = this.props
        hpvReportApi.userRealInfo({
          operateType,
          barCode:getParams().barCode,
          userRealInfoDto:{
            userName,
            age,
            sex:2
          }
        }).then(res => {
          if (res.data) {
            if (res.data.isWrite === 0) {
              // this.setState({ downLoad:true })
              this.modalToggle('downLoad')
            } else {
              if (!this.state[name] && operateType === 1) {
                this.modalToggle('downLoad')
              }
              andall.invoke('openUrl', { url:res.data.pdfUrl })
              // toggleNoscroll()
              // this.setState({ downLoad:false }, () => {
              //   andall.invoke('openUrl', { url:res.data.pdfUrl })
              // })
            }
          }
        })
      }
      render() {
        const { data } = this.props
        const { modalFlag, downLoad, flag, highCount, lowCount } = this.state
        return (
          <div className={styles.padding15}>
            <CardTitle title={data.head} />
            <div className={`${styles.square} ${styles.partCard}`}>
              <div className={styles.count}>
                <div onClick={() => this.modalToggle('modalFlag', 1)}>
                  <span>高危型HPV感染</span>
                  <img src={images.ques} />
                </div>
                <p>{`${highCount === 0 ? '无' : highCount + '个'}`}</p>
              </div>
              <div className={styles.high}>
                {
                  data.highRiskList.map((item, index) => (
                    <div key={index} >
                      <span>{`HPV${item.type}`}</span>
                      <img src={item.flag === 1 ? images.part1 : images.part2} />
                      {/* <span className={`${item.flag === 1 ? styles.active : ''}`}>{`${item.flag === 1 ? '阳性' : '阴性'}`}</span> */}
                    </div>
                  ))
                }
              </div>
              <div className={styles.count}>
                <div onClick={() => this.modalToggle('modalFlag', 2)}>
                  <span>低危型HPV感染</span>
                  <img src={images.ques} />
                </div>
                <p>{`${lowCount === 0 ? '无' : lowCount + '个'}`}</p>
              </div>
              <div className={styles.high}>
                {
                  data.lowRiskList.map((item, index) => (
                    <div key={index} >
                      <span>{`HPV${item.type}`}</span>
                      <img src={item.flag === 1 ? images.part1 : images.part2} />
                    </div>
                  ))
                }
              </div>
              {
                data.description
                  ? <div className={styles.view}>
                    <p>* 研究表明：</p>
                    <div>{`${data.description.startsWith('研究表明') ? data.description.substr(5) : data.description}`}</div>
                  </div>
                  : ''
              }
              <div className={styles.downLoad} onClick={() => this.downReportBtn()}>
                <span>下载医用报告</span>
                <img src={images.right} />
              </div>
            </div >
            {
              modalFlag
                ? <ShowModal
                  type={1}
                  flag={flag}
                  handleToggle={() => this.modalToggle('modalFlag')}
                />
                : null
            }
            {
              downLoad
                ? <ShowModal
                  type={2}
                  handleToggle={() => this.modalToggle('downLoad')}
                  onHandleConfirm={(userName, age) => this.goConfirm(userName, age)}
                />
                : null
            }
          </div>
        )
      }
}

export default PartCard
