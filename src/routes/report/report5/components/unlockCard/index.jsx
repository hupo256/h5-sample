import React, { Component } from 'react'
import styles from './unlockCard.scss'
import { fun } from '@src/common/app'
import { recomReportGoto } from '../../BuriedPoint';
const { getParams } = fun

class Unlock extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }
    // 转跳产品报告首页，未解锁转跳产品详情
    toReportIndex = (url, flag, productId, productType, productCode) => {
        if (flag) {
            console.log(url);
            // 转跳产品报告首页
            location.href = url
            const obj = getParams()
            const name = localStorage.getItem("traitName");
            recomReportGoto({
                Btn_name: 'recom_unlock_to_report',
                page_code: 'report_detail_result_page',
                sample_linkmanid: obj.linkManId,
                sample_barcode: obj.barCode,
                report_code: obj.code,
                report_name: name,
                recom_product_id: productCode
            })
        } else {
            // 未解锁转跳产品详情
            console.log("产品详情", productId, productType);
            const obj = getParams()
            const name = localStorage.getItem("traitName");
            recomReportGoto({
                Btn_name: 'recom_unlock_to_5',
                page_code: 'report_detail_result_page',
                sample_linkmanid: obj.linkManId,
                sample_barcode: obj.barCode,
                report_code: obj.code,
                report_name: name,
                detail_source: 'report_trait'
            })
            andall.invoke('goProductDetail', {
                productId,
                productType,
            })
        }
    }
    // 原生下单支付
    toPayOrder = (productId, productType, e) => {
        console.log('下单支付', productId, productType);
        e.nativeEvent.stopImmediatePropagation()
        e.stopPropagation()
        const obj = getParams()
        const name = localStorage.getItem("traitName");
        recomReportGoto({
            Btn_name: 'recom_unlock_to_order_submit',
            page_code: 'report_detail_result_page',
            sample_linkmanid: obj.linkManId,
            sample_barcode: obj.barCode,
            report_code: obj.code,
            report_name: name,
            order_source: 'report_trait'
        })
        andall.invoke('goPayOrder', {
            seriesId: '',
            linkManId: obj.linkManId,
            productId,
            productType,
            buyType: 2
        })
    }
    render() {
        const { data } = this.props

        return (
            <div className={styles.card}>
                <div className={styles.unlock}>
                    <div>
                        <img src={data.titleIcon} alt="" />
                        <div>{data.title}</div>
                    </div>
                    <div></div>
                    <div>
                        <div>{data.recommendTitle}</div>
                        <div>
                            {
                                !!data.dataList && !!data.dataList[0] && data.dataList.map((item, index) => {
                                    return (
                                        <div className={styles.unlockItem} key={index}
                                            onClick={() => this.toReportIndex(item.reportIndexUrl, item.unlockFlag, item.productId, item.productType, item.productCode)}>
                                            <div style={{ backgroundImage: `url(${item.pictureUrl})` }}>
                                                <p>{item.productName}</p>
                                                <p>{item.productBuyDesc}</p>
                                                {
                                                    item.unlockFlag ? <div className={styles.checkBtn}>
                                                        查看报告
                                                    </div> :
                                                        <div className={styles.checkBtn}
                                                            onClick={e => this.toPayOrder(item.productId, item.productType, e)} >
                                                            立即解锁
                                                        </div>
                                                }
                                            </div>
                                        </div>)
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Unlock