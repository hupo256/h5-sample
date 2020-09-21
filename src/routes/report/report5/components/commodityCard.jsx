import React, { Component } from 'react'
import styles from '../style.scss'

class CommodityCard extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }
    toLink = (url) => {
        location.href = `andall://andall.com/inner_webview?url=${url}`
    }
    render() {
        const { data } = this.props
        return (
            <div className={styles.card}>
                <div className={styles.commodity}>
                    <div>
                        <img src={data.moduleIconUrl} alt="" />
                        <div>{data.title}</div>
                    </div>
                    <div></div>
                    <div>
                        {
                            data.commodityDtos && data.commodityDtos.map((item, index) => {
                                return (
                                    <div className={styles.commodityItem}
                                        key={index}
                                        onClick={() => this.toLink(item.linkUrl)}>
                                        <section>
                                            <img src={item.picUrl} alt="" />
                                        </section>
                                        <div>
                                            <div>{item.title}</div>
                                            <div>{item.description}</div>
                                            <div>¥<span>{item.price}</span></div>
                                        </div>
                                    </div>)
                            })
                        }
                        {
                            data.dataList && data.dataList.map((item, index) => {
                                return (
                                    <div className={styles.commodityItem}
                                        key={index}
                                        onClick={() => this.toLink(item.productUrl)}>
                                        <section>
                                            <img src={item.productPictureUrl} alt="" />
                                        </section>
                                        <div>
                                            <div>{item.productName}</div>
                                            <div>{item.productSubheading}</div>
                                            <div>¥<span>{item.productPrice}</span></div>
                                        </div>
                                    </div>)
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default CommodityCard
