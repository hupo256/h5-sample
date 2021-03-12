import React, { Component } from 'react'

import styles from '../style.scss'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'zrender/lib/svg/svg';
class CrowdCard extends Component {
    static propTypes = {

    }
    state = {
        dataIndex: 0,
        color: '',
        showPercent: true,
        value: null
    }
    componentDidMount() {
        this.handleRingChart()
    }
    // 制作环形图
    handleRingChart = () => {
        const { data: { pieChartDtoList }, index } = this.props
        const color = []
        const list = pieChartDtoList.map((item, index) => {
            color.push(item.pieChartColor)
            return { value: parseInt(item.benefitLevel), }
        })
        this.setState({
            color: color[0],
            value: list[0].value
        })
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
                    name: '%',
                    type: 'pie',
                    center: ['50%', '50%'],
                    radius: ['55%', '85%'],
                    selectedOffset: 0,
                    hoverOffset: 7,
                    startAngle: 80,
                    avoidLabelOverlap: false,
                    silent: true,
                    label: {
                        normal: {
                            show: false,
                            position: "center",
                        },
                        emphasis: {
                            show: true,
                            formatter: '{d}',
                            rich: {
                                a: {
                                    fontSize: "15",
                                }
                            },
                            textStyle: {
                                fontSize: '36',
                                align: 'center',
                                padding: [5, 5, 0, 0],
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
        };
        const myChart = echarts.init(document.getElementById(index), null, { renderer: 'svg' })
        myChart.setOption(option)
        myChart.dispatchAction({
            type: 'highlight',
            seriesName: '%',
            dataIndex: 0,
        })
    }
    render() {
        const { data, index } = this.props
        const { value, color, showPercent } = this.state
        let left
        let width="48vw"
        if (value < 10) {
            left = true
        }
        if (value == 100) {
            left = true
            width = "50.6vw"
        }
        return (
            <div className={styles.card}>
                <div className={styles.crowdCard}>
                    <div>
                        <img src={data.moduleIconUrl} alt="" />
                        <div>{data.title}</div>
                    </div>
                    <div></div>
                    <div>

                        <div id={index} style={{ width: '100%', height: '100%', paddingBottom: '25px' }}></div>
                        {showPercent && <div className={styles.percent}
                            style={left ? { color, left: width } : { color }}>%</div>}
                    </div>
                    <div>
                        {
                            data.pieChartDtoList && data.pieChartDtoList.map((item, index) => {
                                const desc = item.conclusionDesc.split(',')
                                return (
                                    <div className={styles.crowdRow} key={index}>
                                        <div>
                                            <div style={{ backgroundColor: item.pieChartColor }}></div>
                                            <div style={{ backgroundColor: item.pieChartColor }}></div>
                                        </div>
                                        <div >
                                            <div style={{ color: item.pieChartColor }}>
                                                <div >{desc[0]}</div>
                                                <div style={{ color: item.pieChartColor }}>{desc[1]}</div>
                                            </div>
                                            <div></div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default CrowdCard
