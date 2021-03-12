import React, {Component, Fragment} from 'react'
import styles from './reportHome.scss'
import Page from '@src/components/page'
import {Carousel} from 'antd-mobile'
import s1 from '@static/readGuide/s1.png'
import s2 from '@static/readGuide/s2.png'
import s3 from '@static/readGuide/s3.png'
import s4 from '@static/readGuide/s4.png'
import s5 from '@static/readGuide/s5.png'
import s6 from '@static/readGuide/s6.png'
import d1 from '@static/readGuide/d1.png'
import d2 from '@static/readGuide/d2.png'
import d3 from '@static/readGuide/d3.png'
import d4 from '@static/readGuide/d4.png'
import d5 from '@static/readGuide/d5.png'
import d6 from '@static/readGuide/d6.png'
import d7 from '@static/readGuide/d7.png'

export default class Guide extends Component {
  constructor(props) {
    super(props)
  }
  state = {
    slideList:[
      s1, s2, s3, s4, s5, s6
    ],
    readList:[
      d1, d2, d3, d4, d5, d6, d7
    ],
    current:0
  }
  componentDidMount() {

  }
  changeSlide = (current) => {
    console.log(current)
    this.setState({
      current
    })
  }

  render() {
    const { location } = this.props
    const { slideList, readList,current } = this.state
    return (
      <Page title={'阅读指南'} class={styles.guide}>
        <div className={styles.guideWrap}>
          <div className={styles.slideContent}>
            <Carousel
              infinite
              autoplay
              dots={false}
              afterChange={current => this.changeSlide(current)}
            >
              {slideList && slideList.map((item, index) => {
                return(
                  <div className={styles.slideWrap} key={index}>
                    <img src={item} />
                  </div>
                )
              })}
            </Carousel>
            <div className={styles.dotsWrap}>
              {slideList && slideList.map((item,index)=> {
                return <div key={index} style={{background:`${index === current ? '#6567E5':'#EFEFEF'}` }}></div>
              })}
            </div>
          </div>
          <div className={styles.guideContent}>
            <div className={styles.title}>如何使用我的基因检测报告？<span></span></div>
            <div className={styles.readWrap}>
              <img src={d1} />
            </div>
            <div className={styles.readWrap}>
              <img src={d7} />
            </div>
            <div className={styles.readWrap}>
              <img src={d2} />
            </div>
            <div className={styles.readWrap}>
              <img src={d3} />
              <img src={d6} />
            </div>
            <div className={styles.readWrap}>
              <img src={d4} />
            </div>
            <div className={styles.readWrap}>
              <img src={d5} />
            </div>
          </div>
        </div>
      </Page>
    )
  }
}
