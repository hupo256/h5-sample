import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../style.scss'
import images from '../images'
import TableCard from './tableCard'

class ResultCard extends Component {
  static propTypes = {
    userName: propTypes.string.isRequired,
    data:propTypes.object
  }
  state = {
  }
  componentDidMount() {

  }
  linkTo=(obj)=>{
    this.props.handleDetail(obj)
   
  }
  render() {
    const { userName, data } = this.props

    return (
      <div>
        <div className={styles.resultOtherCard}>
          <div className={styles.card}>
            <div className={styles.content}>
              <p>[{userName}]的遗传性乳腺癌&卵巢癌(BRCA1/2)基因检测结果</p>
              <h2>{data.conclusion}</h2>
              <img src={images.cardImg2} className={styles.arrow}/>
            </div>  
          </div>  
          <div className={styles.resultPara}>
            <div className={styles.resultParaCon}>
              {data.conclusionDesc}
              <div className={styles.moreBtn} onClick={()=>this.linkTo(data.variants)}>了解更多</div>
            </div>  
          </div>       
        </div>
        <TableCard data={data.genes} />
      </div>
    )
  }
}

export default ResultCard
