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
        const { history } = this.props
        console.log(el);
        history.push(`/reportExample/detail?reportType=${el.reportType}&linkManId=${el.linkManId}&code=${el.code}&traitId=${el.traitId}&id=${el.id}&barCode=${el.barCode}&exampleFlag=0`)
    }
    render() {
        const { data } = this.props
        const { type } = getParams()
        console.log(data)
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
