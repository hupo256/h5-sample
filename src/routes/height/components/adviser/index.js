import React from 'react'
import propTypes from 'prop-types'
import { Icon, Toast, Picker, TextareaItem } from 'antd-mobile'
import { API, images, fun, ua } from '@src/common/app'
import styles from './adviser.scss'

import answer from '@static/height/icon_answer.png'
import exportP1 from '@static/height/icon_export1.png'
import question from '@static/height/icon_question.png'
const { todayDate } = fun
class Adviser extends React.Component {
  state = {
    submitCont: '',
    adviserList: [],
    isAgainConsult: false,
  }
  componentDidMount() {
    this.handleGetAdvisers()
  }
  // 获取用户问答
  handleGetAdvisers = () => {
    const params = {
      linkManId: this.props.linkManId
    }
    API.getInterlocutionRecord(params).then(res => {
      const { data } = res
      let newData = []
      if (data.length > 2) {
        data.forEach((item, index) => {
          if (index === 0) {
            item.isExpand = 0
          } else if (index > 0 && item.isReply) {
            item.isExpand = 1 // 0,不需要,1收起（显示展开按钮）,2展开（显示收起按钮）
          }
          newData.push(item)
        })
      } else {
        newData = data
      }
      this.setState({
        adviserList: newData
      })
    })
  }
  // 提交咨询内容
  handleSubmit = (flag) => {
    const { submitCont } = this.state
    if (submitCont.length === 0) return
    const params = {
      linkmanId: this.props.linkManId,
      question: submitCont
    }
    API.addInterlocutionRecord(params).then(res => {
      if (res) {
        this.handleGetAdvisers()
        if (flag) {
          this.setState({
            isAgainConsult: false,
            submitCont: ''
          })
        }
      }
    })
  }
  // 咨询内容
  handleChangeInput = (e) => {
    this.setState({
      submitCont: e
    })
  }
  // 再次咨询
  handleAgainConsult = () => {
    document.body.scrollTop = document.documentElement.scrollTop = 0
    this.setState({
      isAgainConsult: true
    })
  }
  // 取消再次咨询
  handleCancle = () => {
    this.setState({
      isAgainConsult: false,
      submitCont: ''
    })
  }
  // 是否显示查看更多按钮
  handleSetExpand = (value, num) => {
    if (value.isReply) {
      if (value.isExpand === 1) {
        return <div
          className={styles.lookMoreBtn}
          onClick={() => this.handleLookMore(num)}
        >查看专家解答</div>
      } else {
        return <div className={styles.answer}>
          <div className={styles.answerLeft}>
            <img src={answer} alt='' />
          </div>
          <div className={styles.answerRight}>
            <div className={styles.cont}>{value.answer}</div>
            {
              value.isExpand === 2
                ? <p onClick={() => this.handleRetract(num)} className={styles.retract}>收起</p>
                : ''
            }
          </div>
        </div>
      }
    } else {
      return <div className={styles.waiting}>育儿顾问会在24小时内给您回复</div>
    }
  }
  // 查看专家回答
  handleLookMore = (num) => {
    const { adviserList } = this.state
    const _adviserList = adviserList
    _adviserList[num].isExpand = 2
    this.setState({
      adviserList: _adviserList
    })
  }
  // 收起专家回答
  handleRetract = (num) => {
    const { adviserList } = this.state
    const _adviserList = adviserList
    _adviserList[num].isExpand = 1
    this.setState({
      adviserList: _adviserList
    })
  }
  render() {
    const { submitCont, adviserList, isAgainConsult } = this.state
    return (
      <div className={styles.adviserCont} >
        <div className={styles.descBox}>
          <div className={styles.left}>
            <img src={exportP1} alt='' />
          </div>
          <div className={styles.right}>
            <p className={styles.title}>安我育儿顾问</p>
            <p className={styles.desc}>饮食、睡眠、运动等方面帮助孩子解决身高问题</p>
          </div>
        </div>
        <div className={styles.consultBox}>
          <p className={styles.title}>咨询专家</p>
          <div className={styles.consults}>
            {
              adviserList.length === 0
                ? <div className={styles.consultDetail}>
                  <div className={styles.question}>
                    <div className={styles.quesLeft}>
                      <img src={question} alt='' />
                    </div>
                    <div className={styles.quesRight}>
                      <p className={styles.time}>{todayDate()}</p>
                      <div className={styles.inputBox}>
                        <TextareaItem
                          className={styles.input}
                          placeholder='点击输入想咨询的内容'
                          autoHeight
                          onChange={(e) => this.handleChangeInput(e)}
                        />
                      </div>
                    </div>
                  </div>
                  <span
                    className={`${styles.submitBtn} ${submitCont.length > 0 ? styles.green : ''}`}
                    onClick={this.handleSubmit}
                  >提交</span>
                </div>
                : ''
            }
            {
              isAgainConsult
                ? <div className={styles.consultDetail}>
                  <div className={styles.question}>
                    <div className={styles.quesLeft}>
                      <img src={question} alt='' />
                    </div>
                    <div className={styles.quesRight}>
                      <p className={styles.time}>{todayDate()}</p>
                      <div className={styles.inputBox}>
                        <TextareaItem
                          className={styles.input}
                          placeholder='点击输入想咨询的内容'
                          autoHeight
                          onChange={(e) => this.handleChangeInput(e)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.btnsCont}>
                    <span
                      className={`${styles.submitBtn} ${submitCont.length > 0 ? styles.green : ''}`}
                      onClick={() => this.handleSubmit(1)}
                    >提交</span>
                    <span
                      className={styles.submitBtn}
                      onClick={this.handleCancle}
                    >取消</span>
                  </div>
                </div>
                : ''
            }
            {
              adviserList.length > 0
                ? adviserList.map((item, index) => {
                  return (<div className={styles.consultDetail} key={index}>
                    <div className={styles.question}>
                      <div className={styles.quesLeft}>
                        <img src={question} alt='' />
                      </div>
                      <div className={styles.quesRight}>
                        <p className={styles.time}>{item.createTime}</p>
                        <div className={`${styles.cont} ${item.isExpand === 1 ? styles.overflow3 : ''}`}>{item.question}</div>
                      </div>
                    </div>
                    {this.handleSetExpand(item, index)}
                  </div>
                  )
                })
                : ''
            }
            {
              adviserList.length && adviserList[0].isReply && !isAgainConsult
                ? <span className={styles.consultBtn} onClick={this.handleAgainConsult}>继续咨询</span>
                : ''
            }
          </div>
        </div>
      </div>
    )
  }
}
Adviser.propTypes = {
  linkManId: propTypes.number,
}
export default Adviser
