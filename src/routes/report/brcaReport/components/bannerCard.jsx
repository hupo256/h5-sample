import React, { Component } from 'react'
import styles from '../style.scss'
import CardTitle from './cardTitle.js'

class BannerCard extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }
    toLink = (url) => {
        if (url) {
            location.href = `andall://andall.com/inner_webview?url=${url}`
        }
    }
    render() {
        const { data } = this.props
        return (
            <div className={styles.bannerCard}>
                <CardTitle title={data.remark} />
                {
                    data.dataList.map((item, index) => {
                        return (
                            <div className={styles.cardImg}
                                key={index}
                                style={{ fontSize: '0' }}
                                onClick={() => this.toLink(item.linkUrl)}>
                                <img src={item.pictureUrl} alt="" />
                            </div>
                        )
                    })
                }
            </div>

        )
    }
}

export default BannerCard
