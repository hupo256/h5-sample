import React from 'react'
import propTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import wxconfig from '@src/common/utils/wxconfig'
import { fun, API, ua } from '@src/common/app'
import andall from '@src/common/utils/andall-sdk'
import { Page } from '@src/components'
// import { Player } from 'video-react'
import images from '../components/images'
import styles from './detail.scss'
import './video-react.css'
import {
  trackPointNewmallContentView,
  trackPointNewmallBestGoodsGoto,
  newmallarticleview
} from '../buried-point'
const { getParams, numToStringK } = fun
export default class ArticleDetail extends React.Component {
  state = {
    detail: {},
    isVideo: false,
    isGood: false,
    content: '',
    isAndall: ua.isAndall(),
    isPlay: false,
    isArticle: false,
    loading:true,
  }
  componentDidMount () {
    const { id = '', type } = getParams()
    newmallarticleview({ content_id: id })
    if (+type === 1) {
      this.setState({
        isArticle: true
      })
    }
    this.handleGetArticle()
    this.handleAddBrowseNumber()
  }
  handleAddBrowseNumber = () => {
    const { id, type } = getParams()
    const params = {
      contentId: +id,
      contentType: +type
    }
    API.updateActivContentBrowseNumber(params).then(({ data }) => {
    })
  }
  handleGetArticle=() => {
    const { id, type, viewType } = getParams()
    const { isAndall } = this.state
    API.getActivContentDetailById({ id, contentType: +type }).then(({ data }) => {
      let mtype = ''
      let productName = ''
      if (+type === 1) {
        mtype = 'SHOW_TYPE_20001'
      } else if (+type === 4) {
        mtype = 'SHOW_TYPE_20004'
        productName = data.title
      } else if (+type === 3 || +type === 6) {
        mtype = 'SHOW_TYPE_20003'
      }
      trackPointNewmallContentView({
        content_id: id,
        mtype,
        view_type: viewType,
        product_name: productName
      })
      this.setState({
        detail: data,
        isVideo: !!((+type === 3 || +type === 6)),
        content: this.handleSetContent(data),
        isGood: !!((+type === 4)),
        loading:false
      }, () => {
        if (!isAndall) {
          this.wxShare(data)
        }
      }
      )
    })
  }
  handleSetContent = (data) => {
    const { type } = getParams()
    const { content, courseIntroduceContent, goodsIntroduceContent, videoIntroduceContent } = data
    switch (+type) {
    case 1:
      return content
    case 3:
      return videoIntroduceContent
    case 4:
      return goodsIntroduceContent
    case 6:
      return courseIntroduceContent
    }
  }
  handleAddActivUserUpDown = (type) => {
    const { id } = getParams()
    const { detail } = this.state
    const params = {
      contentId: id,
      type,
      withoutBack: '1'
    }
    let mtype = ''
    let productName = ''
    if (+type === 1) {
      mtype = 'SHOW_TYPE_20001'
    } else if (+type === 4) {
      mtype = 'SHOW_TYPE_20004'
      productName = detail && detail.title
    } else if (+type === 3 || +type === 6) {
      mtype = 'SHOW_TYPE_20003'
    }
    trackPointNewmallBestGoodsGoto({
      content_id: id,
      mtype,
      Btn_name: type === 1 ? 'good' : 'bad',
      product_name: productName
    })
    API.addActivUserUpDown(params).then(({ data }) => {
      if (data) {
        Toast.info(data)
        andall.invoke('updateArticleLike', { upNum:detail.upNum + 1, upFlag:true, contentId: id }) // 通知app首页
        this.handleGetArticle()
      } else if (detail.upDownType === 1 || detail.upDownType === 2) {
        if (detail.upDownType === type) {
          Toast.info('无需重复提交!')
        } else {
          Toast.info('不支持修改!')
        }
      }
    })
  }
  handleShare = () => {
    const { id, type } = getParams()
    const { detail } = this.state
    const { title, shareTitle, shareDescription, shareImgUrl, linkUrl, jumpLink, shareDesc, sharePictureUrl } = detail || {}
    let mtype = ''
    let productName = ''
    if (+type === 1) {
      mtype = 'SHOW_TYPE_20001'
    } else if (+type === 4) {
      mtype = 'SHOW_TYPE_20004'
      productName = title
    } else if (+type === 3 || +type === 6) {
      mtype = 'SHOW_TYPE_20003'
    }
    trackPointNewmallBestGoodsGoto({
      content_id: id,
      mtype,
      Btn_name: 'share',
      product_name: productName
    })

    if (ua.isAndall()) {
      setTimeout(() => {
        andall.invoke('share', {
          type: 'link',
          title: shareTitle,
          text: shareDescription || shareDesc,
          url: linkUrl || jumpLink,
          thumbImage: shareImgUrl || sharePictureUrl,
          image: shareImgUrl || sharePictureUrl,
        })
      }, 100)
    } else {
      this.setState({ share: true })
    }
  }
  /**
   * 微信分享
   */
  wxShare = (shareInfo) => {
    const { shareTitle, linkUrl, jumpLink, shareDescription,
      shareDesc, shareImgUrl, sharePictureUrl } = shareInfo
    wxconfig({
      showMenu: true,
      params:{
        title: shareTitle,
        link: linkUrl || jumpLink,
        desc: shareDescription || shareDesc,
        imgUrl: shareImgUrl || sharePictureUrl,
      }
    })
  }

