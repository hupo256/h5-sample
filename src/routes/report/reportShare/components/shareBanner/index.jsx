import React, { Component, Fragment } from 'react'
import styles from './shareBanner.scss'
import shareLogo from '@static/shareLogo.png'
import BottomBlock from '@src/components/bottomBlock'

export default class Evaluate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {}
        }
    }
    componentDidMount() {
        const { QRlist } = this.props
        if (QRlist) {
            const data = QRlist.find((el, i) => {
                return el.pageCode == 3
            })
            this.setState({
                data
            })
        }
    }
    render() {
        const { data } = this.state
        return (
            <Fragment>
                <section className={styles.stand}></section>
                <BottomBlock />
                <div className={styles.shareBanner}>
                    <section>
                        <img src={shareLogo} alt="" />
                        {data && <div>
                            <div>
                                {
                                    data.subTitle && data.subTitle.split('\n').map((item, index) => <p key={index}>{item}</p>)
                                }
                            </div>
                            <img src={data.qrCodeUrl} alt="" />
                        </div>}
                    </section>
                    <BottomBlock color={'#fff'} />
                </div>
            </Fragment>)
    }
}
