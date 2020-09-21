import React, { Component } from 'react'
import styles from './categoryDtos.scss'
import toright from '@static/reportEg/jt.png'
import {
    pageModuleClick,
} from '../../../reportExample/BuriedPoint'

export default class Entry extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    checkReportDetail = el => {
        const { history, linkManId } = this.props
        console.log(el);
        history.push(`/reportExample/detail?reportType=${el.reportType}&linkManId=${linkManId}&code=${el.code}&traitId=${el.traitId}&id=${el.id}&barCode=${el.barCode}&exampleFlag=0`)
        pageModuleClick({
            page_code: 'sample_report_list',
            module_code: '4401',
            module_content_type: el.traitId
        })
    }
    render() {
        const { dataList } = this.props
        return (
            <section className={styles.resultList}>
                <div>
                    <p>{dataList.title}</p>
                    <a href={dataList.pictureUrl}>{dataList.literature}<img className={styles.toright}
                        src={toright} /></a>
                </div>
                {
                    dataList.dataList.map((item, index) => {
                        return (
                            <div className={styles.reportEntry}
                                key={index}
                                onClick={() => this.checkReportDetail(item)}>
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
                        )
                    })
                }
            </section>

        )
    }
}
