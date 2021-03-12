import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../style.scss'

import { API, fun, ua } from '@src/common/app'
import like1 from '@static/report4_2/like1.png'
import like1_1 from '@static/report4_2/like1_1.png'
import like1_h from '@static/report4_2/like1-h.png'
import like2 from '@static/report4_2/like2.png'
import like2_1 from '@static/report4_2/like2_1.png'
import like2_h from '@static/report4_2/like2-h.png'
import like3 from '@static/report4_2/like3.png'
import like3_1 from '@static/report4_2/like3_1.png'
import like3_h from '@static/report4_2/like3-h.png'
import substrate from '@static/report4_2/substrate.png'

import images from '../images'
import Points from '@src/components/points'
import PointsToast from '@src/components/pointsToast'
import integrationApi from '@src/common/api/integrationApi'
import {
  reportDetailResultBottomFeedbackView, reportDetailResultBottomFeedbackGoto
} from '../BuriedPoint'
import andall from "@src/common/utils/andall-sdk";
import {Toast} from "antd-mobile";
// import Drops from '@src/components/drops'
const { getParams } = fun

class ResultCard extends Component {
    hasTime = false
    hasSendPoing = true
    static propTypes = {
      first: propTypes.object,
      second: propTypes.object,
      third: propTypes.object,
      username: propTypes.string.isRequired,
    }
    state = {
      likeFlag: null,
      show: true,
      conclusion: [],
      pointValue:'',
      pointValueFlag:true, // +3积分提示flag
      point1:'',
      thanksVisible:false,
      showModal:false,
      showTop:false,
      isCut:true
    }
    componentDidMount() {
      const { first, third, submitConclusion } = this.props
      const conclusion = first ? first.conclusion.split('|') : ''
      this.setState({
        conclusion,
        likeFlag: third ? third.likeFlag : ''
      })
      this.getPointTip()
      submitConclusion(conclusion[1])
      this.setScroll()
      andall.on('closeDialog', (res) => {
        if (res.close) {
          this.setState({
            isCut:false
          })
        } else {
          this.setState({
            isCut:true
          })
        }
      })
    }
    setScroll = () => {
      document.body.onscroll = e => {
        if (e.target.documentElement.scrollTop) {
          if (e.target.documentElement.scrollTop > 667) {
            this.timeModal()
          } else {
            this.setState({
              showModal: false
            })
          }
        } else {
          if (e.target.body.scrollTop > 667) {
            this.timeModal()
          } else {
            this.setState({
              showModal: false
            })
          }
        }
      }
    }
    //  积分提示
    getPointTip=() => {
      integrationApi.getPointTip({
        position:1,
        barCode:getParams().barCode,
        traitId:getParams().traitId,
        noloading:1
      }).then(res => {
        this.setState({ pointValue:res.data ? res.data.point : '' })
      })
    }

