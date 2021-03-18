const skinSearchCreate = (ajaxinstance) => {
  const skin = {}
  // 美妆工具获取肌秘报告的状态/红亮点数据/推荐产品
  skin.getBeautyHomeInfo = params => (
    ajaxinstance.get('beauty/getBeautyHomeInfo', { params })
  )
  // 获取美妆工具的收藏产品
  skin.getFavoriteBoxData = postData => (
    ajaxinstance.post('beauty/getFavoriteBoxData', postData)
  )
  // 美妆工具的获取热搜关键词
  skin.getHostKeyWord = params => (
    ajaxinstance.get('beauty/getHostKeyWord', { params })
  )
  // 获取用户的搜索记录，和大家都在搜关键词
  skin.getHistoryAndHostKey = params => (
    ajaxinstance.get('beauty/getHistoryAndHostKey', { params })
  )
  // 搜索产品或者成分
  skin.searchProduct = postData => (
    ajaxinstance.post('beauty/searchProduct', postData)
  )
  // 产品详情
  skin.searchProductDetail = params => (
    ajaxinstance.get('beauty/searchProductDetail', { params })
  )
  // 成分详情
  skin.searchElementDetail = params => (
    ajaxinstance.get('beauty/searchElementDetail', { params })
  )
  // 添加美妆工具的收藏产品
  skin.addFavoriteBoxData = postData => (
    ajaxinstance.post('beauty/addFavoriteBoxData', postData)
  )
  // 清空搜索历史
  skin.clearHistory = params => (
    ajaxinstance.get('beauty/clearHistory', { params })
  )
  // 记录推荐产品的匹配度的反馈数据
  skin.recordFeedback = postData => (
    ajaxinstance.post('beauty/recordFeedback', postData)
  )
  // 通过成分查产品list
  skin.queryPorductByElement = postData => (
    ajaxinstance.post('beauty/queryPorductByElement', postData)
  )
  return skin
}

export default skinSearchCreate
