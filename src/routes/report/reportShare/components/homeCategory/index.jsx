import React, { Component, Fragment } from 'react'
import styles from './categoryDtos.scss'
import Entry from './reportEntry'
import lang from '@static/reportEg/lang.png'
import Recommendations from '../recommendation'

export default class Evaluate extends Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef();
        this.state = {
            hover: 0,
            fixedScroll:false,
            navArray:[],
            test: false
        }
        
    }
    componentDidMount() {
        console.log(this.props.data);
        this.addEventListenerSroll()
        
        // document.getElementById('category').scrollTop()
        this.getNavScrollArray();
       
       
    }
    getNavScrollArray=()=>{
        const{data}=this.props;
        let navArray=[]
        data.map((item,index)=>{
            navArray.push(document.getElementById("#scroll"+index).offsetTop - 50)
        })
        this.setState({
            navArray
        })
        
    }
    getNavScrollTop=()=>{
        let { navArray } = this.state;
        let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0
        if (document.body) bodyScrollTop = document.body.scrollTop
        if (document.documentElement) documentScrollTop = document.documentElement.scrollTop
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop
        let offsetTop=document.getElementById("category").offsetTop-60;
        //console.log(scrollTop);
        // let index = 0;
        // //console.log(this.state.navArray)
        // for(let i in navArray){
        //     if(scrollTop >= offsetTop && scrollTop >= navArray[i]){
        //         index = Number(i);
        //         // this.navCtrl(e, i);
        //     }
        //     console.log(document.body.offsetHeight)
        //     console.log(scrollTop,offsetTop,navArray[i])
        // }
    
        // if(this.state.test != index){
        //     this.state.test = index;
        //     if(this.state.hover>0){
        //         this.navCtrl("", this.state.hover,true);   
        //     }
        //     else{
        //         this.navCtrl("", index,true); 
        //     }
              
        // }

        // this.state.test = i;


        let index = 0;
        let scroll = true;
        for(let i in navArray){
            if(scrollTop >= offsetTop && scrollTop >= navArray[i]){
                index = Number(i);
                scroll = false;
            }
        }

        if(this.state.test != index){
            this.state.test = index;
            this.navCtrl("", index, scroll);
        }
        
    }
    addEventListenerSroll = () => {
        window.addEventListener('scroll', (e) => {
            //console.log(this.getScrollTop());
            this.getScrollTop()
            this.getNavScrollTop();
        }, false)
    }
   
    getScrollTop=()=> {
        
        let scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0
        let offsetTop=document.getElementById("category").offsetTop-60 
        if (document.body) bodyScrollTop = document.body.scrollTop;
        if (document.documentElement) documentScrollTop = document.documentElement.scrollTop;
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        
        let fixedScroll=scrollTop>offsetTop ?true:false

        this.setState({
            fixedScroll
        })
    }

    navCtrl = (e, index, scroll) => {
        const { data } = this.props;
        const maxScrollHeight = document.body.clientHeight - document.documentElement.clientHeight;
        const move = (this.myRef.current.scrollWidth - this.myRef.current.offsetWidth) / (data.length - 3)
        const dif = ((index - 1) * move - this.myRef.current.scrollLeft) / 10
        const animation = () => {
            if (i < 10) {
                this.myRef.current.scrollLeft += dif
                requestAnimationFrame(animation);
                i++
            } else {
                this.myRef.current.scrollLeft = (index - 1) * move
            }

        }
        let i = 0
        requestAnimationFrame(animation);
        if(!scroll){
            this.setState({ hover: index })
        }
       
        if(scroll){
            return
        }
        let scrollTop=document.getElementById("#scroll"+index).offsetTop - 50

        document.documentElement.scrollTop = scrollTop > maxScrollHeight ? maxScrollHeight : scrollTop;
        document.body.scrollTop = scrollTop > maxScrollHeight ? maxScrollHeight : scrollTop;
        
    }
    render() {
        const { data } = this.props
        const { hover,fixedScroll } = this.state
        return (
            <section className={styles.category} >
                    {data.length > 1?null:<h1 className={styles.title}>检测结论</h1>}
                    {data.length > 1 && <div  className={styles.navbarBox}>
                        <div className={`${styles.navbar} ${fixedScroll?`${styles.fixed}`:''}`} ref={this.myRef}>
                            {
                                data.map((item, index) => {
                                    return (
                                        <div className={`${styles.hoverNavTitle} ${index == hover ? styles.hoverNav : ''}`}>
                                            <div key={index} onClick={e => this.navCtrl(e, index)}>{item.catalogue}</div>
                                            <img src={index == hover ? lang : ''} alt="" />
                                            {item.lookFlag==0?<div className={styles.dot}></div>:null}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className={styles.scroll}></div>
                    </div>
                    }
               
                {
                    data[hover].suggestInfo.suggestFlag == 1 && <Recommendations data={data[hover].suggestInfo} />
                }
                {   
                    <div id='category'>
                        {data.map((item,index)=>{
                            return(
                                <div id={"#scroll"+index}>
                                    <Entry title={item.catalogue} dataList={item.resultInfo} {...this.props} />
                                </div>
                            )
                        })}
                    </div>
                }
                {/* <Entry dataList={data[hover].resultInfo} {...this.props} /> */}
            </section>

        )
    }
}