    changeCheck = (likeFlag, pageCodeSource) => {
      const { method } = this.props
      if (this.state.likeFlag == null) {
        this.hasTime = true
        this.setState({ likeFlag })
        const { userId } = this.props
        const obj = getParams()
        setTimeout(() => {
          this.setState({
            showModal:false
          })
          method()
        }, 1500)
        API.upgradeReportTraitFeedBackOperation({
          userId,
          linkManId: '',
          traitId: '',
          likeFlag,
          ...obj,
          writeChannel:2, // 送积分
          noloading:1,
          pageCodeSource
        }).then(res => {
          const name = localStorage.getItem('traitName')
          reportDetailResultBottomFeedbackGoto({
            page_code:pageCodeSource,
            feedback_detail:likeFlag === 'Y' ? 'yes' : (likeFlag === 'N' ? 'no' : 'uncertain'),
            report_code:getParams().code,
            trait_code:getParams().traitId,
            trait_name:name,
            trait_type:name.split('|')[1] === '差' ? 'red' : (name.split('|')[1] === '正常' ? 'normal' : 'good'),
            sample_barcode:getParams().barCode,
            sample_linkmanid:getParams().linkManId
          })

          if (res.data) {
            this.setState({
              point1:res.data.pointStatusTipResp ? res.data.pointStatusTipResp.point : '',
              pointValueFlag:false,
              pointVisible:true
            }, () => {
              setTimeout(() => {
                this.setState({
                  pointVisible:false
                })
              }, 2000)
            })
          }
        })
      }
    }
    closeModal = () => {
      this.setState({
        showModal:false
      })
    }
    timeModal = () => {
      const { pointValueFlag } = this.state
      const { isShare } = this.props
      if (this.hasTime) return
      if (pointValueFlag && this.state.likeFlag == null && !isShare) {
        const name = localStorage.getItem('traitName')
        if (this.hasSendPoing) {
          this.hasSendPoing = false
          reportDetailResultBottomFeedbackView({
            report_code:getParams().code,
            trait_code:getParams().traitId,
            trait_name:name,
            trait_type:name.split('|')[1] === '差' ? 'red' : (name.split('|')[1] === '正常' ? 'normal' : 'good'),
            sample_barcode:getParams().barCode,
            sample_linkmanid:getParams().linkManId
          })
        }
        this.setState({
          showModal:true
        })
      }
    }
    render() {
      const { first, second, third, username, headUrl, saveModalName, traitName} = this.props
      const { likeFlag, conclusion, showModal, thanksVisible, isCut, thanksType, pointValue, pointVisible, showTop } = this.state
      return (
        <div className={styles.card}>
          <div className={styles.firstCard}>
            {first && <div className={styles.first}
              style={{ backgroundImage: `linear-gradient(to right, ${first.preColor}, ${first.sufColor})` }}>
              <img src={first.pictureUrl} alt='' />
              <div >{`「${username}」${conclusion[0] && conclusion[0].split('」')[1]}`}</div>
              <div dangerouslySetInnerHTML={{ __html: conclusion[1] }} />
              <img className={styles.substrate} src={substrate} alt='' />
              <div className={styles.userInfo}>
                <img src={images[`head${headUrl}`]} alt='' />
                <div>{username}</div>
              </div>
            </div>
            }
            {second ? <div className={styles.second} dangerouslySetInnerHTML={{ __html: second.conclusion }} />
              : <div className={styles.second} />}

            {third && <div className={styles.divLine} />}

            {third && <div className={styles.thirdArea}>
              {/* <div>{third.title}</div> */}
              <div className={styles.integration}>
                <p className={styles.left}>{third.title}</p>
                {this.state.pointValue && this.state.pointValueFlag ? <Points value={this.state.pointValue} /> : ''}
              </div>
              <div>
                <div onClick={() => this.changeCheck('Y', 'report_detail_result_page_top')}
                  style={likeFlag == 'Y' ? { color: '#6567E5' } : null} >
                  <img src={likeFlag == 'Y' ? like1_h : like1}
                    className={likeFlag == 'Y' ? styles.positive : null} />
                  {third.positiveFeedback || '准'}
                </div>
                <div onClick={() => this.changeCheck('N', 'report_detail_result_page_top')}
                  style={likeFlag == 'N' ? { color: '#6567E5' } : null} >
                  <img src={likeFlag == 'N' ? like2_h : like2}
                    className={likeFlag == 'N' ? styles.reverse : null} />
                  {third.reverseFeedback || '不准'}
                </div>
                <div onClick={() => this.changeCheck('U', 'report_detail_result_page_top')}
                  style={likeFlag == 'U' ? { color: '#6567E5' } : null} >
                  <img src={likeFlag == 'U' ? like3_h : like3}
                    className={likeFlag == 'U' ? styles.uncertain : null} />
                  {third.uncertainFeedback || '不确定'}
                </div>
              </div>
            </div>}
            {(third && isCut) &&
            <div className={`${styles.commonModal} ${styles.dark}  ${(showModal && isCut) ? styles.ModalMoveTop : styles.ModalMoveBottom}`}>
              <div className={styles.thirdArea} style={{ padding:'16px 20px 0', boxSizing:'border-box' }}>
                {/* <div>{third.title}</div> */}
                <div className={styles.integration} style={{alignItems:'inherit'}}>
                  <p className={styles.left} style={{fontSize:'13px',lineHeight: '21px', color:'#fff',paddingRight:"17px",wordBreak: 'break-all'}}>{username}{traitName}{conclusion[1]}，准确吗？</p>
                  {/* <Points value={this.state.pointValue} />  */}
                  {this.state.pointValue ? <Points color value={this.state.pointValue} /> : ''}
                </div>
                <div style={{ padding:'13px 0 16px' }}>
                  <div onClick={() => this.changeCheck('Y', 'report_detail_result_page_bottom')}
                    style={likeFlag == 'Y' ? { color: '#6567E5', background:'#EFEFFC' } : null}>
                    <img src={likeFlag == 'Y' ? like1_h : like1_1}
                      className={likeFlag == 'Y' ? styles.positive : null} />
                    <span>{third.positiveFeedback || '准'}</span>
                  </div>
                  <div onClick={() => this.changeCheck('N', 'report_detail_result_page_bottom')}
                    style={likeFlag == 'N' ? { color: '#6567E5', background:'#EFEFFC' } : null} >
                    <img src={likeFlag == 'N' ? like2_h : like2_1}
                      className={likeFlag == 'N' ? styles.reverse : null} />
                    <span>{third.reverseFeedback || '不准'}</span>
                  </div>
                  <div onClick={() => this.changeCheck('U', 'report_detail_result_page_bottom')}
                    style={likeFlag == 'U' ? { color: '#6567E5', background:'#EFEFFC' } : null} >
                    <img src={likeFlag == 'U' ? like3_h : like3_1}
                      className={likeFlag == 'U' ? styles.uncertain : null} />
                    <span>{third.uncertainFeedback || '不确定'}</span>
                  </div>
                </div>
              </div>
              {/* <div className={styles.modalTips} style={{color:'#CBCBD4'}}>* 每一次点击都是对自己及家人健康的重视</div> */}
            </div>}
          </div>
          <div className={`${styles.thanksModal} ${thanksVisible ? styles.thanksTop : styles.thanksBottom}`}>
            <div className={`${styles.thanksResult} ${thanksType === 'Y' ? styles.thanks1 : (thanksType === 'N' ? styles.thanks2 : styles.thanks3)}`}>{thanksType === 'Y' ? '准确' : (thanksType === 'N' ? '不准' : '不确定')}</div>
            <p className={styles.thanksTips}>感谢反馈，你的每一次点击都是对{(headUrl === 1 || headUrl === 2) ? username : '自己'}健康的重视。</p>
          </div>
          {
            this.state.point1 ? <PointsToast value={this.state.point1} /> : ''
          }

          {/* {
            this.state.point1 ? <Drops /> : ''
          } */}
        </div >
      )
    }
}

export default ResultCard
