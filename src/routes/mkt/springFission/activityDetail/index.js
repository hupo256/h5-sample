import React from 'react'
import { Page, Modal } from '@src/components'
import { MyLoader } from '../../lego/MyLoader'
import { API, fun, ua } from '@src/common/app'
import images from '@src/common/utils/images'
import { Icon } from 'antd-mobile'
import Rankings from './components/rankings'
import Carousel from './components/carousel'
import toDoShare from '@src/common/utils/toDoShare'
import {
    FXLBLandingpageView,
    FXLBAccountGoto,
    FXLBShareGoto,
    FXLBInvitationRecordGoto
} from '../BuriedPoint';

import styles from './activityDetail'
const { springFission, shareRedPacker } = images
const { getParams } = fun

class SpringFission extends React.Component {
    state = {
        sharePop: false,
        expand: false,
        list: [],
        activRule: "",
        firstImg: "",
        userId: '',
        headImg: '',
        nickName: '',
        invitedNum: '',
        accumulatedAmount: '',
        prizeImg: '',
        showRule: false,
        shareConfig: "",
        ranking: "",
        pfTopRankRespList: [],
        bannerInfoList: [],
        userRank: {},
        isAndall: ua.isAndall(),
        haveFinish: null
    }

    componentDidMount() {
        console.log(this.props)
        this.getShareActivPageInfo()
        this.getRankingRecord()
        this.getShareConfig()
        // 页面访问埋点
        FXLBLandingpageView({ view_type: getParams().viewType });
    }

    // 获取邀请主页配置
    getShareActivPageInfo = () => {
        API.getSpringShareActivPageInfo({ "activCode": "fenxiangfanyong" })
            .then(res => {
                console.log(res);
                this.setState({ ...res.data })
            })
    }
    // 获取分享配置
    getShareConfig = () => {
        const { haveFinish } = this.state;
        API.getSpringShareConfig({ "activCode": "fenxiangfanyong" })
            .then(res => {
                const { data } = res
                this.setState({
                    shareConfig: data
                })
                if (!haveFinish) {
                    toDoShare(data, false)
                }
            })
    }
    // 获取排行配置
    getRankingRecord = () => {
        API.getSpringRankingRecord({ "activCode": "fenxiangfanyong" })
            .then(res => {
                console.log(res);
                const { pfTopRankRespList, userId, headImg, invitedNum, ranking, phone } = res.data;
                this.setState({
                    ...res.data,
                    list: pfTopRankRespList.slice(0, 10),
                    userRank: { userId, headImg, invitedNum, ranking, phone }
                })
            })
    }
    // 蒙版toggle
    modalToggle = (name) => {
        const bool = this.state[name]
        this.setState({
            [name]: !bool
        })
    }
    // 跳转邀请成功页面
    toInvitation = () => {
        // 埋点
        FXLBInvitationRecordGoto();
        // this.props.history.push(`/invitation`);
        window.location.href = `${window.location.origin}/andall-sample/invitation`


    }
    // 跳转我的账户页面
    toMyAccount = () => {
        // 埋点
        FXLBAccountGoto()
        const { isAndall } = this.state
        if (isAndall) {
            window.location.href = `${window.location.origin}/andall-sample/myAccount?viewType=FXLB_account`
            // this.props.history.push("/myAccount?viewType=FXLB_account")
        } else {
            window.location.href = `${window.location.origin}/download-app`
        }

    }

