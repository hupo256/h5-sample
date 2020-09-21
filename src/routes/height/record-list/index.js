import React from 'react'
import propTypes from 'prop-types'
import { fun, API, ua } from '@src/common/app'
import wxconfig from '@src/common/utils/wxconfig'
import { Page } from '@src/components'
import styles from './recordlist'
import edit1 from '@static/height/icon_edit_1.png'
const { getSession } = fun
class RecordList extends React.Component {
  state = {
    list: [],
    pageObj: {
      pageNum: 1,
      totalPage: 1,
      pageSize: 10
    },
    loadingStatus: true,
  }
  componentDidMount() {
    this.handleQueryRecordList()
    this.addEventListenerSroll()
    if (!ua.isAndall()) {
      this.wxShare(getSession('shareInfo'))
    }
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
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.handleQueryRecordList)
  }
  handleQueryRecordList = () => {
    let { loadingStatus, list, pageObj } = this.state
    const { pageNum, totalPage, pageSize } = pageObj
    const { linkManId } = getSession('currentLinkManInfo')
    const params = {
      linkmanId: linkManId,
      pageNum,
      pageSize
    }
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    if (loadingStatus && pageNum <= totalPage && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        API.selectHeightInputRecords(params).then(({ data }) => {
          if (data) {
            this.setState({
              list: [...list, ...data.data],
              pageObj: {
                ...pageObj,
                pageNum: data.pageNum + 1,
                totalPage: data.totalPage
              }
            })
          }
          // 页面抖动
          setTimeout(() => {
            this.setState({
              loadingStatus: true
            })
          }, 30)
        })
      })
    }
  }
  handleEdit = (item) => {
    const { measureDate, weight, height, id } = item
    this.props.history.push(`/height/add-record?measureDate=${measureDate}&weight=${weight}&height=${height}&id=${id}`)
  }
  render () {
    const { list } = this.state
    return (
      <Page title='确认宝宝信息'>
        <div className={styles.listCont}>
          {
            list && list.length
              ? list.map((item, index) => {
                return <div key={index} className={styles.item}>
                  <div className={styles.leftCont}>
                    <p className={styles.data}>
                      {item.measureDate}
                      <span>{item.ageText}</span>
                    </p>
                    <p className={styles.height}>身高 {item.height}cm</p>
                    <p className={`${styles.desc} ${item.flag ? styles.actived : ''}`}>{item.remark}</p>
                  </div>
                  <div className={styles.rightCont}>
                    <img src={edit1} onClick={() => this.handleEdit(item)} alt='' />
                  </div>
                </div>
              })
              : ''
          }
        </div>
      </Page>
    )
  }
}
RecordList.propTypes = {
  history: propTypes.object,
}
export default RecordList
