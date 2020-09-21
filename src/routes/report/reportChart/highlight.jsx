import React, { Component, Fragment } from 'react'
import Page from '@src/components/page'
import { HighlightLoader } from '@src/components/contentLoader'
import styles from './reportHome.scss'
import {API, fun, ua} from '@src/common/app'
const { getParams } = fun
import highlight from '@static/reportEg/highlight.png'
import lowlight from '@static/reportEg/lowlight.png'
import Category from './components/highlightCategory/index'
import ShareBanner from './components/shareBanner/index'
import LoginCover from '@src/components/acitvityMould/loginCover'
import {
    shareLinkGoto
} from './BuriedPoint'
import images from './image'

export default class ReportList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categoryList: [],
            linkManName: '',
            highLightTitle: '',
            highLightDesc: '',
            code: '',
            noScroll: false,
            QRlist: null,
            shareToken: null,
            mobile: '',
            loginVisible: false,
            tipsShow: false,
            num:''
        }
    }
    componentDidMount() {
        const { type, id, linkManId, productCategory, status, reportType, shareToken, code, barCode,num } = getParams()
        this.setState({
            num
        })
        API.myInfo({ noloading: 1, nomsg: true }).then(res => {
            if (!res.data.mobileNo) {
                this.setState({
                    loginVisible: true
                })
            }
        })
        let shareCode = null
        if (ua.isWechat() && getParams().hasOwnProperty('state')) {
          const curUrl = window.location.href
          const code = curUrl.substring(curUrl.indexOf('code=')+5, curUrl.indexOf('&linkManId'))
          shareCode = code
        }
        API.highLightListShare({
            categoryType: 20,
            id,
            linkManId,
            productCategory,
            status,
            type,
            reportType,
            code: shareCode || (code || ''),
            barCode: barCode || '',
            shareToken,
        }).then(res => {
            // console.log(res);
            let num=res.data.categoryList[0].traitList.length
            this.setState({
                categoryList: res.data.categoryList,
                linkManName: res.data.linkManName,
                highLightDesc: res.data.highLightDesc,
                highLightTitle: res.data.highLightTitle,
                code: res.data.code,
                QRlist: res.data.reportQrcodeConfigReqList,
                shareToken: res.data.shareToken,
                qnaireVerdict:res.data.qnaireVerdict
                
            })
            shareLinkGoto({
                page_code: type == 'L' ? 'report_red_trait_page' : 'report_good_trait_page',
                sample_linkmanid: res.data.linkManId,
                trait_code: '',
                trait_name: '',
                report_code: res.data.code,
                report_name: res.data.shareInfo.title
            })
        })
        console.log(document.documentElement.scrollTop);
        document.documentElement.scrollTop = 0
    }

    toggleMask = (name) => {
        const bool = this.state[name]
        this.setState({
            [name]: !bool
        })
    }
    changeMobile = (num) => {
        this.setState({
            mobile: num
        })
    }
    // 设置登陆标示
    setLoginFlag = bool => {
        return
    }
    tipsMask=()=>{
        var _this=this
        _this.setState({
            tipsShow:true
        })
        setTimeout(function(){
            _this.setState({
                tipsShow:false
            })
        },2000)
    }
    linkTo=(url)=>{
        window.location.href=url
    }

    render() {
        const { categoryList, shareToken, highLightDesc,
            highLightTitle, QRlist, noScroll, loginVisible,tipsShow ,num,qnaireVerdict} = this.state
        const { type } = getParams()
        return (
            highLightTitle ? <Page title={highLightTitle} class={styles.page} >
                <div style={noScroll ? { overflow: '', height: '100vh' } : {}}>
                    <div className={type == 'H' ? styles.hBannerBg : styles.lBannerBg}></div>
                    <div className={type == 'H' ? styles.hBanner : styles.lBanner} >
                        <div className={type == 'H' ? styles.high : styles.low}>
                        {/* <div style={type == 'H' ? { backgroundImage: `url(${highlight})` } : { backgroundImage: `url(${lowlight})` }}
                            className={type == 'H' ? styles.high : styles.low}> */}
                            <div className={styles.highLightTitle}>
                                <div className={styles.highLightTitleTxt} onClick={()=>{this.tipsMask()}}>
                                    <span>{highLightTitle}</span>
                                    <img src={images.mark} />
                                    <div className={`${styles.highLightMask} ${tipsShow?`${styles.active}`:''} `}>
                                        <div className={styles.content}>
                                            {highLightDesc}
                                        </div>    
                                    </div>    
                                </div>
                                {/* <p>{highLightDesc}</p> */}
                                <h2>共{num}个</h2>
                            </div>
                        </div>
                    </div>
                    {qnaireVerdict?<div className={styles.highLightLink} >
                        <div className={styles.chart}>
                        {qnaireVerdict.btn}
                        </div>  
                        <div className={styles.linkTo} onClick={()=>this.linkTo(qnaireVerdict.qnaireUrl)}>点击查看
                        </div>     
                    </div>:null}
                    <div className={styles.category_List}>
                        <Category data={categoryList} shareToken={shareToken} {...this.props} />
                    </div>
                </div>
                {QRlist && <ShareBanner QRlist={QRlist} />}
                <LoginCover visible={loginVisible} setVisible={this.toggleMask}
                    changeMobile={this.changeMobile} setLoginFlag={this.setLoginFlag}
                    showClose={false} />
            </Page> : <HighlightLoader />
        )
    }
}
