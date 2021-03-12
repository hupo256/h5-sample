import { API, fun, ua } from '@src/common/app'
const { setSetssion } = fun

function getProductInfor(obj,actualType, params,callback) {
  // 获取产品详情ByID
  if(obj.buyInfo['transportCost']){
    obj.buyProductList[0].productList[0]["transportCost"] = obj.buyInfo['transportCost']
  }
  const tempList = obj.buyProductList[0].productList
  const tempObj = {...obj.userInfo,...obj.buyInfo,kitInfo:obj.buyProductList[0].kitInfo,actualType,...params}
  setSetssion("shopList", tempList)
  setSetssion("orderUserInfoKitInfo", tempObj)
  if(callback) callback()
}

// SPT_XXX  表示单品
// SPTS_XXX  表示多个商品
function gotoSubmitPage(paras) {
  const { activeCode='', linkManId, productList,unlockType,buyType,extraData, giveFlag = false } = paras
  const SPTS_ = activeCode.includes('SPTS_')
  let setParams = {linkManId,productList,activeCode,actualType:linkManId ==="" ?buyType: unlockType}
  if(!linkManId){
    delete setParams["linkManId"];
  }
  if (extraData){
    setParams = Object.assign(setParams, {extraData:extraData})
  }
  if (!ua.isAndall() && !ua.isWechat() && ua.isIos()) {
    var a = document.createElement('a')
    a.setAttribute('href', `${origin}/mkt/orders/order-submit`)
    a.setAttribute('id', 'startTelMedicine')
    a.click()
    window.location.href = `${origin}/mkt/orders/order-submit`
    return
  }
  if (ua.isAndall()) {
    setParams.giveFlag = giveFlag
    setTimeout(() =>{
      andall.invoke('confirmOrder', setParams)
      //linkManId || andall.invoke('goProductList', { productId, productType })
    }, 200)
  } else {
    window.location.href = window.location.origin + `/mkt/orders/order-submit`
  }
}

// export default newToOrderSubmit
export { getProductInfor, gotoSubmitPage }
