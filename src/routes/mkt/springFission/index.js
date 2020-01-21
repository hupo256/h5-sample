import React from 'react'
import { Page, Modal } from '@src/components'
import { MyLoader } from '../lego/MyLoader'
import { API, fun, ua } from '@src/common/app'
import images from '@src/common/utils/images'
import toDoShare from '@src/common/utils/toDoShare'
import JumpImg from './componets/jumpImg'
import Ruler from '@src/components/ruler'
import { Toast } from 'antd-mobile'
import {
    GMFXLandingpageView,
    GMFXLandingpageCouponPopupGoto,
    GMFXLandingpageCouponPopupView,
    GMFXLandingpageCancelCouponPopup,
    GMFXLandingpageBuyNowGoto,
    GMFXSuccessProductViewGoto,
    GMFXShareGoto,
    GMFXConvertGoto,
    GMFXSuccessSharePopupGoto,
    GMFXSuccessSharePopupView,
    GMFXSuccessCancelSharePopup,
} from './BuriedPoint';

import styles from './fission'
const { springFission, shareRedPacker } = images
const { getParams, setSetssion, getSetssion } = fun


class SpringFission extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }
    state = {
        sharePop: false,
        checkOrder: false,
        isgrey: true,
        showRule: false,
        isAndall: ua.isAndall(),
        isWechat: ua.isWechat(),
        pfProductList: [],
        indexImgList: [],
        popFlag: false,
        activRule: "",
        shareConfig: {},
        orderId: "",
        mobileNo: "",
        isBangs: false,
        moneyPop: false,
        haveFinish: null
    }

    componentDidMount() {
        // console.log(this.props);
        this.getIndexConfig();
        this.getShareConfig();
        this.getUserInfor();
        this.judgeIsIPhone();
        // 页面访问埋点
        GMFXLandingpageView({ view_type: getParams().viewType });
    }
    // 判断是否为刘海屏
    judgeIsIPhone = () => {
        const userA = window.navigator.userAgent
        const isIPhone = /iPhone/.exec(userA)
        // console.log(window.screen);
        if (isIPhone) {
            if ((window.screen.width == 414 && window.screen.height == 896) || (window.screen.width == 375 && window.screen.height == 812)) {
                this.setState({
                    isBangs: true
                })
            }
        }
    }
    // 获取主页配置
    getIndexConfig = () => {
        API.getSpringIndexConfig({ "activCode": "chunjieliebian" })
            .then(res => {
                // console.log(res);
                const { status, popFlag, pfProductList, orderId } = res.data;
                this.setState({ ...res.data })
                // 领券弹框埋点
                if (popFlag) {
                    GMFXLandingpageCouponPopupGoto();
                }
                const popOnce = getSetssion("popOnce");
                const token = localStorage.getItem('token');
                // console.log(popOnce);
                console.log(token);

                // 分享赚钱弹框埋点
                if (orderId && (popOnce != token)) {
                    GMFXSuccessSharePopupGoto()
                    setSetssion("popOnce", token)
                    this.setState({
                        moneyPop: true
                    })
                }
                // 获取产品详情ByID
                API.productDetail({ id: pfProductList[0].productId, noloading: 1 }).then(res => {
                    // console.log(res);
                    const { productName, productPrice, productDetail } = res.data.tradeProduct
                    let tempObj = [{
                        prodId: pfProductList[0].productId,
                        productNum: 1,
                        productName,
                        cartProdPath: productDetail.indexPicUrl,
                        productPrice,
                        fromCartFlag: true
                    }]
                    setSetssion("shopList", tempObj)
                })
                switch (status) {
                    case '1':
                        this.setState({
                            checkOrder: true,
                            isgrey: true
                        })
                        break;
                    case '2':
                        // 一期一律置灰;二期已更改
                        this.setState({
                            checkOrder: true,
                            isgrey: false
                        })
                        break;
                    case '3':
                        this.setState({
                            checkOrder: false,
                            isgrey: true
                        })
                        break;
                    default:
                        break;
                }
            })
    }

    //  获取分享配置
    getShareConfig = () => {
        const { haveFinish } = this.state;
        API.getSpringShareConfig({ "activCode": "chunjieliebian" })
            .then(res => {
                // console.log(res);
                const { data } = res
                this.setState({
                    shareConfig: data
                })
                let springFission = getParams()
                springFission.name = 'springFission'
                setSetssion('springFission', springFission)
                // console.log(data);
                if (!haveFinish) {
                    toDoShare(data, false)
                }
            })
    }

    // 蒙版toggle
    modalToggle = (name, info) => {
        const bool = this.state[name]
        this.setState({
            [name]: !bool
        })
        // 领券弹框埋点
        if (name == 'popFlag') {
            if (info == 'view') {
                GMFXLandingpageCouponPopupView()
            } else if (info == 'cancel') {
                GMFXLandingpageCancelCouponPopup()
            }
        }
        // 分享赚钱埋点
        if (name == 'moneyPop') {
            if (info == 'share_view') {
                GMFXSuccessSharePopupView()
            } else if (info == 'share_cancel') {
                GMFXSuccessCancelSharePopup()
            }
        }

    }

    // 分享
    toShare = () => {
        // 分享按钮埋点
        GMFXShareGoto()
        const { shareConfig, isAndall } = this.state
        if (isAndall) {
            toDoShare(shareConfig, true)
        } else {
            this.setState({ sharePop: true })
        }
    }
    toRankingPage = () => {
        window.location.href = `${window.location.origin}/andall-sample/activityDetail?viewType=GMFX_float`
        // this.props.history.push("/activityDetail?viewType=GMFX_float")
    }
    toRankingPageByPop = () => {
        GMFXSuccessSharePopupView()
        window.location.href = `${window.location.origin}/andall-sample/activityDetail?viewType=zfwc_pop`
        // this.props.history.push("/activityDetail?viewType=zfwc_pop")
    }
    // 去我的账户
    toMyAccount = () => {
        const { isAndall } = this.state
        if (isAndall) {
            if (!this.state.isgrey) {
                // 去兑换埋点
                GMFXConvertGoto()
                // this.props.history.push("/myAccount?viewType=GMFX_convert")
                window.location.href = `${window.location.origin}/andall-sample/myAccount?viewType=GMFX_convert`

            }
        } else {
            if (!this.state.isgrey) {
                // 去兑换埋点
                GMFXConvertGoto()
                window.location.href = `${window.location.origin}/download-app`
            }
        }

    }

    // 获取电话号码
    getUserInfor = () => {
        const infoPara = { noloading: 1 }
        ua.isAndall() && Object.assign(infoPara, { clientType: 'app' })
        API.myInfo(infoPara).then(res => {
            // console.log(res)
            const { code, data } = res
            if (!code) this.setState({ mobileNo: data.mobileNo })
        })
    }

    // 去下单
    toPayOrder = () => {
        const { isAndall, mobileNo, pfProductList, haveFinish } = this.state
        const { productId, productType } = pfProductList[0]
        if (haveFinish) {
            return
        }
        API.getSpringIndexConfig({ "activCode": "chunjieliebian" })
            .then(res => {
                const { status, orderId } = res.data;
                if (status == '3') {
                    // 立即领取按钮埋点
                    GMFXLandingpageBuyNowGoto({ product_id: productId })
                    if (isAndall) {
                        andall.invoke('goPayOrder', {
                            seriesId: '',
                            linkManId: '',
                            productId,
                            productType
                        })
                    } else {
                        if (mobileNo) {
                            // console.log(mobileNo);
                            window.location.href = `${origin}/andall-report/order-submit`
                        } else {
                            const { origin, pathname, search } = location
                            window.location.href = `${origin}/login?url=${pathname}${search}`
                        }
                    }
                } else {
                    Toast.info('您已参加本活动了哦')
                    location.reload();
                }
            })


    }

    // 查看订单
    toCheckOrder = () => {
        // 购买成功-查看订单按钮埋点 
        const { pfProductList } = this.state
        const { productId } = pfProductList[0]
        GMFXSuccessProductViewGoto({ product_id: productId })
        const { orderId } = this.state
        window.location.href = `${window.location.origin}/order-details?orderId=${orderId}`
    }
    // 隐藏弹窗动画
    timer = null;
    hidePop = () => {
        if (this.timer) {
            // console.log(this.timer);
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.myRef.current.style.right = "0px";
                this.timer = null;
            }, 1000);
        } else {
            this.myRef.current.style.right = "-95px";
            this.timer = setTimeout(() => {
                this.myRef.current.style.right = "0px";
                this.timer = null;
            }, 1000);
        }

    }

    render() {
        const { checkOrder, indexImgList, showRule, activRule, popFlag,
            isBangs, sharePop, isgrey, scrollElement, moneyPop, haveFinish } = this.state
        const loading = false
        return (
            <Page title='春节送健康 满150返150'>
                {loading ? <MyLoader /> :
                    <div>
                        <div className={styles.fission} onScroll={this.hidePop}>
                            <div className={styles.backgroundImgBox}>
                                {indexImgList && indexImgList.slice(0, 2).map((item, index) => <img src={item.imgUrl} key={index} />)}
                            </div>
                            <div className={styles.indexImg}>
                                {indexImgList && indexImgList.slice(2).map((item, index) => <img src={item.imgUrl} key={index} />)}
                                <div className={styles.paddingBox}></div>
                            </div>

                            <div
                                className={styles.rule}
                                onClick={() => this.modalToggle('showRule')}>活动规则</div>
                            {!haveFinish && <div
                                className={styles.share}
                                onClick={this.toShare}>分享</div>}
                            <div className={styles.luckyBag}
                                onClick={this.toRankingPage}
                                style={{ "backgroundImage": `url(${springFission}entry1.png)` }}
                                ref={this.myRef}>
                                <img src={`${springFission}entry2.png`} />
                                <img src={`${springFission}entry3.png`} />
                            </div>
                            {
                                checkOrder ? (
                                    <div
                                        className={styles.btnBox} >
                                        <div
                                            className={styles.checkOrder}
                                            onClick={this.toCheckOrder}
                                            style={isBangs ? { paddingBottom: "7px" } : {}}>查看订单</div>
                                        <div
                                            className={isgrey ? styles.exchangeIsgrey : styles.exchange}
                                            onClick={this.toMyAccount}
                                            style={isBangs ? { paddingBottom: "7px" } : {}}>去兑换(¥150)</div>
                                    </div>
                                ) : (<div
                                    className={haveFinish ? styles.getNowFinish : styles.getNow}
                                    style={isBangs ? { paddingBottom: "7px" } : {}}
                                    onClick={this.toPayOrder}>立即领取</div>)
                            }

                        </div>

                        {/* 活动规则 */}
                        <Modal
                            handleToggle={() => { this.modalToggle('showRule') }}
                            type
                            visible={showRule}
                            rootDOM={scrollElement}>
                            <div className={styles.scanModal}>
                                <Ruler remark={activRule}></Ruler>
                            </div>
                        </Modal>

                        {/* 引导分享 */}
                        {sharePop && <div className={styles.sharebox} onClick={() => this.modalToggle('sharePop')}>
                            <img src={`${shareRedPacker}nfriend_share1.png`} alt="nfriend_share" />
                        </div>}

                        {/* 跳转蒙版图片领券弹框 */}
                        <JumpImg
                            src={`${springFission}authorize.png`}
                            closeMask={() => this.modalToggle('popFlag', "cancel")}
                            toAim={() => this.modalToggle('popFlag', "view")}
                            visiable={popFlag} />

                        {/* 跳转蒙版图片分享赚钱 */}
                        <JumpImg
                            src={`${springFission}15money.png`}
                            closeMask={() => this.modalToggle('moneyPop', "share_cancel")}
                            toAim={this.toRankingPageByPop}
                            visiable={moneyPop} />
                    </div>}
            </Page>
        )
    }
}

export default SpringFission
