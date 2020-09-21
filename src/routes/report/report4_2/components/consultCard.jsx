import React, { Component } from 'react'
import styles from '../report4_2.scss'
import images from '../images'
import html2canvas from 'html2canvas'
import andall from '@src/common/utils/andall-sdk'



class ConsultCard extends Component {
    static propTypes = {

    }
    state={
        flag: false,
        base64Img:"",
        scrollTop:''
    }
    componentDidMount() {
        const { data } = this.props
        let _this=this

        _this.convertImgToBase64(data.wechatUrl, function(base64Img){     
            _this.setState({
                base64Img
            })
        });

    }

    hideMask = () =>{
        this.setState({
            flag: false
        })
        const{scrollTop}=this.state;
        document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
    }
    showMask = () =>{    
        let scrollTop=document.documentElement.scrollTop
        this.setState({
            scrollTop
        })
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.setState({
            flag: true
        })
    }
    handleHtml2Canvas = () => {
        let myPoster = this.refs.myPoster
        let canvas = document.createElement('canvas')
        canvas.width = myPoster.offsetWidth * 3
        canvas.height = myPoster.offsetHeight * 3
        let opts = {
          scale: 3,
          canvas: canvas,
          width: myPoster.offsetWidth,
          height: myPoster.offsetHeight,
          useCORS: true
        }
    
        html2canvas(myPoster, opts).then(canvas => {
            console.log(canvas);
          // setmoreImg(canvas.toDataURL('image/jpeg'))
          // setTimeout(() => {
            andall.invoke('saveWebImage', {
              source: canvas.toDataURL('image/jpeg'),
            })
          // },300)
        })
        
    }
    convertImgToBase64(url, callback, outputFormat){
        var canvas = document.createElement('canvas'),
     　　ctx = canvas.getContext('2d'),
     　　img = new Image;
     　　img.crossOrigin = 'Anonymous';
     　　img.onload = function(){
         　　canvas.height = img.height;
         　　canvas.width = img.width;
         　　ctx.drawImage(img,0,0,img.width,img.height);
         　　var dataURL = canvas.toDataURL(outputFormat || 'image/png');
         　　callback.call(this, dataURL);
         　　canvas = null; 
         };
     　　img.src = url;
     }   
    
  

    
    render() {
        const { data } = this.props
        const {flag,base64Img}=this.state
        return (
            <div className={styles.card}>
                <div className={styles.consult}>
                    <div>
                        <img src={data.moduleIconUrl} alt="" />
                        <div>{data.title.split('|').map((item, index) => {
                            return <p key={index}>{item}</p>
                        })}</div>
                        {data.wechatUrl?
                            <div className={styles.consult_link} style={{backgroundImage:`url(${images.right})`}} onClick={this.showMask}>
                            扫码添加小助手
                            </div> : null
                        }
                          
                    </div>
                    <div></div>
                    <div className={styles.consult_basic_info}>
                        <div className={styles.consult_avatar} style={{backgroundImage:`url(${data.expertPicURL})`}}></div>
                        <div className={styles.consult_info}>
                            <h1>{data.expertTitle}</h1>
                            <p>{data.expertDesc}</p>
                        </div>

                    </div>
                </div>
                <div className={`${styles.consult_mask} ${!!flag ? styles.active : ''}`}>
                    <div className={styles.content}>
                        <img src={images.maskContent} />
                       
                            <div className={styles.maskQrcode} >
                                <img src={base64Img} ref='myPoster' />
                            </div>
                            
                            
                            <div className={styles.btn} onClick={this.handleHtml2Canvas}>立即保存二维码</div>
                        
                        <div className={styles.close_btn} onClick={this.hideMask}>
                            <img src={images.closeCircle} />    
                        </div>  
                    </div>  
                </div>          
            </div>
        )
    }
}

export default ConsultCard
