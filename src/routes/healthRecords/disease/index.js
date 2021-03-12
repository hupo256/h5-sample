import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import images from '../images'
import { fun, ua } from '@src/common/app'
import { Picker, Toast } from 'antd-mobile'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
import NavigationBar from '@src/components/navigationBar'
import styles from './disease.scss'
import BottomBtn from '../components/bottomBtn'
import ShowModal from '../components/showModal'
import { diseaseListView, diseaseRecordGoto } from '../buried-point'
const { getParams } = fun
const { isAndall } = ua

class Disease extends React.Component {
  state = {
    loading:false,
    linkManId:getParams().linkManId,
    pageType:+getParams().type,
    sickList:[],
    selectSick: [],
    pickerPop:'',
    sValue: [],
    yearAndMonth : [],
    allFamilyFriends:[],
    selectFamily:[],
    userName:'',
    isFixedTop:false,
    modalFlag:'',
    chooseList:[]
  }
  componentDidMount () {
    let { pageType } = this.state
    this.addEventListenerSroll()
    if (pageType === 2) {
      this.queryAllFamilyFriends()
    }
    this.querySickList()
    let _years = []
    let _month = []
    let { yearAndMonth } = this.state
    for (let i = 0; i < 121; i++) {
      _years.push(
        {
          label: i + '岁',
          value:  i + '岁',
        }
      )
    }
    for (let i = 1; i < 13; i++) {
      _month.push(
        {
          label: i + '个月',
          value: i + '个月',
        }
      )
    }
    yearAndMonth[0] = _years
    yearAndMonth[1] = _month
    this.setState({ yearAndMonth })
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.onWindowScroll)
  }
  addEventListenerSroll = () => {
    window.addEventListener('scroll', this.onWindowScroll)
  }
  onWindowScroll = () => {
    let _top = document.getElementById('scrollBox').offsetTop
    let h = document.body.scrollTop || document.documentElement.scrollTop
    this.setState({
      isFixedTop: h > _top - (isAndall() && document.getElementById('titleBar').offsetHeight)
    }, () => {
      if (this.state.isFixedTop) {
        document.getElementById('fixBox').style.top = isAndall() && document.getElementById('titleBar').offsetHeight - 1 + 'px'
      }
    })
  }
  querySickList=() => {
    let { linkManId, pageType } = this.state
    healthRecordsApi.querySickList({
      linkManId,
      type:pageType
    }).then(res => {
      if (res) {
        diseaseListView({
          sample_linkmanid:linkManId,
          disease_type:pageType === 1 ? 'personal' : 'family'
        })
        console.log(res.data.sickList)
        let { selectSick } = this.state
        let { headType, yearOfLinkMan, monthOfLinkMan, sickList, userName } = res.data
        sickList.map((item, index) => {
          item.selectFlag === 1 && selectSick.push(item.sickId)
        })
        this.setState({
          headType,
          yearOfLinkMan,
          monthOfLinkMan,
          sickList,
          selectSick,
          userName:userName && userName.length > 4 ? userName.substring(0, 4) : userName
        }, () => {
          localStorage.setItem('yearOfLinkMan', yearOfLinkMan)
          localStorage.setItem('monthOfLinkMan', monthOfLinkMan)
          this.setState({ thisResult:this.getThisParams() })
        })
      }
    })
  }
  getThisParams=() => {
    const { linkManId, pageType, selectSick, sickList } = this.state
    let _personalSickList = []
    let _familySickList = []
    console.log(selectSick)
    sickList.map((item, index) => {
      selectSick.map((v, i) => {
        if (v === item.sickId) {
          if (pageType === 1) {
            _personalSickList.push({
              sickId:item.sickId,
              yearOfFirstAppearance:item.yearOfFirstAppearance,
              monthOfFirstAppearance:item.monthOfFirstAppearance
            })
          } else {
            _familySickList.push({
              sickId:item.sickId,
              friendRelationIds:item.friendRelationIds
            })
          }
        }
      })
    })
    let params = {
      linkManId,
      type:pageType,
    }
    pageType === 1 ? params.personalSickList = _personalSickList : params.familySickList = _familySickList
    return JSON.stringify(params)
  }
  queryAllFamilyFriends=() => {
    healthRecordsApi.queryAllFamilyFriends().then(res => {
      if (res) {
        this.setState({ allFamilyFriends:res.data.allFriendRelation })
      }
    })
  }
  goBack=() => {
    if (this.getThisParams() !== this.state.thisResult) {
      this.setState({ modalFlag:true })
    } else {
      this.confirmGoBack()
    }
  }
  confirmGoBack=() => {
    isAndall()
      ? andall.invoke('back')
      : window.history.go(-1)
  }
  handleCheck = (name, index) => {
    let { sickList, selectSick } = this.state
    this.setState(({ selectSick }) => ({
      selectSick: selectSick.includes(name)
        ? selectSick.filter(item => item !== name)
        : [...selectSick, name],
    }))
    !selectSick.includes(name) && this.showPicker(sickList.filter(item => item.sickId === name)[0], index)
  }
  showPicker=(item, index) => {
    console.log(item, index)
    let { pageType, yearOfLinkMan, monthOfLinkMan } = this.state
    this.setState({
      pickerPop:pageType === 1 ? 'age' : 'familys',
      thisIndex:index,
      sValue:[item.yearOfFirstAppearance ? item.yearOfFirstAppearance + '岁' : yearOfLinkMan + '岁', +item.monthOfFirstAppearance ? item.monthOfFirstAppearance + '个月' : monthOfLinkMan + '个月'],
      chooseList:pageType === 2 ? [...item.friendRelationIds] : []
    }, () => {
      console.log(this.state.thisIndex)
    })
  }
  hidePicker=() => {
    this.setState({ pickerPop:false })
  }
  pickerOk = (value) => {
    console.log(value)
    const { sickList, thisIndex, pageType, chooseList } = this.state
    if (pageType === 1) {
      sickList[thisIndex].yearOfFirstAppearance = value[0].substr(0, value[0].length - 1)
      sickList[thisIndex].monthOfFirstAppearance = value[1].substr(0, value[1].length - 2)
    } else {
      sickList[thisIndex].friendRelationIds = [...chooseList]
    }
    this.setState({ sickList }, () => {
      console.log(this.state.sickList)
    })
    this.hidePicker()
  }
  handleSaveBtn=() => {
    let { pageType, linkManId, selectSick } = this.state
    // console.log(this.getThisParams())
    // console.log(selectSick)
    healthRecordsApi.recordSickInfo(JSON.parse(this.getThisParams())).then(res => {
      if (res) {
        diseaseRecordGoto({
          sample_linkmanid:linkManId,
          disease_type:pageType === 1 ? 'personal' : 'family',
          disease_num:selectSick.length
        })
        this.props.history.push(`/healthRecords/diseaseRecords?hideTitleBar=1&tab=${pageType}&linkManId=${linkManId}`)
      }
    })
  }
  chooseFamily=(val) => {
    let { chooseList } = this.state
    if (chooseList.indexOf(val.id) === -1) {
      chooseList.push(val.id)
    } else {
      chooseList.splice(chooseList.indexOf(val.id), 1)
    }
    this.setState({ chooseList })
  }
  modalToggle = (name) => {
    this.setState({
      [name]: !this.state[name],
    })
  }
  render () {
    const { loading, pageType, headType, sickList, selectSick, isFixedTop, yearAndMonth, pickerPop, allFamilyFriends, chooseList, userName, modalFlag } = this.state
    return (
      <Page title={`${userName}的${pageType === 1 ? '个人' : '家族'}疾病史`}>
        {
          !loading
            ? <div className={`${styles.disease}`} id='top'>
              <NavigationBar title={`${userName}的${pageType === 1 ? '个人' : '家族'}疾病史`} type='black'
                background={`${pageType === 1 ? '#D7D7FD' : '#D7EDFE'}`} back={() => this.goBack()} />
              <div className={`${styles.header} ${pageType === 2 ? styles.header2 : ''} `}>
                <img src={`${headType === 1 ? images.userImg1 : headType === 2 ? images.userImg2 : headType === 3 ? images.userImg3 : images.userImg4}`} />
                <div>
                  <div>{`请勾选${userName}${pageType === 1 ? '疾病史和首次出现的年龄' : '家族疾病及患病亲属'}`}</div>
                  <div>完善疾病信息，获得个性化的健康服务</div>
                </div>
              </div>
              <div className={`${styles.history}`} id='scrollBox'>
                <div className={`${styles.fixBox} ${isFixedTop && styles.fixTop}`}
                  style={{ background:isFixedTop && (pageType === 1 ? '#D7D7FD' : '#D7EDFE') }} id='fixBox'>
                  <p />
                </div>
                <div className={`${styles.chooseThis} `} >
                  {sickList.map((item, index) => (
                    <div key={index} className={`${styles.chooseSick}`}>
                      <div className={styles.thisSick} onClick={() => this.handleCheck(item.sickId, index)}>
                        <img src={`${selectSick.includes(item.sickId) ? images.choosed : images.choose}`} />
                        <span>{item.sickName}</span>
                      </div>
                      {
                        selectSick.includes(item.sickId)
                          ? <div className={styles.firstTime} onClick={() => this.showPicker(item, index)}>
                            <label>{pageType === 1 ? '首次出现的年龄' : '患病家属'}</label>
                            {
                              pageType === 1
                                ? <span className={`${styles.chooseSpan} ${item.yearOfFirstAppearance && item.monthOfFirstAppearance ? styles.black : ''}`}>
                                  {
                                    item.yearOfFirstAppearance && item.monthOfFirstAppearance
                                      ? `${item.yearOfFirstAppearance}岁${item.monthOfFirstAppearance}个月`
                                      : '请选择'
                                  }
                                </span>
                                : <span className={`${styles.chooseSpan} ${item.friendRelationIds.length ? styles.black : ''} ${item.friendRelationIds.length > 3 ? styles.left : ''}  ${styles.chooseSpan2} `}>
                                  {
                                    item.friendRelationIds.length && allFamilyFriends.length
                                      ? item.friendRelationIds.map((v, i) => (
                                        `${allFamilyFriends.filter(item => item.id === v)[0].relationName}${i < item.friendRelationIds.length - 1 ? '、' : ''}`
                                      ))
                                      : '请选择'
                                  }
                                </span>
                            }
                          </div>
                          : ''
                      }
                    </div>
                  ))}
                </div>
                {
                  sickList.length
                    ? <BottomBtn handleSave={this.handleSaveBtn} text={!selectSick.length ? '以上疾病全无' : '确认保存'} type={selectSick.length ? 1 : 2} />
                    : ''
                }
              </div>
            </div>
            : ''
        }
        {
          <Picker
            visible={pickerPop === 'age'}
            data={yearAndMonth}
            title='请选择首次出现的年龄'
            cascade={false}
            extra='请选择(可选)'
            value={this.state.sValue}
            onOk={(e) => this.pickerOk(e, 'age')}
            onDismiss={this.hidePicker}
          />
        }
        {
          pickerPop === 'familys'
            ? <div className={styles.mask}>
              <div className={styles.allFamily}>
                <div className={styles.top}>
                  <span onClick={this.hidePicker}>取消</span>
                  <span>请选择患病家属</span>
                  <span onClick={this.pickerOk}>完成</span>
                </div>
                <div className={styles.familys}>
                  {
                    allFamilyFriends.map((item, index) => (
                      <div key={index} onClick={() => this.chooseFamily(item)}
                        className={`${chooseList.indexOf(item.id) > -1 ? styles.blue : ''}`}>
                        <span>{item.relationName}</span>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            : ''
        }
        {
          modalFlag
            ? <ShowModal
              handleToggle={() => this.modalToggle('modalFlag')}
              confirmBtn={() => this.confirmGoBack()}
              type={5}
            />
            : null
        }
      </Page>
    )
  }
}
Disease.propTypes = {
  history: propTypes.object,
}
export default Disease
