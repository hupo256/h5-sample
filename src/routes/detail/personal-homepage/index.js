import React from 'react'
import propTypes from 'prop-types'
import { fun, API, ua } from '@src/common/app'
import andall from '@src/common/utils/andall-sdk'
import { Page } from '@src/components'
import styles from './personal.scss'
import ArticleList from '../components/articleList'
import {
  trackPointNewmallMoretopiclistView,
  trackPointNewmallMoretopiclistArticleGoto,
  trackPointNewmallMoretopiclistShare
} from '../buried-point'

// const { yinyang } = images
const { getParams } = fun
export default class PersonalHomepage extends React.Component {
  state = {
    articleList: [],
    topicDetail: {},
    pageObj: {
      pageNum: 1,
      totalPage: 1,
      pageSize: 10
    },
    loadingStatus: true,
    isAndall: ua.isAndall(),
  }
  componentDidMount () {
    trackPointNewmallMoretopiclistView()
    setTimeout(() => {
      this.handleGetList()
      this.handleGetDetail()
      this.addEventListenerSroll()
      this.handleAddBrowseNumber()
    }, 400)
  }
  handleAddBrowseNumber = () => {
    const { id } = getParams()
    const params = {
      contentId: +id,
      contentType: 7
    }
    API.updateActivContentBrowseNumber(params).then(({ data }) => {
    })
  }
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.handleGetList)
  }
  // 获取话题详情
  handleGetDetail = () => {
    const { id } = getParams()
    const { isAndall } = this.state
    API.getActivContentTopicById({ id: +id }).then(({ data }) => {
      this.setState({
        topicDetail: data
      }, () => {
        if (!isAndall) {
          this.wxShare(data)
        }
      }
      )
    })
  }
  // 获取文章列表
  handleGetList = () => {
    let { loadingStatus, articleList, pageObj } = this.state
    const { pageNum, totalPage, pageSize } = pageObj
    const { id } = getParams()
    const params = {
      topicId: +id,
      pageNum,
      pageSize
    }
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    if (loadingStatus && pageNum <= totalPage && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        API.getActivContentArticleListByTopicId(params).then(({ data }) => {
          if (data && data.data) {
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
  // 文章详情
  handleGoToDetail = (id) => {
    trackPointNewmallMoretopiclistArticleGoto({
      content_id: id
    })
    this.props.history.push(`/news/article-detail-index?id=${id}&type=1`)
  }
  handleShare = () => {
    trackPointNewmallMoretopiclistShare({
      content_id: getParams().id
    })
    const { topicDetail } = this.state
    const { shareTitle, shareDescription, shareImgUrl, linkUrl, imgUrl, title } = topicDetail || {}
    const shareConfig = {
      type: 'link',
      title: shareTitle || title || '还在等什么？快来发表你的观点>>',
      text: shareDescription || '还在等什么？快来发表你的观点>>',
      url: linkUrl || window.location.href.split('#')[0],
      thumbImage: shareImgUrl || imgUrl || `${origin}/mkt/binding/images/shareimg.png`,
      image: shareImgUrl || imgUrl || `${origin}/mkt/binding/images/shareimg.png`,
    }
    if (ua.isAndall()) {
      setTimeout(() => {
        andall.invoke('share', shareConfig)
      }, 100)
    } else {
      this.setState({ share: true })
    }
  }

  /**
   * 微信分享
   */
  wxShare = (shareInfo) => {
    const { shareTitle, linkUrl, shareDescription, shareImgUrl, imgUrl } = shareInfo
    wxconfig({
      showMenu: true,
      params:{
        title: shareTitle || '还在等什么？快来发表你的观点>>',
        link: linkUrl,
        desc: shareDescription || '还在等什么？快来发表你的观点>>',
        imgUrl: shareImgUrl || imgUrl,
      }
    })
  }

  render () {
    const { articleList, topicDetail, isAndall } = this.state
    const { title, articleNum, imgUrl, isShare } = topicDetail || {}
    return (
      <Page title={title || ''}>
        <div className={styles.personalCont}>
          <div className={styles.header} style={{ background: `url(${imgUrl})` }}>
            <div className={styles.mask} />
            <div className={styles.textCont}>
              <div className={styles.topicCont}>
                <img src={images.topic} alt='' />
                <span className={styles.title}>{title}</span>
              </div>
              <p className={styles.desc}>已有{articleNum || 0}篇文章</p>
            </div>
          </div>
          <div className={styles.articleCont}>
            <ArticleList
              articleList={articleList}
              onGotoDetail={this.handleGoToDetail}
            />
          </div>
          {
            isShare && isAndall
              ? <div className={styles.btnCont}>
                <span className={styles.btn} onClick={this.handleShare}>
                  <img src={images.shareIcon} alt='' />
                  分享给好友
                </span>
              </div>
              : ''
          }
        </div>
      </Page>
    )
  }
}
PersonalHomepage.propTypes = {
  history: propTypes.object,
}
