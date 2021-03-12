import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../detailAn'
import images from './imagesAn'
import {Toast} from "antd-mobile";

class ShoworHide extends Component {
  static propTypes = {
    data:propTypes.array,
    type:propTypes.number
  }
  state = {
    boolArr: [false],
    boolArr2: [false],
  }
  componentDidMount() {
    console.log(this.props.data)
  }
  changeBoolArr = (index) => {
    console.log(index)
    if( index != 0 ){
      Toast.info('该板块内容只在正式报告中展示')
      return
    }
    let { boolArr } = this.state
    let arr = boolArr.slice()
    if (index + 1 > boolArr.length) {
      arr[index] = true
    } else {
      arr[index] = !arr[index]
    }
    console.log(arr)
    this.setState({
      boolArr: arr
    })
  }
  changeBoolArr2 = (index) => {
    console.log(index)
    let { boolArr2 } = this.state
    let arr = boolArr2.slice()
    if (index + 1 > boolArr2.length) {
      arr[index] = true
    } else {
      arr[index] = !arr[index]
    }
    this.setState({
      boolArr2: arr
    })
  }
  render() {
    const { boolArr, boolArr2 } = this.state
    const { data, type } = this.props
    return (
      type === 1
        ? <div className={styles.padding15}>
          {
            data.map((item, index) => {
              return (
                <div className={styles.drawer} key={index}>
                  <div onClick={() => this.changeBoolArr(index)}
                    className={`${styles.questionDemo} ${index === data.length - 1 && !boolArr[index] ? styles.padding0 : ''}`}>
                    <div>{item.title}</div>
                    <img
                      className={boolArr[index] ? styles.arrowRotate : null}
                      src={images.upOrDown} />
                  </div>
                  <div className={`${styles.answerDemo} `}
                    style={boolArr[index] ? null : { height: '0', padding: '0' }}
                  >
                    <div dangerouslySetInnerHTML={{ __html:item.desc }} />
                  </div>
                </div>)
            })
          }
        </div>
        : type === 2
          ? <div>
            {data.map((item, index) => {
              return (
                <div className={styles.drawer2} key={index}>
                  <div onClick={() => this.changeBoolArr(index)} className={styles.questionDemo}>
                    <div className={styles.left}>
                      <img src={index === 0 ? images.analysis1 : index === 1 ? images.analysis2 : index === 2 ? images.analysis3 : images.analysis4} />
                      <span>{item.name}</span>
                    </div>
                    <div className={styles.right}>
                      <span className={`${item.riskLevel === '中等' ? styles.orange2 : item.name === '免疫力水平' ? item.riskLevel === '高' ? styles.green2 : styles.red2 : item.riskLevel === '高' ? styles.red2 : styles.green2}`}>
                        {item.riskLevel}
                      </span>
                      <img className={boolArr[index] ? styles.arrowRotate : null} src={images.upOrDown} />
                    </div>
                  </div>
                  <div className={styles.answerDemo}
                    style={boolArr[index] ? null : { height: '0', padding: '0' }}
                  >
                    <div className={styles.details}>
                      <div dangerouslySetInnerHTML={{ __html:item.subTitle }} className={styles.detailsSub} />
                      {
                        item.genusRanges.length
                          ? <div className={styles.tips}>
                            <div className={styles.column}>
                              <span>检测项目</span>
                              <span>检测结果‰</span>
                              <span>参考范围‰</span>
                            </div>
                            <div>
                              {
                                item.genusRanges.map((v, i) => (
                                  <p key={i} className={styles.resultText}>
                                    <span>{v.name}</span>
                                    {
                                      v.isUp === 1 || v.isUp === 0
                                        ? <span>{v.value}<img src={images.low} className={`${styles.arrow} ${v.isUp === 1 ? styles.high : ''}`} /></span>
                                        : <span>{v.value}</span>
                                    }
                                    <span>{v.range}</span>
                                  </p>
                                ))
                              }
                            </div>
                          </div>
                          : ''
                      }
                      <div className={`${styles.floraTips} ${styles.margin2}`}>
                        说明:
                        <img src={images.low} className={styles.high} />
                        表示该菌含量偏高,
                        <img src={images.low} />
                        表示该菌含量偏低或未检出
                      </div>
                      <div className={styles.finds} dangerouslySetInnerHTML={{ __html:item.explain }} />
                      <div className={styles.indicate} dangerouslySetInnerHTML={{ __html:item.result }} />
                      <div className={styles.littleTips}>
                        <div className={styles.more}>
                          <img src={images.tips} />
                          <span>小贴士</span>
                        </div>
                        <p dangerouslySetInnerHTML={{ __html:item.tips }} className={styles.moreWords2} />
                      </div>
                      <div className={styles.padding15}>
                        {
                          item.knowledge && item.knowledge.map((v, i) => {
                            return (
                              <div className={styles.drawer} key={i}>
                                <div onClick={() => this.changeBoolArr2(i)} className={`${styles.questionDemo} ${i === 0 ? styles.border0 : ''}`}>
                                  <div>
                                    <img src={images.circle2} />
                                    <div>{v.subtitle}</div>
                                  </div>
                                  <img
                                    className={boolArr2[i] ? styles.arrowRotate : null}
                                    src={images.upOrDown} />
                                </div>
                                <div className={styles.answerDemo} style={boolArr2[i] ? null : { height: '0', padding: '0' }}>
                                  <div dangerouslySetInnerHTML={{ __html:v.description }} />
                                  {
                                    v.child.length
                                      ? v.child.map((vv, ii) => (
                                        <div key={ii}>
                                          <h4>{ii + 1}、{vv.subtitle}</h4>
                                          <div dangerouslySetInnerHTML={{ __html:vv.description }} />
                                        </div>
                                      ))
                                      : ''
                                  }
                                </div>

                              </div>)
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
            }
          </div>
          : type === 3
            ? <div>
              {data.map((item, index) => {
                return (
                  <div className={styles.drawer2} key={index}>
                    <div onClick={() => this.changeBoolArr(index)} className={styles.questionDemo}>
                      <div className={styles.left}>
                        <img src={item.score === 1 ? images.smile : images.cry} />
                        <span>{item.cname}</span>
                      </div>
                      <div className={styles.right}>
                        <span className={`${item.score === 1 ? styles.green : styles.red}`}>{item.conclusion}</span>
                        <img className={boolArr[index] ? styles.arrowRotate : null} src={images.upOrDown} />
                      </div>
                    </div>
                    <p className={styles.prefix}>{item.prefix}</p>
                    <div className={styles.answerDemo} style={boolArr[index] ? null : { height: '0', padding: '0' }}>
                      <div className={styles.details}>
                        <div className={`${styles.tips} ${styles.top20}`}>
                          <div className={styles.column}>
                            <span>检测项目</span>
                            <span>检测结果‰</span>
                            <span>参考范围‰</span>
                          </div>
                          <div>
                            {
                              item.genusRangeDtos && item.genusRangeDtos.map((v, i) => (
                                <p key={i} className={styles.resultText}>
                                  <span>{v.name}</span>
                                  {
                                    v.isUp === 1 || v.isUp === 0
                                      ? <span>{v.value}<img src={images.low} className={`${styles.arrow} ${v.isUp === 1 ? styles.high : ''}`} /></span>
                                      : <span>{v.value}</span>
                                  }
                                  <span>{v.range}</span>
                                </p>
                              ))
                            }
                          </div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html:item.text }} className={styles.text} />
                        <div className={styles.littleTips}>
                          <div className={styles.more}>
                            <img src={images.more} />
                            <span>{item.tips.title}</span>
                          </div>
                          {
                            item.tips.value.map((v, i) => (
                              <div key={i} className={styles.moreWords}>
                                <p>{v.title}</p>
                                <div dangerouslySetInnerHTML={{ __html:v.text }} />
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
              }
            </div>
            : ''
    )
  }
}

export default ShoworHide
