import React, { Component } from 'react'
import title_prefix3 from '@static/changdao_report/title_prefix3.png'
import styles from './modules.scss'
class CommonText extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }
    openDesc=(type,index,item,index_new)=>{
        this.props.openDesc(type,index,item,index_new)
    }
    render() {
        const { data , index_new} = this.props
        if (data.text.indexOf("<br/>") != -1 ){
          data.text=data.text.replace(/<[<br/>]+>/g,'</p><p>');
          data.text='<p>'+data.text+'</p>'
        }
        return (
          <div className={`${styles.type5}`} key={index_new}>
            <div className={styles.cardTitle}>
              {
                data.icon?<img src={data.icon} />:
                <img src={title_prefix3} />
              }
              <div>{data.title}</div>
            </div>
            <div className={`${styles.ctnDesc}`}  dangerouslySetInnerHTML={{__html:data.text}}>
            </div>
          </div>
        )
    }
}

export default CommonText
