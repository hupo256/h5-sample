import React from 'react'
import Page from '@src/components/page'
import images from '../images'
import { fun, ua } from '@src/common/app'
import { Picker, Toast } from 'antd-mobile'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
import NavigationBar from '@src/components/navigationBar'
import styles from '../disease/disease.scss'
import BottomBtn from '../components/bottomBtn'
import ShowModal from '../components/showModal'
import { diseaseProfileView, diseaseProfilePageGoto } from '../buried-point'
const { getParams } = fun
const { isAndall } = ua

class DiseaseRecords extends React.Component {
  state = {
    loading:false,
    linkManId:getParams().linkManId,
    tabs:['个人疾病史', '家族疾病史'],
    allFamilyFriends:[],
    activeKey:+getParams().tab - 1,
    sickList:[],
    sValue:[],
    pickerPop:'',
    yearAndMonth : [],
    thisIndex:'',
    modalFlag:false,
    personalFlag:'',
    familyFlag:'',
    userName:'',
    chooseList:[]
  }
  componentDidMount () {
    this.queryhasSelectSickList()
    this.queryAllFamilyFriends()
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
  queryhasSelectSickList=(type) => {
    let { linkManId, activeKey } = this.state
    healthRecordsApi.queryhasSelectSickList({
      linkManId,
      type:activeKey + 1,
      noloading:type ? 1 : ''
    }).then(res => {
      if (res) {
        let { personalFlag, familyFlag, personalSickList, familySickList, userName } = res.data
        type && Toast.info(type === 1 ? '修改成功' : '删除成功', 1)
        if (!type) {
          diseaseProfileView({
            sample_linkmanid:linkManId,
            disease_type:activeKey === 0 ? 'personal' : 'family',
            record_status:(activeKey === 0 && personalFlag) || (activeKey === 1 && familyFlag) ? 1 : 0
          })
        }
        this.setState({
          personalFlag,
          familyFlag,
          sickList:activeKey === 0 ? personalSickList : familySickList,
          userName,
          modalFlag:false
        }, () => {
          console.log(this.state.sickList)
        })
      }
    })
  }
  queryAllFamilyFriends=() => {
    healthRecordsApi.queryAllFamilyFriends().then(res => {
      if (res) {
        this.setState({ allFamilyFriends:res.data.allFriendRelation })
      }
    })
  }
  goBack=() => {
    isAndall() ? andall.invoke('back') : window.history.go(-1)
  }
  handleCheck = (name) => {
    this.setState(({ selectSick }) => ({
      selectSick: selectSick.includes(name)
        ? selectSick.filter(item => item !== name)
        : [...selectSick, name],
    }))
  }
  showPicker=(item, index) => {
    console.log(item)
    let { activeKey } = this.state
    this.setState({
      pickerPop:activeKey === 0 ? 'age' : 'familys',
      thisIndex:index,
      sValue:[item.yearOfFirstAppearance ? item.yearOfFirstAppearance + '岁' : localStorage.yearOfLinkMan + '岁', +item.monthOfFirstAppearance ? item.monthOfFirstAppearance + '个月' : localStorage.monthOfLinkMan + '个月'],
      chooseList:activeKey === 1 ? [...item.friendRelationIds] : []
    }, () => {
      console.log(this.state.thisIndex)
    })
  }
  hidePicker=() => {
    this.setState({ pickerPop:'' })
  }
  pickerOk = (value) => {
    const { linkManId, sickList, thisIndex, activeKey, chooseList } = this.state
    console.log(sickList)
    console.log(chooseList)
    let params = {
      linkManId,
      type:activeKey + 1,
      sickId:sickList[thisIndex].sickId,
      noloading:1
    }
    if (activeKey === 0) {
      params.yearOfFirstAppearance = value[0].substr(0, value[0].length - 1)
      params.monthOfFirstAppearance = value[1].substr(0, value[1].length - 2)
    } else {
      params.friendRelationIds = chooseList
    }
    console.log(params)
    healthRecordsApi.updSick(params).then(res => {
      console.log(res)
      if (res.data) {
        this.queryhasSelectSickList(1)
      }
    })
    this.hidePicker()
  }
  changeTabs=(index) => {
    this.setState({
      activeKey:index,
      sickList:[]
    }, () => {
      this.queryhasSelectSickList()
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
  delThis=(sickId) => {
    this.setState({
      modalFlag:true,
      thisSickId:sickId
    })
  }
  confirmBtn=() => {
    const { linkManId, thisSickId, activeKey } = this.state
    healthRecordsApi.delSick({
      linkManId,
      sickId:thisSickId,
      type:activeKey + 1,
      noloading:1,
    }).then(res => {
      if (res) {
        this.queryhasSelectSickList(2)
      }
    })
  }
  modalToggle = (name) => {
    this.setState({
      [name]: !this.state[name],
    })
  }
  goDisease=(flag) => {
    let { linkManId, activeKey } = this.state
    diseaseProfilePageGoto({
      sample_linkmanid:linkManId,
      disease_type:activeKey === 0 ? 'personal' : 'family',
      record_status:flag,
      Btn_name:flag
    })
    location.href = `${location.origin}/mkt/healthRecords/disease?hideTitleBar=1&type=${activeKey + 1}&linkManId=${linkManId}`
  }
  render () {
    const { loading, tabs, activeKey, sickList, allFamilyFriends, pickerPop, yearAndMonth, modalFlag,
      personalFlag, familyFlag, userName, chooseList } = this.state
    return (
      <Page title='疾病档案'>
        {
          !loading
            ? <div className={styles.diseaseRecords}>
              <NavigationBar title='疾病档案' type='black'
                background='#fff' back={() => this.goBack()} />
              <div className={`${styles.tabs}`}>
                {
                  tabs.map((item, index) => (
                    <label key={index} className={`${activeKey === index ? styles.active : ''}`} onClick={() => this.changeTabs(index)}>
                      <span>{item}</span>
                      <span>&nbsp;</span>
                    </label>
                  ))
                }
              </div>
              {
                sickList.length
                  ? <div className={styles.sick}>
                    {
                      sickList.map((item, index) => (
                        <div className={styles.sickList} key={index}>
                          <div className={styles.box1}>
                            <span>{item.sickName}</span>
                            <img src={images.delBtn} onClick={() => this.delThis(item.sickId)} />
                          </div>
                          <div className={`${styles.firstTime} ${styles.left0}`} onClick={() => this.showPicker(item, index)}>
                            <label>{activeKey === 0 ? '首次出现的年龄' : '患病家属'}</label>
                            {
                              activeKey === 0
                                ? <span className={`${styles.chooseSpan} ${item.yearOfFirstAppearance && item.monthOfFirstAppearance ? styles.black : ''}`}>
                                  {
                                    item.yearOfFirstAppearance && item.monthOfFirstAppearance
                                      ? `${item.yearOfFirstAppearance}岁${item.monthOfFirstAppearance}个月`
                                      : '请选择'
                                  }
                                </span>
                                : <span className={`${styles.chooseSpan} ${item.friendRelationIds.length ? styles.black : ''} ${item.friendRelationIds.length > 3 ? styles.left : ''} ${styles.chooseSpan2} `}>
                                  {
                                    allFamilyFriends.length && item.friendRelationIds.length
                                      ? item.friendRelationIds.map((v, i) => (
                                        `${allFamilyFriends.filter(item => item.id === v)[0].relationName}${i < item.friendRelationIds.length - 1 ? '、' : ''}`
                                      ))
                                      : '请选择'
                                  }
                                </span>
                            }

                          </div>
                        </div>
                      ))
                    }
                  </div>
                  : ''
              }
              {
                (activeKey === 0 && personalFlag === false) || (activeKey === 1 && familyFlag === false)
                  ? <div className={styles.noRecords} onClick={() => this.goDisease(0)}>
                    <img src={images.disease2} />
                    <div>完善疾病信息，获得个性化的健康服务</div>
                    <p>去完善</p>
                  </div>
                  : ''
              }
              {
                (activeKey === 0 && personalFlag && sickList.length === 0) || (activeKey === 1 && familyFlag && sickList.length === 0)
                  ? <div className={styles.noData}>
                    <img src={images.disease1} />
                    {
                      activeKey === 0
                        ? <p>{userName}目前非常健康，请遵照报告建议，继续保持！</p>
                        : <p>家族无患病的情况下，{userName}患病的风险也会较一般人群低哦！</p>
                    }

                  </div>
                  : ''
              }
              {
                personalFlag || familyFlag
                  ? <BottomBtn handleSave={() => this.goDisease(1)} text={activeKey === 0 ? '修改个人疾病史' : '修改家族疾病史'} type={1} />
                  : ''
              }

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
              confirmBtn={() => this.confirmBtn()}
              type={3}
            />
            : null
        }
      </Page>
    )
  }
}
export default DiseaseRecords
