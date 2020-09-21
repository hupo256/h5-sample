import React, { Component, Fragment } from 'react'
import Page from '@src/components/page'
import styles from './reportExample.scss'
import { API, fun } from '@src/common/app'
const { getParams } = fun
import Header from './components/header'
import Thought from './components/thought'
import highlight from '@static/reportEg/highlight.png'
import lowlight from '@static/reportEg/lowlight.png'
import Category from '../reportHome/components/highlightCategory'
import {
    sampleReportRedTraitPageView,
} from './BuriedPoint'

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
            linkMans: [{
                id: 1347,
                relationId: "3",
                userName: "小小安",
                sex: "male",
                status: 0,
            }, {
                id: 2286223641214976,
                relationId: "1",
                userName: "小安",
                sex: "female",
                status: 0,
            }],
            curLinkMan: {
                id: 1347,
                relationId: "3",
                userName: "小小安",
                sex: "male",
                status: 0,
            },
        }
    }
    componentDidMount() {
        const lowurl = location.href.toLocaleLowerCase()
        const { type, id, linkManId, productCategory, status, code, barCode, reportType} = getParams()
        const {linkmanid} = getParams(lowurl)
        const obj = barCode ? { code, barCode,linkManId,type,nomsg:true,productCategory:0,reportType,relationId:linkManId == 1347 ? 3:1,categoryType:20 } : {linkManId, type, nomsg: true}
        API.highLightList(obj).then(res => {
            this.setState({
                categoryList: res.data.categoryList,
                linkManName: linkmanid == 1347 ? '小小安':'小安',
                highLightDesc: res.data.highLightDesc,
                highLightTitle: res.data.highLightTitle,
                code: res.data.code
            })
            sampleReportRedTraitPageView({
                sample_linkman: res.data.linkManName,
                sample_barcode: res.data.categoryList[0].barCode,
                page_type: res.data.categoryList[0].reportType,
                report_code: res.data.code
            })
        })
        console.log(document.documentElement.scrollTop);
        document.documentElement.scrollTop = 0
    }
    setNoScroll = (bool) => {
        this.setState({
            noScroll: bool
        })
    }
    setCurLinkMan = () => {
        const { linkManId } = getParams()
        const { linkMans } = this.state
        if (linkMans[1].id == linkManId) {
            this.setState({
                curLinkMan: linkMans[1]
            })
        } else {
            this.setState({
                curLinkMan: linkMans[0]
            })
        }
    }
    render() {
        const { categoryList, linkManName, highLightDesc, highLightTitle, code, noScroll,curLinkMan, linkMans } = this.state
        const { type } = getParams()
        return (
            <Page title={highLightTitle} class={styles.page}>
                <div style={noScroll ? { overflow: '', height: '100vh' } : {}}>
                    <Header title={`「${linkManName}」的${type == 'H' ? '亮点' : '红点'}基因`}
                        page_code={type == 'H' ? 'sample_good_trait_list' : 'sample_red_trait_list'}
                        code={code}
                        noScroll={this.setNoScroll}
                        curLinkMan={curLinkMan}
                        linkMans={linkMans}
                        setCurLinkMan={this.setCurLinkMan} />

                    <div className={type == 'H' ? styles.hBanner : styles.lBanner}>
                        <div>
                            <p>{highLightTitle}</p>
                            <p>{highLightDesc}</p>
                        </div>
                        <img src={type == 'H' ? highlight : lowlight} alt="" />
                    </div>
                    <Category data={categoryList} {...this.props} />
                    {code && <Thought code={code}
                        userName={linkManName}
                        page_code={type == 'H' ? 'sample_good_trait_list' : 'sample_red_trait_list'}
                        noScroll={this.setNoScroll} />}
                </div>
            </Page>
        )
    }
}
