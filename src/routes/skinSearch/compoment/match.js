import React, { Component } from 'react'
import propTypes from 'prop-types'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import styles from '../skinBeauty.scss'

class Match extends Component {
  static propTypes = {
    matchValue:propTypes.number,
    type:propTypes.number,
  }

  componentDidMount () {
    // alert(this.props.matchValue)
    let option = {
      backgroundColor: '',
      // title: {
      //   show:true,
      //   text: this.props.matchValue + '%',
      //   x: 'center',
      //   y: 'center',
      //   textStyle: {
      //     color: '#440817FF',
      //     fontWeight: 'bolder',
      //     fontSize: this.props.type === 2 ? 20 : 40,
      //   }
      // },
      grid:{
        x:90,
        y:90,
        x2:0,
        y2:30
      },
      series: [{ // 最外层的底圆
        type: 'pie',
        radius: ['100%', '78%'],
        silent: true,
        label: {
          normal: {
            show: false,
          }
        },

        data: [{
          value: 1,
          itemStyle: {
            normal: {
              color: '#ffe9e4',
              shadowBlur: 20,
              opacity: 0.8,
              shadowColor: '#ffe8e4'
            }
          }
        }],

        animation: false
      },
      {
        // 底圆中间白色阴影部分
        type: 'pie',
        radius: ['95%', '98%'],
        silent: true,
        label: {
          normal: {
            show: false,
          }
        },

        data: [{
          value: 1,
          itemStyle: {
            normal: {
              color: '#fff',
              shadowBlur: 20,
              opacity: 0.1,
              shadowColor: '#fff'
            }
          }
        }],

        animation: false
      },
      {
        // 加载数据部分的圆 这个是重点
        name: 'main',
        type: 'pie',
        radius: ['85%', '95%'],
        hoverAnimation: false,
        label: {
          normal: {
            show: false,

          }
        },
        data: this.getData(),
        animationEasingUpdate: 'cubicInOut',
        animationDurationUpdate: 1000
      }
      ]
    }
    let myChart = echarts.init(document.getElementById('main'))
    myChart.setOption(option)
  }
  getData=() => {
    return [{
      value: +this.props.matchValue,
      itemStyle: {
        normal: {
          opacity: 1,
          color: { // 完成的圆环的颜色
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(255, 131, 131, 1)' // 0% 处的颜色
            }, {
              offset: 1,
              color: 'rgba(255, 131, 131, 1)' // 100% 处的颜色
            }],
            // globalCoord: false // 缺省为 false
          },
        }
      }
    }, {
      value: 100 - Number(this.props.matchValue),
      itemStyle: {
        normal: {
          color: 'transparent'
        }
      }
    }]
  }

  render () {
    const { type } = this.props
    return (
      <div>
        {
          type === 2
            ? <div id='main' className={styles.matchCircle1} />
            : <div id='main' className={styles.matchCircle2} />
        }

      </div>
    )
  }
}
export default Match
