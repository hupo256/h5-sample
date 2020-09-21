import React, { Component } from 'react'

import styles from './drawerCard.scss'
import images from '../../images'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'zrender/lib/svg/svg'

class Card extends Component {
  static propTypes = {

  }
  componentDidMount() {
    const { data = {} } = this.props
    data.geneDtos && data.geneDtos.map((item, index) => {
      if (item.frequencyDto) {
        this.handleRingChart(item.frequencyDto.populationGFreq, index)
      }
    })
  }
  changeBoolArr = (index) => {
    const { boolArr } = this.state
    const arr = boolArr.slice()
    if (index + 1 > boolArr.length) {
      arr[index] = true
    } else {
      arr[index] = !arr[index]
    }
    // console.log(arr);
    this.setState({
      boolArr: arr
    })
  }
  state = {
    boolArr: [true],
    color: ['#6567e5', '#60617c', '#4FA9FF', '#07BCB1']
  }
  // 制作环形图
  handleRingChart = (origin, id) => {
    const color = []
    let list = origin.map((item, index) => {
      color.push(item.color)
      return {
        value: parseFloat(item.value),
        name: item.genotype
      }
    })
    list[0].selected = true
    id = id.toString()
    const option = {
      tooltip: {
        show: false
      },
      color,
      legend: {
        orient: 'vertical',
        left: 15,
        data: ['吸收能力差', '吸收能力较差', '吸收能力正常', '吸收能力较高', '吸收能力高']
      },
      series: [
        {
          name: id,
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['65%', '100%'],
          selectedOffset: 0,
          startAngle: 80,
          avoidLabelOverlap: false,
          hoverOffset: 0,
          silent: true,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              position: 'center',
              formatter: '{b}',
              textStyle: {
                fontSize: '14',
                fontWeight: 'bold',
                fontFamily: 'DINAlternate-Bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: list
        }
      ]
    }
    const myChart = echarts.init(document.getElementById(id), null, { renderer: 'svg' })
    myChart.setOption(option)
    myChart.dispatchAction({
      type: 'highlight',
      seriesName: id,
      dataIndex: 0,
    })
  }
  // 阻止图片被选中
  preventDNAImgDefault = (event) => {
    event.stopPropagation();
    event.preventDefault();
  }
  render() {
    const { data = {} } = this.props
    const { boolArr, color } = this.state
    return (
      <div className={styles.card}>
        <div className={styles.dnaBlock}>
          <div>
            <img src={data.moduleIconUrl} alt='' />
            <div>{data.title}</div>
          </div>
          <div>
            {
              data.geneDtos && data.geneDtos.map((item, index) => {
                // console.log(item.frequencyDto.populationGFreq,item.gname);

                return (
                  <div className={styles.dna} key={index}>
                    <div />
                    <div onClick={() => this.changeBoolArr(index)}>
                      <div>
                        <p>{item.gname}</p>
                        <p>[{item.gsite}]</p>
                      </div>
                      <img
                        className={boolArr[index] ? null : styles.arrowRotate}
                        src={images.up} alt='' />
                    </div>

                    <div style={boolArr[index] ? null : { height: '0', padding: '0' }}>
                      {item.frequencyDto &&
                        <div className={styles.dnaChart} >
                          <div>
                            <p>{item.frequencyDto.chromosome}</p>
                            <img src={item.frequencyDto.chromosomePicUrl} alt='' />
                          </div>
                          <div className={styles.dnaPie}>
                            <p>基因型频率</p>
                            <div>
                              <div id={index} />
                              <div className={styles.peanText}>
                                {
                                  item.frequencyDto.populationGFreq && item.frequencyDto.populationGFreq.map((item3, index3) => {
                                    return (
                                      <div key={index3}>
                                        <div>
                                          <div style={{ backgroundColor: item3.color }} />
                                          <div style={{ backgroundColor: item3.color }} />
                                        </div>
                                        <div>
                                          <p style={{ color: item3.color }}>{item3.genotype}基因型频率</p>
                                          <p style={{ color: item3.color }}>{parseFloat(item3.value).toFixed(1) + '%'}</p>
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            </div>
                          </div>
                          <div>
                            <p>等位型频率</p>
                            <div>
                              <div className={styles.dnaChain}>
                                <div>
                                  {
                                    item.frequencyDto.effectAllele.map((item2, index2) => {
                                      return (
                                        <div key={index2} style={{ width: item2.value, backgroundColor: item2.color }} />
                                      )
                                    })
                                  }
                                  {
                                    item.frequencyDto.normalAllele.map((item1, index1) => {
                                      return (
                                        <div key={index1} style={{ width: item1.value, backgroundColor: item1.color }} />
                                      )
                                    })
                                  }
                                </div>
                                <img src={images.dna} onClick={this.preventDNAImgDefault} />
                              </div>
                              <div className={styles.peanText}>
                                {
                                  item.frequencyDto.effectAllele && item.frequencyDto.effectAllele.map((item1, index1) => {
                                    return (
                                      <div key={index1}>
                                        <div>
                                          <div style={{ backgroundColor: item1.color }} />
                                          <div style={{ backgroundColor: item1.color }} />
                                        </div>
                                        <div>
                                          <p style={{ color: item1.color }}>{item1.genotype}风险突变频率</p>
                                          <p style={{ color: item1.color }}>{parseFloat(item1.value).toFixed(1) + '%'}</p>
                                        </div>
                                      </div>
                                    )
                                  })
                                }

                                {
                                  item.frequencyDto.normalAllele && item.frequencyDto.normalAllele.map((item2, index2) => {
                                    return (
                                      <div key={index2}>
                                        <div>
                                          <div style={{ backgroundColor: item2.color }} />
                                          <div style={{ backgroundColor: item2.color }} />
                                        </div>
                                        <div>
                                          <p style={{ color: item2.color }}>{item2.genotype}正常变异频率</p>
                                          <p style={{ color: item2.color }}>{parseFloat(item2.value).toFixed(1) + '%'}</p>
                                        </div>
                                      </div>
                                    )
                                  })
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                      <div className={styles.dnaWithTitle}>
                        <div>
                          <div>基因位点释义</div>
                        </div>
                        <div>
                          {item.siteDes}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }

          </div>
        </div>
      </div >
    )
  }
}

export default Card
