import React, { Component } from 'react'
import styles from './articleCard.scss'

class ArticleCard extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }
    // 转跳文章页面
    toArticle = (url) => {
        // andall.invoke('openUrl', {url})
        location.href = `andall://andall.com/inner_webview?url=${url}`
    }
    render() {
        const { data } = this.props
        return (
            <div className={styles.card}>
                <div className={styles.article}>
                    <div>
                        <img src={data.moduleIconUrl} alt="" />
                        <div>{data.title}</div>
                    </div>
                    <div></div>
                    <div>
                        {data.articleDtos && data.articleDtos.map((item, index) => {
                            return (
                                <div className={styles.articleItem} key={index}
                                    onClick={() => { this.toArticle(item.linkUrl) }}>
                                    <img src={item.picUrl} alt="" />
                                    <div className={styles.articleTextbox}>
                                        <p>{item.title}</p>
                                        <p>{item.description}</p>
                                        <div>
                                            <p>{item.tag}</p>
                                        </div>
                                    </div>
                                </div>)
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default ArticleCard
