import ajaxinstance from './ajaxinstance'
const healthRecordsCreate = () => {
  const healthRecords = {}
  // 校验是否需要选定本人联系人
  healthRecords.checkSelfLinkMan = params => (
    ajaxinstance.get('healthDoc/checkSelfLinkMan', { params })
  )
  // 选定本人联系人
  healthRecords.chooseSelfLinkMan = postData => (
    ajaxinstance.post('healthDoc/chooseSelfLinkMan', postData)
  )
  // 首页
  healthRecords.healthDocHomePage = params => (
    ajaxinstance.get('healthDoc/healthDocHomePage', { params })
  )
  // 我的检测人详情
  healthRecords.getHealthDocLinkManDetails = params => (
    ajaxinstance.get('healthDoc/getHealthDocLinkManDetails', { params })
  )
  // 查看联系人授权详情
  healthRecords.getHealthDocLinkManAuthDetails = params => (
    ajaxinstance.get('healthDoc/getHealthDocLinkManAuthDetails', { params })
  )
  // 保存授权信息
  healthRecords.updateHealthDocLinkManAuthDetails = postData => (
    ajaxinstance.post('healthDoc/updateHealthDocLinkManAuthDetails', postData)
  )
  // 谁来看过
  healthRecords.getBrowseLog = params => (
    ajaxinstance.get('healthDoc/getBrowseLog', { params })
  )
  // 查新亲友信息
  healthRecords.queryFriendDetail = params => (
    ajaxinstance.get('healthDoc/queryFriendDetail', { params })
  )
  // 获取分享邀请必要信息
  healthRecords.getShareData = params => (
    ajaxinstance.get('healthDoc/getShareData', { params })
  )
  // 核验身份
  healthRecords.checkAcceptInvite = params => (
    ajaxinstance.get('healthDoc/checkAcceptInvite', { params })
  )
  // 邀请界面查询人
  healthRecords.getPreAcceptInvite = params => (
    ajaxinstance.get('healthDoc/getPreAcceptInvite', { params })
  )
  // 接受邀请
  healthRecords.acceptShareInvite = postData => (
    ajaxinstance.post('healthDoc/acceptShareInvite', postData)
  )
  // 获取关系字典
  healthRecords.getAllRelationDic = params => (
    ajaxinstance.get('healthDoc/getAllRelationDic', { params })
  )
  // 查询检测人信息
  healthRecords.getLinkManInfo = params => (
    ajaxinstance.get('linkman/getLinkManInfo', { params })
  )
  // 修改检测人信息
  healthRecords.updateLinkManInfo = postData => (
    ajaxinstance.post('linkman/updateLinkManInfo', postData)
  )
  // 查询亲友信息
  healthRecords.queryFriendInfo = params => (
    ajaxinstance.get('healthDoc/queryFriendInfo', { params })
  )
  // 查询用户所有联系人的报告
  healthRecords.queryAuthToFriendReport = params => (
    ajaxinstance.get('healthDoc/queryAuthToFriendReport', { params })
  )
  // 授权报告给亲友
  healthRecords.authReportToFriend = postData => (
    ajaxinstance.post('healthDoc/authReportToFriend', postData)
  )
  // 亲友信息编辑
  healthRecords.updateFriendInfo = postData => (
    ajaxinstance.post('healthDoc/updateFriendInfo', postData)
  )
  // 保存浏览他人报告记录
  healthRecords.recordBrowseLog = postData => (
    ajaxinstance.post('healthDoc/recordBrowseLog', postData)
  )
  // 判断个人疾病和家族疾病档案是否已完善
  healthRecords.checkDataIsImproved = params => (
    ajaxinstance.get('sickDoc/checkDataIsImproved', { params })
  )
  // 查询个人疾病史或家族疾病史
  healthRecords.querySickList = params => (
    ajaxinstance.get('sickDoc/querySickList', { params })
  )
  // 完善个人疾病历史信息和家族疾病历史信息
  healthRecords.recordSickInfo = postData => (
    ajaxinstance.post('sickDoc/recordSickInfo', postData)
  )
  // 查询所有家族亲友
  healthRecords.queryAllFamilyFriends = params => (
    ajaxinstance.get('sickDoc/queryAllFamilyFriends', { params })
  )
  // 查询已记录的疾病信息
  healthRecords.queryhasSelectSickList = params => (
    ajaxinstance.get('sickDoc/queryhasSelectSickList', { params })
  )
  // 修改疾病史
  healthRecords.updSick = postData => (
    ajaxinstance.post('sickDoc/updSick', postData)
  )
  // 删除疾病史
  healthRecords.delSick = postData => (
    ajaxinstance.post('sickDoc/delSick', postData)
  )
  // 添加联系人时，展示的疾病列表信息
  healthRecords.getSickList = params => (
    ajaxinstance.get('sickDoc/getSickList', { params })
  )
  return healthRecords
}

export default healthRecordsCreate()
