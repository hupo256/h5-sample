import React from 'react'
import { Page } from '@src/components'
import { Toast } from 'antd-mobile'
import { API, fun, ua } from '@src/common/app'
import toDoShare from '@src/common/utils/toDoShare'
import images from '@src/common/utils/images'
import { getProductInfor, gotoSubmitPage } from '@src/common/utils/toOrderSubmit'
import { XgLandingpageView, XgLandingpageGoto } from '../learning/BuriedPoint'
import styles from './babyNutri'

const { getParams, getSetssion } = fun
const { isAndall } = ua
const { babyNutri,yinyang } = images

class SkinCare extends React.Component {
  state = {
    sharePop: false,
    mobileNo: '',
    isLogin: false,
    activeRuleList: [],
    noscroll: false,
  }

  componentDidMount () {
    const { viewType, activeCode } = getParams()
    const params = {
      view_type: viewType,
      client_type: isAndall() ? 'app' : 'h5',
      active_code: activeCode,
    }
    XgLandingpageView(params)

    API.xinguanActiveRule({activeCode, noloading: 1}).then(res => {
      const {code, data} = res
      if(!code){
        this.setState({ ...data }, () => {
          toDoShare(this.touchShareParas())
        })

        this.getUserInfor()
      }
    })
  }

  getUserInfor = () => {
    const infoPara = {noloading: 1}
    isAndall() && Object.assign(infoPara, {clientType: 'app'})
    API.myInfo(infoPara).then(res => {
      const {code, data} = res
      if(!code){
        this.setState({
          mobileNo: data.mobileNo,
          isLogin: true
        })
      }
    })
  }

  touchShareParas = () => {
    const { shareTitle, shareDesc, shareUrl, shareImage } = this.state
    return {
      shareUrl: shareUrl,
      title: shareTitle,
      subTitle: shareDesc,
      headImg: shareImage,
    }
  }

  toggleMask = (key) => {
    this.setState({
      [key]: !this.state[key]
    })
  }

  toShare = () => {
    const params = {
      Btn_name: 'share', 
      product_id: '',
      user_status: '',
      product_code: '',
      active_code: getParams().activeCode || ''
    }
    // XgLandingpageGoto(params)

    if (!isAndall()) {
      this.setState({sharePop: true})
      return
    }
    toDoShare(this.touchShareParas(), true)
  }

  gotoBuy = (id, type, buyFlag, productCode, index) => {
    const { mobileNo, isLogin, activeRuleList } = this.state
    const activeCode = getParams().activeCode || ''
    let Btn_name = !index ? 'babybuy' : 'adultbuy'
    if(activeRuleList.length > 1) Btn_name = 'unibuy'
    const params = {
      Btn_name, 
      product_id: id,
      user_status: buyFlag ? 'canbuy' : 'cannotbuy',
      product_code: productCode,
      active_code: activeCode
    }
    XgLandingpageGoto(params)

    if(!buyFlag){
      Toast.fail('此为限购商品，不可再次下单')
      return
    }

    const productIdList = activeRuleList.map(item => item.productId)
    const { linkManId } = getSetssion('linkMan')
    console.log(productIdList)
    if(!isLogin && isAndall()){
      andall.invoke('login', {}, (res) => {
        window.localStorage.setItem('token', res.result.token)
        window.location.reload()
      })
    } else {
      getProductInfor(id, activeCode, () => {
        const paras = { 
          productId: id || '2832288089292800', 
          productType: type, 
          mobileNo,
          activeCode,
          linkManId,
          productIdList
        }
        gotoSubmitPage(paras)
      })
    }
  }

  render () {
    const { sharePop, activeRuleList } = this.state
    return (
      <Page title='科学膳食，宝宝更健康'>
        <div className={styles.xinguan}>
          <div className={styles.imgbox}>
            <span className={styles.toShare} onClick={() => this.toShare()} />
            <img src={`${babyNutri}yingyang_01_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_02_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_03_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_04_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_05_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_06_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_07_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_08_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_09_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_10_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_11_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_12_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_13_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_14_3.jpg`} alt=""/>
            <img src={`${babyNutri}yingyang_15_3.jpg`} alt=""/>
          </div>

          <div className="foot">
            <div className={styles.foot}>
               { activeRuleList.length > 0 && activeRuleList.map((item, index) => {
                  const { productId, productType, buyFlag, productCode } = item
                  return <button
                      key={index}
                      onClick={() => this.gotoBuy(productId, productType, buyFlag, productCode, index)}
                    >
                      click me
                    </button>
               })}
            </div>
          </div>

          {sharePop && <div className={styles.sharebox} onClick={() => this.toggleMask('sharePop')}>
            <img src={`${yinyang}nfriend_share.png`} alt="nfriend_share"/>
          </div>}
        </div>
      </Page>
    )
  }
}

export default SkinCare
