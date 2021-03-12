import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './chooseOne.scss'
import ShowModal from '../components/showModal'
import fun from '@src/common/utils/index'
import images from '../images'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
import UpdataVersion from '@src/components/updataVersion'
import { healthRecordsHomePageView, healthRecordsHomePageGoto } from '../buried-point'
const { isTheAppVersion } = fun
const { getParams } = fun
class ChooseOne extends React.Component {
  state = {
    active:'',
    activeId:'',
    modalFlag:false,
    linkmanList:[],
    needChoose:false,
    relationList:[],
    nolinkman:'',
    invitedFriendList:[],
    allmyFriendList:[],
    onlyOneFalg:false, // 亲友关系邀请
  }

  componentDidMount () {
    if (getParams().closeWebViewFlag) {
      andall.invoke('closeWebViewFlag', {})
    }
    this.checkSelfLinkMan()
  }
  checkSelfLinkMan=() => {
    healthRecordsApi.checkSelfLinkMan({ noloading: 1 }).then(res => {
      if (res) {
        if (res.data.needChoose) {
          this.setState({
            linkmanList:res.data.list,
            needChoose: res.data.needChoose,

          })
        } else {
          this.healthDocHomePage()
        }
      }
    })
  }
  chooseThis=(index, id) => {
    this.setState({
      active:index,
      activeId:id
    })
  }
  modalToggle = (name) => {
    this.setState({
      [name]: !this.state[name],
    })
  }
  confirmBtn=() => {
    if (!this.state.activeId) {
      return
    }
    healthRecordsApi.chooseSelfLinkMan({ linkManId:this.state.activeId }).then(res => {
      if (res.data) {
        this.setState({ needChoose:false })
        this.healthDocHomePage()
      }
    })
  }
  // 主页
  healthDocHomePage=() => {
    healthRecordsHomePageView()
    healthRecordsApi.healthDocHomePage().then(res => {
      if (res) {
        console.log(res.data)
        this.setState({
          relationList:res.data.relationList,
          nolinkman:res.data.relationList.length === 0 ? true : '',
          invitedFriendList:res.data.invitedFriendList,
          allmyFriendList:res.data.allmyFriendList
        })
      }
    })
  }
  goPage1=(id, name) => {
    healthRecordsHomePageGoto({ click_my_linkman:name === '本人' ? 'myself' : 'my_baby' })
    this.props.history.push(`/healthRecords/information?pageType=1&linkManId=${id}`)
  }
  goPage2=(otherUserId, type, id) => {
    healthRecordsHomePageGoto({ click_my_relative_friends:'relationship_name' })
    this.props.history.push(`/healthRecords/information?pageType=2&otherUserId=${otherUserId}&type=${type}&linkManId=${id}`)
  }
  goBinding=() => {
    healthRecordsHomePageGoto({
      viewtype:'bind_button'
    })
    let nextUrl = isTheAppVersion('1.7.1') ? 'andall://andall.com/bind_view' : `${origin}/mkt/binding`
    location.href = nextUrl
  }
  goInvite=(item) => {
    console.log(item)
    if (item.forbidden) {
      this.setState({
        onlyOneFalg:true,
        relationName:item.relationName
      })
      return
    }
    healthRecordsHomePageGoto({ viewtype:'add_relatives_friends' })
    this.props.history.push(`/healthRecords/invite?id=${item.id}`)
  }
  render () {
    const { linkmanList, active, activeId, modalFlag, needChoose, relationList, nolinkman,
      invitedFriendList, allmyFriendList, onlyOneFalg } = this.state
    return (
      <Page title='亲友健康档案'>
        {
          <UpdataVersion
            value={'为保证最好的报告体验，请将APP更新至最新版本后重新进入哦。'}
            version={175}
          />
        }
        {
          needChoose
            ? <div className={styles.chooseOne}>
              <p>小安发现您有多个成年检测人，需要您选择一个作为您本人检测人，请选中一个作为您本人标记。</p>
              <p>未来您仍可在其他地方管理所有检测人。</p>
              <h4>* 选中后您将无法再次修改，务必请您谨慎选择！</h4>
              <div className={styles.choose}>
                {
                  linkmanList.map((item, index) => (
                    <div onClick={() => this.chooseThis(index, item.id)} key={index}>
                      <img src={`${index === active ? images.radio1 : images.radio2}`} />
                      {/* <span className={`${styles.radio} ${index === active ? styles.active : ''}`} ><em /></span> */}
                      <label>{item.userName}</label>
                    </div>
                  ))
                }
              </div>
              <div className={styles.bottomFix}>
                <h5 onClick={() => this.modalToggle('modalFlag')}><label>为什么我必需要指定一个本人检测人？</label><span>?</span></h5>
                <div className={`${styles.confirmBtn} ${!activeId ? styles.grey : ''}`} onClick={this.confirmBtn}>确定</div>
              </div>

              {
                modalFlag
                  ? <ShowModal
                    handleToggle={() => this.modalToggle('modalFlag')}
                    type={1}
                  />
                  : null
              }
            </div>
            : <div className={`${styles.family}`}>
              <div className={styles.mine}>
                <p>我的检测人</p>
                <div onClick={this.goBinding}><img src={images.bind} />绑定采样器</div>
              </div>
              {
                !nolinkman
                  ? <div className={styles.linkman}>
                    {
                      relationList.map((item, index) => (
                        <div onClick={() => this.goPage1(item.id, item.relationName)} key={index}>
                          <img src={`${item.headImgType === 1 ? images.userImg1 : item.headImgType === 2 ? images.userImg2 : item.headImgType === 3 ? images.userImg3 : images.userImg4}`} />
                          <div><span>{item.relationName}</span></div>
                          <p>{item.name.length > 5 ? item.name.substring(0, 5) : item.name}</p>
                          {item.star && <label>&nbsp;</label>}
                        </div>
                      ))
                    }
                  </div>
                  : <div className={styles.nolinkman}>您还没有检测人，先绑定一个采样器吧</div>
              }
              {
                <div>
                  {
                    allmyFriendList.length
                      ? <div className={styles.mine}>
                        <p>我的亲友</p>
                      </div> : ''
                  }
                  {
                    invitedFriendList.length
                      ? <div className={styles.relatives}>
                        {
                          invitedFriendList.map((item, index) => (
                            <div key={index} className={`${styles.box1}`}>
                              <div className={`${styles.first}  ${item.babys && item.babys.length ? styles.hasBottom : ''}`}
                                onClick={() => this.goPage2(item.otherUserId, item.type, item.id)}>
                                <div>
                                  <img src={`${item.headImgType === 1 ? images.userImg1 : item.headImgType === 2 ? images.userImg2 : item.headImgType === 3 ? images.userImg3 : images.userImg4}`} />
                                  <span>{`${item.name}（${item.friendRelationName}）`}</span>
                                </div>
                                {item.star && <label>&nbsp;</label>}
                              </div>
                              {
                                item.babys && item.babys.length && item.babys.map((v, i) => (
                                  <div key={i} className={styles.secord}
                                    onClick={() => this.goPage2(v.otherUserId, v.type, v.id)}>
                                    <div>
                                      <img src={`${v.headImgType === 1 ? images.userImg1 : v.headImgType === 2 ? images.userImg2 : v.headImgType === 3 ? images.userImg3 : images.userImg4}`} />
                                      <span>{`${v.name}（${v.friendRelationName}）`}</span>
                                    </div>
                                    {v.star && <label>&nbsp;</label>}
                                  </div>
                                ))
                              }
                            </div>
                          ))
                        }
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
                              <div key={index} onClick={() => this.goInvite(item)} className={`${item.forbidden && styles.forbidden}`}>
                                <img src={`${item.forbidden ? images.add3 : images.add2}`} />
                                <span>{item.relationName}</span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                      : ''
                  }
                  {
                    onlyOneFalg
                      ? <ShowModal
                        relationName={this.state.relationName}
                        handleToggle={() => this.modalToggle('onlyOneFalg')}
                        type={2}
                      />
                      : null
                  }
                </div>
              }
            </div>
        }
      </Page>
    )
  }
}
ChooseOne.propTypes = {
  history: propTypes.object,
}
export default ChooseOne
