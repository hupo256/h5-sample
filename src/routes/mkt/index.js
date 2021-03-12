import React from 'react'
import { Route } from 'react-router-dom'
import Loadable from '@src/components/loading/Loadable'
// import { KeepAlive } from 'react-keep-alive'

// const Yunchan = Loadable(() => import('./yunchan'))
// const EditOrder = Loadable(() => import('./yunchan/editOrder'))
// const Succeed = Loadable(() => import('./yunchan/succeed'))
// const receiveCoupon = Loadable(() => import('./receive-coupon'))
// const yunchanLego = Loadable(() => import('./lego'))
// const yunchanEdit = Loadable(() => import('./lego/yunchan-edit'))
// const yunchanSucceed = Loadable(() => import('./lego/yunchan-succeed'))
// const yunchanTimeOut = Loadable(() => import('./lego/yunchan-timeout'))
// const loversCode = Loadable(() => import('./lego/lovers-code'))
// const YinYang = Loadable(() => import('./yinyang'))
// const yinyangSolution = Loadable(() => import('./yinyang/solution'))
// const Bbinfor = Loadable(() => import('./yinyang/bbinfor'))
// const articleDtail = Loadable(() => import('./yinyang/article-detail'))
// const HomePage = Loadable(() => import('./skinSearch/pages/homePage'))
// const Records = Loadable(() => import('./skinSearch/pages/records'))
// const SkinSearch = Loadable(() => import('./skinSearch/pages/skinSearch'))
// const GoodsDetail = Loadable(() => import('./skinSearch/pages/goodsDetail'))
// const GroupDetail = Loadable(() => import('./skinSearch/pages/groupDetail'))
// const SharePage = Loadable(() => import('./skinSearch/pages/sharePage'))
// const GetwxCash = Loadable(() => import('./getwxCash'))
// const ShareRedPacker = Loadable(() => import('./shareRedPacker'))
// const SpringFission = Loadable(() => import('./springFission'))
// const MyAccount = Loadable(() => import('./springFission/myAccount'))
// const Exchangeview = Loadable(() => import('./springFission/myAccount/exchangeview'))
// const OpenCard = Loadable(() => import('./springFission/openCard'))
// const ActivityDetail = Loadable(() => import('./springFission/activityDetail'))
// const invitation = Loadable(() => import('./springFission/activityDetail/invitationRecord'))
// const TransformPage = Loadable(() => import('./transformPage'))
// const report4_2 = Loadable(() => import('./report4_2/index.jsx'))
// const Xinguan1 = Loadable(() => import('./xinguan/list'))
const LandingPage = Loadable(() => import('./landingPage'))
// const AdultSport = Loadable(() => import('./adultSport'))
// const BabyNutri = Loadable(() => import('./babyNutri'))
// const UnlockLand = Loadable(() => import('./unlock-land'))
// const GetInsurance = Loadable(() => import('./getInsurance'))
// const FileDetail = Loadable(() => import('./getInsurance/file'))
//
// const Xinguan = Loadable(() => import('./xinguan'))
// const ShortSighted = Loadable(() => import('./shortSighted'))
// const Learning = Loadable(() => import('./learning'))
// const BabyHeight = Loadable(() => import('./babyHeight'))
// const SkinCare = Loadable(() => import('./skinCare'))
//
// const Disease = Loadable(() => import('./disease'))
// const LandPage = Loadable(() => import('./landPage'))
// const Universal = Loadable(() => import('./universal'))
export default (
  <React.Fragment>
    {/* <Route path='/yunchan' component={Yunchan} /> */}
    {/* <Route path='/editOrder' component={EditOrder} /> */}
    {/* <Route path='/succeed' component={Succeed} /> */}
    {/*<Route path='/markting/receive-coupon' component={receiveCoupon} />*/}
    {/* <Route path='/lego' component={yunchanLego} /> */}
    {/* <Route path='/yunchan-edit' component={yunchanEdit} /> */}
    {/* <Route path='/yunchan-succeed' component={yunchanSucceed} /> */}
    {/* <Route path='/yunchan-timeout' component={yunchanTimeOut} /> */}
    {/* <Route path='/shareimg' component={loversCode} /> */}
    {/* <Route path='/yinyang' component={YinYang} /> */}
    {/* <Route path='/yinyang-solution' component={yinyangSolution} /> */}
    {/* <Route path='/yinyang-bbinfor' component={Bbinfor} /> */}
    {/* <Route path='/article-detail' component={articleDtail} /> */}
    {/* <Route path='/skinSearch/homePage' component={HomePage} /> */}
    {/* <Route path='/skinSearch/records' component={Records} /> */}
    {/* <Route path='/skinSearch/skinSearch' component={SkinSearch} /> */}
    {/* <Route path='/skinSearch/goodsDetail' component={GoodsDetail} /> */}
    {/* <Route path='/skinSearch/groupDetail' component={GroupDetail} /> */}
    {/* <Route path='/skinSearch/sharePage' component={SharePage} /> */}
    {/* <Route path='/getwxCash' component={GetwxCash} /> */}
    {/* <Route path='/ShareRedPacker' component={ShareRedPacker} /> */}
    {/* <Route path='/springFission' component={SpringFission} /> */}
    {/* <Route path='/myAccount' component={MyAccount} /> */}
    {/* <Route path='/activityDetail' component={ActivityDetail} /> */}
    {/* <Route path='/invitation' component={invitation} /> */}
    {/* <Route path='/toExchange' component={Exchangeview} /> */}
    {/* <Route path='/openCard' component={OpenCard} /> */}
    {/* <Route path='/transformPage' component={TransformPage} /> */}
    {/* <Route path='/report4_2' component={report4_2} /> */}
    {/* <Route path='/xLlist-wert' component={Xinguan1} /> */}
    {/* <Route path='/landing' component={LandingPage} /> */}
     <Route path='/mktlanding' component={LandingPage} />
    {/* <Route path='/unlock-land' component={UnlockLand} /> */}
    {/* <Route path='/adultSport' component={AdultSport} /> */}
    {/* <Route path='/babyNutri' component={BabyNutri} /> */}
    {/* <Route path='/getInsurance' component={GetInsurance} /> */}
    {/* <Route path='/fileDetail' component={FileDetail} /> */}

    {/* <Route path='/mktlanding' component={LandingPage} /> */}

    {/* <Route path='/markting/shortSighted' component={ShortSighted} /> */}
    {/* <Route path='/markting/xinguan' component={Xinguan} /> */}
    {/* <Route path='/markting/onlineLearning' component={Learning} /> */}
    {/* <Route path='/markting/babyHeight' component={BabyHeight} /> */}
    {/* <Route path='/markting/skinCare' component={SkinCare} /> */}
    {/*<Route path='/markting/universal' component={Universal} />*/}
    {/*<Route path='/markting/disease' component={Disease} />*/}
    {/*<Route path='/markting/land-page' component={LandPage} />*/}
  </React.Fragment>
)
