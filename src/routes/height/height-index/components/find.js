import React from 'react'
import propTypes from 'prop-types'
import GoodsList from './../../components/goodsList'
import ArticleList from './../../components/articleList'
import Adviser from './../../components/adviser'
import { fun, images, ua, API } from '@src/common/app'
import styles from '../index.scss'
import {
  trackPointToolHeightContentPageView,
  trackPointToolHeightContentGoods,
  trackPointToolHeightContentArticle
} from './../../buried-point'
const { getSession, setSession } = fun
class Find extends React.Component {
  state = {
    // tabsList: ['育儿顾问', '文章', '商品'],
    tabsList: ['文章', '商品'],
    activedTab: 0,
    articleList: [],
    pageObj: {
      pageNum: 1,
      totalPage: 1,
      pageSize: 10
    },
    loadingStatus: true,
  }
  componentDidMount() {
    document.body.scrollTop = document.documentElement.scrollTop = 0
    const { activedTab } = this.props
    const currentLinkManInfo = getSession('currentLinkManInfo')
    this.setState({
      activedTab
    }, () => {
      if (activedTab === 0 || activedTab === 1) {
      // if (activedTab === 1 || activedTab === 2) {
        this.handleGetList()
        this.addEventListenerSroll()
      }
    })
    trackPointToolHeightContentPageView({
      sample_linkmanid: currentLinkManInfo.linkManId
    })
  }
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.handleGetList)
  }
  handleGetList = () => {
    let { loadingStatus, articleList, pageObj, activedTab } = this.state
    const { pageNum, totalPage, pageSize } = pageObj
    const currentLinkManInfo = getSession('currentLinkManInfo')
    const params = {
      linkManId: currentLinkManInfo.linkManId,
      pageNum,
      pageSize
    }
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34 - 50 - 44
    if (loadingStatus && pageNum <= totalPage && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        let fun = ''
        // if (activedTab === 1) {
        if (activedTab === 0) {
          fun = API.getArticleByCategory
        // } else if (activedTab === 2) {
        } else if (activedTab === 1) {
          fun = API.getGoodsByCategory
        }
        fun && fun(params).then(({ data }) => {
          if (data) {
            this.setState({
              articleList: [...articleList, ...data.data],
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
  // 切换顶部tab
  handleChangeTab = (index) => {
    const currentLinkManInfo = getSession('currentLinkManInfo')
    const _linkmanId = currentLinkManInfo.linkManId
    document.body.scrollTop = document.documentElement.scrollTop = 0
    const { activedTab, pageObj } = this.state
    // if (index === 1) {
    if (index === 0) {
      trackPointToolHeightContentArticle({
        sample_linkmanid: _linkmanId
      })
    // } else if (index === 2) {
    } else if (index === 1) {
      trackPointToolHeightContentGoods({
        sample_linkmanid: _linkmanId
      })
    }
    if (activedTab === index) return
    setSession('activedTab', index)
    this.setState({
      activedTab: index,
      articleList: [],
      pageObj: {
        ...pageObj,
        pageNum: 1,
      },
    }, () => {
      // if (index === 1 || index === 2) {
      if (index === 0 || index === 1) {
        this.handleGetList()
        this.addEventListenerSroll()
      } else {
        window.removeEventListener('scroll', this.handleGetList)
      }
    })
  }
  render () {
    const { tabsList, activedTab, articleList } = this.state
    const currentLinkManInfo = getSession('currentLinkManInfo')
    return (
      <div className={styles.findCont}>
        <ul className={styles.tabsList}>
          {
            tabsList.map((item, index) => {
              return <li onClick={() => this.handleChangeTab(index)} className={activedTab === index ? styles.actived : ''} key={index}>
                {item}
              </li>
            })
          }
        </ul>
        <div className={styles.tabCont}>
          {/* {
            activedTab === 0
              ? <Adviser linkManId={currentLinkManInfo.linkManId} />
              : ''
          } */}
          {
            // activedTab === 1
            activedTab === 0
              ? <ArticleList
                history={this.props.history}
                articleList={articleList}
              />
              : ''
          }
          {
            // activedTab === 2
            activedTab === 1
              ? <GoodsList
                history={this.props.history}
                goodsList={articleList}
              />
              : ''
          }
        </div>
      </div>
    )
  }
}
Find.propTypes = {
  history: propTypes.object,
  activedTab: propTypes.number
}
export default Find
