import React, { Component } from 'react'
import styles from './highlightCategory.scss'
import toright from '@static/reportEg/jt.png'
import { fun } from '@src/common/app'
const { getParams } = fun

export default class Evaluate extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    checkReportDetail = el => {
        const { shareToken } = getParams()
        console.log(el);
        if (el.redirectH5 == 1) {
            location.href = `${location.origin}/mkt/report4_2?reportType=${el.reportType}&linkManId=${el.linkManId}&code=${el.code}&traitId=${el.traitId}&id=${el.id}&barCode=${el.barCode}&exampleFlag=0&shareToken=${shareToken}`
        } else {
            location.href = `${location.origin}/report-detail?barCode=${el.barCode}&productCode=${el.code}&linkManId=${el.linkManId}&reportType=${el.reportType}&shareToken=${shareToken}&traitId=${el.traitId}&id=${el.id}`
        }
    }
    render() {
        const { data } = this.props
        const { type } = getParams()
        return (
            <section className={styles.highlightList}>
                {
                    data.map((item, index) => {
                        return (
                            <div className={styles.reportList} key={index}>
                                <div><span style={{
                                    backgroundColor: type == "H" ? "#07BCB1" : '#FF8571'
                                }}></span>{item.name}</div>
                                {
                                    item.traitList.map((item, index) => {
                                        return (
                                            <div className={styles.reportEntry} key={index}
                                                onClick={() => this.checkReportDetail(item)}>
                                                <div>
                                                    <p>{item.traitName}</p>
                                                    <p>{item.conclusion}</p>
                                                </div>
                                                <img src={toright} alt="" />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </section >

        )
    }
}
