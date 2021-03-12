import React, { Component, Fragment } from 'react'
import styles from './categoryDtos.scss'
import toright from '@static/reportEg/jt.png'
import { fun } from '@src/common/app'
const { getParams } = fun

export default class Entry extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    checkReportDetail = el => {
        const { linkManId } = this.props
        const { shareToken } = getParams()
        console.log(el);
        if (el.redirectH5 == 1) {
            location.href = `${location.origin}/mkt/report4_2?reportType=${el.reportType}&linkManId=${linkManId}&code=${el.code}&traitId=${el.traitId}&id=${el.id}&barCode=${el.barCode}&exampleFlag=0&shareToken=${shareToken}`
        } else {
            location.href = `${location.origin}/report-detail?barCode=${el.barCode}&productCode=${el.code}&linkManId=${linkManId}&reportType=${el.reportType}&shareToken=${shareToken}&traitId=${el.traitId}&id=${el.id}`
        }
    }
    toGuide = imgUrl => {
        const { history } = this.props
        history.push({
            pathname: '/reportShare/guide',
            state: {
                imgUrl
            }
        })
    }
    render() {
        const { dataList,title } = this.props
        return (
            <section className={styles.resultList}>
                {/* <div>
                    <p>{dataList.title}</p>
                    <a onClick={() => { this.toGuide(dataList.pictureUrl) }}>{dataList.literature}<img className={styles.toright}
                        src={toright} /></a>
                </div> */}
                {title?<div className={styles.title}>{title}</div>:null}
                {
                    dataList.dataList.map((item, index) => {
                        return (
                            <Fragment key={index} >
                                {/* <div className={styles.divLine}></div> */}
                                <div className={styles.reportEntry} onClick={() => this.checkReportDetail(item)}>
                                    {item.lookFlag==0?<div className={styles.dot}></div>:null}
                                    <div>
                                        <div style={{ backgroundColor: item.preColor }}></div>
                                        <div>
                                            <p>{item.traitName}</p>
                                            <p>{item.conclusion}</p>
                                        </div>
                                        
                                    </div>
                                    <img className={styles.toright}
                                        src={toright} />
                                </div>
                            </Fragment>
                        )
                    })
                }
            </section>

        )
    }
}
