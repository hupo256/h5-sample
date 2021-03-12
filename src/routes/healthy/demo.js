import React from 'react'
import { Page } from '@src/components'
import styles from './checkout.scss'
import images from '../images'
import healthyApi from '@src/common/api/healthyApi'
import Evaluation from '../components/evaluationCard'
import { fun } from '@src/common/app'
import { healthTestDetailView, healthTestDetailGoto } from '../buried-point'
const { getParams } = fun
class CheckOut extends React.Component {
  state = {
    visitFlag:false,
    start: 0,
    end: 0,
    top: 0,
    bottom: 0,
    ease: 0,
    maxHeight: 100,
    setTime: null,
    traitInfo:{},
    isUnLockFlag:+getParams().isUnLockFlag,
    qnaireTitle:'',
    prevFlag:'',
    nextFlag:'',
    index: 0,
    questionnaireInfo:{},
    preEvaluationDto:{}, // 上一题
    sufEvaluationDto:{}, // 下一题
    animationFlag:false,
    loadingFlag:true,
    describeHeight:''
  };

  componentDidMount() {
    let obj = getParams()
    this.evaluationDetails(+obj.isUnLockFlag, obj.productCode, +obj.qnaireId, +obj.traitId)
  }
  evaluationDetails=(isUnLockFlag, productCode, qnaireId, traitId, noloading) => {
    healthyApi.evaluationDetails({
      isUnLockFlag,
      productCode,
      qnaireId,
      traitId,
      linkManId:+getParams().linkManId,
      evaPageType:getParams().evaPageType,
      noloading,
    }).then(({ data }) => {
      if (data) {
        healthTestDetailView({
          sample_linkmanid:+getParams().linkManId,
          trait_code:data.traitCode,
          trait_name:data.traitName,
          unlock_status:isUnLockFlag,
          trait_type:data.redLightType === 'L' ? 'red' : data.redLightType === 'M' ? 'normal' : data.redLightType === 'H' ? 'good' : '',
          submit_history:data.submitHistory,
          submit_status:localStorage.submitFlag === 'true' ? 0 : 1
        })
        console.log(data)
        this.setState({
          loadingFlag:false,
          isUnLockFlag,
          visitFlag:data.visitFlag,
          userName:data.userName,
          headImgType:data.headImgType,
          redLightType:data.redLightType,
          traitInfo:data,
          prevFlag:!!data.preEvaluationDto,
          nextFlag:!!data.sufEvaluationDto,
          questionnaireInfo:data.questionnaireInfo,
          preEvaluationDto:data.preEvaluationDto ? data.preEvaluationDto : {},
          sufEvaluationDto:data.sufEvaluationDto ? data.sufEvaluationDto : {},
          preQnaireTitle:data.preEvaluationDto ? data.preEvaluationDto.qnaireTitle : '',
          nextQnaireTitle:data.sufEvaluationDto ? data.sufEvaluationDto.qnaireTitle : '',
        }, () => {
          console.log(this.state.prevFlag)
          console.log(this.state.nextFlag)
          this.setState({ describeHeight:document.getElementById('describe').offsetHeight >= 84 })
        })
      }
    })
  }
  onTouchStart = e => {
    this.setState({
      start: e.touches[0].clientY,
      ease: 0
    })
    clearTimeout(this.state.setTime)
  }
  onTouchMove = e => {
    const { start, maxHeight } = this.state
    const onPullUpHeight = this.refs.scrollContent.clientHeight
    const documentHeight = document.documentElement.clientHeight
    const documentTop = document.documentElement.scrollTop
    const end = e.touches[0].clientY
    const top = start < end && end - start > documentTop ? end - (start + documentTop) > maxHeight ? maxHeight : end - (start + documentTop) : 0
    const bottom = start > end && start - end > onPullUpHeight - documentHeight - documentTop ? start - end - (onPullUpHeight - documentHeight - documentTop) > maxHeight ? maxHeight : start - end - (onPullUpHeight - documentHeight - documentTop) : 0
    this.setState({
      top,
      bottom,
      end
    })
  }
  onTouchEnd = e => {
    const { top, bottom, maxHeight, prevFlag, nextFlag, preEvaluationDto, sufEvaluationDto } = this.state
    if (top >= maxHeight && prevFlag) {
      console.log('上拉======')
      this.setState({
        loading: true,
        isUnLockFlag:preEvaluationDto.isUnLockFlag,
        setTime: setTimeout(() => {
          this.init()
        }, 1000)
      }, () => {
        this.evaluationDetails(preEvaluationDto.isUnLockFlag, preEvaluationDto.productCode, preEvaluationDto.qnaireId, preEvaluationDto.traitId, 1)
      })
    } else if (bottom >= maxHeight && nextFlag) {
      console.log('下拉======')
      this.setState({
        loading: true,
        isUnLockFlag:sufEvaluationDto.isUnLockFlag,
        setTime: setTimeout(() => {
          this.init()
        }, 1000)
      }, () => {
        this.evaluationDetails(sufEvaluationDto.isUnLockFlag, sufEvaluationDto.productCode, sufEvaluationDto.qnaireId, sufEvaluationDto.traitId, 1)
      })
    } else { // 还原，给个缓动动画，之后还原
      this.setState({
        top: 0,
        bottom: 0,
        ease: 0.5,
        setTime: setTimeout(() => {
          this.init()
        }, 500)
      })
    }
  }

