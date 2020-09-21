import React, { Component } from 'react'
import prefix from '@static/changdao_report/prefix.png'
import down from '@static/changdao_report/down.png'
import star from '@static/changdao_report/star.png'
import styles from './modules.scss'
class RiskAssess extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }
    openDesc=(type,index,item,index_new)=>{
        this.props.openDesc(type,index,item,index_new)
    }
    render() {
        const { data,index_new } = this.props
        const colorObj={'L':'#4FA9FF','M':'#FA883F','H':'#FF6767',}
        const colorObj2={
            '高':'#FF6767','中':'#FA883F','中等':'#FA883F','低':'#4FA9FF','正常':'#51C4BD'
        }
        return (
            <div className={styles.type2} key={detail.moduleType}>
                <div className={styles.title} dangerouslySetInnerHTML={{__html:data.head}}>

                </div>
                <div className={styles.ctn}>
                  <div className={styles.subtitle}>{data.title||''}</div>
                  <div className={styles.detail}>
                    {data.riskItems&&data.riskItems.length&&
                    data.riskItems.map((item,index)=>(
                      <div key={index}>
                        <span className={styles.typeName}>{item.name}</span>
                        <div className={styles.origin}>
                          <div style={{width:`${(item.value/100)*100}%`,background:`${colorObj[item.riskLevel]}`}}></div>
                        </div>
                      </div>
                    ))
                    }
  
                    <div className={styles.level}>
                      <span>低</span>
                      <span>中等</span>
                      <span>高</span>
                    </div>
                  </div>
                  <div className={styles.text} dangerouslySetInnerHTML={{__html:data.conclusion}}>
                      {/* {conclusion_3&&conclusion_3.length&&conclusion_3[0]}
                     <span>{conclusion_2}</span>
                      {conclusion_3&&conclusion_3.length&&conclusion_3[1]} */}
                  </div>
                </div>
                <div className={styles.resultList}>
                  <div className={styles.title}>{data.sedTitle||''}</div>
                 
                    {
                      data.riskAssessmentResults&&data.riskAssessmentResults.length&&
                      data.riskAssessmentResults.map((list,index)=>(
                        <div className={styles.items} key={index}>
                          <div className={styles.item} onClick={()=>this.openDesc('4502',index,data,index_new)}>
                            <div>
                              <img className={styles.panel} src={prefix} />
                              <span>{list.name||''}</span>
                            </div>
                            <div >
                              <span style={{color:`${colorObj2[list.riskLevel]}`}}>{list.riskLevel||''}</span>
                              <img className={styles.panel} src={down} />
                            </div>
                          </div>
                          
                          {list.isOpen&&
                          <div>
                            {
                              list.genusRanges&&list.genusRanges.length?
                              <div>
                                <div className={styles.myTable}>
                                <table>
                                  <thead>
                                    <tr>
                                      <td>主要菌属</td>
                                      <td>检测结果‰</td>
                                      <td>参考范围‰</td>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      list.genusRanges&&list.genusRanges.length&&
                                      list.genusRanges.map((item,index)=>(
                                        <tr key={index}>
                                          <td>{item.name}</td>
                                          <td>{item.value}
                                            {item.flag==0&&<img className={styles.star} src={star} />}
                                          </td>
                                          <td>{item.range}</td>
                                        </tr>
                                      ))
                                    }
                                  </tbody>
                                </table>
                              
                              </div>
                              <div className={styles.intro}>
                                说明：
                                <img className={styles.star} src={star} />
                                表示该菌数量处于异常范围。
                              </div>
                            </div>:null
                            }
                                                                        
                            <div className={styles.sum} dangerouslySetInnerHTML={{__html:list.desc}}></div>
                          </div>
                          }
                          
                         
                        </div>
                      ))
                    } 
                </div>
            </div>
        )
    }
}

export default RiskAssess
