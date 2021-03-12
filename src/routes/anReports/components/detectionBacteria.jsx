import React, { Component } from 'react'
import up from '@static/changdao_report/up.png'
import down from '@static/changdao_report/down.png'
import title_prefix2 from '@static/changdao_report/title_prefix2.png'
import subtitle_prefix from '@static/changdao_report/subtitle_prefix.png'
import styles from './modules.scss'
class DetectionBacteria extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }
    openDesc=(type,index,item,index_new)=>{
        this.props.openDesc(type,index,item,index_new)
    }
    render() {
        const { data ,index_new} = this.props
        const colorObj2={
          '高':'#FF6767','中':'#FA883F','中等':'#FA883F','低':'#4FA9FF','正常':'#51C4BD'
        }
        return (
        <div className={`${styles.type4}`} key={detail.moduleType}>
          <div className={styles.cardTitle}>
            <img src={title_prefix2} />
            <div>{data.head}</div>
          </div>
          {
           data.genusItems&&data.genusItems.length&&
           data.genusItems.map((list,index)=>(
              <div className={styles.items} key={index}>
                  <div className={styles.item} onClick={()=>this.openDesc('4504',index,data,index_new)}>
                    <div>
                      <p>{list.title}</p>
                      <span>{list.relation}</span>
                    </div>
                    <div>
                      <span style={{color:`${colorObj2[list.value]}`}}>{list.value}</span>
                      <img src={list.isOpen?up:down} />
                      {/* <img className={styles.panel} src={`${changdao_report}down.png`} /> */}
                    </div>
                  </div>
                  {
                    list.isOpen&&<div>
                  <p className={styles.title}  dangerouslySetInnerHTML={{__html:list.des}}></p>
                    <div className={styles.listAll}>
                      <div className={styles.subTitle}>
                          <img src={subtitle_prefix} />
                          <span>{list.tips.title||''}</span>
                      </div>
                      {
                      list.tips.value&&list.tips.value.length&&
                      list.tips.value.map((item,index)=>(
                        <div className={styles.listItem} key={index} >
                          <h5>{item.title}</h5>
                          <div dangerouslySetInnerHTML={{__html:item.text}}></div>
                        </div>
                      ))
                      }
                    </div>
                    </div>
                  }
                  
              </div>
           )) 
          }
          
        </div>  
        )
    }
}

export default DetectionBacteria
