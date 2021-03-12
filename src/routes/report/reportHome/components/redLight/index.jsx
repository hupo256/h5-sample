import React, { Component, Fragment } from 'react'
import styles from './redLight.scss'
import toright from '@static/reportEg/jt.png'
import {
    pageModuleClick,
} from '../../../reportExample/BuriedPoint'

export default class Evaluate extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    checkHighlight = el => {
        const { history } = this.props
        console.log(el);
        if (el) {
            history.push(`/reportExample/highLight?type=${el.type}&linkManId=${el.linkManId}&productCategory=${el.productCategory || 0}&status=${el.status || 0}&id=${el.id || 0}&code=${el.code}&barCode=${el.barCode}&reportType=${el.reportType}`)
            pageModuleClick({
                page_code: 'sample_report_list',
                module_code: '1201',
                module_content_type: el.type == "H" ? 'good_trait' : 'red_trait'
            })
        }
    }
    render() {
        const { data } = this.props
        console.log(data);

        return (
            <section className={styles.redLight}>
                {/* {
                    data && data.map((item, index) => {
                        switch (item.type) {
                            case 'H':
                                return (
                                    <Fragment>
                                        <div key={index} className={styles.hightLight}
                                            onClick={() => this.checkHighlight(item)}>
                                            <p>{item.num}</p>
                                            <div>
                                                <p>{item.name}</p>
                                                <p>个{item.describe}</p>
                                            </div>
                                            <img src={toright} alt="" />
                                        </div>
                                        <div className={styles.verticalLine}></div>
                                    </Fragment>
                                )
                            case 'L':
                                return (
                                    <div className={styles.highRed}
                                        onClick={() => this.checkHighlight(item)}>
                                        <p>{item.num}</p>
                                        <div>
                                            <p>{item.name}</p>
                                            <p>个{item.describe}</p>
                                        </div>
                                        <img src={toright} alt="" />
                                    </div>
                                )
                            default:
                                return null
                        }
                    })
                } */}
                <div className={styles.hightLight}
                    onClick={() => this.checkHighlight(data[0].type == 'H' ? data[0] : null)}>
                    <p>{data[0].type == 'H' ? data[0].num : '0'} </p>
                    <div>
                        <p>天生优秀</p>
                        <p>个亮点基因</p>
                    </div>
                    <img src={(data[0].type == 'H' ? data[0].num : '0') != "0" && toright} alt="" />
                </div>
                <div className={styles.verticalLine}></div>
                <div className={styles.highRed}
                    onClick={() => this.checkHighlight(data[1] ? (data[1].type == 'L' ? data[1] : null) :
                        (data[0].type == 'L' ? data[0] : null))}>
                    <p>{data[1] ? (data[1].type == 'L' ? data[1].num : '0') :
                        (data[0].type == 'L' ? data[0].num : '0')} </p>
                    <div>
                        <p>重点关注</p>
                        <p>个红点基因</p>
                    </div>
                    <img src={(data[1] ? (data[1].type == 'L' ? data[1].num : '0') :
                        (data[0].type == 'L' ? data[0].num : '0')) != "0" && toright} alt="" />
                </div>
            </section>

        )
    }
}
