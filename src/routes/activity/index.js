import React from 'react'
import { Page } from '@src/components'
import images from '@src/common/utils/images'
import styles from './activity.scss'
import { fun, API, ua } from '@src/common/app'
import { Toast } from 'antd-mobile'
import andall from '@src/common/utils/andall-sdk'
import { Case } from '@src/components/case/Case'
const { getParams } = fun
export default class Activity extends React.Component {
  state = {
    content: '',
    title: '',
    articleId: '',
    userThumbs: 0, // 0未点 1赞  2踩
    goodCount: 0,
    badCount: 0,
    shareInfo: null,
    isRender: false,
    isAndall: ua.isAndall(),
    author: '',
    authorHeadImgUrl: '',
    articleDate: '',
    headImgUrl: '',
    downAppUrl:''
  }
  componentDidMount() {
    this.getData()
  }

  getData() {
    let { isAndall, isRender } = this.state
    const { articleId } = getParams()
    let token = window.localStorage.getItem('token')
    API.queryArticleByArticleId({ id: articleId }).then(res => {
      if (!res.data) return
      const result = res.data
      let {
        title,
        content,
        userThumbs,
        goodCount,
        badCount,
        shareInfo,
        author,
        authorHeadImgUrl,
        articleDate,
        headImgUrl,
        downAppUrl
      } = result
      if (isAndall && token) isRender = true
      this.setState({
        articleId,
        title,
        content,
        userThumbs,
        goodCount,
        badCount,
        shareInfo,
        isRender,
        author,
        authorHeadImgUrl,
        articleDate,
        headImgUrl,
        downAppUrl
      })
    })
  }
  handleZan(thumbsType) {
    const { articleId, userThumbs, goodCount, badCount } = this.state
    userThumbs === thumbsType && Toast.info('无需重复提交')
    userThumbs !== 0 && userThumbs !== thumbsType && Toast.info('不支持修改')
    userThumbs === 0 &&
      API.insertThumbsUpRecord({ articleId, thumbsType }).then(() => {
        this.setState({
          userThumbs: thumbsType,
          goodCount: thumbsType === 1 ? goodCount + 1 : goodCount,
          badCount: thumbsType !== 1 ? badCount + 1 : badCount
        })
      })
  }
  handleShare() {
    const { shareInfo } = this.state
    andall.invoke('share', shareInfo)
  }
  goDown () {
    const { downAppUrl } = this.state
    window.location.href = downAppUrl
  }
  render() {
    const {
      title,
      content,
      goodCount,
      badCount,
      userThumbs,
      isRender,
      author,
      authorHeadImgUrl,
      articleDate,
      headImgUrl,
      isAndall,
      downAppUrl
    } = this.state
    return (
      <Page title=''>
        <div className={styles.shareBoxWrap}>
          <Case when={!!headImgUrl}>
            <img className={styles.imgHeadBox} src={headImgUrl} />
          </Case>
          <Case when={!!title}>
            <div className={styles.shareTitle}>{title}</div>
          </Case>
          <div className={styles.shareBoxFlex}>
            <div className={styles.shareBoxAuthor}>
              <Case when={!!authorHeadImgUrl}>
                <img className={styles.imgBox} src={authorHeadImgUrl} />
              </Case>
              <Case when={!!author}>
                <span>{author}</span>
              </Case>
            </div>
            <Case when={!!articleDate}>
              <div>{articleDate}</div>
            </Case>
          </div>
          <Case when={!!content}>
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className={styles.shareBoxContent}
            />
          </Case>
          <Case when={!isAndall && !!downAppUrl}>
            <div className={styles.appDown}>
              <div className={styles.appDownLeft}>
                <img src={images.downLogo} alt='' className={styles.appLogo} />
                <div>
                  <div className={styles.appName}>安我生活</div>
                  <div className={styles.appDec}>由基因开启全新生活</div>
                </div>
              </div>
              <div className={styles.appBtn} onClick={() => this.goDown()}>立即下载</div>
            </div>
          </Case>
          <Case when={!!isRender}>
            <div className={styles.shareBox}>
              <div
                className={styles.shareBoxItem}
                onClick={() => this.handleZan(1)}
              >
                <img
                  className={styles.imgBox}
                  src={userThumbs === 1 ? images.zanUpDisable : images.zanUp}
                />
                <span>{goodCount > 0 ? ' ' + goodCount : ''}</span>
              </div>
              <div
                className={styles.shareBoxItem}
                onClick={() => this.handleZan(2)}
              >
                <img
                  className={styles.imgBox}
                  src={
                    userThumbs === 2 ? images.zanDownDisable : images.zanDown
                  }
                />
                <span>{badCount > 0 ? ' ' + badCount : ''}</span>
              </div>
              <div
                className={styles.shareBoxItem}
                onClick={() => this.handleShare()}
              >
                <img className={styles.imgBox} src={images.share} />
              </div>
            </div>
          </Case>
        </div>
      </Page>
    )
  }
}
