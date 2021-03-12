import React from 'react'
import Page from '@src/components/page/index'
import styles from '../../members'
import images from '../images'
import { fun, ua } from '@src/common/app'
const { getParams } = fun

class Service extends React.Component {
  state = {
    statusBarHeight:''
  }
  componentDidMount() {
    this.getStatusBarHeight()
  }
  getStatusBarHeight(){
    let height = window.localStorage.getItem('statusBarHeight')
    
    let statusBarHeight= height? height+'px': '44px'
    this.setState({
      statusBarHeight
    })
  }
  goBack(){
    const { userCenter } = getParams()
    userCenter==1? window.history.go(-1) : andall.invoke('back')
  }
  
  render() {
    const { statusBarHeight} = this.state
    
    return (
      <Page title='安我会员自动续费服务协议'>
        <div className={`${styles.titleBar} ${styles.white}`} style={{paddingTop: `${statusBarHeight}`}}>
          <div className={styles.titleBarCon}>
            <div className={styles.backIcon} onClick={()=>this.goBack()}>
              <img src={images.iconBackBlack} />
            </div>
            <h1>安我会员自动续费服务协议</h1>
          </div>  
        </div>
        <div style={{paddingTop: `calc(44px + ${statusBarHeight}`}}>
          <div className={styles.protocolBox}>
            <p>生效日期:2020年6月10日</p>
            <p>提示条款</p>
            <p>各服务条款前所列索引关键词仅为帮助您理解该条款表达的主旨之用，不影响或限制本协议条款的含义或解释。为维护您自身权益，建议您仔细阅读各条款具体表述。</p>
            <p>【审慎阅读】您在开通安我会员流程中点击同意本协议之前，应当认真阅读本协议。请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议解决条款。免除或者限制责任的条款将以粗线下划线标识，您应重点阅读。如您对协议有任何疑问，可按照本协议中的联系方式向我们咨询，我们会为您做进一步解释和说明。</p>
            <p>【签约动作】当您按照安我会员开通页面提示阅读并同意本协议且完成全部开通程序后，即表示您已充分阅读、理解并接受本协议的全部内容，并与安我达成一致，成为安我会员。阅读本协议的过程中，如果您不同意本协议或其中任何条款约定，您应立即停止开通程序。</p>
            <h2>一、服务条款的接受与修改</h2>
            <p>本协议是安我会员(下称“会员")与上海解兮生物科技有限公司(下称“安我")之间关于会员使用安我生活APP提供的自动续费委托扣款服务(下称“本服务”)所订立的协议。在开通会员服务时选择了"开启自动续费"或其他具有类似含义的选项，表示会员同意并签署本协议，本协议对双方具有法律效力。</p>
            <h2>二、服务说明</h2>
            <p>1.本服务是出于会员对于自动续费的需求，避免会员因疏忽或其他原因导致未能及时续费造成损失而推出的服务，安我可在会员有效期即将过期时，从会员的自有充值账户、与会员账号绑定称“账户"余额中代扣下一个计费周期会员服务费(自动续费的会员周期类型默认为与即将到期的会员周期同类)，该服务实现的前提是会员已将其安我会员账号与上述账户绑定，且可成功从其上述账户中扣款。</p>
            <p>2.自动续费具体指，基于上述的前提下，安我通过上述账户收取会员下一计费周期会员服务费的扣费方式，会员需保证安我可以从上述账户扣款成功，因上述账户中可扣款余额不足导致的续费失败，由会员自行承担责任。</p>
            <p>3. 您已充分理解，受您账户余额、系统原因等各种因素影响，开通本服务并不代表您一定能够续费成功。</p>
            <p>3.购买自动续费服务后，会在每个计费周期到期前1天，自动在对应的账户扣费并延长该计费周期对应的会员有效期。</p>
            <p>4.安我将于您当期会员服务期届满前向您以发送短信或PUSH消息等形式向您发送自动续费提示，如您在收到提示信息后未取消自动续费功能，则安我有权按照本协议约定方式通知支付平台为您划扣下一个计费周期的安我会员服务费。</p>
            <p>5.会员在享受本服务时，应受《安我会员服务协议》关于会员规定的约束，当会员使用本服务时，会员的使用行为视为其对本服务的服务条款以及安我针对本服务发出的各类公示的同意。</p>
            <p>6.自动续费服务开通后，如会员希望取消自动续费，会员可以通过会员页面"自动续费管理″按钮进入自动续费管理页面，点击“取消自动续费"。会员也可以在其绑定安我的支付平台(如支付宝)操作取消自动续费(支付宝客户端点击“我的”→“设置〃→“支付设置”→“免密支付/自动扣款"安我免密支付”→“解约")</p>
            <h2>三、双方的权利和义务</h2>
            <p>1.安我负责向会员提供有关自动续费收费具体情况的查询方式。</p>
            <p>2.安我通过会员上述账户扣除下一计费周期会员服务费，于到期前一天扣划，并将款项记入会员支付记录，并同时相应延长会员有效期</p>
            <p>3.如在扣费过程出现差错，安我和会员应密切配合查明原因，各自承担己方过错造成的损失;若因双方各自存在不均等过错造成的损失，由双方按过错的程度承担相应责任;双方共负责任的，由双方均摊责任。</p>
          </div>
        </div>
      </Page>
    )
  }
}

export default Service
