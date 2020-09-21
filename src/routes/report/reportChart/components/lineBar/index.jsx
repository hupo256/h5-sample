import React from 'react';
import styles from './style.scss'
import images from './image'
class LineBar extends React.Component {
    state = {
       
    }
    componentDidMount() {
       
    }
  
    render() {
        const { item ,num} = this.props
        const {}=this.state
        return (
            <div className={styles.line_bar}>
                <div className={styles.line_bar_header}>
                    <h1>{item.categoryDesc}</h1>
                    {0<item.scoreResult && item.scoreResult<=10?<img src={images.rankOne} />:null}
                    {10<item.scoreResult && item.scoreResult<=20?<img src={images.rankTwo} />:null}
                    {20<item.scoreResult && item.scoreResult<=30?<img src={images.rankThree} />:null}
                    {30<item.scoreResult && item.scoreResult<=40?<img src={images.rankFour} />:null}
                    {40<item.scoreResult && item.scoreResult<=50?<img src={images.rankFive} />:null}
                    {50<item.scoreResult && item.scoreResult<=60?<img src={images.rankSix} />:null}
                    {60<item.scoreResult && item.scoreResult<=70?<img src={images.rankSeven} />:null}
                    {70<item.scoreResult && item.scoreResult<=80?<img src={images.rankEight} />:null}
                    {80<item.scoreResult && item.scoreResult<=90?<img src={images.rankNine} />:null}
                    {90<item.scoreResult && item.scoreResult<=100?<img src={images.rankTen} />:null}  
                      
                </div> 
                <div className={styles.line_bar_bottom}>
                    <div className={styles.line_bar_inner}>      
                        
                        {0<item.scoreResult && item.scoreResult<=10?<span className={num===1?styles.lineColor:''} style={{width: "10%"}}></span>:null}
                        {10<item.scoreResult && item.scoreResult<=20?<span className={num===1?styles.lineColor:''} style={{width: "20%"}}></span>:null}
                        {20<item.scoreResult && item.scoreResult<=30?<span className={num===1?styles.lineColor:''} style={{width: "30%"}}></span>:null}
                        {30<item.scoreResult && item.scoreResult<=40?<span className={num===1?styles.lineColor:''} style={{width: "40%"}}></span>:null}
                        {40<item.scoreResult && item.scoreResult<=50?<span className={num===1?styles.lineColor:''} style={{width: "50%"}}></span>:null}
                        {50<item.scoreResult && item.scoreResult<=60?<span className={num===1?styles.lineColor:''} style={{width: "60%"}}></span>:null}
                        {60<item.scoreResult && item.scoreResult<=70?<span className={num===1?styles.lineColor:''} style={{width: "70%"}}></span>:null}
                        {70<item.scoreResult && item.scoreResult<=80?<span className={num===1?styles.lineColor:''} style={{width: "80%"}}></span>:null}
                        {80<item.scoreResult && item.scoreResult<=90?<span className={num===1?styles.lineColor:''} style={{width: "90%"}}></span>:null}
                        {90<item.scoreResult && item.scoreResult<=100?<span className={num===1?styles.lineColor:''} style={{width: "100%"}}></span>:null}      

                        <i className={styles.lineOne}></i>
                        <i className={styles.lineTwo}></i>
                        <i className={styles.lineThree}></i>
                        <i className={styles.lineFour}></i>
                    </div>    
                </div>       
                
                     
            </div>
        )
    };
}

export default LineBar;