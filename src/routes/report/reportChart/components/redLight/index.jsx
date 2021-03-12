import React, { Component, Fragment } from 'react'
import styles from './redLight.scss'
import toright from '@static/reportEg/jt.png'
import { fun } from '@src/common/app'
const { getParams } = fun

export default class Evaluate extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    checkHighlight = el => {
        const { history } = this.props
        const { shareToken } = getParams()
        console.log(el);
        if (el.num) {
            history.push(
                `/reportShare/highLight?shareToken=${shareToken}&reportType=${el.reportType}&type=${el.type}&linkManId=${el.linkManId}&productCategory=${el.productCategory || 0}&status=${el.status || 0}&id=${el.id || 0}&code=${el.code}&barCode=${el.barCode}&num=${el.num}`
            )
        }
    }
    render() {
        const { data } = this.props
        return (
            <section className={styles.redLight}>
                <div className={styles.hightLight}
                    onClick={() => this.checkHighlight(data[0].type == 'H' ? data[0] : null)}>
                    <div>
                        <p style={(data[0].type == 'H' && data[0].num > 99) ? { fontSize: '42px' } : {}}>{data[0].type == 'H' ? data[0].num : '0'} </p>
                        <div>
                            <p>天生优秀</p>
                            <p>个亮点基因</p>
                        </div>
                    </div>
                    <img src={(data[0].type == 'H' ? data[0].num : '0') != "0" && toright} alt="" />
                </div>
                <div className={styles.verticalLine}></div>
                <div className={styles.highRed}
                    onClick={() => this.checkHighlight(data[1] ? (data[1].type == 'L' ? data[1] : null) :
                        (data[0].type == 'L' ? data[0] : null))}>
                    <div>
                        <p style={(data[1].type == 'L' && data[1].num > 99) ? { fontSize: '42px' } : {}}
                        >{data[1] ? (data[1].type == 'L' ? data[1].num : '0') :
                            (data[0].type == 'L' ? data[0].num : '0')} </p>
                        <div>
                            <p>重点关注</p>
                            <p>个红点基因</p>
                        </div>
                    </div>
                    <img src={(data[1] ? (data[1].type == 'L' ? data[1].num : '0') :
                        (data[0].type == 'L' ? data[0].num : '0')) != "0" && toright} alt="" />
                </div>
            </section>

        )
    }
}
