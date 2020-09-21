import React from 'react'
import Page from '@src/components/page'
import FormNew from '@src/components/formNew'
import MyLoader from '@src/components/contentLoader'
import styles from './receive'
import integrationApi from '@src/common/api/integrationApi'
import { fun } from '@src/common/app'
import { Toast } from 'antd-mobile'
import { trackPointGetRewardView, trackPointGetRewardGoto } from '../buried-point'
const { isPoneAvailable, getParams } = fun

class Receive extends React.Component {
  state = {
    loading:false,
    receiveList:[],
    orderAddress: {},
    phoneNum: false,
  }

  componentDidMount () {
    document.body.scrollTop = 1
    document.documentElement.scrollTop = 1
    trackPointGetRewardView({
      view_type: getParams().viewType
    })
    this.getDrawAwardInfo()
  }
  getDrawAwardInfo=() => {
    console.log(getParams().awardRecordId)
    integrationApi.getDrawAwardInfo(
      getParams().awardRecordId ? { awardRecordId:getParams().awardRecordId } : {}
    ).then(res => {
      if (res) {
        console.log(res.data.list)
        this.setState({ receiveList:res.data.list })
      }
    })
  }
  formChange = (value, key) => {
    console.log(value, key)
    const { orderAddress } = this.state
    let addersObj = { [key]: value }
    if (key === 'adders') {
      addersObj = {
        area: value[2].split('-')[1],
        city: value[1].split('-')[1],
        province: value[0]
      }
    }
    if (key === 'mobile') {
      const isPhone = isPoneAvailable(+value)
      isPhone && this.setState({ phoneNum: true })
    }
    Object.assign(orderAddress, addersObj)
    this.setState({ orderAddress })
  }

  formBlur = (value, key) => {
    const isPhone = isPoneAvailable(+value)
    if (!isPhone) {
      Toast.fail('电话号码不符合规范', 2)
      this.setState({ phoneNum: false })
    } else {
      this.setState({ phoneNum: true })
    }
  }

   confirmBtn=() => {
     const { orderAddress } = this.state
     let { name, mobile, province, area, city, addressDetail } = orderAddress
     console.log(orderAddress)
     if (!name) {
       Toast.info('请填写收件人')
       return
     }
     if (!mobile) {
       Toast.info('请填写正确手机号')
       return
     }
     if (!province) {
       Toast.info('请选择地区')
       return
     }
     if (!addressDetail) {
       Toast.info('请填写详细地址')
       return
     }
     let params = {
       awardRecordId:getParams().awardRecordId ? getParams().awardRecordId : '',
       username:name,
       mobile,
       province,
       city,
       area,
       address:addressDetail
     }
     console.log(params)
     trackPointGetRewardGoto({
       Btn_name: 'get_reward_sure'
     })
     integrationApi.drawAward(params).then(res => {
       if (res) {
         this.props.history.replace('/integration/receiveSuccess')
       }
     })
   }
   render () {
     const { loading, receiveList, orderAddress, phoneNum } = this.state
     return (
       <Page title='领取奖品'>
         {
           loading
             ? <MyLoader />
             : <div className={styles.receive}>
               <div className={styles.list}>
                 {
                   receiveList.map((item, index) => (
                     <div className={styles.one} key={index}>
                       <img src={item.iconUrl} />
                       <div className={styles.right}>
                         <p>{item.awardName}</p>
                         <p>奖品到期 {item.expireTime}</p>
                         <p>
                           <label>¥0</label>
                           <span>¥{item.faceValue}</span>
                         </p>
                       </div>
                     </div>
                   ))
                 }
                 <div className={styles.total}>
                   <span>共{receiveList.length}件商品 小计：</span>
                   <label>¥0</label>
                 </div>
               </div>
               <div className={styles.shippingFrom}>
                 <FormNew onChange={this.formChange} onBlur={this.formBlur} type={0} />
               </div>
               <div className={styles.confirm}>
                 <button onClick={() => this.confirmBtn()}>确认领取</button>
               </div>

             </div>
         }
       </Page>
     )
   }
}

export default Receive