  // 专家主页
  handleGoToExpert = (id) => {
    if (id) {
      this.props.history.push(`/news/expert-homepage?id=${id}`)
    }
  }
  handleGoTosan= (url) => {
    const { id } = getParams()
    const { detail } = this.state
    trackPointNewmallBestGoodsGoto({
      content_id: id,
      mtype: 'SHOW_TYPE_20004',
      Btn_name: 'buy',
      product_name: detail && detail.title
    })
    if (ua.isAndall()) {
      andall.invoke('openUrl', { url },
        params => {
        }
      )
    } else {
      location.href = url
    }
  }
  handleOnPlay = () => {
    this.setState({
      isPlay: true
    }, () => {
      document.getElementById('video1').play()
    })
  }
  bannerLink=() => {
    const { detail } = this.state
    if (detail.bannerResp && detail.bannerResp.jumpUrl) { window.location.href = detail.bannerResp.jumpUrl }
  }
  render () {
    const { loading, detail, isVideo, content, isGood, isAndall, isPlay, isArticle } = this.state
    let { title, displayTags, description, coverImgUrl, upNum, downNum, activContentExpertResp, contentCourseVideoUrl,
      goodsPictureUrl, describe, contentVideoUrl, creatTime, contentCourseVideoCoverPicture, contentVideoCoverPicture,
      upDownType, isShare, purchaseLink, isFollow, bannerResp } = detail || {}
    const { expertHeadPortrait, expertName, backgroundIntroduction, id } = activContentExpertResp || {}
    displayTags = displayTags && displayTags.replace(/，/g, ',')
    const tipArr = displayTags && displayTags.split(',')
    return (
      <Page title={''}>
        {
          !loading &&
          <div className={styles.detailCont}>
            {
              isVideo
                ? <div className={`${styles.header} ${isArticle ? styles.h283 : ''} ${isVideo ? styles.h206 : ''}`}>
                  <div className={styles.videoCont}>
                    {
                      isPlay
                        ? <video id='video1' controls='controls' autoPlay='autoplay'>
                          <source src={contentCourseVideoUrl || contentVideoUrl} type='video/mp4' />
                        </video>
                        : <div>
                          <img className={styles.cover} src={contentVideoCoverPicture || contentCourseVideoCoverPicture} alt='' />
                          <div className={styles.fixed}>
                            <img onClick={this.handleOnPlay} className={styles.videoIcon} src={images.video} />
                          </div>
                        </div>
                    }
                  </div>
                  {/* <div>{coverImgUrl || goodsPictureUrl ? <img className={styles.img} src={coverImgUrl || goodsPictureUrl} alt='' /> : ''} </div> */}
                </div>
                : ''
            }

            <div className={`${styles.cont} ${isGood ? styles.pb116 : ''}`}>
              <p className={styles.title}>{title}</p>
              <div className={styles.tipsCont}>
                <div className={styles.left}>安我生活/原创</div>
                <div>
                  {
                    tipArr && tipArr.length
                      ? tipArr.map((item, index) => {
                        if (displayTags.length > 10) {
                          if (index < 2) {
                            return <span className={styles.tips} key={index}>{item}</span>
                          }
                        } else {
                          if (index < 3) {
                            return <span className={styles.tips} key={index}>{item}</span>
                          }
                        }
                      })
                      : ''
                  }
                </div>
              </div>
              {
                activContentExpertResp
                  ? <div className={styles.authorCont}>
                    <img className={styles.authorImg} src={expertHeadPortrait} onClick={() => this.handleGoToExpert(id)} alt='' />
                    <div className={styles.authorIntroduce}>
                      <p className={styles.authorName}>{expertName}</p>
                      <p className={styles.introduce} dangerouslySetInnerHTML={{ __html: backgroundIntroduction }} />
                    </div>
                    <span className={isFollow ? styles.authorFollow : styles.authorNoFollow}>
                      {isFollow ? '已关注' : '关注'}
                    </span>
                    <span className={styles.time}>{creatTime}</span>
                  </div>
                  : ''
              }
              {
                description || describe
                  ? <div className={styles.desc} dangerouslySetInnerHTML={{ __html: description || describe }} />
                  : ''
              }
              <div className={styles.detail} dangerouslySetInnerHTML={{ __html: content || '' }} />
              <div className={styles.ending} >
                <img src={images.end} />
                <div className={styles.title}>
                  <label />
                  <span>安我生活</span>
                  <img src={images.sanjiao} />
                  <span>科技赋能美好生活</span>
                  <label />
                </div>
                <div className={styles.text}>
                  <p>提供专业的家用型检测、诊断及解决方案</p>
                  <p>累计获得了百万中国家庭的青睐</p>
                  <p>安我拥有国家卫健委认证的医学检验所资质</p>
                  <p>通过国家信息安全三级等保认证和国际ISO体系认证</p>
                  <p>安我一直秉承用户第一的价值观</p>
                  <p> 坚持为中国家庭持续提供值得信赖的产品及服务</p>
                </div>
              </div>

            </div>
            {
              bannerResp && bannerResp.imgUrl
                ? <div className={styles.bannerImg} onClick={this.bannerLink}>
                  <img src={bannerResp.imgUrl} />
                </div>
                : ''
            }
            <div className={styles.bottomCont}>
              {
                isGood && purchaseLink && purchaseLink.length
                  ? <span className={styles.buyBtn} onClick={() => this.handleGoTosan(purchaseLink)}>立即购买</span>
                  : ''
              }
              {
                isAndall
                  ? <div className={styles.zanCont}>
                    <span onClick={() => this.handleAddActivUserUpDown(1)}>
                      {upDownType > -1 ? <img src={upDownType === 1 ? images.zan : images.zanNo} alt='' /> : ''}
                      <em>{numToStringK(upNum)}</em>
                    </span>
                    {/* <span onClick={() => this.handleAddActivUserUpDown(2)}>
                    <img src={upDownType === 2 ? images.cai : images.caiNo} alt='' />
                    <em>{numToStringK(downNum)}</em>
                  </span> */}
                    {
                      isShare
                        ? <span onClick={this.handleShare}>
                          <img src={images.shareIcon1} alt='' />
                        </span>
                        : ''
                    }
                  </div>
                  : ''
              }
            </div>
          </div>
        }

      </Page>
    )
  }
}
ArticleDetail.propTypes = {
  history: propTypes.object,
}
