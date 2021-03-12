import React from 'react'
import propTypes from 'prop-types'
import { fun, API, ua } from '@src/common/app'
import images from '../components/images'
import andall from '@src/common/utils/andall-sdk'
import { Page } from '@src/components'
import styles from './expert.scss'
import ArticleList from '../components/articleList'

const { getParams } = fun
export default class ExpertHomepage extends React.Component {
  state = {
    articleList: [],
    expertDetail: {},
    courseList: [],
    pageObj: {
      pageNum: 1,
      totalPage: 1,
      pageSize: 10
    },
    loadingStatus: true,
    isAndall: ua.isAndall(),
  }
  componentDidMount () {
    this.handleGetCourseList()
    this.handleGetList()
    this.addEventListenerSroll()
    this.handleGetExpertDetail()
    this.handleAddBrowseNumber()
  }
  handleAddBrowseNumber = () => {
    const { id } = getParams()
    const params = {
      contentId: +id,
      contentType: 5
    }
    API.updateActivContentBrowseNumber(params).then(({ data }) => {
    })
  }
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.handleGetList)
  }
  // 获取课程列表
  handleGetCourseList=() => {
    const { id } = getParams()
    const params = {
      expertId: +id,
      'pageNum': 1,
      'pageSize': 10,
    }
    API.getActivContentCourseListByExpertId(params).then(({ data }) => {
      this.setState({
        courseList: data
      })
    })
  }
  // 获取专家详情
  handleGetExpertDetail = () => {
    const { id } = getParams()
    API.getActivContentDetailById({ id, contentType: 5 }).then(({ data }) => {
      this.setState({
        expertDetail: data
      })
    })
  }
  // 获取文章列表
  handleGetList = () => {
    let { loadingStatus, articleList, pageObj } = this.state
    const { pageNum, totalPage, pageSize } = pageObj || {}
    const { id } = getParams()
    const params = {
      expertId: +id,
      pageNum,
      pageSize
    }
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    if (loadingStatus && pageNum <= totalPage && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        API.getActivContentArticleListByExpertId(params).then(({ data }) => {
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
  // 课程详情
  handleGoToDetail = (id, type) => {
    this.props.history.push(`/news/article-detail-index?id=${id}&type=${type || 1}`)
  }
  handleShare = () => {
    const { expertDetail } = this.state
    const { shareTitle, shareDescription, shareImgUrl, linkUrl } = expertDetail || {}
    if (ua.isAndall()) {
      setTimeout(() => {
        andall.invoke('share', {
          type: 'link',
          title: shareTitle,
          text: shareDescription,
          url: linkUrl,
          thumbImage: shareImgUrl,
          image: shareImgUrl,
        })
      }, 100)
    } else {
      this.setState({ share: true })
    }
  }
  render () {
    const { articleList, expertDetail, courseList, pageObj, isAndall } = this.state
    const { expertName, backgroundIntroduction, fansNum, isShare, courseNum, articleNum, expertHeadPortrait, contentPictureBig } = expertDetail || {}
    return (
      <Page title=''>
        <div className={styles.expertCont}>
          <div className={styles.headerCont}>
            <img className={styles.expertImg} src={expertHeadPortrait} alt='' />
            <div className={styles.mask} />
            <div className={styles.header}>
              <div className={styles.expert}>
                <div>
                  <p className={styles.name}>{expertName}</p>
                  <p className={styles.desc} dangerouslySetInnerHTML={{ __html: backgroundIntroduction }} />
                </div>
                <img className={styles.img} src={expertHeadPortrait} alt='' />
              </div>
              <div className={styles.fansCont}>
                {/* <div className={styles.count}>
                <p className={styles.num}>{fansNum}</p>
                <p className={styles.name}>粉丝数</p>
              </div> */}
                <div className={styles.count}>
                  <p className={styles.num}>{courseNum}</p>
                  <p className={styles.name}>课程数</p>
                </div>
                <div className={styles.count}>
                  <p className={styles.num}>{articleNum}</p>
                  <p className={styles.name}>文章数</p>
                </div>
                {/* <div className={styles.follow}>
                关注
              </div> */}
              </div>
            </div>
          </div>
          {/* <div className={styles.recommend}>根据你的「紫外线晒伤风险高」进行推荐</div> */}
          <div className={styles.articleCont}>
            {
              courseList && courseList.length
                ? <p className={styles.title}>课程作品<span>（{(courseList && courseList.length) || 0}）</span></p>
                : ''
            }
            <div className={styles.courseCont} style={{ width: '9.2rem' }}>
              {
                courseList && courseList.length
                  ? courseList.map((item, index) => {
                    return <div key={index} onClick={() => this.handleGoToDetail(item.id, 6)} className={styles.courseItem}>
                      <div className={styles.detail}>
                        <img src={item.contentCourseVideoCoverPicture} alt='' />
                        <div className={styles.mask} />
                        <div className={styles.cont}>
                          <p className={styles.tips}>课程</p>
                          <p className={styles.courseDesc}>{item.subtitle}</p>
                          <p className={styles.num}>
                            <img src={images.video} alt='' />
                            {item.contentBrowseNumber}人已学习
                          </p>
                        </div>
                      </div>
                      <p className={styles.courseTitle}>{item.title}</p>
                      {
                        item.labelRespList && item.labelRespList.length
                          ? <p className={styles.tipsCont}>
                            <span>{item.labelRespList[0]}</span>
                          </p>
                          : ''
                      }
                    </div>
                  })
                  : ''
              }
            </div>
            {
              articleList && articleList.length
                ? <p className={`${styles.title} ${styles.articleTitle}`}>发表文章<span>（{articleNum}）</span></p>
                : ''
            }
            <ArticleList
              articleList={articleList}
              onGotoDetail={this.handleGoToDetail}
            />
            {
              isAndall ? <div className={styles.btnCont}>
                {
                  isShare && isAndall
                    ? <span className={`${styles.btn} ${styles.shareBtn}`} onClick={this.handleShare}>
                      <img src={images.shareIcon} alt='' />
                  分享
                    </span>
                    : ''
                }
                <a className={styles.btn} href={`tel:400-682-2288`}>咨询专家</a>
              </div>
                : ''
            }
          </div>
        </div>
      </Page>
    )
  }
}
ExpertHomepage.propTypes = {
  history: propTypes.object,
}
