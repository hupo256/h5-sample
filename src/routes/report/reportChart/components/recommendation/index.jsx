import React, { Component, Fragment } from 'react'
import styles from './recommendations.scss'

export default class Recommendations extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const { data } = this.props
        return (
            <section className={styles.recommendations}>
                <h2>{data.title}</h2>
                <div className={styles.normalText}
                    dangerouslySetInnerHTML={{ __html: data.comSuggest }} />

                {/* <h3>多吃含维素B的食物</h3>
                <p>建议适量摄入全麦、红薯，帮助乳酸杆菌的增值，为肠道菌群提供更多营养，增加肠道菌群的丰富度及多样性。控制油炸类、西式快餐、含糖饮料等高脂高糖高热量食物。</p>
                <h3>多户外运动</h3>
                <p>运动虽然对于肠道环境改善没有直</p> */}
            </section>
        )
    }
}
