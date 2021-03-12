import React, { Component } from 'react'
import propTypes from 'prop-types'

import styles from '../../style.scss'
import { fun } from '@src/common/app'
import images from '../../images'
import hpvReportApi from '@src/common/api/hpvReportApi'
import CardTitle from '../cardTitle'

const { getParams } = fun

class FeedBackCard extends Component {
    static propTypes = {
      data: propTypes.object
    }
    state = {
      expression: '',
      index: null,
      feedValue: '',
      tagsArr: [],
      showChooseBox: true,
    }
    componentDidMount() {

    }
    // 选择题表情
    chooseExpression = (expression, index) => {
      if (getParams().shareToken) {
        return
      }
      const { haveSubmit } = this.props
      if (haveSubmit) {
        return
      }
      this.setState({ expression, index, tagsArr: [] })
    }
    // 控制输入框
    handleValueChange = e => {
      const { haveSubmit } = this.props
      if (haveSubmit) {
        return
      }
      let height = parseInt(getComputedStyle(e.target).height.slice(0, -2), 10)
      if (e.target.scrollHeight > height) {
        e.target.style.height = `${e.target.scrollHeight}px`
      } else {
        while (height >= e.target.scrollHeight) {
          e.target.style.height = `${height - 22}px`
          height -= 22
        }
        e.target.style.height = `${height + 22}px`
      }

      this.setState({
        feedValue: e.target.value,
      })
    }
    // 选择标签
    chooseTags = (index, item) => {
      const { tagsArr } = this.state
      const { haveSubmit } = this.props
      if (haveSubmit) {
        return
      }
      const tempArr = tagsArr.slice()
      if (tempArr[index]) {
        tempArr[index] = null
      } else {
        tempArr[index] = item
      }
      this.setState({
        tagsArr: tempArr
      })
    }
    // 提交反馈
    submit = () => {
      const { tagsArr, feedValue, expression } = this.state
      const { userId, handleSubmit } = this.props
      console.log(this.props)
      const obj = getParams()
      hpvReportApi.upgradeReportGetReportTraitFeedBack({
        userId,
        linkManId: obj.linkManId,
        barCode: obj.barCode,
        expression,
        suggest: feedValue,
        tags: tagsArr.join('/'),
      })
      handleSubmit()
    }
    render() {
      const { haveSubmit, data } = this.props
      const { expression, index, feedValue, tagsArr, showChooseBox } = this.state
      return (
        <div className={`${styles.padding15} ${styles.yourOnlyCard}`}>
          <CardTitle title={data.title} />
          <div className={`${styles.feedback} ${styles.square}`}>
            <div className={styles.box}>
              <div onClick={() => this.chooseExpression(data.expressionDtos[0].content, 0)}>
                <div>
                  <img src={expression === data.expressionDtos[0].content ? images.usefulH : images.useful} alt='' />
                </div>
                <p style={expression === data.expressionDtos[0].content ? { color: '#F24B94', fontWeight: '700', fontSize: '15px' } : null}>
                  {data.expressionDtos[0].content}
                </p>
              </div>
              <div onClick={() => this.chooseExpression(data.expressionDtos[1].content, 1)}>
                <div>
                  <img src={expression === data.expressionDtos[1].content ? images.littleUseH : images.littleUse} alt='' />
                </div>
                <p style={expression === data.expressionDtos[1].content ? { color: '#F24B94', fontWeight: '700', fontSize: '15px' } : null}>
                  {data.expressionDtos[1].content}
                </p>
              </div>
              <div onClick={() => this.chooseExpression(data.expressionDtos[2].content, 2)}>
                <div>
                  <img src={expression === data.expressionDtos[2].content ? images.noUseH : images.noUse} alt='' />
                </div>
                <p style={expression === data.expressionDtos[2].content ? { color: '#F24B94', fontWeight: '700', fontSize: '15px' } : null}>
                  {data.expressionDtos[2].content}
                </p>
              </div>
            </div>
            {
              expression &&
              <div className={styles.feedSubmit}>
                <img src={index === 0 ? images.line0 : index === 1 ? images.line1 : images.line2} />
                <div>
                  {
                    showChooseBox && <div className={styles.tagBox}>
                      {
                        data.expressionDtos[index].tags.split('/').map((item, index) => {
                          return (
                            <div key={index}
                              className={styles.tags}
                              onClick={() => { this.chooseTags(index, item) }}
                              style={tagsArr[index] ? {
                                color: 'white', backgroundColor: '#6567E5', borderColor: '#6567E5'
                              } : null}>{item}</div>
                          )
                        })
                      }
                    </div>
                  }
                </div>
                {
                  showChooseBox && <div className={styles.adviseText}><textarea type='text'
                    placeholder={data.suggest}
                    onChange={this.handleValueChange}
                    value={feedValue} /></div>

                }
                <section className={styles.submitBox}>
                  {
                    haveSubmit ? <div className={styles.submitText}><div />感谢您的反馈～<div /></div>
                      : <div className={styles.submitBtn}
                        onClick={this.submit}>提交 </div>
                  }
                </section>
              </div>
            }
            <div className={styles.feedPad} />
          </div>
        </div>
      )
    }
}

export default FeedBackCard
