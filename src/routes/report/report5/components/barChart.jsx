import React, { Component } from 'react'
import styles from '../style.scss'

class Bar extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }

    render() {
        const { list } = this.props
        return (
            list.map((item, index) => {
                item.width = item.value / item.maxValue * 100
                return (
                    <div className={styles.bar} key={index}>
                        <div>
                            <p>{item.key}</p>
                            <p>{item.value}</p>
                        </div>
                        <div><div style={{ width: `${item.width}%` }}></div></div>
                    </div>
                )
            })

        )
    }
}

export default Bar
