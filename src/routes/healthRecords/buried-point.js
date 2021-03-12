import { point } from '@src/common/app'
const { allPointTrack } = point

// 健康档案主页浏览
const healthRecordsHomePageView = (params) => {
  allPointTrack({
    eventName: 'health_records_home_page_view',
    pointParams: {
      ...params
    }
  })
}
// 健康档案主页点击
const healthRecordsHomePageGoto = (params) => {
  allPointTrack({
    eventName: 'health_records_home_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 我的检测人浏览
const myLinkmanPageView = (params) => {
  allPointTrack({
    eventName: 'my_linkman_page_view',
    pointParams: {
      ...params
    }
  })
}
// 我的亲友浏览
const myRelativesFriendsPageView = (params) => {
  allPointTrack({
    eventName: 'my_relatives_friends_page_view',
    pointParams: {
      ...params
    }
  })
}
// 我的检测人点击
const myLinkmanPageGoto = (params) => {
  allPointTrack({
    eventName: 'my_linkman_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 我的亲友点击
const myRelativesFriendsPageGoto = (params) => {
  allPointTrack({
    eventName: 'my_relatives_friends_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 邀请亲友浏览
const myInvitationPageView = (params) => {
  allPointTrack({
    eventName: 'my_invitation_page_view',
    pointParams: {
      ...params
    }
  })
}
// 我邀请亲友点击
const myInvitationPageGoto = (params) => {
  allPointTrack({
    eventName: 'my_invitation_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 邀请亲友页面浏览
const invitationPageView = (params) => {
  allPointTrack({
    eventName: 'invitation_page_view',
    pointParams: {
      ...params
    }
  })
}
// 验证身份
const invitationPageoto = (params) => {
  allPointTrack({
    eventName: 'invitation_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 被邀请人完善关系浏览
const invitationImproveInformationPageView = (params) => {
  allPointTrack({
    eventName: 'invitation_improve_information_page_view',
    pointParams: {
      ...params
    }
  })
}
// 被邀请人完善关系点击
const invitationImproveInformationPageGoto = (params) => {
  allPointTrack({
    eventName: 'invitation_improve_information_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 被邀请成功页面浏览
const invitationCompletePageView = (params) => {
  allPointTrack({
    eventName: 'invitation_complete_page_view',
    pointParams: {
      ...params
    }
  })
}
// 被邀请成功页面点击
const invitationCompletePageGoto = (params) => {
  allPointTrack({
    eventName: 'invitation_complete_page_goto',
    pointParams: {
      ...params
    }
  })
}
// 进入疾病档案页
const diseaseProfileGoto = (params) => {
  allPointTrack({
    eventName: 'disease_profile_goto',
    pointParams: {
      ...params
    }
  })
}
// 疾病档案页
const diseaseProfileView = (params) => {
  allPointTrack({
    eventName: 'disease_profile_view',
    pointParams: {
      ...params
    }
  })
}
// 疾病列表
const diseaseListView = (params) => {
  allPointTrack({
    eventName: 'disease_list_view',
    pointParams: {
      ...params
    }
  })
}
// 点击保存疾病信息
const diseaseRecordGoto = (params) => {
  allPointTrack({
    eventName: 'disease_record_goto',
    pointParams: {
      ...params
    }
  })
}
// 疾病档案页点击
const diseaseProfilePageGoto = (params) => {
  allPointTrack({
    eventName: 'disease_profile_page_goto',
    pointParams: {
      ...params
    }
  })
}
export {
  healthRecordsHomePageView,
  healthRecordsHomePageGoto,
  myLinkmanPageView,
  myRelativesFriendsPageView,
  myLinkmanPageGoto,
  myRelativesFriendsPageGoto,
  myInvitationPageView,
  myInvitationPageGoto,
  invitationPageView,
  invitationPageoto,
  invitationImproveInformationPageView,
  invitationImproveInformationPageGoto,
  invitationCompletePageView,
  invitationCompletePageGoto,
  diseaseProfileGoto,
  diseaseProfileView,
  diseaseListView,
  diseaseRecordGoto,
  diseaseProfilePageGoto
}
