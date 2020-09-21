import React from 'react'
import propTypes from 'prop-types'
import { fun, API, images, ua } from '@src/common/app'
import api from '@src/common/api/expertApi'
import andall from '@src/common/utils/andall-sdk'
import { Page } from '@src/components'
import styles from './expert.scss'
import ArticleList from '../components/articleList'
import userApi from '@src/common/api/userApi'
import image from '../image'
import { Toast } from 'antd-mobile'
const { isWechat, isIos, isAndall } = ua

const { getParams } = fun

import {
  trackExpertsPageView,
  trackExpertsPageGoto
} from '../buried-point'
export default class ExpertDetail extends React.Component {
  state = {
    articleList: [],
    detail:{},
    pageObj: {
      pageNum: 1,
      totalPage: 1,
      pageSize: 10
    },
    loadingStatus: true,
    isAndall: ua.isAndall(),
    isFollow:false,
    isLogin:false
  }
  componentDidMount () {
    this.handleGetExpert() 
  }
 
  
 
  handleGetExpert = () =>{
    const { id , view_type} = getParams()
    let params={
      expertId:Number(id)
    }
    api.getIndexExpertSayDetail(params).then(res=>{
      console.log(res);
      if(res.data){
        this.setState({
          detail:res.data,
          isFollow: res.data.isFollow
        })
      }
      console.log(this.state.detail)
      if(view_type){
        trackExpertsPageView({
          view_type
        })
      }
      else{
        trackExpertsPageView({
          view_type:'homepage'
        })
      }
      
      
    })
    
  }
  handleGoToDetail = (url,article_title) => {
    trackExpertsPageGoto({btn_name:'article_title'})
    location.href = url;
  }
  follow=()=>{
    const { id } = getParams()
    let params={
      expertId:Number(id)
    }
    const{detail}=this.state;
    const { origin, pathname, search } = location
    userApi.myInfo({ noloading: 1, withoutBack:1,clientType : isWechat() ? 'WeChat' : 'H5' }).then(res => {
      console.log(res);
      if(res.code==0){
        api.followExpert(params).then(res=>{
          if(res){
            trackExpertsPageGoto({btn_name:'follow'})
            Toast.success('关注成功', 1.5)
            this.setState({
              isFollow: true
            })
          } 
        })
      }
      else{
        if (isAndall()) {
          andall.invoke('login', {}, res => {
            window.localStorage.setItem('token', res.result.token)
            //window.location.reload()
            window.location.href = `${origin}${pathname}${search}`
          })
        } else {
          window.location.href = `${origin}/mkt/login/mobileLogin?url=${pathname}${search}`
        } 
      }
    })

  }
  unfollow=()=>{
    const { id } = getParams()
    let params={
      expertId:Number(id)
    }
    const { origin, pathname, search } = location
    userApi.myInfo({ noloading: 1,withoutBack:1, clientType : isWechat() ? 'WeChat' : 'H5' }).then(res => {
      console.log(res);
      if(res.code==0){
        api.unFollowExpert(params).then(res=>{
          if(res){
            Toast.success('取消关注', 1.5)
            this.setState({
              isFollow: false
            })
          } 
        })
      }
      else{
        if (isAndall()) {
          andall.invoke('login', {}, res => {
            window.localStorage.setItem('token', res.result.token)
            //window.location.reload()
            window.location.href = `${origin}${pathname}${search}`
          })
        } else {
          window.location.href = `${origin}/mkt/login/mobileLogin?url=${pathname}${search}`
        } 
      }
    })
    
  }
  
 
  render () {
    const { articleList, pageObj, isAndall,detail ,isFollow} = this.state
    return (
      <Page title='专家主页'>
        
        <div className={styles.expert_panel}>  
          <div className={styles.expert_basic_info}>
            <div className={styles.expert_avatar} style={{backgroundImage:`url(${detail.expertIcon})`}}>
              <div className={styles.expert_verfiy} style={{backgroundImage:`url(${image.verify})`}}>
                安我认证
              </div>  
            </div>
            <div className={styles.expert_info}>
              <h1><em>{detail.expertName}</em><span>获赞<i>{detail.upNum}</i></span></h1>
              <p>{detail.expertTag}</p>
            </div>
            <div className={styles.expert_follow}>
              {!isFollow ?
                <div className={`${styles.btn} ${styles.active}`} onClick={this.follow}>
                  <i></i>关注
                </div>
                :
                <div className={styles.btn} onClick={this.unfollow} onClick={this.unfollow}>已关注</div>
              }
            </div>  
            
          </div>
          <div className={styles.expert_detail_con}>
            <div className={styles.expert_title_txt} style={{backgroundImage: `url(${image.book})`}}>专业背景</div>
            <div className={styles.expert_para} dangerouslySetInnerHTML={{ __html:detail.background }}></div>
          </div>  
          <ArticleList articleList={detail.data} onGotoDetail={this.handleGoToDetail}/> 
            
        </div> 
      
      </Page>
    )
  }
}
ExpertDetail.propTypes = {
  history: propTypes.object
}
