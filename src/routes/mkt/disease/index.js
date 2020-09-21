import React from 'react'
import Page from '@src/components/page'
import styles from './disease.scss'
import { API, ua, fun } from '@src/common/app'
import { Toast } from 'antd-mobile'
import andall from '@src/common/utils/andall-sdk'
// import LazyLoadPage from './loadImg'
import { trackPointView, trackPointClick, trackPointChangerole, trackPointTips } from './buried-point'
import toDoShare from '@src/common/utils/toDoShare'

import disease1 from '@static/disease/1.jpg'
import disease3 from '@static/disease/3.jpg'
import disease4 from '@static/disease/4.jpg'
import disease5 from '@static/disease/5.jpg'
import disease6 from '@static/disease/6.jpg'
import disease7 from '@static/disease/disease7_1.png'
import disease8 from '@static/disease/8.jpg'
import disease9 from '@static/disease/9.jpg'
import baby from '@static/disease/baby.png'
import adult from '@static/disease/adult_1.png'
import share from '@static/disease/share_2.png'
import old from '@static/disease/old.png'
import price from '@static/disease/price.png'
import nfriend_share1 from '@static/disease/nfriend_share1.png'

import Modal from '@src/components/modal'
import CheckModal from '@src/components/check-modal'
import { gotoSubmitPage } from '@src/common/utils/toOrderSubmit'
const { isAndall } = ua 
const { setSetssion, getParams } = fun
export default class Disease extends React.Component {
    state = {
        isCoupon: false,
        isLogin: false,
        imgs: [
            disease3,
            disease4,
            disease5,
            disease6,
            disease7,
            disease8,
            disease9
        ],
        mobileNo: '',
        sharePop: false,
        ruleVisible: false,
        changeUser: false,
        noneVisible: false,
        productListBB: [],
        productListCR: [],
        checkList: [],
        shareObj: {},
        currentkey: 'productListBB',
        isAndall: ua.isAndall(),
        productShow: [
            {
                title: '70+种儿童疾病基因检测',
                subtitle: '给宝宝全方位保障，妈妈更安心',
                originPrice: "297",
                newPrice: '199',
                backImg: baby,
                key: 'productListBB'
            },
            {
                title: '110+种成人常见疾病检测',
                subtitle: '基因告诉你身体有哪些隐患',
                originPrice: "297",
                newPrice: '199',
                backImg: adult,
                key: 'productListCR'
            }
        ],
        activeCode: 'SPTS_APP_JBB_0312',
        toastShow: true

    }
    componentDidMount() {
        this.onScroll();
        this.trackPointViewFn('landingpage');
        this.getUserInfor();
        this.getProduct('SPTS_APP_JBB_0312', 'productListBB');
        this.getProduct('SPTS_APP_JBA_0312', 'productListCR');
    }
    onScroll = () => {
        let _self = this;
        let interval = null;// 定时器  
        window.addEventListener('scroll', () => {
            if (interval == null) {// 未发起时，启动定时器，
                interval = setInterval(function () {
                    test();
                }, 200);
            }
            _self.setState({ toastShow: false })
        }, false)

        function test() {
            _self.setState({ toastShow: true })
            clearInterval(interval);
            interval = null;
        }
    }
    trackPointViewFn = (pagetype) => {
        const pointPara = {
            platform: this.state.isAndall ? 'APP' : 'H5',
            viewtype: getParams().viewType,
            pagetype: pagetype
        }
        trackPointView(pointPara);
    }
    trackPointClickFn = (type) => {
        const pointPara = {
            viewtype: [type]
        }
        trackPointClick(pointPara);
    }
    trackPointTipsFn = (type) => {
        const pointPara = {
            viewtype: [type]
        }
        trackPointTips(pointPara)
    }
    //获取产品id
    getProduct = (code, key) => {
        API.activeRule({ activeCode: code }).then(res => {
            const { code, data } = res;
            if (!code) {
                let list = [];
                data.activeRuleList && data.activeRuleList.length &&
                    data.activeRuleList.map(item => {
                        list.push(item.productId)
                    })
                let shareObj = {
                    title: data.shareTitle,
                    subTitle: data.shareDesc,
                    headImg: data.shareImage,
                    shareUrl: data.shareUrl
                }
                toDoShare(shareObj);
                this.setState({
                    [key]: list,
                    shareObj
                })
            }
        })
    }

