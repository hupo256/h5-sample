const homeCreate = (ajaxinstance) => {
  const home = {}
  // 获取首页banner
  home.indexBannerInfo = params => (
    ajaxinstance.get('index/indexBannerInfo', { params })
  )
  // 获取首页商品分类
  home.categoryList = params => (
    ajaxinstance.get('index/categoryList', { params })
  )
  // 商品详情
  home.productDetail = params => (
    ajaxinstance.get('index/productDetail', { params })
  )
  //商品详情新--
  home.getProductBuyDetailInfo = params => (
    ajaxinstance.get('orderRemould/getProductBuyDetailInfo', { params })
  )

  // 获取文章列表
  home.getArticleInfo = params => (
    ajaxinstance.get('index/getArticleInfo', { params })
  )
  // 获取信息
  home.myTestUserInfo = params => (
    ajaxinstance.get('myInfo/myTestUserInfo', { params })
  )
  // 获取最后一次切换用户的关系人ID
  home.getLastUserLindManId = (params) => (
    ajaxinstance.get('linkman/getLastUserLindManId', { params })
  )

  // 保存最后操作人的linkManId
  home.saveLastUserLindManId = (params) => (
    ajaxinstance.get('linkman/saveLastUserLindManId', { params })
  )
  return home
}

export default homeCreate
