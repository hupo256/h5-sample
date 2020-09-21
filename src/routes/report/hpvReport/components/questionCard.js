import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../hpvReport.scss'
import images from '../images'
import CardTitle from './cardTitle.js'

class QuestionCard extends Component {
  static propTypes = {
    data:propTypes.object,
  }
  state = {
    boolArr: [false]
  }
  componentDidMount() {
    console.log(this.props.data)
  }
  changeBoolArr = (index) => {
    console.log(index)
    const { boolArr } = this.state
    const arr = boolArr.slice()
    arr.map((v, i) => {
      if (index !== i) {
        arr[i] = false
      }
    })
    arr[index] = !arr[index]

    // if (index + 1 > boolArr.length) {
    //   arr[index] = true
    // } else {
    //   arr[index] = !arr[index]
    // }
    console.log(arr)
    this.setState({
      boolArr: arr
    })
  }
  render() {
    const { data } = this.props
    const { boolArr } = this.state
    return (
      <div className={styles.padding15}>
        <CardTitle title={data.head} />
        <div className={`${styles.richText} ${styles.square}`}>
          {data.hpvAnswerDtos.map((item, index) => {
            return (
              <div className={styles.drawer} key={index}>
                <div onClick={() => this.changeBoolArr(index)} className={styles.questionDemo}>
                  <div>
                    <img src={images.question} alt='' />
                    <div>{item.question}</div>
                  </div>
                  <img
                    className={boolArr[index] ? styles.arrowRotate : null}
                    src={images.downIcon} alt='' />
                </div>
                {
                  index < data.hpvAnswerDtos.length - 1 ? <div className={styles.border} /> : ''
                }
                <div className={styles.answerDemo}
                  style={boolArr[index] ? null : { height: '0', padding: '0' }}
                >
                  <img src={images.answer} />
                  <p dangerouslySetInnerHTML={{ __html:item.answer }} />
                </div>
              </div>)
          })
          }
        </div>
      </div>

    )
  }
}

export default QuestionCard
