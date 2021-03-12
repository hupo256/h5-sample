import React, { Component, Fragment } from 'react'
import styles from './components.scss'
import kefu from '@static/reportEg/kefu.png'
import share from '@static/reportEg/share.png'
import head1 from '@static/report4_2/head1.png'
import head2 from '@static/report4_2/head4.png'
import dna from '@static/reportEg/dna.png'
import close1 from '@static/reportEg/close1.png'
import down from '@static/reportEg/down.png'
import wxQR from '@static/wxQR.png'
import nfriend_share1 from '@static/nfriend_share1.png'
import LinkManList from './linkManList.jsx'
import { ua, API } from '@src/common/app'
import toDoShare from '@src/common/utils/toDoShare'
import {
    sampleReportQrcodeView,
    sampleReportPageButtonGoto
} from '../BuriedPoint'
export default class Evaluate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showQR: false,
            showList: false,
            sharePop: false,
            shareConfig: {
                shareUrl: window.location.origin + '/mkt/reportExample/',
                title: '小安基因检测示例报告',
                subTitle: '30秒快速了解检测报告长啥样>>点击查看',
                headImg: `${window.location.origin}/mkt/reportExample/images/shareRedPacker/shareExampleImg.png`,
            },
            isAndall: ua.isAndall()
        }
    }
    componentDidMount() {
        const { shareInfo, setLoginFlag, setCurLinkMan } = this.props
        setCurLinkMan()
        // 详情页分享四要素赋值
        if (shareInfo) {
            this.setState({
                shareConfig: shareInfo
            })
            toDoShare(shareInfo, false)
        } else {
            const { shareConfig } = this.state
            toDoShare(shareConfig, false)
        }

        API.myInfo({ noloading: 1, nomsg: true }).then(res => {
            const { code, data } = res
            if (!code || code == 100001) {
                if (!data || !data.mobileNo) {
                    setLoginFlag && setLoginFlag(true)
                    return
                }
            }
        })
    }

    toggleShowQR = bool => {
        const { curLinkMan } = this.props
        const { code, page_code, noScroll } = this.props
        this.setState({
            showQR: bool,
        })
        noScroll(bool)
        // 访问私人号二维码
        if (bool) {
            sampleReportQrcodeView()
            sampleReportPageButtonGoto({
                Btn_name: 'customer_service',
                page_code,
                sample_linkman: curLinkMan.userName,
                relation_id: curLinkMan.relationId,
                report_code: code
            })
        }
    }
    showLinkManList = bool => {
        this.setState({
            showList: bool
        })
    }
    switchTheMan = id => {
        console.log(id)
        const { history, getReports, setCurLinkMan } = this.props
        history.push(`/reportExample/?linkManId=${id}`)
        getReports()
        setCurLinkMan()
        this.showLinkManList(false)
    }
    // 分享
    toShare = () => {
        const { shareConfig, isAndall } = this.state
        const { code, page_code, noScroll, curLinkMan } = this.props
        if (isAndall) {
            toDoShare(shareConfig, true)
        } else {
            this.setState({ sharePop: true })
        }
        noScroll(true)
        sampleReportPageButtonGoto({
            Btn_name: 'share',
            page_code,
            sample_linkman: curLinkMan.userName,
            relation_id: curLinkMan.relationId,
            report_code: code
        })
    }
    modalToggle = (name) => {
        const { noScroll } = this.props
        const bool = this.state[name]
        this.setState({
            [name]: !bool
        })
        noScroll(!bool)
    }

    render() {
        const { showQR, showList, sharePop } = this.state
        const { title, curLinkMan, linkMans } = this.props
        console.log(curLinkMan)
        return (
            <Fragment>
                <section className={styles.egHeader}>
                    <p>以下为示例报告，请以真实检测数据为准</p>
                    <div>
                        {/* 用户信息 */}
                        {
                            title ? <div className={styles.reportTitle}> {title} </div> : <div className={styles.userInfoBox}
                                onClick={() => this.showLinkManList(true)}>
                                <div>
                                    <img src={curLinkMan.relationId == 3 ? head1 : head2} alt="" />
                                </div>
                                <p>{`${curLinkMan.userName}(${curLinkMan.relationId == 3 ? '宝宝' : '成人'})`}</p>
                                <img src={down} alt="" />
                            </div>
                        }

                        <div>
                            <img src={kefu} alt=""
                                onClick={() => this.toggleShowQR(true)} />
                            <img src={share} alt=""
                                onClick={this.toShare} />
                        </div>
                    </div>
                </section>
                {
                    showQR && <section className={styles.QRcode}>
                        <div>
                            <div style={{ backgroundImage: `linear-gradient(to right, #347AEA, #629CF9)` }}>
                                <div style={{ backgroundImage: `url(${dna})` }}>
                                    <p>加安迪姐了解更多报告内容，<br />添加时请回复感兴趣的报告名称。</p>
                                </div>
                            </div>
                            <div>
                                <img src="http://dnatime-prod.oss-cn-hangzhou.aliyuncs.com/misc/erweima.png" alt="" />
                                <div style={{ backgroundImage: `linear-gradient(to left, #347AEA, #629CF9)` }}>{ua.isAndall() ? '微信扫码添加' : '微信扫码添加'}</div>
                            </div>
                        </div>
                        <img src={close1} alt=""
                            onClick={() => this.toggleShowQR(false)} />
                    </section>
                }
                {/* 引导分享 */}
                {
                    sharePop && <div className={styles.sharebox} onClick={() => this.modalToggle('sharePop')}>
                        <img src={nfriend_share1} alt="nfriend_share" />
                    </div>
                }

                <LinkManList manList={linkMans}
                    showList={showList}
                    toggleMask={this.showLinkManList}
                    curLinkManId={curLinkMan.id}
                    switchTheMan={this.switchTheMan} />

            </Fragment >
        )
    }
}