    // 收起排名
    foldRanking = () => {
        const { pfTopRankRespList } = this.state
        this.setState({
            expand: false,
            list: pfTopRankRespList.slice(0, 10)
        })
    }
    // 展开排名
    expandRanking = () => {
        const { pfTopRankRespList } = this.state
        this.setState({
            expand: true,
            list: pfTopRankRespList

        })
    }
    // 分享
    toShare = () => {
        const { shareConfig, isAndall, haveFinish } = this.state
        if (haveFinish) {
            return
        }
        // 分享按钮埋点
        FXLBShareGoto()
        if (isAndall) {
            toDoShare(shareConfig, true)
        } else {
            this.setState({ sharePop: true })
        }
    }
    render() {
        // const { springFission: { data:{loading, noscroll} } } = this.props
        const loading = false
        const { list, showRule, expand, bannerInfoList, activRule,
            headImg, nickName, invitedNum, accmulatedAmount,
            prizeImg, sharePop, userRank, firstImg, haveFinish, pfTopRankRespList } = this.state
        return (
            <Page title='分享有礼'>
                {loading ? <MyLoader /> :
                    (<div>
                        <div className={styles.detail}>
                            <Carousel bannerInfoList={bannerInfoList}
                                color={"#FD7B20"}
                                speakerUrl={`${springFission}speaker.png`}
                                bgclass={"invitedCarousel"}
                                backgroundColor={"#FF8343"} />
                            {/* 顶部标牌 */}
                            <div className={styles.topSign}>
                                <img src={firstImg} />
                                <div className={styles.rule}
                                    onClick={() => this.modalToggle('showRule')}>活动规则</div>
                            </div>

                            <div className={styles.rankingBox}>
                                {/* 用户详情 */}
                                <div className={styles.middleInfo}>

                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>
                                            <img src={headImg || `${springFission}avatar.png`} alt="#"></img>
                                        </div>
                                        <div className={styles.name}>
                                            {nickName}
                                        </div>
                                    </div>

                                    <div className={styles.rewardInfo}>
                                        <div
                                            className={styles.infoBox}
                                            onClick={this.toInvitation}>
                                            <div>
                                                <div className={styles.infoNum}>{invitedNum}</div>
                                                <div className={styles.infoText}>邀请好友数</div>
                                            </div>
                                            <div className={styles.rightArrow}><Icon type="right" color={"#FF8C47"} size={12} /></div>
                                        </div>

                                        <div className={styles.line}></div>

                                        <div
                                            className={styles.infoBox}
                                            onClick={this.toMyAccount}>
                                            <div>
                                                <div className={styles.infoNum}>
                                                    <div>
                                                        <span>¥</span>{accmulatedAmount || '0'}
                                                    </div>
                                                </div>
                                                <div className={styles.infoText}>累计奖金</div>
                                            </div>
                                            <div className={styles.rightArrow}><Icon type="right" color={"#FF8C47"} size={12} /></div>
                                        </div>
                                    </div>
                                </div>
                                {/*  排行榜 */}
                                <div className={styles.rankingImgBox}>
                                    <img src={prizeImg}></img>
                                </div>
                                <Rankings userRank={userRank} rankingList={list} />
                                {/* 加载更多 */}
                                {pfTopRankRespList.length > 10 ? <div>
                                    {
                                        expand ?
                                            (<div
                                                className={styles.loadMore}
                                                onClick={this.foldRanking}
                                            >
                                                <div>收起</div>
                                                <Icon type="up" size="xxs" />
                                            </div>)
                                            : (<div
                                                className={styles.loadMore}
                                                onClick={this.expandRanking}>
                                                <div>展开更多</div>
                                                <Icon type="down" size="xxs" />
                                            </div>)
                                    }
                                </div> : <div className={styles.loadMore}></div>
                                }
                                <div className={styles.pdb}></div>
                                {/* 按钮 */}
                                {!haveFinish && <div onClick={this.toShare}
                                    className={styles.btn}>
                                    立即邀请赚钱
                                </div>}
                            </div>
                        </div>

                        {/* 引导分享 */}
                        {sharePop && <div className={styles.sharebox} onClick={() => this.modalToggle('sharePop')}>
                            <img src={`${shareRedPacker}nfriend_share1.png`} alt="nfriend_share" />
                        </div>}

                        <Modal
                            handleToggle={() => { this.modalToggle('showRule') }}
                            type
                            visible={showRule}>
                            <div className={styles.scanModal}>
                                <div dangerouslySetInnerHTML={{
                                    __html: activRule
                                }} />
                            </div>
                        </Modal>
                    </div>)}
            </Page>
        )
    }
}

export default SpringFission
