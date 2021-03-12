import React, { Component } from 'react'
import styles from './bottomBlock.scss'

export default class Evaluate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isBangs: false
        }
    }
    componentDidMount() {
        this.judgeIsIPhone();
    }
    // 判断是否为刘海屏
    judgeIsIPhone = () => {
        const userA = window.navigator.userAgent
        const isIPhone = /iPhone/.exec(userA)
        // console.log(window.screen);
        if (isIPhone) {
            if ((window.screen.width == 414 && window.screen.height == 896) || (window.screen.width == 375 && window.screen.height == 812)) {
                this.setState({
                    isBangs: true
                })
            }
        }
    }

    render() {
        const { isBangs } = this.state
        const { color, height } = this.props //背景颜色，不传为透明
        const colorObj = color ? { backgroundColor: color } : {}
        const heightObj = isBangs && height ? { height: `${height}px` } : {}
        const styleObj = { ...colorObj, ...heightObj }
        return (
            <div className={isBangs ? styles.isBangs : styles.isNotBangs}
                style={styleObj} />
        )
    }
}
