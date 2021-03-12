import React, {Component, Fragment} from 'react'
import Page from '@src/components/page'
import styles from './reportExample.scss'
import {API, fun} from '@src/common/app'

import Header from './components/header'
import Thought from './components/thought'
import Bottom from './components/bottomTag'
import RedLight from '../reportHome/components/redLight'
import Category from '../reportHome/components/homeCategory'

const {getParams} = fun
import {
  sampleReportNormalPageVeiw,
} from './BuriedPoint'
import oku from "@src/common/api/oneKeyUnlockApi";

export default class ReportList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataInfo: [],
      name: '',
      userName: '',
      linkManId: '',
      code: '',
      noScroll: false,
      getStatus: {
        bol: true,
        relation: 0,
        isReady: false
      },
      linkMans: [{
        id: 1347,
        relationId: "3",
        userName: "小小安",
        sex: "male",
        status: 0,
      }, {
        id: 2286223641214976,
        relationId: "1",
        userName: "小安",
        sex: "female",
        status: 0,
      }],
      curLinkMan: {
        id: 1347,
        relationId: "3",
        userName: "小小安",
        sex: "male",
        status: 0,
      }
    }
  }

  componentDidMount() {
    const {barCode, reportType, code, linkManId} = getParams()
    API.reportIndex({
      barCode,
      reportType,
      code,
      linkManId,
      categoryType:0,
      nomsg: true
    }).then(res => {
      this.setState({
        dataInfo: res.data.dataInfo,
        name: res.data.name,
        userName: linkManId == 1347 ? '小小安':'小安',
        linkManId: res.data.linkManId,
        code: res.data.code
      })
      sampleReportNormalPageVeiw({
        report_code: res.data.code,
        report_name: res.data.name,
        report_type: res.data.type,
        sample_linkman: res.data.userName,
        relation_id: linkManId == 1347 ? '3' : '1'
      })
      oku.getLinkMan({noloading: 1}).then(rr => {
        this.categoryList(rr.data.bindingInfo, res.data.code)
      })
    })
    document.documentElement.scrollTop = 0

  }

  setNoScroll = (bool) => {
    this.setState({
      noScroll: bool
    })
  }
  categoryList = async (bindingInfo, code) => {
    let {getStatus, userName} = this.state;
    const len = bindingInfo.length
    let saveUser = 0
    for (let i = 0; i < len; i++) {
      if ((userName === '小小安' ? '3' : '1') !== bindingInfo[i].relationId) continue
      await oku.categoryList({linkManId: bindingInfo[i].id, noloading: 1}).then(res => {
        const productList = this.filterCode(res.data.productCategoryList, code)
        if (!productList || productList.reportStatus === '0') {
          getStatus.bol = false
          getStatus.relation = (userName === '小小安') ? 0 : 1
          console.log(getStatus.relation)
        }
        saveUser++
      })
      if (!getStatus.bol) break
    }
    if (saveUser === 0) {
      getStatus.bol = false
      getStatus.relation = (userName === '小小安') ? 0 : 1
    }
    getStatus.isReady = true
    this.setState({
      getStatus
    })
  }
  filterCode = (productCategoryList, code) => {
    let saveProductList = []
    let productCategoryListLen = productCategoryList.length
    for (let y = 0; y < productCategoryListLen; y++) {
      const productList = productCategoryList[y].productList
      const productListLen = productList.length
      for (let z = 0; z < productListLen; z++) {
        if (code === productList[z].productCode) {
          return productList[z]
        }
      }
    }
    return null
  }
  setCurLinkMan = () => {
    const {linkManId} = getParams()
    const {linkMans} = this.state
    if (linkMans[1].id == linkManId) {
      this.setState({
        curLinkMan: linkMans[1]
      })
    } else {
      this.setState({
        curLinkMan: linkMans[0]
      })
    }
  }

  render() {
    const {userName, dataInfo, name, linkManId, code, noScroll, curLinkMan, linkMans, getStatus} = this.state
    return (
      <Page title={name} class={styles.page}>
        <div style={{overflow: '', height: '100vh'}}>
          <Header title={`「${userName}」的${name}报告`}
                  page_code={'sample_report_normal_page'}
                  code={code}
                  noScroll={this.setNoScroll}
                  curLinkMan={curLinkMan}
                  linkMans={linkMans}
                  setCurLinkMan={this.setCurLinkMan}/>

          <section style={{backgroundImage: 'linear-gradient(to bottom, #C8F5ED, #ffffff)'}}>
            <p className={styles.homeTitle}>{name}</p>
            {
              dataInfo.map((item, index) => {
                switch (item.moduleType) {
                  case 1201:
                    return (
                      <RedLight key={index} data={item.dataList} {...this.props} />
                    )
                  case 4401:
                    return (
                      <Category key={index} data={item.data.categoryDtos} {...this.props} linkManId={linkManId}/>
                    )
                  default:
                    return null;
                }
              })
            }
          </section>
          {/*{code && <Bottom code={code}*/}
          {/*                 curLinkMan={curLinkMan}*/}
          {/*                 userName={userName}*/}
          {/*                 isUnlock={getStatus}*/}
          {/*                 noScroll={this.setNoScroll}/>}*/}
          {code && <Thought code={code}
                            noScroll={this.setNoScroll}
                            userName={userName}
                            page_code={'sample_report_list'}/>}
          <div className={styles.block1}></div>
        </div>
      </Page>
    )
  }
}
