import React from 'react'
import { Page } from '@src/components'
import { MyLoader } from '../../lego/MyLoader';
import { API, fun } from '@src/common/app'

import styles from './activityDetail.scss'
import images from '@src/common/utils/images'
import {
    invitationpageView
} from '../BuriedPoint';
const { springFission } = images
const { getParams } = fun

class SpringFission extends React.Component {
    state = {
        inviteList: [],
    }

    componentDidMount() {
        // console.log(this.props)
        // 访问埋点
        invitationpageView({ view_type: getParams().viewType });
        this.getInvitationRecord()
    }
    // 获取邀请记录
    getInvitationRecord = () => {
        API.getSpringInvitationRecord({ "activCode": "fenxiangfanyong" })
            .then(res => {
                console.log(res);
                const { data } = res;
                this.setState({ inviteList: data })
            })
    }
    render() {
        // const { springFission: { data:{loading, noscroll} } } = this.props
        const loading = false
        const { inviteList } = this.state
        return (
            <Page title='邀请成功记录'>
                {loading ? <MyLoader /> :
                    <div className={styles.inviteBox}>
                        <img
                            className={styles.titleImg}
                            src={`${springFission}invitation.png`}></img>
                        {
                            inviteList[0] ? inviteList.map((item, index) => {
                                return (
                                    <div key={index} className={styles.recoding}>
                                        <div className={styles.recodeRow1}>
                                            <div >
                                                <div className={styles.rankingAvatar}>
                                                    <img
                                                        className={styles.img}
                                                        src={item.headImg} />
                                                </div>
                                                <div className={styles.invitedName}>{item.nickName}</div>
                                            </div>
                                            <div>下单时间：{item.orderTime}</div>
                                        </div>
                                        <div className={styles.divLine1}></div>
                                        <div className={styles.recodeRow2}>订单号：{item.orderNo}</div>
                                    </div>
                                )
                            }) : <div className={styles.emptyBox}>
                                    <img src={`${springFission}invEmpty.png`} />
                                    <div>你还没有邀请成功记录哦</div>
                                </div>
                        }
                    </div>}
            </Page>
        )
    }
}

export default SpringFission
