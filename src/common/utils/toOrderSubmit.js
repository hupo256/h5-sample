import { API, fun, ua } from '@src/common/app'
const { setSetssion } = fun

function getProductInfor(pid, activeCode = '', callback) {
  // 获取产品详情ByID
  API.productDetail({ id:pid, activeCode, noloading: 1 }).then(res => {
    const { productName, productPrice, productDetail,
      productBuyDesc, showPrice, transportCost, orderRemark } = res.data.tradeProduct
    let tempObj = [{
      prodId: pid,
      productNum: 1,
      productName,
      activeCode,
      cartProdPath: productDetail.indexPicUrl,
      productPrice,
      fromCartFlag: true,
      productBuyDesc,
      showPrice,
      transportCost,
      orderRemark
    }]
    setSetssion('shopList', tempObj)
    if (callback) callback()
  })
}

// SPT_XXX  表示单品
// SPTS_XXX  表示多个商品
function gotoSubmitPage(paras) {
  const { productId, productType, mobileNo, activeCode = '', linkManId, productIdList } = paras
  const SPTS_ = activeCode.includes('SPTS_')
  if (ua.isAndall()) {
    setTimeout(() => {
      if (SPTS_) { // 多个商品
        linkManId && andall.invoke('unlockProductList', {
          linkManId,
          productIdList,
          activeCode,
        })

        linkManId || andall.invoke('goProductList', { productId, productType })
      } else {
        andall.invoke('goPayOrder', {
          seriesId: '',
          linkManId: '',
          productId,
          activeCode,
          productType,
        })
      }
    }, 200)
  } else {
    if (mobileNo) {
      window.location.href = `${origin}/mkt/orders/order-submit`
    } else {
      const { origin, pathname, search } = location
      window.location.href = `${origin}/mkt/login/mobileLogin?url=${pathname}${search}`
    }
  }
}

// export default toDoShare
export { getProductInfor, gotoSubmitPage }