    // 判断是否登录
    getUserInfor = () => {
        const infoPara = { noloading: 1 }
        isAndall() && Object.assign(infoPara, { clientType: 'app' })
        API.myInfo(infoPara).then(res => {
            const { code, data } = res
            if (!code) {
                this.setState({
                    isLogin: true,
                    mobileNo: data.mobileNo
                })

            }
        })
    }
    // 跳到登录页面
    toLogin() {
        const { isLogin } = this.state;
        if (!isLogin) {
            isAndall() && andall.invoke('login', {}, (res) => {
                window.localStorage.setItem('token', res.result.token)
                window.location.reload()
            })
        }
    }
    toShare = () => {
        const { shareObj } = this.state;
        this.trackPointClickFn('share_bt');
        if (!isAndall()) {
            this.setState({ sharePop: true })
            return
        }
        toDoShare(shareObj, isAndall)
    }
    handleToggle = (name) => {
        const bool = this.state[name]
        if (name == 'ruleVisible' && bool == false) {
            this.trackPointViewFn('rule');
            this.trackPointClickFn('rule_bt');
        }
        if (name == 'noneVisible' && bool == false) {
            this.trackPointViewFn('tipspop');
        }
        if (name == 'noneVisible' && bool == true) {
            this.trackPointTipsFn('close')
        }
        this.setState({
            [name]: !bool
        })
    }
    // 点击解锁
    toLock = (key) => {
        const id = this.state[key];
        this.setState({
            currentkey: key
        })
        const linkManType = key == 'productListBB' ? '2' : '1';
        this.setState({
            activeCode: key == 'productListBB' ? 'SPTS_APP_JBB_0312' : 'SPTS_APP_JBA_0312'
        })
        this.trackPointClickFn(key == 'productListBB' ? 'child_js_bt' : 'adult_js_bt');
        let params = {
            productIds: id,
            linkManType: linkManType
        }
        API.getAvailableLinkMan(params).then(res => {
            const { data, code } = res;
            if (!code && data && data.length) {
                if (data[0].usableStatus == 1) {
                    //有可选的检测人时
                    const bool = this.state.changeUser;
                    // data.map(item=>{
                    //     item.isCheck=false;
                    // })
                    this.setState({
                        changeUser: !bool,
                        checkList: data
                    })
                } else {
                    //
                    this.trackPointViewFn('changerolepop');
                    this.setState({
                        noneVisible: true
                    })

                }
            } else {
                this.setState({
                    noneVisible: true
                })
                // Toast.info('暂无有效检测人', 1)
            }
        })

    }
    // 跳转--确认订单
    jumpOrder = (i, index) => {
        if (i.usableStatus == 0) return;
        const { currentkey, checkList } = this.state;
        const list = this.state[currentkey]
        trackPointChangerole({
            name: i.userName,
            linkmanid: i.linkManId
        })
        checkList && checkList.map(item => {
            item.isCheck = false;
        })
        checkList[index].isCheck = true;
        this.setState({ checkList })
        API.categoryList({ linkManId: i.linkManId }).then(res => {
            const { code, data } = res;
            if (!code) {
                let idList = [];
                let nameStr = '';
                data.productCategoryList && data.productCategoryList.length &&
                    data.productCategoryList.map(item1 => {
                        item1.productList && item1.productList.map(item2 => {
                            list && list.map(item3 => {
                                if (item2.productId == item3 && item2.reportStatus == 0) {
                                    idList.push(item2.productId)
                                    nameStr += item2.productName + '/';

                                } else if (item2.productId == item3) {
                                    Toast.info('暂无可解锁产品', 1)
                                }
                            })
                        })
                    })
                nameStr = nameStr.substring(0, nameStr.length - 1)
                this.getOrderInfo(idList, nameStr, i.linkManId);
            }
        })
    }
    getOrderInfo = (idList, nameStr, linkManId) => {
        const { currentkey, activeCode, isAndall } = this.state;
        let lockCards = [];
        idList.map(data => {
            lockCards.push({ prodId: data })
        })
        API.submitProduct({
            linkManId: linkManId,
            productIdList: idList
        }).then(res => {
            const { code, data } = res;
            if (!code) {
                if (isAndall) {
                    const paras = {
                        linkManId,
                        productIdList: idList,
                        activeCode,
                    }
                    gotoSubmitPage(paras)
                } else {
                    const seriesOrders = {
                        productPrice: data.actualPrice || 0,
                        originPrice: data.originPrice || 0,
                        productName: nameStr || '',
                        linkManId,
                        linkManUserName: data.userName || '',
                        productIdList: idList,
                        lockCards,
                        totalPrice: data.totalPrice
                    }

                    setSetssion('unlockList', [seriesOrders])
                    setSetssion('selectedLinkMan', { linkManId })
                    let imgtype = currentkey == 'productListBB' ? 'disease_child' : 'disease_adult';
                    window.location.href = `${window.location.origin}/mkt/orders/unlock-submit?buyType=4&flag=disease&imgtype=${imgtype}&activeCode=${activeCode}`
                }


            }
        }, err => Toast.fail(err || '服务器异常', 2))
    }
    toNext = (type) => {
        const { isAndall } = this.state;
        this.trackPointTipsFn(type);
        if (type == 'buy') {
            // 去购买
            if (isAndall) {
                // 购买tab
                andall.invoke('goProductList')
            } else {
                window.location.href = `${window.location.origin}/download-app`
            }
        } else {
            if (isAndall) {
                //  去绑定
                this.props.history.push('/mkt/binding')
            } else {
                window.location.href = `${window.location.origin}/download-app`
            }

        }
    }

