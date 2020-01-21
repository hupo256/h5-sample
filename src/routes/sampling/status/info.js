import React from 'react'
import propTypes from 'prop-types'
import { filter, API, ua } from '@src/common/app'

import { trackPointYmlxBaby199bannerGoto, trackPointYmlxMan199bannerGoto, trackPointYmlxWoman199bannerGoto } from '@src/routes/mkt/yunchan/buried-point'
import BannerRun from './bannerRun'
import styles from '../sampling'
import bannerWomen from '@static/bWomen.png'
import bannerBaby from '@static/bBaby.png'
import bannerMan from '@static/bMan.png'

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
  }

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
      console.log(res)
      const { code, data } = res
      if (code) return
      const obj = {
        productType: 2,
        productId: data.id
      }
      andall.invoke('goProductDetail', obj)
    })
  }

  render () {
    const { order, status = [], data = {} } = this.props
    const len = status.filter(item => item)
    return (
      <div className={styles.boxs}>
        <p className={styles.title}>样本信息</p>
        <div className={`fz14 ${styles.box}`}>
          <div className={`white ${styles.time}`} >
            <p>样本号：{order}</p>
            <p>检测人：{data.linkManName}</p>
            <p>性别：{data.sex === 'female' ? '女' : '男'}</p>
            <p>出生日期：{data.birthDay}</p>
            <p>客服电话：<a className='blue' href='tel:400-682-2288'>400-682-2288</a></p>
            <p className={styles.gray}>实验室收到样本起，约2-3周后即可查看检测报告，节假日顺延。</p>
            {
              data.switchDesc
                ? <span className={styles.desc}>{data.switchDesc}</span>
                : ''
            }
          </div>
        </div>
        <p className={styles.title}>状态跟踪</p>
        <div className={'white ' + styles.logisticsStatus}>
          {
            len.length ? (
              <ul>
                {
                  samplingNewStatus.map((item, i) => (
                    <li key={i} className={len[len.length - 1].indexFlag >= i ? styles.activeli : ''}>
                      <div>
                        <span className='fz14'>{item.aliasName}</span>
                        <p className='fz10'>
                          {len[len.length - 1].indexFlag >= i
                            ? (status[i] ? status[i].createTime : '')
                            : ''}
                        </p>
                      </div>
                    </li>
                  ))
                }
              </ul>
            ) : <div className={styles.noData}>暂无状态更新</div>
          }
        </div>

        {data && data.bannerResp && data.bannerResp.length > 0 &&
          <BannerRun banArr={data.bannerResp} viewType='sample_state_bottom' />
        }
      </div>
    )
  }
}
export default Info
