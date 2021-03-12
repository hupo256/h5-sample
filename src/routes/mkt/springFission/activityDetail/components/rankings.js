import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../activityDetail.scss'
import images from '@src/common/utils/images'

const { springFission } = images

class Rankings extends Component {
    static propTypes = {
        userRank: propTypes.object.isRequired,
        rankingList: propTypes.array.isRequired
    }

    render() {
        const { userRank, rankingList } = this.props
        return (
            <div className={styles.rankings}>
                <div className={styles.header}>
                    <div className={styles.headerRanking}>排名</div>
                    <div className={styles.headerAvatar}>头像</div>
                    <div className={styles.headerPhone}>用户信息</div>
                    <div>邀请人数</div>
                </div>
                <div className={styles.rankingBody}>
                    {rankingList[0] && <div className={userRank.ranking == 1 ? styles.rankingFirstPad : styles.rankingPad}></div>}
                    {
                        rankingList ? rankingList.map((item, index) => {
                            return (
                                <div key={index}>
                                    <div className={styles.rankingRow}
                                        style={item.userId == userRank.userId ? { "backgroundColor": "#eff1fb" } : null}>
                                        <div>{item.ranking}</div>
                                        <div className={styles.rankingAvatar}>
                                            <img className={styles.img} src={item.headImg || `${springFission}avatar.png`} />
                                            {
                                                index < 3 ?
                                                    <div className={styles.caps}>
                                                        <img src={`${springFission}cap${index}.png`}
                                                        />
                                                    </div> : null
                                            }
                                        </div>
                                        {item.userId == userRank.userId ?
                                            <div>我</div> : <div>{item.nickName||item.phone}</div>
                                        }
                                        <div>{item.invitedNum}</div>
                                    </div>
                                    {
                                        index < (rankingList.length - 1) ?
                                            <div className={styles.divLine}></div> : null
                                    }
                                </div>
                            )
                        }) : null
                    }
                    {
                        ((userRank.ranking > rankingList.length) || !userRank.ranking) ?
                            <div>
                                <div className={styles.divLine}></div>
                                <div className={styles.userRow} >
                                    <div>{userRank.ranking || "暂无"}</div>
                                    <div className={styles.rankingAvatar}>
                                        <img className={styles.img} src={userRank.headImg || `${springFission}avatar.png`} />
                                    </div>
                                    <div>我</div>
                                    <div>{userRank.invitedNum}</div>
                                </div>
                            </div> : null
                    }

                </div>
            </div>
        )
    }
}

export default Rankings
