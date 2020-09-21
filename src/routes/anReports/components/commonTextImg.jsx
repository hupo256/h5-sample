import React, { Component } from 'react'
import title_prefix3 from '@static/changdao_report/title_prefix3.png'
import styles from './modules.scss'
class CommonTextImg extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }
    openDesc=(type,index,item,index_new)=>{
        this.props.openDesc(type,index,item,index_new)
    }
    render() {
        const { data , index_new} = this.props
        return (
          <div className={`${styles.type5}`} key={index_new}>
            <div className={styles.cardTitle}>
              {
                data.icon?<img src={data.icon} />:
                <img src={title_prefix3} />
              }
              <div>{data.title}</div>
            </div>
            <div className={`${styles.ctnDesc}`}>
              {data.text}
            </div>
            <div className={styles.extra}>
                {/* <span>技术流程</span> */}
                {/* <img src={`${changdao_report}flow.png`} /> */}
                <img src={data.pictureUrl} />
            </div>
          </div>
        )
    }
}

export default CommonTextImg
