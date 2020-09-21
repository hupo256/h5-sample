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
                    {item.scoreNum==0?<img src={images.rankZero} />:null}
                    {0<item.scoreNum && item.scoreNum<=0.5?<img src={images.rankOne} />:null}
                    {0.5<item.scoreNum && item.scoreNum<=1?<img src={images.rankTwo} />:null}
                    {1<item.scoreNum && item.scoreNum<=1.5?<img src={images.rankThree} />:null}
                    {1.5<item.scoreNum && item.scoreNum<=2?<img src={images.rankFour} />:null}
                    {2<item.scoreNum && item.scoreNum<=2.5?<img src={images.rankFive} />:null}
                    {2.5<item.scoreNum && item.scoreNum<=3?<img src={images.rankSix} />:null}
                    {3<item.scoreNum && item.scoreNum<=3.5?<img src={images.rankSeven} />:null}
                    {3.5<item.scoreNum && item.scoreNum<=4?<img src={images.rankEight} />:null}
                    {4<item.scoreNum && item.scoreNum<=4.5?<img src={images.rankNine} />:null}
                    {4.5<item.scoreNum && item.scoreNum<=5?<img src={images.rankTen} />:null}  
                      
                </div> 
                <div className={styles.line_bar_bottom}>
                    <div className={styles.line_bar_inner}>  
                        {item.scoreNum==0?<span className={num===1?styles.lineColor:''} style={{width: "0%"}}></span>:null}       
                        {0<item.scoreNum && item.scoreNum<=0.5?<span className={num===1?styles.lineColor:''} style={{width: "10%"}}></span>:null}
                        {0.5<item.scoreNum && item.scoreNum<=1?<span className={num===1?styles.lineColor:''} style={{width: "20%"}}></span>:null}
                        {1<item.scoreNum && item.scoreNum<=1.5?<span className={num===1?styles.lineColor:''} style={{width: "30%"}}></span>:null}
                        {1.5<item.scoreNum && item.scoreNum<=2?<span className={num===1?styles.lineColor:''} style={{width: "40%"}}></span>:null}
                        {2<item.scoreNum && item.scoreNum<=2.5?<span className={num===1?styles.lineColor:''} style={{width: "50%"}}></span>:null}
                        {2.5<item.scoreNum && item.scoreNum<=3?<span className={num===1?styles.lineColor:''} style={{width: "60%"}}></span>:null}
                        {3<item.scoreNum && item.scoreNum<=3.5?<span className={num===1?styles.lineColor:''} style={{width: "70%"}}></span>:null}
                        {3.5<item.scoreNum && item.scoreNum<=4?<span className={num===1?styles.lineColor:''} style={{width: "80%"}}></span>:null}
                        {4<item.scoreNum && item.scoreNum<=4.5?<span className={num===1?styles.lineColor:''} style={{width: "90%"}}></span>:null}
                        {4.5<item.scoreNum && item.scoreNum<=5?<span className={num===1?styles.lineColor:''} style={{width: "100%"}}></span>:null}      

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