import React from 'react'
import propTypes from 'prop-types'
import styles from './article.scss'
import { fun } from '@src/common/app'
const { numToStringK } = fun
export default class ArticleList extends React.Component {
  state = {
    articleList: []
  }
  componentDidMount() {
    const { articleList } = this.props
    this.setState({
      articleList
    })
  }
  componentWillReceiveProps(nextProps) {
    const { articleList } = nextProps
    this.setState({
      articleList
    })
  }
  static propTypes = {
    articleList: propTypes.array.isRequired,
    onGotoDetail: propTypes.func.isRequired
  }
  render () {
    const { onGotoDetail } = this.props
    const { articleList } = this.state
    return (
      <div>
        {
          articleList && articleList.length
            ? articleList.map((item, index) => {
              return <div className={styles.item} key={index} onClick={() => onGotoDetail(item.jumpUrl,item.title)}>
                <div className={styles.cont}>
                  <p className={styles.title}>{item.title}</p>
                  <p className={styles.tag}>
                    {!!item.articleTag && item.articleTag.split(",").splice(0,2).map(items=>{
                      return (
                        <span>{items}</span>
                      )
                    })}
                  </p>  
                </div>
                {!!item.coverImage?<div className={styles.img} style={{backgroundImage:`url(${item.coverImage})`}} alt='' ></div>:null}
                
              </div>
            })
            : ''
        }
      </div>
    )
  }
}
