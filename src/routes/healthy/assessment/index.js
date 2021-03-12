import React from 'react'
import { Page, NavigationBar} from '@src/components'
import { fun, ua } from '@src/common/app'
import images from '../images'
import styles from './assessment.scss'
import healthyApi from '@src/common/api/healthyApi'
import oku from '@src/common/api/oneKeyUnlockApi'
import { healthTestListView, healthTestListGoto } from '../buried-point'
const { getParams } = fun
let count=0;

class Rules extends React.Component {
  state = {
    records:[],
    loading:true,
    linkManId:'',
    loadingStatus: true,
    totalCount:'',
    relationArray:[],
    relationId: 0,
    pageObj: {
      pageNum: 1,
      pageSize: 10,
      pageCount: 1,
    },
  }

  componentDidMount () {
    let _this=this
    document.body.scrollTop = 1
    document.documentElement.scrollTop = 1
    _this.fetchLinkMan()
    count++;
    if(count>=1){
      //alert(1)
      andall.on('onVisibleChanged', (res) => {
        // alert(res.visibility)
        // if(res.visibility){
        //  alert(this.state.linkManId);
        //   this.setState({
        //     records:[],
        //     totalCount:'',
        //     pageObj: {
        //       pageNum: 1,
        //       pageSize: 10,
        //       pageCount: 1,
        //     },
        //   }, () => {
        //     this.withFillEvaluationList()
        //     this.addEventListenerSroll()
        //   })
        // }
        //alert(res.visibility)
        if(res.visibility){
          _this.setState({
            records:[],
            totalCount:'',
            relationId:0,
            pageObj: {
              pageNum: 1,
              pageSize: 10,
              pageCount: 1,
            },
          }, () => {
          _this.fetchLinkMan()
          }) 
        }
      })
    }
    
    
  }
  refreshPage(){
    let _this=this
    andall.on('onVisibleChanged', (res) => {
      if(res.visibility){
        this.setState({
          records:[],
          totalCount:'',
          relationId:0,
          pageObj: {
            pageNum: 1,
            pageSize: 10,
            pageCount: 1,
          },
        }, () => {
          this.withFillEvaluationList()
          this.addEventListenerSroll()
        })
      }
    })
  }
  fetchLinkMan(){
    oku.getLinkMan().then(res => {
      console.log(res);
      let array =res.data.bindingInfo
      array.sort(function(a,b){      
        return a.relationId - b.relationId       
      })
      let relationArray=array.filter(item => item.relationId!==null)
      this.setState({
        relationArray,
        linkManId:+getParams().linkManId?+getParams().linkManId:relationArray[0].id
      })
    }).then(res=>{

        this.withFillEvaluationList()
        this.addEventListenerSroll()
        //this.doPopstateEvent()
      }
    )
  }
  componentWillUnmount() {
    window.removeEventListener('popstate', this.touchHistory, false)
    window.removeEventListener('scroll', this.addEventListenerSroll)
  }
  doPopstateEvent = () => {
    const state = { title: 'title', url: '#' }
    window.history.pushState(state, 'title', '#')
    window.addEventListener('popstate', this.touchHistory, false)
  }
  touchHistory = () => {
    // alert('我监听到了浏览器的返回按钮事件啦12') // 根据自己的需求实现自己的功能
    ua.isAndall() ? andall.invoke('back') : window.history.go(-1)
  }
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.withFillEvaluationList)
  }
  withFillEvaluationList=() => {
    
    let { records, linkManId, loadingStatus, pageObj } = this.state
    const { pageNum, pageSize, pageCount } = pageObj || {}
    const params = {
      linkManId,
      pageNum,
      pageSize,
      noloading:1
    }
    const bodyHeight = window.innerHeight
    const { offsetHeight } = document.body
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const isFoot = scrollTop >= offsetHeight - bodyHeight - 34
    // alert("loading:"+loadingStatus)
    // alert("pageNum:"+pageNum)
    // alert("pageCount:"+pageCount)
    // alert("isFoot:"+isFoot)
    if (loadingStatus && pageNum <= pageCount && isFoot) {
      this.setState({ loadingStatus: false }, () => {
        healthyApi.withFillEvaluationList(params).then(({ data }) => {
        //alert(data.totalCount)
          if (data) {
            this.setState({
              loading:false,
              records: [...records, ...data.linkManTraitEvaluationDtos],
              totalCount:data.totalCount,
              pageObj: {
                ...pageObj,
                pageNum:data.currentCount + 1,
                pageCount: data.pageCount
              }
            })
            healthTestListView({
              sample_linkmanid:linkManId,
              undo_num:data.totalCount
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
  goCheckout=(item) => {
    let { linkManId, totalCount } = this.state
    healthTestListGoto({
      sample_linkmanid:linkManId,
      undo_num:totalCount,
      Btn_name:'qnaire_go',
      trait_code:item.traitCode,
      trait_name:item.traitName,
      unlock_status:item.isUnLockFlag,
      trait_type:item.redLightType === 'L' ? 'red' : item.redLightType === 'M' ? 'normal' : item.redLightType === 'H' ? 'good' : '',
    })
    
    let url = window.location.origin + `/mkt/healthy/checkout?linkManId=${linkManId}&evaPageType=FILL&isUnLockFlag=${item.isUnLockFlag}&productCode=${item.productCode}&qnaireId=${item.qnaireId}&traitId=${item.traitId}` 
    if(ua.isAndall()){
      location.href = `andall://andall.com/inner_webview?url=${url}`
    }
    else{
      this.props.history.push(`/healthy/checkout?linkManId=${linkManId}&evaPageType=FILL&isUnLockFlag=${item.isUnLockFlag}&productCode=${item.productCode}&qnaireId=${item.qnaireId}&traitId=${item.traitId}`)
    }
  }
  goHasWrite=() => {
    let { linkManId, totalCount } = this.state
    healthTestListGoto({
      sample_linkmanid:linkManId,
      undo_num:totalCount,
      Btn_name:'done_list_go'
    })
    this.props.history.push(`/healthy/hasWrite?hideTitleBar=1&linkManId=${linkManId}`)
  }
  goBack=()=>{
    if(ua.isAndall()){
      andall.invoke('back')
    }
    else{
      window.history.go(-1)
    }
  }
  changeUser=(item,index)=>{
    this.setState({
      relationId:index,
      linkManId:item.id,
      records:[],
      totalCount:'',
      pageObj: {
        pageNum: 1,
        pageSize: 10,
        pageCount: 1,
      },
    }, () => {
      this.withFillEvaluationList()
      this.addEventListenerSroll()
    })
  }
  render () {
    const { loading, records, totalCount ,relationArray,relationId} = this.state
    return (
      <Page title='健康测评'>
        {
          !loading
            ? <div className={styles.details}>
              <NavigationBar title="健康测评" type="black" background="#D7D7FC" back={()=>{this.goBack()}}></NavigationBar>
              <div className={styles.header} id='header'>
                <div className={styles.header_con}>
                  {relationArray.length>0?relationArray.map((item,index)=>{
                    return(
                      <div onClick={()=>this.changeUser(item,index)} className={`${styles.header_person} ${relationId===index?`${styles.active}`:''}`}>
                        <img src={`${item.headImgType === 1 ? images.img1 : item.headImgType === 2 ? images.img2 : item.headImgType === 3 ? images.img3 : images.img4}`} />
                        <span className={styles.bold}>{item.userName}</span>
                      </div>
                    )
                  }):null }

                  
                  
                  {/* <div className={`${styles.header_person}`}>
                    <img src={`${headImgType === 1 ? images.userImg1 : headImgType === 2 ? images.userImg2 : headImgType === 3 ? images.userImg3 : images.userImg4}`} />
                    <span className={styles.bold}>{linkManName}</span>
                    <span>{`${headImgType > 2 ? '（成人）' : '（儿童）'}`}</span> 
                  </div>  */}
                
                </div>
              </div>

              <div className={styles.lists} id='lists'>
                <div className={`${styles.writeStatus} ${!totalCount ? styles.noborder : ''}`}>
                  <span><label>待填写</label>（{totalCount}）</span>
                  <span onClick={() => this.goHasWrite()}><label>查看已填写</label><img src={images.right} /></span>
                </div>
                {
                  totalCount
                    ? records.map((item, index) => (
                      <div className={styles.records} key={index} onClick={() => this.goCheckout(item)}>
                        <div>
                          {/* <div className={styles.imgUrl} style={{backgroundImage:`url(${item.indexPicUrl})`}}></div>   */}
                          <div className={styles.left}>
                            <h5>{item.qnaireTitle}</h5>
                            <p>「{item.productName}」-{item.traitName}</p>
                            {
                              item.isUnLockFlag === 1
                                ? <span className={`${item.redLightType === 'L' ? styles.status1 : item.redLightType === 'M' ? styles.status2 : styles.status3}`}>
                                  {item.redLightType === 'L' ? '红点' : item.redLightType === 'M' ? '正常' : '亮点'}
                                </span>
                                : <span className={styles.lock}><img src={item.isUnLockFlag === 2 ? images.locking : images.lock} />{item.isUnLockFlag === 2 ? '解锁中...' : '待解锁'}</span>
                            }
                          </div>
                          <div className={styles.goBtn}>去填写</div>
                        </div>
                      </div>
                    ))
                    : <div className={styles.nodata}>
                      <img src={images.nodata3} />
                      <p>恭喜完成所有测评，健康王者成就GET！</p>
                      <p>测评仍在上新，敬请期待！</p>
                    </div>
                }
              </div>
            </div>
            : ''
        }
      </Page>
    )
  }
}

export default Rules
