import React, { Component } from 'react'
import styles from '../report4_2.scss'
import red0 from '@static/report4_2/red0.png'
import red1 from '@static/report4_2/red1.png'
import redBtn from '@static/report4_2/redBtn.png'
// import images from '@src/common/utils/images'
// const { report4_2 } = images

class RebateCard extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }
    toCheckCard = (url) => {
        location.href = `andall://andall.com/inner_webview?url=${url}`
        // andall.invoke('openUrl', {url})
    }
    render() {
        const { data } = this.props
        // const { data } = this.state
        return (
            <div className={styles.card}>
                {/* <div className={styles.rebate} style={{ backgroundImage: `url(${data.isActive == 0 ? `${report4_2}red0.png` : `${report4_2}red1.png`})` }}> */}
                <div className={styles.rebate} style={{ backgroundImage: `url(${data.isActive == 0 ? red0 : red1})` }}>
                    <div>{data.cardName}</div>
                    <div><span>¥</span>{data.cardAmount}</div>
                    <div>{data.usedTime}</div>
                    <img src={redBtn} alt="" />
                    <div onClick={() => this.toCheckCard(data.returnCardUrl)}>点击查看</div>
                </div>
            </div >
        )
    }
}

export default RebateCard
