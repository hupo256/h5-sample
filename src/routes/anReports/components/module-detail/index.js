import React from 'react'
import propTypes from 'prop-types'
import styles from '../modules.scss'
import { API,ua } from '@src/common/app'
import Modal from '@src/components/modal/index'

import img1 from '@static/changdao_report/img1.png'
import img2 from '@static/changdao_report/img2.png'
import img3 from '@static/changdao_report/img3.png'
import img4 from '@static/changdao_report/img4.png'
import coupon from '@static/changdao_report/coupon.png'

import OverallScore from '../overallScore'
import RiskAssess from '../riskAssess'
import ConditionScheme from '../conditionScheme'
import DetectionBacteria from '../detectionBacteria'
import CommonText from '../commonText'
import CommonTextImg from '../commonTextImg'
import Coupon from '../coupon'

const { isAndall, isIos } = ua 

class ModuleDetail extends React.Component {
  state = {
   data:{},
   couponVis:false,
   userId:'',
   jumpLink:'',
   imgs:{
     1:img1,
     2:img2,
     3:img3,
     4:img4,
   }
  }
  componentDidMount () {
    this.getUserInfor();
    const {data}=this.props;
    data&&this.setState({
      data
    })
  }
   // 判断是否登录
   getUserInfor = () => {
      const infoPara = {noloading: 1}
      isAndall() && Object.assign(infoPara, {clientType: 'app'})
      API.myInfo(infoPara).then(res => {
          const {code, data} = res
          if(!code) {
              this.setState({
                  userId: data.userId,
              })

          }
      })
  }
  openDesc=(type,index,item,index_new)=>{
    const {data } = this.props;
    let {dataInfo}=data&&data;
    switch (+type) {
      case 4502:
        let item_1=item.riskAssessmentResults&&item.riskAssessmentResults[index];
        item_1.isOpen=!item_1.isOpen;
        dataInfo[index_new].data.riskAssessmentResults[index]=item_1;
        this.setState({
          dataInfo
        })
      case 4503:
         let item_2=item.cultureItems&&item.cultureItems[index];
         item_2.isOpen=!item_2.isOpen;
         dataInfo[index_new].data.cultureItems[index]=item_2;
         this.setState({
           dataInfo
         })
      case 4504:
        let item_3=item.genusItems&&item.genusItems[index];
        item_3.isOpen=!item_3.isOpen;
        dataInfo[index_new].data.genusItems[index]=item_3;
        this.setState({
          dataInfo
        })
  }

   
  }
  receive=(item,index_new)=>{
    const {userId}=this.state;
    const {data } = this.props;
    let {dataInfo}=data&&data;
    if(item.isGet==1)return;
    this.setState({
      couponVis:true,
    })
    let params={
      "userId":userId,
      "couponId":item.couponId
    }
    API.userRreceiveCoupon(params).then(res=>{
      const {code,data}=res;
      if(!code){
        let item_1=item;
        item_1.isGet=1;
        dataInfo[index_new].data=item_1;
        this.setState({
          dataInfo,
          couponVis:true,
          jumpLink:data.jumpLink
        })
      }
    })
  }

  toBuy=()=>{
    window.location.href=`${window.location.origin}/mkt/markting/land-page`;
    // const { data } = this.state;
    // let {dataInfo}=data&&data;
    // dataInfo&&dataInfo.map((item,index)=>{
    //   if(item.moduleType==4508){
    //     window.location.href = item.data.linkUrl||`${window.location.origin}/andall-sample/land-page`;
    //   }
    // })
  }
  closeModal=()=>{
    this.setState({
      couponVis: false,
    })
  }
  render () {
    const { data,couponVis,imgs } = this.state;
    let {dataInfo,headImgType,userName,month,collectData,reportData}=data&&data;
    headImgType=headImgType||1;
    return (
    <div className={styles.moduleDetail} id='detail'>
       
       <div className={styles.myInfo}>
         <div className={styles.info_left}>
           <img src={imgs[headImgType]} />
           <div>
             <h5>{userName||''}</h5>
             <p>{month||''}</p>
           </div>
         </div>
         <div className={styles.info_right}>
           <p>采样日期：{collectData||''}</p>
           <p>报告日期：{reportData||''}</p>
         </div>
       </div>

       {
         dataInfo && dataInfo.length
         ? dataInfo.map((item, index_new) => {
          switch (+item.moduleType) {
     
            case 4501: //"肠道综合得分"
              return (
                <OverallScore data={item.data} key={index_new}/>
              )
            case 4502://"健康风险评估"
              return (
                 <RiskAssess data={item.data} key={index_new} index_new={index_new} openDesc={this.openDesc} />
              )
            case 4503://"调理方案"
              return(
                <ConditionScheme data={item.data} key={index_new} index_new={index_new} openDesc={this.openDesc} />
              )
            case 4504://"检测菌属"
              return(
                <DetectionBacteria data={item.data} key={index_new} index_new={index_new} openDesc={this.openDesc}  />
              )
            case 3201://通用模块—文字--"温馨提示"
              return(
               <CommonText data={item.data} key={index_new} index_new={index_new} />
              )
            case 3204://通用模块-图片-文字"--"肠道菌群检测技术"
                return(
                 <CommonTextImg data={item.data} key={index_new} index_new={index_new} />
                )
            case 4508:
               return (
                <Coupon data={item.data} key={index_new} index_new={index_new} receive={this.receive} />
               )
          }
         })
         : null
       }


      <Modal 
        visible={couponVis}
        type
        close2={true}
        style={{
          width:'76%',
          left:'12%',
          // overflowY:'hidden',
          borderRadius:'8px'
        }}
        handleToggle={() => { this.closeModal() }}
      >  
        <div className={styles.my_modal}>
          <img src={coupon} />
          <h3>成功领取活动优惠</h3>
          <p>恭喜！你已成功领取安小软加购专用券！现在就去加购吧！</p>
          <div onClick={()=>{this.toBuy()}}>去加购</div>
        </div>
      
      </Modal>
         
 
     </div>
     
    )
  }
}
ModuleDetail.propTypes = {
  history: propTypes.object,
  // detailList: propTypes.array.isRequired,
  modalFun: propTypes.func,
  computerHeight: propTypes.func,
}
export default ModuleDetail
