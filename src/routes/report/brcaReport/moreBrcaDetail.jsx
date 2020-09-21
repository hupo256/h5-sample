import React, { Component } from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './style.scss'
import { fun, ua } from '@src/common/app'
import { Icon } from 'antd-mobile'
import brcaReportApi from '@src/common/api/brcaReportApi'
import andall from '@src/common/utils/andall-sdk'
import { trackPointReportHpvListView, trackPointReportHpvListBuyGoto, trackPointReportHpvListReportGoto } from './buried-point'
import images from './images'

const { getParams } = fun
class MoreBrcaDetail extends Component {
  state = {
    title:'',
    table:[],
  
   
  }

  componentDidMount () {
  
    // const{dataConfig}=this.props.location.state
    // console.log(dataConfig);
    // this.setState({
    //   table:dataConfig.array
    // })
    const {barCode}=getParams()
    console.log(barCode)
    brcaReportApi.getCollectionData({
      barCode
    }).then(res => {
      this.setState({
          table:res.data
        })
    })
   
  }
  handleTab=(id)=>{
    this.setState({ 
      id
    })
  }
  changeDrawItem=(e,type)=>{
    let {drawIndexOne,drawIndexTwo,drawIndexThree,drawIndexFour,drawIndexFive,drawIndexSix}=this.state
    if(type=='infoOne'){
      if(drawIndexOne==e){
        this.setState({ drawIndexOne:-1 })
      }
      else{
        this.setState({ drawIndexOne:e })
      }
    }
    else if(type=='infoTwo'){
      if(drawIndexTwo==e){
        this.setState({ drawIndexTwo:-1 })
      }
      else{
        this.setState({ drawIndexTwo:e })
      }
    }
    else if(type=='infoThree'){
      if(drawIndexThree==e){
        this.setState({ drawIndexThree:-1 })
      }
      else{
        this.setState({ drawIndexThree:e })
      }
    }
    else if(type=='infoFour'){
      if(drawIndexFour==e){
        this.setState({ drawIndexFour:-1 })
      }
      else{
        this.setState({ drawIndexFour:e })
      }
    }
    else if(type=='infoFive'){
      if(drawIndexFive==e){
        this.setState({ drawIndexFive:-1 })
      }
      else{
        this.setState({ drawIndexFive:e })
      }
    }
    else if(type=='infoSix'){
      if(drawIndexSix==e){
        this.setState({ drawIndexSix:-1 })
      }
      else{
        this.setState({ drawIndexSix:e })
      }
    }
    
    
  }

  render () {
    const { table} = this.state
    return (
      <Page title='详情'>
        <div className={styles.morePanel}>
          <div className={styles.titleTxt}>我们检测到您的基因变异情况</div>
          {table&&table.length>0?<div className={styles.moreTable}>
            <table>
              <tbody>
                <tr>
                  <th>变异等级</th>
                  <th>突变数量</th>
                </tr>  
                {table.map((item,index)=>{
                  return (
                  <tr className={index%2==0?'':`${styles.even}`}>
                    <td>{item.desc}</td>
                    <td>{item.value}</td>
                  </tr>  
                  )
                })}
              </tbody>  
            </table>  
          </div>:null }
          <div className={styles.moreParaCon}> 
            <p>附注：检测结果表格展现了受检者的基因组状况，里面包含了本次检出的变异的具体基因，位置，变异类型，等位基因信息以及相关的遗传病信息，其中最重要的内容为变异类型和等位基因信息。</p>
            <p>ACMG(美国医学遗传学与基因组学学会(The American College of Medical Genetics and Genomics))的变异分类等级:变异（variant）一般可分为五个等级，分别是：</p>
            
            <p><img src={images.dot} className={styles.dot} /><span>致病的（pathogenic）</span></p>
            <p><img src={images.dot} className={styles.dot} /><span>可能致病的（likely pathogenic）</span></p>
            <p><img src={images.dot} className={styles.dot} /><span>意义未知的（variant uncertain significance，VUS）</span></p>
            <p><img src={images.dot} className={styles.dot} /><span>可能良性的（likely benign）</span></p>
            <p><img src={images.dot} className={styles.dot} /><span>良性的（benign）</span></p>
            
            <p>良性一般指代变异与疾病无关，属于人群中正常存在的分布；</p>
            <p>意义不明则指代该变异目前还没有确切的功能定义，仍需要进一步研究；</p>
            <p>致病性则指代变异与相关的遗传病有关系，需要特别注意(注意，即使检测出致病性/可能致病的变异也不代表受检者一定罹患相关的疾病)</p>
            <p>这里的“可能”指概率超过90%的可能性。</p>
          
          </div> 


          
        </div>
      </Page>
    )
  }
}
MoreBrcaDetail.propTypes = {
  history: propTypes.object,
}

export default MoreBrcaDetail
