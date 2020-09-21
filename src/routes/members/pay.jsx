import React from 'react'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import Page from '@src/components/page/index'
import ua from '@src/common/utils/ua'
import memberApi from '@src/common/api/memberApi'
import MemberBtn from './componets/btn/index'
import TagList from './componets/tags/index'
import images from './componets/images'
import { vipBuyPageView, vipBuyPageGoto,} from './componets/BuriedPoint'
import styles from './members'

const { isAndall } = ua

const payArr = [{
  name: '支付宝支付',
  value: 2,
  imgUrl: images.payzhi,
}, {
  name: '微信支付',
  value: 1,
  imgUrl: images.paywx,
}]

class Payment extends React.Component {
  state = {
    renewal: isAndall(),
    protocol: false,
    payType: 2,
  }

  componentDidMount() {
    vipBuyPageView()
    Toast.hide()
  }

  touchPayment = val => {
    const { renewal } = this.state
    const pointConfig = {
      Btn_name: 'open_now',
      vip_type: renewal ? 1 : 0,
    }
    vipBuyPageGoto(pointConfig)
    this.setState({ payType: val })
  }

  runSetstate = name => {
    this.setState({ [name]: !this.state[name] }, () => {
      if(name === 'renewal'){
        const {renewal} = this.state
        renewal && this.setState({payType: 2})
      }
    })
  }

  toPay = () => {
    const { location: {state:{productId}}} = this.props
    const { protocol, payType, renewal } = this.state
    if (!protocol) return Toast.info("请同意服务协议", 2)

    const pointConfig = {
      Btn_name: 'open_now',
      vip_type: renewal ? 1 : 0,
    }
    vipBuyPageGoto(pointConfig)

    const params = {
      noloading: 1,
      memberProductId: productId,
      signFlag: renewal,
      payStr: isAndall() ? 'APP' : 'H5',
      paySuccessUrl: 'mkt/members/members-success',
      payType,  // 1微信支付  2支付宝
    }
    memberApi.submitOrder(params).then(res => {
      const { code, data } = res
      if (code) return
      if(isAndall()){
        andall.invoke('gotoThirdPay', { payType, data }, re => {
          if (+re.isSuccess) {
            this.props.history.push(`/members/members-success`)
          }
        })
      } else {
        window.location.href = data.mwebUrl
      }
    })
  }

  render() {
    const { location: {state:{discount, price, contractPrice}}} = this.props
    const { renewal, payType, protocol } = this.state
    return (
      <Page title='购买安我会员'>
        <React.Fragment>
          <div className={styles.payTit}>
            <TagList discount={discount} />
          </div>

          <div className={styles.memberbox}>
            <div className={styles.memberCard}>
              <h3>安我会员</h3>

              <ul className={styles.cards}>
                <li>
                  {renewal && <span>超值</span>}
                  <h4>月卡会员</h4>
                  <p><b>￥</b><span>{renewal ? contractPrice : price}</span></p>
                  {renewal && <del>原价{price}</del>}
                </li>
              </ul>

              {isAndall() && <label className={styles.radioBox} onClick={() => this.runSetstate('renewal')}>
                <img src={renewal ? images.radioget : images.radio} alt="" />
                <span>到期后自动续费，可随时取消</span>
              </label>}
            </div>

            <ul className={styles.paylist}>
              {payArr.map((item, index) => {
                const { name, value, imgUrl } = item
                if ((renewal && index === 1) || (!renewal && index === 0) ) {
                  return null
                } else {
                  return <li key={index} className={styles[`pay${index}`]} onClick={() => this.touchPayment(value)}>
                    <span styles={{backgroundImage: imgUrl}}>{name}</span>
                    <img src={value === payType ? images.radioget : images.radio} alt="" />
                  </li>
                }
              })}
            </ul>

            <div className={styles.footerBox}>
              <MemberBtn
                userState={1}
                conTex='立即开通'
                togglefunc={this.toPay}
              />
              <label className={styles.protocol} onClick={() => this.runSetstate('protocol')}>
                <img src={protocol ? images.protocoled : images.protocol} alt="" />
                <span>我已阅读并同意
                <Link to={`/members/agreement-service`}>《安我会员服务协议》</Link>和
                <Link to={`/members/agreement-buy`}>《自动续费协议》</Link>
                </span>
              </label>
            </div>
          </div>
        </React.Fragment>
      </Page>
    )
  }
}

export default Payment
