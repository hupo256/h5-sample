import React from 'react'
import propTypes from 'prop-types'
import Page from '@src/components/page'
import styles from './question.scss'
import images from '../images'
import healthRecordsApi from '@src/common/api/healthRecordsApi'
import BottomBtn from '../components/bottomBtn'
class Question extends React.Component {
  state = {
    loading:false,
    optionList:['不清楚', '是', '否'],
    sickList:[],
    isBlue:'',

  }
  componentDidMount () {
    console.log(this.props)
    if (this.props.location.state.dataConfig.personalSickList) {
      this.setState({
        sickList:this.props.location.state.dataConfig.personalSickList,
        isBlue:true
      })
    } else {
      this.getSickList()
    }
  }
  getSickList=() => {
    const { relationId, sex, linkManId } = this.props.location.state.dataConfig
    healthRecordsApi.getSickList({
      relationId,
      sex,
      linkManId
    }).then(res => {
      if (res) {
        this.setState({
          sickList:res.data.sickList,
          isBlue:res.data.sickList.filter(item => item.selectFlag > -1).length === res.data.sickList.length
        })
      }
    })
  }
  chooseThis=(index, i) => {
    console.log(index, i)
    let { sickList } = this.state
    sickList[index].selectFlag = i
    this.setState({
      sickList,
    }, () => {
      this.setState({
        isBlue:sickList.filter(item => item.selectFlag > -1).length === sickList.length
      })
      console.log(sickList)
    })
  }
  handleSaveBtn=() => {
    let { sickList } = this.state
    let { dataConfig } = this.props.location.state
    console.log(sickList)
    let allFlag = true
    sickList.map((item, index) => {
      console.log(item.selectFlag)
      if (item.selectFlag === undefined) {
        allFlag = false
      }
    })
    let sickName = ''
    if (allFlag) {
      if (sickList.filter(item => item.selectFlag === 1).length) {
        sickList.filter(item => item.selectFlag === 1).map((item, index) => {
          sickName += item.sickName + '、'
        })
      } else {
        sickName = '无'
      }
      dataConfig = { ...dataConfig, personalSickList:sickList, sickName }
      this.props.history.push({
        pathname: `/binding/bind-user`,
        search:  `id=${dataConfig.linkManId || ''}&barcode=${dataConfig.barcode || ''}&linkManType=${dataConfig.linkManType}`,
        state: { dataConfig }
      })
    }
  }
  render () {
    const { sickList, optionList, isBlue } = this.state
    let { dataConfig } = this.props.location.state
    return (
      <Page title='检测者信息'>
        <div className={styles.question}>
          <h5>请问{dataConfig.userName}是否有以下特殊情况？</h5>
          <div className={styles.subject}>
            {
              sickList.map((item, index) => (
                <div key={index}>
                  <div className={styles.title}>
                    <label>{index < 9 ? '0' + (index + 1) : index + 1}.</label>
                    <span>{item.sickName}</span>
                  </div>
                  <div className={styles.options}>
                    {
                      optionList.map((v, i) => (
                        <div key={i} onClick={() => this.chooseThis(index, i)}>
                          <img src={item.selectFlag === i ? images.radio1 : images.radio2} />
                          <span>{v}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
          </div>
          <BottomBtn handleSave={this.handleSaveBtn} text='确认' type={isBlue ? 1 : 3} />
        </div>
      </Page>
    )
  }
}
Question.propTypes = {
  history: propTypes.object,
}
export default Question
