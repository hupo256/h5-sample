import React from 'react'
import styles from '../mould'
import {Modal} from 'antd-mobile'
import {NewUser,UnlockUser,OrderInfo} from '@src/components/acitvityMould'
import landing from '@src/common/api/landingApi'
import {Toast} from 'antd-mobile'
import { getProductInfor, gotoSubmitPage } from '@src/common/utils/newToOrderSubmit'
import UA from '@src/common/utils/ua'

class comfirmModal extends React.Component {
    // visible  弹窗显示控制
    // newUserVisible  新用户组件显示控制
    // unlockUserVisible  解锁用户组件显示控制
    // chooseID  选中用户，单选，包括新用户及解锁用户
    // limitNum 限制购买数量
    // numBtnVisible 新用户选择数量显示控制
    state = {
      visible:false,
      newUserVisible:false,
      unlockUserVisible:true,
      unlockerUserData:[],
      chooseID:'',
      limitNum:0,
      numBtnVisible:false,
      newUserNum:1,
      reqProductIds:[],
      canUnlock:true,
      hasUser:true,
      orgBuyTotalPrice:0
    }

    componentDidMount() {
      const { callbackFun:{ onRef } } = this.props
      onRef(this)
    }

    setVisible = () => {
      const {callbackFun:{setVisible}} = this.props
      this.clearModal()
      setVisible('modalVisible')
    }
    // 清理弹窗state
    clearModal = () => {
      this.setState({
        visible:false,
        newUserVisible:false,
        unlockUserVisible:true,
        unlockerUserData:[],
        chooseID:'',
        limitNum:0,
        numBtnVisible:false,
        newUserNum:1
      })
    }

    // 获取有效检测人
    getAvailableLinkMan = (obj) => {

    }

    changeId = async (id) => {
      const { newUserNum } = this.state
      const { dataObj = {}, callbackFun:{setData}} = this.props
      const { chooseID, productIds, productPrice } = dataObj
      if (chooseID === id) {
        return
      }
      let saveIds = []
      if (id !== 'newuser' && id !== chooseID) {
        const params = { linkManId:id, productIds }
        await landing.checkUnlockProducts(params).then((res)=>{
          if (!res.code) {
            saveIds = res.data
          }
        })
      }

      let totPrice = 0
      let reqProductIds = saveIds.length > 0 ? saveIds : productIds

      reqProductIds.map((item, index) => {
        productPrice.map((ii, iindex) => {
          if (item === ii['id']) {
            if (id === 'newuser') {
              totPrice += ii['productPrice'] * newUserNum
              dataObj.numBtnVisible = dataObj.buyFlag !== 1 ? true:false
            } else {
              totPrice += ii["unlockPrice"]
              dataObj.numBtnVisible = false
            }
          }
        })
      })
      totPrice = +totPrice.toFixed(2)
      const orgBuyTotalPrice = totPrice
      let saveData = Object.assign(dataObj,{chooseID: id,reqProductIds,totPrice})
      this.setState({
        orgBuyTotalPrice
      })
      setData(saveData)
    }

    getNewUserNum = (num) =>{
      // 获取购买数量
      const {orgBuyTotalPrice} = this.state;
      const {dataObj,callbackFun:{setData}} = this.props
      let saveData = Object.assign(dataObj,{totPrice:(+orgBuyTotalPrice).toFixed(2)})
      setData(saveData)
      this.setState({
          newUserNum:num,
      })
    }

    gotoGetDetil = () => {
      const { newUserNum } = this.state;
      const {dataObj,callbackFun:{setVisible},modalParams:{visible}} = this.props
      const {chooseID,hasUser,buyType,unlockType,reqProductIds,canUnlock,unlockNumber,limitNum,activeCode} = dataObj
      let finallProductIds = []

      if (limitNum === 0 && chooseID === 'newuser') {
        Toast.info('购买订单达上限')
        return
      }

      if(!unlockNumber && chooseID!=="newuser"){
        Toast.info("解锁订单达上限",2)
        return
      }
      if (!hasUser) {
        Toast.info("商品仅支持解锁",2);
        return
      }
      if (!canUnlock) {
        Toast.info("所有商品均已解锁",2);
        return
      }

      if (chooseID === '') {
        Toast.info('请选择用户',2);
        return
      }
      const idLength = reqProductIds.length
      for (let i = 0; i < idLength; i++) {
        finallProductIds.push({ productId:reqProductIds[i], productNum:chooseID === 'newuser' ? newUserNum : 1 })
      }
      const params = {
        linkManId:chooseID === "newuser" ? '' : chooseID,
        actualType:chooseID === "newuser" ? buyType : unlockType,
        productList:finallProductIds,
        ...dataObj
      }
      if (!visible) {
        return
      }
      landing.getProductBuyDetailInfo(params).then((res)=>{
        // this.clearModal()
        if (UA.isAndall() || UA.isWechat() || UA.isAndroid()) {
          setVisible('modalVisible')
        }
        this.setState({
          newUserNum:1,
        })
        if(!res.code){
          getProductInfor(res.data,params.actualType,params, () => {
            const paras = {
              linkManId:res.data.userInfo.linkManId?res.data.userInfo.linkManId:"",
              productList:finallProductIds,
              activeCode:params.activeCode,
              buyType,
              unlockType
            }
            gotoSubmitPage(paras)
          })
        } else {
          Toast.info(res.msg,2)
        }
      })
    }

    render () {
      const {} = this.state
      const {dataObj,modalParams,callbackFun:{showAnswer}} = this.props;
      const {visible,isBangs,wechatBottom} = modalParams
      const {templateRuleList,newUserVisible,unlockUserVisible, unlockerUserData, chooseID,limitNum,numBtnVisible,reqProductIds,totPrice,buyNumber} = dataObj
      return (
        <Modal
          popup
          visible={visible}
          animationType="slide-up"
          className={`${styles.modalTest} ${isBangs?styles.xPaddingBottom:""}`}
          closable
          onClose={()=>this.setVisible("modalVisible")}
        >
          <div className={styles.confirmWrap}>
            <OrderInfo dataList={templateRuleList} reqProductIds={reqProductIds} chooseID={chooseID} />
            <div className={styles.totalPrice} style={{paddingBottom:`${reqProductIds.length < 2? "5px":null}`}}>{reqProductIds.length > 1&&<div>共{reqProductIds.length}件商品&nbsp;小计:<span>￥{totPrice}</span></div>}</div>
            {unlockUserVisible && unlockerUserData.length>0 &&
            <UnlockUser
              dataList={unlockerUserData}
              changeId={this.changeId}
              chooseID={chooseID}
              showAnswer={showAnswer}
            />
            }
            {newUserVisible &&
            <NewUser
              chooseID={chooseID}
              changeId={this.changeId}
              limitNum={limitNum}
              numBtnVisible={numBtnVisible}
              setNum={this.getNewUserNum}
              buyNumber={buyNumber}
            />
            }

          </div>
          <div className={`${styles.confirmBtn} ${isBangs?styles.xPhonePaddingB:""} ${(wechatBottom && !isBangs)?styles.wechatPaddingB:""}`}>
            <div onClick={()=>this.gotoGetDetil()}>确认下单</div>
          </div>
          {/* <div className={styles.closeWrap} onClick={()=>this.setVisible(false)}></div> */}
        </Modal>
      )
    }
}

export default comfirmModal
