import React from 'react'
import propTypes from 'prop-types'
import GoodsList from './../../components/goodsList'
import ArticleList from './../../components/articleList'
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
      this.handleGetList()
      this.addEventListenerSroll()
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
    const params = {
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
        if (activedTab === 0) {
          fun = API.getArticleByCategory
        } else {
          fun = API.getGoodsByCategory
        }
        fun(params).then(({ data }) => {
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
    if (index === 0) {
      trackPointToolHeightContentArticle({
        sample_linkmanid: _linkmanId
      })
    } else {
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
      this.handleGetList()
    })
  }
  render () {
    const { tabsList, activedTab, articleList } = this.state
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
          {
            activedTab === 0
              ? <ArticleList
                history={this.props.history}
                articleList={articleList}
              />
              : <GoodsList
                history={this.props.history}
                goodsList={articleList}
              />
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
