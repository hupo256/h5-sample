import React, { Component } from 'react'
import up from '@static/changdao_report/up.png'
import down from '@static/changdao_report/down.png'
import title_prefix1 from '@static/changdao_report/title_prefix1.png'
import title2_prefix1 from '@static/changdao_report/title2_prefix1.png'
import title2_prefix2 from '@static/changdao_report/title2_prefix2.png'
import title2_prefix3 from '@static/changdao_report/title2_prefix3.png'
import title2_prefix4 from '@static/changdao_report/title2_prefix4.png'
import title2_prefix5 from '@static/changdao_report/title2_prefix5.png'
import title2_prefix6 from '@static/changdao_report/title2_prefix6.png'
import title2_prefix7 from '@static/changdao_report/title2_prefix7.png'
import styles from './modules.scss'
class ConditionScheme extends Component {
    state = {
      titlePrefix:{
        1:title2_prefix1,
        2:title2_prefix2,
        3:title2_prefix3,
        4:title2_prefix4,
        5:title2_prefix5,
        6:title2_prefix6,
        7:title2_prefix7,
      }
    }
    componentDidMount() {

    }
    openDesc=(type,index,item,index_new)=>{
        this.props.openDesc(type,index,item,index_new)
    }
    render() {
        const { data , index_new} = this.props
        const cultureItems=data.cultureItems;
        cultureItems&&cultureItems.length&&cultureItems.map((list,index)=>{
          const list_all=list.item&&list.item.split('</h2>');
          list.item1=list_all&&list_all[0].substring(4,list_all[0].length);
          list.item2=list_all&&list_all[1];
          list.item2 = list.item2.replace(/(\r\n[^\r\n]+)\r\n/g,"$1\</p>");
          list.item2 = list.item2.replace(/\r\n/g,"<p>");
        })
        const {titlePrefix}=this.state;
        return (
            <div className={`${styles.type3}`} key={detail.moduleType}>
            <div className={styles.cardTitle}>
              <img src={title_prefix1} />
              <div>{data.head}</div>
            </div>
            <div className={styles.res}>
               {data.des}
            </div>
               {
              cultureItems&&cultureItems.length&&
              cultureItems.map((item,index)=>(
                  <div className={styles.ctnRight} key={index}>
                    <div className={styles.ctnIcon} onClick={()=>this.openDesc('4503',index,data,index_new)}>

                      <div  className={styles.subTitle}>
                         <img src={titlePrefix[index>6?7:index+1]} />
                         <div>{item.item1}</div>
                      </div>
                      <div>
                        <img src={item.isOpen?up:down} />
                      </div>

                    </div>

                    {
                      item.isOpen&&<div className={styles.ctnDesc1} dangerouslySetInnerHTML={{__html:item.item2}}>
                      </div>
                    }
                      
                  </div>
              ))
            }

           
          </div>
        )
    }
}

export default ConditionScheme