    render() {
        const { imgs, sharePop, ruleVisible, noneVisible, changeUser, checkList, productShow, toastShow } = this.state;
        return (
            <Page title='疾病风险早知道'>
                <div className={styles.myPages} >
                    <div onClick={() => this.handleToggle('ruleVisible')} className={styles.ruleBox}>
                        活动规则
                    </div>
                    <div onClick={() => this.toShare()} className={`${styles.shareBox} ${!toastShow ? styles.shareBox1 : ""}`}>
                        <img src={share} />
                        <span>分享</span>
                    </div>
                    {/* 引导分享 */}
                    {sharePop && <div className={styles.sharebox1} onClick={() => this.handleToggle('sharePop')} >
                        <img src={nfriend_share1} alt="nfriend_share" />
                    </div>}
                    <div className={styles.myLandPage} id='myPage'>
                        <img src={disease1} className={styles.myBack} />
                        <div className={styles.ctn}>
                            {
                                productShow && productShow.length && productShow.map((data, index) => (
                                    <div className={styles.item} key={index} style={{ background: `url(${data.backImg}) right top no-repeat`, backgroundSize: '135px 135px' }}>
                                        <img src={old} className={styles.leftTip} />
                                        <div className={styles.title}>{data.title}</div>
                                        <div className={styles.subtitle}>{data.subtitle}</div>
                                        <div className={styles.bottom}>
                                            <div className={styles.btn} onClick={() => { this.toLock(data.key) }}>马上解锁</div>
                                            <div>
                                                <div className={styles.origin}>原解锁价:￥{data.originPrice}</div>
                                                <div className={styles.now}>
                                                    <span>全套解锁价：</span>
                                                    <img src={price} className={styles.myPrice} />
                                                    <span className={styles.fontSmall}>封顶</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }


                        </div>

                    </div>

                    {/* <LazyLoadPage imgs={imgs} />   */}
                    <div className={styles.imgbox}>
                            <img  src={disease3} />
                            <img  src={disease4} />
                            <img  src={disease5} />
                            <img  src={disease6} />
                            <img  src={disease7} />
                            <img  src={disease8} />
                            <img  src={disease9} />
                    </div>


                    <Modal
                        visible={noneVisible}
                        type
                        handleToggle={() => { this.handleToggle('noneVisible') }}
                    >
                        <div className={styles.tips}>
                            <div className={styles.title}>温馨提示</div>
                            <p>本次活动仅对绑定过唾液检测样本的用户开放。</p>
                            <div className={styles.btn1} onClick={() => this.toNext('buy')}>无检测盒，去购买</div>
                            <div className={styles.btn2} onClick={() => this.toNext('bind')}>有检测盒，去绑定</div>
                        </div>
                    </Modal>

                    <CheckModal
                        toOrder={(item, index) => this.jumpOrder(item, index)}
                        title='切换检测人'
                        visible={changeUser}
                        children={checkList}
                        onClose={() => this.handleToggle('changeUser')}
                    />



                    <Modal
                        visible={ruleVisible}
                        type
                        style={{ height: '380px', overflowY: 'hidden' }}
                        handleToggle={() => { this.handleToggle('ruleVisible') }}
                    >
                        <div style={{ height: '100%' }}>
                            <div className={styles.myTitle}>活动规则</div>
                            <p style={{ marginTop: '30px' }}>1、活动对象：本活动仅限已绑定样本的用户参与；若还未绑定样本，可自行去安我生活app购买其他检测产品，绑定样本之后，再来参与本次活动；</p>
                            <p>2、活动时间：3月17日-3月23日；</p>
                            <p>3、活动价格规则：安我为回馈老用户，在本次活动期间，对已绑定的老检测人设置了3项福利：</p>
                            <p>（1）将老检测人解锁付费设置封顶价299元，即每位老检测人，所有的解锁订单，总计只需付费299元；</p>
                            <p>（2）为老检测人上线专属的3类疾病检测产品，单品解锁价为99元，本活动为3件套设置封顶价199元，即参与本次活动解锁这3类产品时，最高只需付费199元，立省98元；</p>
                            <p>（3）如果老检测人在参与本活动之前已经解锁了其他产品，并且实际付费了X元，参与本次活动时，解锁价将取最小值：</p>
                            <p>i. 若299元-X元大于或等于199元，解锁价为199元；</p>
                            <p>ii. 若299元-X元小于199元，解锁价为299元-X元。
                            即最后解锁价取以上2种情况的最小值，自动显示在页面中，最终以页面显示价格为准；</p>
                            <p>4、绑定了宝宝检测者的用户可解锁儿童疾病检测套餐；绑定了成人检测者的用户可解锁成人疾病检测套餐；</p>
                            <p>5、解锁订单不支持退款；</p>
                            <p>6、 通过技术或非正常手段（包括但不限于恶意注册、恶意套现、利用程序漏洞等）获得奖励的用户，安我基因有权利取消该用户参与资格并回收其所有奖励，情节严重者将追究其法律责任；</p>
                            <p>7、本次活动最终解释权归安我基因所有，如有疑问可拨打客服电话：400-682-2288。</p>

                        </div>
                    </Modal>
                </div>

            </Page>
        )
    }
}