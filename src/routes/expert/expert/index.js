import React from 'react'
import propTypes from 'prop-types'
import { fun, API, images, ua } from '@src/common/app'
import api from '@src/common/api/expertApi'
import andall from '@src/common/utils/andall-sdk'
import { Page } from '@src/components'
import styles from './expert.scss'
import ExpertList from '../components/expertList'

const { getParams } = fun
import {
  trackExpertsListView,
  trackExpertsListGoto
} from '../buried-point'
export default class Expert extends React.Component {
  state = {
    expertList: [],
    pageObj: {
      pageNum: 1,
      totalPage: 1,
      pageSize: 10
    },
    loadingStatus: true,
    isAndall: ua.isAndall(),
  }
  componentDidMount () {
    trackExpertsListView({
      view_type: 'homepage'
    })
   
    this.handleGetList()
    this.addEventListenerSroll()
  }
 
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.handleGetList)
  }
  handleGetList = () => {
    let { loadingStatus, expertList, pageObj } = this.state
    const { pageNum, totalPage, pageSize } = pageObj || {}
    const params = {
      pageNum,
      pageSize
    }
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    if (loadingStatus && pageNum <= totalPage && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        api.getAllIndexExpertSay(params).then(({ data }) => {
          if (data) {
            this.setState({
              expertList: [...expertList, ...data.data],
              pageObj: {
                ...pageObj,
                pageNum: data.pageNum + 1,
                totalPage: data.totalPage
              }
            })
          }
          // 页面抖动
          setTimeout(() => {
            this.setState({
              loadingStatus: true
            })
          }, 30)
        })
      })
    }
  }
  handleGoToDetail = (id,name) => {
    trackExpertsListGoto({btn_name:'expert_name'})
    this.props.history.push(`/expert/expertDetail?id=${id}`)
  }
  handleArticleDetail=(url)=>{
    location.href = url;
    console.log(url);
  }
 
  render () {
    const { expertList, pageObj, isAndall } = this.state
    return (
      <Page title='专家说'>
        <div className={styles.expert_panel}>
            
            <ExpertList expertList={expertList} onGotoDetail={this.handleGoToDetail} onGotoArticleDetail={this.handleArticleDetail}/>
            
        </div>
      
      </Page>
    )
  }
}
Expert.propTypes = {
  history: propTypes.object,
}
