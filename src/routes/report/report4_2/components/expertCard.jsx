import React, { Component } from 'react'
import styles from '../report4_2.scss'

class ExpertCard extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }

    render() {
        const { data } = this.props
        return (
            <div className={styles.card}>
                <div className={styles.expert}>
                    <div>
                        <img src={data.moduleIconUrl} alt="" />
                        <div>{data.title}</div>
                    </div>
                    <div></div>
                    <div>
                        <div>
                            <img src={data.expertPicURL} alt="" />
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: data.text }}></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ExpertCard
