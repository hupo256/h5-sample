import React from 'react'
import propTypes from 'prop-types'
// import styles from './goods.scss'
import echarts from 'echarts/lib/echarts' // 引入 ECharts 主模块
import 'echarts/lib/chart/line' // 引入柱状图
import 'echarts/lib/chart/radar'
import 'echarts/lib/component/tooltip' // 引入提示框组件
import emoji1 from '@static/height/icon_emoji_1.png'
import emoji2 from '@static/height/icon_emoji_2.png'
import emoji3 from '@static/height/icon_emoji_3.png'
import emoji4 from '@static/height/icon_emoji_4.png'
import emoji5 from '@static/height/icon_emoji_5.png'
class EchartsCom extends React.Component {
  state = {
    data: {},
    images: [emoji1, emoji2, emoji3, emoji4, emoji5]
  }
  componentDidMount () {
  }
  componentWillReceiveProps (nextprops) {
    const { data } = this.state
    const { echartsData } = nextprops
    if (data === echartsData) return
    this.setState({
      data: echartsData
    })
    this.handleMarkLineChart(echartsData)
  }
  handleSetName = (type) => {
    if (type === 'Nutrition') {
      return '营养评级'
    } else if (type === 'Sport') {
      return '运动评级'
    } else if (type === 'Sleep') {
      return '睡眠评级'
    }
  }
  handleSetColor = (value) => {
    if (value === 1) {
      return 'red'
    } else if (value === 3) {
      return '#000'
    } else if (value === 5) {
      return 'yellow'
    }
  }
  handleSetImage = (value) => {
    if (value === 1) {
      return `image://${origin}/mkt/height/images/icon_emoji_1.png`
    } else if (value === 2) {
      return `image://${origin}/mkt/height/images/icon_emoji_2.png`
    } else if (value === 3) {
      return `image://${origin}/mkt/height/images/icon_emoji_3.png`
    } else if (value === 4) {
      return `image://${origin}/mkt/height/images/icon_emoji_4.png`
    } else if (value === 5) {
      return `image://${origin}/mkt/height/images/icon_emoji_5.png`
    }
  }
  // 制作折线图
  handleMarkLineChart = (data) => {
    const { averageData, geneData, inputData, xData, yData, type, categoryRespList } = data || {}
    var myChart = echarts.init(document.getElementById('echarts'))
    // 指定图表的配置项和数据
    /* eslint-disable */
    let option = {}
    if (type === 'height') {
      let num = 0
      inputData.map((item, index) => {
        if (item) {
          num++
        }
      })
      option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(10,167,85,1)',
            color: '#fff',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              lineStyle: {
                color: 'rgba(255, 255, 255, .2)'
              }
            },
            formatter: function (params) {
              let res = ''
              if (params[0] && params[0].value) {
                res += '<p style="padding: 0 8px;"><span style="width: 8px;height:8px;border-radius: 100%;display:inline-block;background: rgba(81, 244, 239, 1);margin-right:4px;"></span>' + params[0].seriesName + '：'+params[0].value + '</p>'
              }
              if (params[1] && params[1].value) {
                let color = 'rgba(236, 255, 0, 1)'
                if (params.length === 2) {
                  color = '#fff'
                }
                res += '<p style="padding: 0 8px;"><span style="width: 8px;height:8px;border-radius: 100%;display:inline-block;background: '+color+';margin-right:4px;"></span>' + params[1].seriesName + '：'+params[1].value + '</p>'
              }
              if (params[2] && params[2].value) {
                res += '<p style="padding: 0 8px;"><span style="width: 8px;height:8px;border-radius: 100%;display:inline-block;background:#fff;margin-right:4px;"></span>' + params[2].seriesName + '：'+params[2].value + '</p>'
              }
              return res
            }
        },
        legend: {
            data: ['平均身高', '基因身高', '测量身高'],
            x: 'left'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff',  //更改坐标轴文字颜色
                fontSize : 12     //更改坐标轴文字大小
              },
              formatter: (val, index) => {
                if (index === 0) {
                  if (val === '0个月') return ''
                  return `(${val})`
                } else {
                  return `${index}月`
                }
              },
              interval:0,  
            },
            data: xData
        },
        yAxis: [{
            type: 'value',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            min: function(value) {
              if (value <= 20) return value
              return parseInt((value.min - 10)/10)*10
            },
            axisLabel: {
              show: true,
               textStyle: {
                 color: '#fff',  //更改坐标轴文字颜色
                 fontSize : 12     //更改坐标轴文字大小
               }
            },
            splitLine: {
                lineStyle: {
                    type: 'solid',
                    color:'rgba(17, 164, 63, 1)',
                    width: 0.5
                }
            },
            splitNumber: 5
        }],
        grid: {
            left: '18px',
            right: '4%',
            bottom: '0',
            top: '4%',
            containLabel: true,
            borderWidth: '0'
        },
        series: [
          {
                name: "平均身高",
                type: "line",
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                data: averageData,
                itemStyle: {
                    normal: {
                        color: 'rgba(84, 250, 255, 1)',
                        lineStyle: {
                            width: 2
                        }
                    }
                },
                connectNulls: true
            },
            {
                name: "基因身高",
                type: "line",
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                data: geneData,
                itemStyle: {
                    normal: {
                        color: 'rgba(236, 255, 0, 1)',
                        lineStyle: {
                            width: 2,
                        }
                    }
                },
                connectNulls: true
            },
            {
                name: "测量身高",
                type: "line",
                smooth: true,
                symbol: 'circle',
                symbolSize: num === 1 ? 10 : 6,
                data: inputData,
                itemStyle: {
                    normal: {
                        color: '#fff',
                        lineStyle: {
                            width: 2,
                        }
                    }
                },
                connectNulls: true
            }
        ]
      }
    } else if (type === 'Nutrition' ||type === 'Sport' || type ==='Sleep' ) {
      option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(10,167,85,1)',
            color: '#fff',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              lineStyle: {
                color: 'rgba(255, 255, 255, .2)'
              }
            },
            formatter: function (params) {
              let res = ''
              if (params[0] && params[0].value) {
                res += '<p style="padding: 0 8px;"><span style="width: 8px;height:8px;border-radius: 100%;display:inline-block;background: rgba(236, 255, 0, 1);margin-right:4px;"></span>' + params[0].seriesName + '：'+params[0].value + '</p>'
              }
              return res
            }
        },
        legend: {
            data: ['平均身高', '基因身高', '测量身高'],
            x: 'left'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff',  //更改坐标轴文字颜色
                fontSize : 12     //更改坐标轴文字大小
              },
              formatter: (val, index) => {
                if (index === 0) {
                  if (val === '0个月') return ''
                  return `(${val})`
                } else {
                  return `${index}月`
                }
              },
              interval:0,  
            },
            data: xData
        },
        yAxis: [{
            type: 'value',
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            min: 0,
            max: 5,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff',  //更改坐标轴文字颜色
                fontSize : 12     //更改坐标轴文字大小
              },
              formatter: function(v){
                return `${v}级`
              }
            },

            splitLine: {
                lineStyle: {
                    type: 'solid',
                    color:'rgba(17, 164, 63, 1)',
                    width: 0.5
                }
            },
            splitNumber: 5
        }],
        grid: {
            left: '18px',
            right: '4%',
            bottom: '0',
            top: '4%',
            containLabel: true,
            borderWidth: '0'
        },
        series: [{
                name: this.handleSetName(type),
                type: "line",
                smooth: true,
                data: [{
                  value: yData[0],
                  symbol: this.handleSetImage(yData[0]),
                  symbolSize: 20,
                }, {
                  value: yData[1],
                  symbol: this.handleSetImage(yData[1]),
                  symbolSize: 20,
                }, {
                  value: yData[2],
                  symbol: this.handleSetImage(yData[2]),
                  symbolSize: 20,
                }, {
                  value: yData[3],
                  symbol: this.handleSetImage(yData[3]),
                  symbolSize: 20,
                }, {
                  value: yData[4],
                  symbol: this.handleSetImage(yData[4]),
                  symbolSize: 20,
                }, {
                  value: yData[5],
                  symbol: this.handleSetImage(yData[5]),
                  symbolSize: 20,
                }, {
                  value: yData[6],
                  symbol: this.handleSetImage(yData[6]),
                  symbolSize: 20,
                }, {
                  value: yData[7],
                  symbol: this.handleSetImage(yData[7]),
                  symbolSize: 20,
                }, {
                  value: yData[8],
                  symbol: this.handleSetImage(yData[8]),
                  symbolSize: 20,
                }, {
                  value: yData[9],
                  symbol: this.handleSetImage(yData[9]),
                  symbolSize: 20,
                }, {
                  value: yData[10],
                  symbol: this.handleSetImage(yData[10]),
                  symbolSize: 20,
                }, {
                  value: yData[11],
                  symbol: this.handleSetImage(yData[11]),
                  symbolSize: 20,
                }, {
                  value: yData[12],
                  symbol: this.handleSetImage(yData[12]),
                  symbolSize: 20,
                }],
                itemStyle: {
                    normal: {
                        color: 'rgba(236, 255, 0, 1)',
                        lineStyle: {
                            width: 2
                        }
                    }
                },
                areaStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: 'rgba(236, 255, 0, 1)' },
                      { offset: 1, color: "rgba(236, 255, 0, 0)" }
                    ])
                  }
                }, //填充区域样式
                connectNulls: true
            },
        ]
      }
    } else if (type === 'tizhi') {
      const data = this.handleSetTizhiData(categoryRespList)
      const {itemArr, labelArr } = data
      option = {
        radar: {
            // shape: 'circle',
            splitNumber: 5, // 雷达图圈数设置
            name: {
                textStyle: {
                    color: '#fff',
                },
            },
            indicator: [  //绘制总的图形
              {text: labelArr[0], max: 5, color: '#fff'},
              {text: labelArr[1], max: 5, color: '#fff'},
              {text: labelArr[2], max: 5, color: '#fff'},
              {text: labelArr[3], max: 5, color: '#fff'},
              {text: labelArr[4], max: 5, color: '#fff'},
              {text: labelArr[5], max: 5, color: '#fff'},
            ],
            radius: 110,
            //雷达图背景的颜色，在这儿随便设置了一个颜色，完全不透明度为0，就实现了透明背景
            splitArea: {
              areaStyle: {
                color: ['#13A15B', '#10A55A', '#0BAC59',      '#05B458', '#03B758'],
              }
            },
            axisLine: {
              lineStyle: {
                color: '#04ac53'
              },
            },
            splitLine: {
              lineStyle: {
                color: '#04ac53' //网格的颜色
              },
            }
        },
        series: [{
            name: '雷达图', // tooltip中的标题
            type: 'radar', //表示是雷达图
            symbol: 'circle', // 拐点的样式，还可以取值'rect','angle'等
            symbolSize: 8, // 拐点的大小
            areaStyle: {
                normal: {
                    width: 1,
                    opacity: 0.2,
                },
            },
            data: [
                {
                    value:itemArr,
                    // 设置区域边框和区域的颜色
                    itemStyle: {
                        normal: {
                            color: '#ECFF00',
                        },
                    },
                },
            ],
        }],
      }
    }
    if (myChart) {
      myChart.clear()
    }
    // 基于准备好的dom，初始化echarts实例
    myChart.setOption(option)
    window.scrollTo(0, 0)
  }
  // 初始化体质雷达图的数据
  handleSetTizhiData = (value) => {
    let itemArr = []
    let labelArr = []
    value && value.length && value.map((item, index) => {
      itemArr.push(item.score)
      labelArr.push(item.traitName)
    })
    const data = {
      itemArr,
      labelArr
    }
    return data
  }
  render () {
    return (
      <div>
        <div style={{ width: '100%', height: '300px', paddingBottom: '25px' }} id='echarts' />
      </div>
    )
  }
}
EchartsCom.propTypes = {
  echartsData: propTypes.object,
}
export default EchartsCom
