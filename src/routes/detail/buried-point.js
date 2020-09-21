/**
  * @description: 首页2.0埋点
  * @author: gaoyanxia
  * @update: 2020-01-11
  */

import { point } from '@src/common/app'
const { allPointTrack } = point

// 埋点 访问话题页
const trackPointNewmallMoretopiclistView = (params) => {
  allPointTrack({
    eventName: 'newmall_moretopiclist_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 话题页点击文章
const trackPointNewmallMoretopiclistArticleGoto = (params) => {
  allPointTrack({
    eventName: 'newmall_moretopiclist_article_goto',
    pointParams: {
      ...params
    }
  })
}
// 埋点 话题页分享给好友
const trackPointNewmallMoretopiclistShare = (params) => {
  allPointTrack({
    eventName: 'newmall_moretopiclist_share',
    pointParams: {
      ...params
    }
  })
}
// 埋点 详情页浏览
const trackPointNewmallContentView = (params) => {
  allPointTrack({
    eventName: 'newmall_content_view',
    pointParams: {
      ...params
    }
  })
}
// 埋点 详情页按钮点击
const trackPointNewmallBestGoodsGoto = (params) => {
  allPointTrack({
    eventName: 'newmall_content_goto',
    pointParams: {
      ...params
    }
  })
}

// 页面访问
const newmallarticleview = (params) => {
  const { content_id } = params
  allPointTrack({
    eventName: 'newmall_article_view',
    pointParams: {
      content_id
    }
  })
}

export {
  trackPointNewmallMoretopiclistView,
  trackPointNewmallMoretopiclistArticleGoto,
  trackPointNewmallMoretopiclistShare,
  trackPointNewmallContentView,
  trackPointNewmallBestGoodsGoto,
  newmallarticleview
}
