import React, { Component } from 'react'
import Page from '@src/components/page'
import { API } from '@src/common/app'
import { Icon } from 'antd-mobile'
import styles from './../binding.scss'

export default class CommonProblem extends Component {
  state = {
    navList: [],
    navActived: 0,
    navContList: [],
    activedNavCont: []
  }
  componentDidMount() {
    this.handleQueryHelpCenter()
  }
  handleQueryHelpCenter = () => {
    API.helpCenter().then(res => {
      const { data } = res
      this.handleGetDatas(data)
    })
  }
  // nav 切换
  handleChangeTab = (index) => {
    const { navContList } = this.state
    this.setState({
      navActived: index,
      activedNavCont: navContList[index]
    })
  }
  // 处理数据
  handleGetDatas = (data) => {
    const { helpRespMap } = data
    let navContList = []
    let navList = []
    for (let k in helpRespMap) {
      if (helpRespMap[k].length) {
        helpRespMap[k].forEach((el, ind) => {
          el.isOpen = false
        })
        navContList.push(helpRespMap[k])
        navList.push(helpRespMap[k][0].typeName)
      } else {
        navContList.push([])
      }
    }

    this.setState({
      navList,
      navContList,
      activedNavCont: navContList[0]
    })
  }
  // 展开更多
  handleToggleCont = (index) => {
    const { activedNavCont } = this.state
    activedNavCont[index].isOpen = !activedNavCont[index].isOpen
    this.setState({
      activedNavCont
    })
  }
  render() {
    const { navList, navActived, activedNavCont } = this.state
    return (
      <Page title='常见问题'>
        <div className={styles.problemBg}>
          <div className={styles.problemCont}>
            <ul className={styles.navs}>
              {
                navList.length
                  ? navList.map((item, index) => {
                    return (<li
                      key={index}
                      className={`${navActived === index ? styles.actived : ''}`}
                      onClick={() => this.handleChangeTab(index)}
                    >
                      <p className={styles.word}>{item}</p>
                      <i className={styles.line} />
                    </li>)
                  })
                  : null
              }
            </ul>
            <div className={styles.navCont}>
              {
                activedNavCont.length
                  ? activedNavCont.map((item, index) => {
                    return (<div key={index} className={styles.listItem}>
                      <div className={styles.titleCont} onClick={() => this.handleToggleCont(index)}>
                        <p className={styles.problemTitle}>
                          {item.question}
                        </p>
                        <Icon
                          type={item.isOpen ? 'up' : 'down'}
                        />
                      </div>
                      {
                        item.isOpen ? <div className={styles.detail} dangerouslySetInnerHTML={{ __html: item.answer }} /> : ''
                      }
                    </div>
                    )
                  })
                  : null
              }
            </div>
          </div>
          <div className={styles.contactUs}>
            <p className={styles.phone}>客服电话：<a href='tel:400-682-2288'>4006822288</a></p>
            <p>工作日：9:00-21:00 | 节假日：9:00-17:00</p>
          </div>
        </div>
      </Page>
    )
  }
}
