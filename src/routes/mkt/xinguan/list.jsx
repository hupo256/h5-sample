import React from 'react'
import { Page } from '@src/components'
import { Toast } from 'antd-mobile'
import fun from '@src/common/utils'
import ua from '@src/common/utils/ua'
import userApi from '@src/common/api/userApi'
import activeApi from '@src/common/api/activeApi'
import toDoShare from '@src/common/utils/toDoShare'
import images from '@src/common/utils/images'
import { getProductInfor, gotoSubmitPage } from '@src/common/utils/toOrderSubmit'
import { XgLandingpageView, XgLandingpageGoto } from '../learning/BuriedPoint'
import styles from './xinguan'

const { getParams, getSetssion } = fun
const { isAndall } = ua
const { xinguan, yinyang } = images

class Xinguan extends React.Component {
  state = {
    sharePop: false,
    mobileNo: '',
    isLogin: false,
    activeRuleList: [],
    noscroll: false,
  }

  componentDidMount () {
    const params = {
      view_type: getParams().viewType,
      client_type: isAndall() ? 'app' : 'h5'
    }
    XgLandingpageView(params)

    const activeCode = getParams().activeCode || 'NCOV20200208'
    activeApi.xinguanActiveRule({activeCode, noloading: 1}).then(res => {
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
    userApi.myInfo(infoPara).then(res => {
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
    this.props.history.push('/xLlist-wert')
    window.location = 'http://10.88.24.243:8081/andall-sample/xLlist-wert'
    return
    const params = {
      Btn_name: 'share', 
      product_id: '',
      user_status: '',
      product_code: '',
      active_code: getParams().activeCode || ''
    }
    XgLandingpageGoto(params)

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
      <Page title='TEST'>
        <p>test</p>
      </Page>
    )
  }
}

export default Xinguan
