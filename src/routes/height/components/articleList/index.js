import React from 'react'
import propTypes from 'prop-types'
import styles from './article.scss'
import {
  trackPointToolHeightArticleClick
} from '../../buried-point'
class ArticleList extends React.Component {
  state = {
  }
  componentDidMount () {
  }
  handleSetTips = (value) => {
    if (value && value.length) {
      value = value.replace(/，/g, ',')
      let arr = value.split(',')
      return <p className={styles.articleTips}>
        {
          arr.map((elm, i) => {
            return <span key={i} className={styles.tipItem}>{elm}</span>
          })
        }
      </p>
    }
  }
  handleGoToDetail = (value) => {
    trackPointToolHeightArticleClick({
      article_id: value
    })
    window.location.href = `${window.location.origin}/mkt/news/article-detail-index?type=1&id=${value}`
  }
  render () {
    const { articleList } = this.props
    return (
      <div className={styles.articleCont}>
        {
          articleList && articleList.length
            ? articleList.map((el, ind) => {
              return <div className={styles.articleItem} key={ind} onClick={() => this.handleGoToDetail(el.id)}>
                <img className={styles.articleImg} src={el.coverImgUrl} alt='' />
                <div className={styles.articleRight}>
                  <p className={styles.articleName}>{el.title}</p>
                  {
                    this.handleSetTips(el.displayTags)
                  }
                </div>
              </div>
            })
            : ''
        }
      </div>
    )
  }
}
ArticleList.propTypes = {
  articleList: propTypes.array,
  history: propTypes.object,
}
export default ArticleList
