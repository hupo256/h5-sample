import React from 'react'
import propTypes from 'prop-types'
import { filter, API, ua } from '@src/common/app'

import { trackPointYmlxBaby199bannerGoto, trackPointYmlxMan199bannerGoto, trackPointYmlxWoman199bannerGoto } from '@src/routes/mkt/yunchan/buried-point'
import BannerRun from './bannerRun'
import styles from '../sampling'
import img1 from '@static/sampling/1.png'
import img2 from '@static/sampling/2.png'
import img3 from '@static/sampling/3.png'
import img4 from '@static/sampling/4.png'
import img5 from '@static/sampling/5.png'
import img6 from '@static/sampling/6.png'
import img7 from '@static/sampling/7.png'
import img8 from '@static/sampling/8.png'
import img9 from '@static/sampling/9.png'
import img10 from '@static/sampling/10.png'
import img11 from '@static/sampling/11.png'
import point from '@src/common/utils/point'
const { allPointTrack } = point
const { samplingNewStatus } = filter
class Info extends React.Component {
  static propTypes = {
    order: propTypes.string,
    status: propTypes.array,
    data: propTypes.object
  }
  state = {
    isAndall: ua.isAndall(),
    indexAd: 0,
    children:true,
    img:[
      img1,img2,img3,img4,img5,img6,img7,img8,img9,img10,img11
    ],
  }
  btnName = [
    'tq_video',
    'kz_video',
    'zj_video',
    'xr_video',
    'jc_video'
  ]

  getIDandType = (productCode) => {
    const { isAndall } = this.state
    if (!isAndall) return
    if (productCode === 'BBY') {
      trackPointYmlxBaby199bannerGoto()
      andall.invoke('goProductDetail', { productType:1, productId:1 })
      return
    } else if (productCode === 'AAM') {
      trackPointYmlxMan199bannerGoto()
    } else if (productCode === 'AAF') {
      trackPointYmlxWoman199bannerGoto()
    }

    API.getBannerProductInfoByProductCode({ productCode }).then(res => {
      const { code, data } = res
      if (code) return
      const obj = {
        productType: 2,
        productId: data.id
      }
      andall.invoke('goProductDetail', obj)
    })
  }

  playVideo = (index) => {
    if (index > 3 && index < 9) {
      console.log(index)
      this.setState({
        videoUrl:`http://static.andall.com/shop/video/samplingStatus/${index - 3}.mp4`,
        videoVisible:true
      }, () => {
        const vi = document.getElementById('vi')
        vi.play()
        vi.addEventListener('pause', () => {
          this.setState({
            videoUrl:null,
            videoVisible:false
          })
        })
        let obj = {
          eventName:'sample_status_goto',
          pointParams:{
            button_name:this.btnName[index - 4]
          }
        }
        allPointTrack(obj)
      })
    }
  }

  closeVideo = () => {
    const vi = document.getElementById('vi')
    vi.pause()
    this.setState({
      videoUrl:'',
      videoVisible:false
    })
  }

  render () {
    const { order, status = [], data = {} } = this.props
    const { children, img, videoType, videoUrl, videoVisible } = this.state
    const len = status.filter(item => item)
    return (
      <div className={styles.boxs}>
        <p className={styles.infoTitle}>{data.title}</p>
        <p className={styles.subTitle}>{data.subTitle}</p>
        <div className={`fz14 ${styles.infoBox}`}>
          <div className={`white ${styles.infoTime}`} >
            <div>
              <div>样本编号:</div>
              <div>{order}</div>
            </div>
            <div>
              <div>产品名称:</div>
              <div>{data.productName}</div>
            </div>
            <div>
              <div>客服电话:</div>
              <div>400-682-2288</div>
            </div>
            {/*<p>样本号：{order}</p>*/}
            {/*<p>检测人：{data.linkManName}</p>*/}
            {/*<p>性别：{data.sex === 'female' ? '女' : '男'}</p>*/}
            {/*<p>出生日期：{data.birthDay}</p>*/}
            {/*<p className={styles.gray}>实验室收到样本起，约2-3周后即可查看检测报告，节假日顺延。</p>*/}
            {/*{*/}
            {/*  data.switchDesc*/}
            {/*    ? <span className={styles.desc}>{data.switchDesc}</span>*/}
            {/*    : ''*/}
            {/*}*/}
          </div>
        </div>
        {/*<p className={styles.title}>状态跟踪</p>*/}
        <div className={'white ' + styles.logisticsStatus}>
          {
            len.length ? (
              <ul>
                {
                  samplingNewStatus.map((item, i) => (
                    <li key={i} className={len[len.length - 1].indexFlag >= i ? styles.activeli : ''}>
                      <div className={styles.statusVideo} onClick={() => this.playVideo(i)}>
                        <img src={img[i]} />
                        {(i > 3 && i < 9) && <div className={styles.playBtn}></div> }
                      </div>
                      <div className={styles.statusContent}>
                        <span className='fz14'>{item.aliasName}</span>
                        {
                          i < 10 &&
                          <p className={len[len.length - 1].indexFlag >= i ? 'fz10' : ''} style={{paddingTop:'8px',fontSize:'12px',color:`${len[len.length - 1].indexFlag >= i ?'#3C3FC9':'rgba(56,57,91,.7)'}`}}>
                            {len[len.length - 1].indexFlag >= i
                              ? (status[i] ? status[i].createTime : '')
                              : i !== 2?`预计耗时${( i === 3 || i === 4) ? '2':'1'}天`:''}
                          </p>
                        }

                      </div>
                    </li>
                  ))
                }
              </ul>
            ) : <div className={styles.noData}>暂无状态更新</div>
          }
        </div>
        <div className={styles.videoWrap} style={{ display:`${videoVisible ? 'block' : 'none'}` }} >
          <div className={styles.video}>
            <video controls src={videoUrl} id='vi' />
          </div>
          {!ua.isIos() && <div className={styles.closeBtn} onClick={() => this.closeVideo()}></div>}
        </div>
        {data && data.bannerResp && data.bannerResp.length > 0 &&
          <BannerRun banArr={data.bannerResp} viewType='sample_status_page_banner_goto' />
        }
      </div>
    )
  }
}
export default Info