  // settimeout与init结合为模拟数据加载
  init = () => {
    this.setState({
      start: 0,
      end: 0,
      top: 0,
      bottom: 0,
      ease: 0,
      loading: false,
    })
  }
  closeBtn=() => {
    this.setState({ visitFlag:1 })
  }
  // 全部测评/去查看报告详情/去解锁/去购买
  goPage=(page) => {
    let { traitInfo, isUnLockFlag } = this.state
    healthTestDetailGoto({
      Btn_name:page === 1 ? 'health_test_go' : 'trait_card',
      sample_linkmanid:+getParams().linkManId,
      trait_code:traitInfo.traitCode,
      trait_name:traitInfo.traitName,
      unlock_status:isUnLockFlag,
      trait_type:traitInfo.redLightType === 'L' ? 'red' : traitInfo.redLightType === 'M' ? 'normal' : traitInfo.redLightType === 'H' ? 'good' : '',
      submit_history:traitInfo.submitHistory,
      submit_status:localStorage.submitFlag === 'true' ? 0 : 1
    })
    if (page === 4) {
      location.href = 'andall://andall.com/buy_tab'
    }
    if (page === 3) {
      location.href = `andall://andall.com/product_detail?productId=${traitInfo.productId}&newProductDetailType=5`
    }
    if (page === 1) {
      this.props.history.push(`/healthy/assessment?linkManId=${getParams().linkManId}`)
    }
    if (page === 2) {
      this.props.history.push(`/report4_2?linkManId=${getParams().linkManId}&id=${traitInfo.productId}&code=${traitInfo.productCode}&traitId=${traitInfo.traitId}&barCode=${traitInfo.barCode}&reportType=${traitInfo.reportType}&exampleFlag=${traitInfo.exampleFlag}`)
    }
  }
  render() {
    const { loadingFlag, userName, headImgType, visitFlag, top, bottom, ease, loading, maxHeight, traitInfo, prevFlag, nextFlag,
      redLightType, preQnaireTitle, nextQnaireTitle, isUnLockFlag, describeHeight } = this.state
    // 页面结构需要注意超出部分显示，最外部div需要超出部分隐藏且不能设置高度
    return (
      <Page title='健康测评'>
        {
          !loadingFlag
            ? <div style={{ overflow: 'hidden' }} className={`${visitFlag === 0 && styles.noscroll}`}>
              {
                visitFlag === 0
                  ? <div className={styles.firstTime}>
                    <img src={images.top} className={styles.top} />
                    <img src={images.bottom} className={styles.bottom} />
                    <p>页面顶部下拉或底部上拉释放，</p>
                    <p>均可快捷进入其它测评哦～</p>
                    <div onClick={this.closeBtn}>我知道了</div>
                  </div>
                  : ''
              }
              {loading ? (
                <div style={{ position: 'absolute', zIndex: 10, width: '100%', height: '100%', background: 'rgba(0,0,0,.7)', color: '#fff', textAlign: 'center' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize:'16px' }}>loading...</div>
                </div>
              ) : (
                <div ref='scrollContent' style={{ minHeight: '100vh', overflow: 'visible', position: 'relative', transform: 'translate3d(0px,' + (top || -bottom) + 'px,0px)', transition: 'all ' + ease + 's ease' }}
                  onTouchMove={this.onTouchMove} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
                  <div style={{ width: '100%', height: maxHeight, textAlign: 'center', lineHeight: maxHeight + 'px', background: '#eee', position: 'absolute', top: '-' + maxHeight + 'px' }}>
                    {prevFlag ? (
                      <div style={{ position: 'relative', margin: 'auto', top: '50%', transform: 'translate(0, -50%)', lineHeight: 'normal' }}>
                        <div>释放打开上一测评</div>
                        <div className={styles.preQnaireTitle}>{preQnaireTitle}</div>
                      </div>
                    ) : '暂无更多测评了'}
                  </div>
                  <div className={styles.checkout}>
                    <div className={styles.header}>
                      <div className={styles.left}>
                        <img src={`${headImgType === 1 ? images.userImg1 : headImgType === 2 ? images.userImg2 : headImgType === 3 ? images.userImg3 : images.userImg4}`} />
                        <span className={styles.bold}>{userName}</span>
                        <span>{`${headImgType > 2 ? '（成人）' : '（儿童）'}`}</span>
                      </div>
                      <div className={styles.right} onClick={() => this.goPage(1)}>
                        <span>全部测评</span>
                        <img src={images.right} />
                      </div>
                    </div>
                    <div className={styles.title}>{traitInfo.qnaireTitle}</div>
                    {
                      traitInfo.productName
                        ? isUnLockFlag === 1
                          ? <div onClick={() => this.goPage(2)}
                            className={`${styles.status} ${redLightType === 'L' ? styles.red : redLightType === 'M' ? styles.middle : redLightType === 'H' ? styles.green : ''}`}>
                            <img src={redLightType === 'L' ? images.red : redLightType === 'M' ? images.middle : redLightType === 'H' ? images.green : ''} />
                            <span>「{traitInfo.productName}」-{traitInfo.traitName}</span>
                            <img src={images.right} />
                          </div>
                          : <div className={`${styles.status} ${styles.status2}`}>
                            <img src={images.lock} />
                            <span>「{traitInfo.productName}」-{traitInfo.traitName}</span>
                            {
                              isUnLockFlag === 2
                                ? <div className={styles.locking}>解锁中...</div>
                                : traitInfo.isOnlyNonGeneFlag === 1
                                  ? <div className={styles.goLock} onClick={() => this.goPage(4)}>去购买</div>
                                  : <div className={styles.goLock} onClick={() => this.goPage(3)}>去解锁</div>
                            }
                          </div>
                        : ''
                    }
                    {
                      traitInfo.questionnaireInfo
                        ? <div className={`${styles.describe} ${describeHeight ? styles.describe2 : ''}`} id='describe'>
                          <div dangerouslySetInnerHTML={{ __html: traitInfo.questionnaireInfo.questionaireDesc }} />
                        </div> : ''
                    }
                  </div>
                  <div style={{ width: '100%', height: maxHeight, textAlign: 'center', lineHeight: maxHeight + 'px', background: '#eee', position: 'absolute', bottom: '-' + maxHeight + 'px' }}>
                    {nextFlag ? (
                      <div style={{ position: 'relative', margin: 'auto', top: '50%', transform: 'translate(0, -50%)', lineHeight: 'normal' }}>
                        <div>释放打开下一测评</div>
                        <div className={styles.nextQnaireTitle}>{nextQnaireTitle}</div>
                      </div>
                    ) : '暂无更多测评了'}
                  </div>
                  {
                    traitInfo.questionnaireInfo && <Evaluation
                      data={traitInfo} />
                  }

                </div>
              )}
            </div>
            : ''
        }
      </Page>
    )
  }
}
export default CheckOut
