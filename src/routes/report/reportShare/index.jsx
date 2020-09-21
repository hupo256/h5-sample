import React, { Component, Fragment } from 'react'
import Page from '@src/components/page'
import styles from './reportHome.scss'
import { API, fun } from '@src/common/app'
import LoginCover from '@src/components/acitvityMould/loginCover'

import RedLight from './components/redLight'
import Category from './components/homeCategory'
import Program from './components/program'
import Suggest from './components/suggest'
const { getParams } = fun
import ShareBanner from './components/shareBanner/index'
import {
    shareLinkGoto
} from './BuriedPoint'
import { ReportLoader } from '@src/components/contentLoader'

export default class ReportList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataInfo: [],
            name: '',
            userName: '',
            linkManId: '',
            code: '',
            QRlist: null,
            reportColor: '#fff',
            mobile: '',
            loginVisible: false,
            userInfo:{},
            programe:{}
        }
    }
    componentDidMount() {
        const { barCode, shareToken } = getParams()
        API.myInfo({ noloading: 1, nomsg: true }).then(res => {
            this.setState({
                userInfo:res.data
            })
            console.log(this.state.userInfo)
            if (!res.data.mobileNo) {
                this.setState({
                    loginVisible: true
                })
            }
        })
        API.reportIndexShare({
            barCode,
            firstCategoryId: "",
            shareToken
        }).then(res => {
            let dataInfo=res.data.dataInfo;
            let array=[]
            dataInfo.map((item, index) => {
                if(item.moduleType==4401){
                    array=item.data.categoryDtos
                    this.setState({
                        programe:array[array.length-1].recommendInfo
                    })
                }        
            })
        
            this.setState({
                dataInfo: res.data.dataInfo,
                name: res.data.name,
                userName: res.data.userName,
                linkManId: res.data.linkManId,
                code: res.data.code,
                QRlist: res.data.reportQrcodeConfigReqList,
                reportColor: res.data.reportColour
            })
            shareLinkGoto({
                page_code: 'report_normal_page',
                sample_linkmanid: res.data.linkManId,
                trait_code: '',
                trait_name: '',
                report_code: res.data.code,
                report_name: res.data.name
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
    unlock=(item)=>{
        console.log({ productId:item.productId, productNum:1 });
        const{linkManId,code}=this.state
        const params = {
          linkManId,
          productList:[{ productId:item.productId, productNum:1 }],
          activeCode:code,
          actualType: 2
        }
        andall.invoke('confirmOrder', params)
    }
    render() {
        const { dataInfo, name, linkManId,
            QRlist, reportColor, loginVisible,userInfo ,programe} = this.state
        return (
            !name ? <ReportLoader /> :
                <Page title={name && `安我生活-${name}`} class={styles.page} >
                    <div>
                        <section style={{ backgroundImage: `linear-gradient(to bottom, ${reportColor}, #ffffff)` }}
                            className={styles.indexPage}>
                            <p className={styles.homeTitle}>{name}</p>
                            {
                                dataInfo.map((item, index) => {
                                    switch (item.moduleType) {
                                        case 1201:
                                            return (
                                                <RedLight key={index} data={item.dataList} {...this.props} />
                                            )
                                        case 4403:
                                            return (
                                                <Suggest key={index} data={item.data} userInfo={userInfo} {...this.props} />
                                            )    
                                        case 4401:
                                            return (
                                                <Category key={index} data={item.data.categoryDtos} {...this.props} linkManId={linkManId} />
                                            )
                                        default:
                                            return null;
                                    }
                                })
                            }
                        </section>

                        {/* {programe.dataList.length>0?
                            <div className={styles.report_program}>
                                <h1>{programe.title}</h1>
                                <div className={styles.report_program_list}>
                                    {programe.dataList.map(item=>{return(
                                        <div className={styles.report_program_field}>
                                        <Program item={item} onUnlock={()=>{this.unlock(item)}}></Program>
                                        </div>
                                    ) 
                                    })}  
                                </div> 
                            </div>:null
                        } */}
                        <div className={styles.block1}></div>
                    </div>
                    {QRlist && <ShareBanner QRlist={QRlist} />}
                    {/* 手机登录弹窗 */}
                    <LoginCover visible={loginVisible} setVisible={this.toggleMask}
                        changeMobile={this.changeMobile} setLoginFlag={this.setLoginFlag}
                        showClose={false} />
                </Page>
        )
    }
}
