import React from 'react'
import propTypes from 'prop-types'
import styles from './expert.scss'
import { fun } from '@src/common/app'
import image from '../../image'
const { numToStringK } = fun
export default class ExpertList extends React.Component {
  state = {
    expertList: []
  }
  componentDidMount() {
    const { expertList } = this.props
    this.setState({
      expertList
    })
  }
  componentWillReceiveProps(nextProps) {
    const { expertList } = nextProps
    this.setState({
      expertList
    })
  }
  static propTypes = {
    expertList: propTypes.array.isRequired,
    onGotoDetail: propTypes.func.isRequired,
    onGotoArticleDetail:propTypes.func.isRequired
  }

  render () {
    const { onGotoDetail ,onGotoArticleDetail} = this.props
    const { expertList } = this.state
    return (
      <div>
        {
          expertList && expertList.length
            ? expertList.map((item, index) => {
              return <div className={styles.item} key={index} >
                <div className={styles.expert_basic_info} onClick={() => onGotoDetail(item.id,item.expertName)}>
                  <div className={styles.expert_avatar} style={{backgroundImage:`url(${item.expertIcon})`}}></div>
                  <div className={styles.expert_name_con} style={{backgroundImage:`url(${image.arrow})`}}>
                    <h1>{item.expertName}</h1>
                    {item.expertTag?
                      <p><span>{item.expertTag}</span></p>:''
                    }
                  </div>
                </div>
                <div className={styles.expert_article}>
                  {
                    item.dataList.map(item=>{
                      return(
                        <div className={styles.expert_article_item} onClick={() => onGotoArticleDetail(item.jumpUrl)}>
                          <div className={`${styles.expert_article_tag} ${item.articleTag=="推荐"? styles.active:''}`}>{item.articleTag}</div>
                      <div className={styles.expert_article_con}>{item.title}</div>
                        </div> 
                      )
                    })
                    
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
