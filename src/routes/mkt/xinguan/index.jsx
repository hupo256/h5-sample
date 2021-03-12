import React from 'react'
import Page from '@src/components/page'
import { Toast } from 'antd-mobile'
import activeApi from '@src/common/api/activeApi'
import userApi from '@src/common/api/userApi'
import fun from '@src/common/utils'
import ua from '@src/common/utils/ua'
import toDoShare from '@src/common/utils/toDoShare'
import { getProductInfor, gotoSubmitPage } from '@src/common/utils/toOrderSubmit'
import { XgLandingpageView, XgLandingpageGoto } from '../learning/BuriedPoint'
import styles from './xinguan'

import img0 from '@static/xinguan/0e@2x.png'
import img1 from '@static/xinguan/1e@2x.png'
import img2 from '@static/xinguan/2e@2x.png'
import img3 from '@static/xinguan/3e@2x.png'
import img4 from '@static/xinguan/4e@2x.png'
import nfriendShare from '@static/xinguan/nfriend_share.png'
const imgArr = [img0, img1, img2, img3, img4]

const { getParams, getSetssion } = fun
const { isAndall } = ua

class Xinguan extends React.Component {
  state = {
    sharePop: false,
    mobileNo: '',
    isLogin: false,
    activeRuleList: [],
    noscroll: false,
  }

  componentDidMount () {
    setTimeout(() => {
      const stn = document.getElementById('skeleton')
      stn.className += ` tofade`
    }, 200)
    // return

    const params = {
      view_type: getParams().viewType,
      client_type: isAndall() ? 'app' : 'h5'
    }
    XgLandingpageView(params)

    const activeCode = getParams().activeCode || 'NCOV20200208'
    activeApi.xinguanActiveRule({ activeCode, noloading: 1 }).then(res => {
      console.log(res)
      // alert('111res =====> ' + JSON.stringify(res))
      const { code, data } = res
      if (!code) {
        this.setState({ ...data }, () => {
          toDoShare(this.touchShareParas())
        })

        this.getUserInfor()
      }
    })
  }

  getUserInfor = () => {
    const infoPara = { noloading: 1 }
    isAndall() && Object.assign(infoPara, { clientType: 'app' })
    userApi.myInfo(infoPara).then(res => {
      const { code, data } = res
      if (!code) {
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
    // this.props.history.push('/yinyang')
    // window.location = 'http://10.88.24.243:8081/andall-sample/xLlist-wert'
    // return
    const params = {
      Btn_name: 'share',
      product_id: '',
      user_status: '',
      product_code: '',
      active_code: getParams().activeCode || ''
    }
    XgLandingpageGoto(params)

    if (!isAndall()) {
      this.setState({ sharePop: true })
      return
    }
    toDoShare(this.touchShareParas(), true)
  }

  gotoBuy = (id, type, buyFlag, productCode, index) => {
    const { mobileNo, isLogin, activeRuleList } = this.state
    const activeCode = getParams().activeCode || ''
    let Btn_name = !index ? 'babybuy' : 'adultbuy'
    if (activeRuleList.length > 1) Btn_name = 'unibuy'
    const params = {
      Btn_name,
      product_id: id,
      user_status: buyFlag ? 'canbuy' : 'cannotbuy',
      product_code: productCode,
      active_code: activeCode
    }
    XgLandingpageGoto(params)

    if (!buyFlag) {
      Toast.fail('此为限购商品，不可再次下单')
      return
    }

    const productIdList = activeRuleList.map(item => item.productId)
    const { linkManId } = getSetssion('linkMan')
    console.log(productIdList)
    if (!isLogin && isAndall()) {
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
      <Page title='新冠健康大作战'>
        <div className={styles.xinguan}>
          <div className={styles.imgbox}>
            {/* <img src={`${xinguan}2e@2x.png`} alt=""/> */}
            <span className={styles.toShare} onClick={() => this.toShare()} />
            {/* <img src={`${xinguan}0e@2x.png`} alt=""/>
            <img src={`${xinguan}1e@2x.png`} alt=""/>
            <img src={`${xinguan}2e@2x.png`} alt=""/>
            <img src={`${xinguan}3e@2x.png`} alt=""/>
            <img src={`${xinguan}4e@2x.png`} alt=""/> */}

            {imgArr.map((item, index) => <img src={item} key={index} alt='' />)}
          </div>

          <div className='foot'>
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
            <img src={nfriendShare} alt='nfriend_share' />
          </div>}
        </div>
      </Page>
    )
  }
}

export default Xinguan
