import React from 'react'
import Page from '@src/components/page'
import styles from './family.scss'
import images from '../images'
import { fun } from '@src/common/app'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
const { isTheAppVersion } = fun

class Family extends React.Component {
  state = {
    relationList:[],
    invitedFriendList:[],
    allmyFriendList:[],
  }

  componentDidMount () {
    this.healthDocHomePage()
  }
  healthDocHomePage=() => {
    healthRecordsApi.healthDocHomePage().then(res => {
      if (res) {
        console.log(res.data)
        this.setState({
          relationList:res.data.relationList,
          invitedFriendList:res.data.invitedFriendList,
          allmyFriendList:res.data.allmyFriendList
        })
      }
    })
  }
  goPage=(type, item) => {
    if (type === 1) {
      this.props.history.push(`/healthRecords/information?pageType=${type}&linkManId=${item.id}`)
    } else {
      this.props.history.push(`/healthRecords/information?pageType=${type}&otherUserId=${item.otherUserId}&type=${item.type}&linkManId=${item.id}`)
    }
  }
  goBinding=() => {
    let nextUrl = isTheAppVersion('1.7.1') ? 'andall://andall.com/bind_view' : `${origin}/mkt/binding`
    location.href = nextUrl
  }
  goInvite=(id) => {
    this.props.history.push(`/healthRecords/invite?id=${id}`)
  }
  render () {
    const { relationList, invitedFriendList, allmyFriendList } = this.state
    return (
      <Page title='亲友健康档案'>
        <div className={styles.family}>
          <div className={styles.mine}>
            <p>我的检测人</p>
            <div onClick={this.goBinding}><img src={images.bind} />绑定采样器</div>
          </div>
          <div className={styles.linkman}>
            {
              relationList.map((item, index) => (
                <div onClick={() => this.goPage(1, item)} key={index}>
                  <img src={`${item.headImgType === 1 ? images.userImg1 : item.headImgType === 2 ? images.userImg2 : item.headImgType === 3 ? images.userImg3 : images.userImg4}`} />
                  <span>{item.relationName}</span>
                  <p>{item.name}</p>
                </div>
              ))
            }
          </div>
          {
            invitedFriendList.length
              ? <div>
                <div className={styles.mine}>
                  <p>我的亲友</p>
                </div>
                <div className={styles.relatives}>
                  {
                    invitedFriendList.map((item, index) => (
                      <div key={index} onClick={() => this.goPage(2, item)}>
                        <img src={`${item.headImgType === 1 ? images.userImg1 : item.headImgType === 2 ? images.userImg2 : item.headImgType === 3 ? images.userImg3 : images.userImg4}`} />
                        <span>{`${item.name}（${item.friendRelationName}）`}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              : ''
          }
          {
            allmyFriendList.length
              ? <div className={styles.more}>
                <p>邀请更多亲友加入</p>
                <div className={styles.friends}>
                  {
                    allmyFriendList.map((item, index) => (
                      <div key={index} onClick={() => this.goInvite(item.id)} ><img src={images.add2} />{item.relationName}</div>
                    ))
                  }
                </div>
              </div>
              : ''
          }
        </div>
      </Page>
    )
  }
}

export default Family
