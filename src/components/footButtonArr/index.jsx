import React, { Component } from 'react'
import styles from './footButton.scss'
import BottomBlock from '@src/components/bottomBlock'

export default class Evaluate extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        const { dataList, height, bottomSize } = this.props
        return (
            <div className={styles.footButtonBox}>
                {
                    dataList && dataList.map((item, index) => {
                        return (
                            <div key={index} onClick={item.method} className={item.class ? item.class : styles.default}>
                                <p style={height ? { minHeight: `${height}px` } : {}}>{item.content}</p>
                                <BottomBlock height={bottomSize} />
                            </div>

                        )
                    })
                }
            </div>
        )
    }
}
// 可传入多个button，如：
// dataList: [{
//     content: '确定',
//     method: this.method1,
//     class: styles.btn
// }, {
//     content: '取消', method: this.method2,
//     class: styles.btn
//     class: styles.btn
// }]

// height
// btn高度

// bottomSize
// iphone垫高高度