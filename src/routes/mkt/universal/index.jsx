import React, { Component } from 'react'
import styles from './universal'
import Page from '@src/components/page'
import fun from '@src/common/utils'

import page1 from '@static/universal1.png'
import page2 from '@static/universal2.png'
import page3 from '@static/universal3.png'
import page4 from '@static/universal4.png'
import page5 from '@static/universal5.png'
import page6 from '@static/universal6.png'
const { getParams } = fun

export default class Univer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            referenceId: '',
            aid: ''
        }
    }
    componentDidMount() {
        const { referenceId, aid } = getParams()
        this.setState({ referenceId, aid })
    }
    render() {
        const { referenceId } = this.state
        const origin = window.location.origin
        return (
            <Page title={'内部福利大放送'} class={styles.page}>
                <section className={styles.landBox}
                    style={{ backgroundImage: `url(${page1})` }}>
                </section>
                <section className={styles.landBox}
                    style={{ backgroundImage: `url(${page2})` }}>
                    <div className={styles.childernBox}>
                        <div>
                            <a href={`${origin}/mkt/mktlanding?aid=3005254593031168&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                            <a href={`${origin}/mkt/mktlanding?aid=3002618956360704&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                            <a href={`${origin}/mkt/mktlanding?aid=3002621009505280&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                        </div>
                        <div>
                            <a href={`${origin}/mkt/mktlanding?aid=3002602687982592&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                            <a href={`${origin}/mkt/mktlanding?aid=3002625818897408&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                            <a href={`${origin}/mkt/mktlanding?aid=3005259776388096&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                        </div>
                        <div>
                            <a href={`${origin}/mkt/mktlanding?aid=3007052619820032&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                        </div>
                    </div>
                </section>
                <section className={styles.landBox}
                    style={{ backgroundImage: `url(${page3})` }}>
                </section>
                <section className={styles.landBox}
                    style={{ backgroundImage: `url(${page4})` }}>
                    <div className={styles.adultBox}>
                        <div>
                            <a href={`${origin}/mkt/mktlanding?aid=3005278132399104&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                            <a href={`${origin}/mkt/mktlanding?aid=3005275221322752&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                            <a href={`${origin}/mkt/mktlanding?aid=3005266211400704&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                        </div>
                        <div>
                            <a href={`${origin}/mkt/mktlanding?aid=3005282527538176&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                            <a href={`${origin}/mkt/mktlanding?aid=3005269259693056&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                            <a href={`${origin}/mkt/mktlanding?aid=3005272225082368&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                        </div>
                        <div>
                            <a href={`${origin}/mkt/mktlanding?aid=3007058110540800&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                        </div>
                        <div>
                            <a href={`${origin}/mkt/mktlanding?aid=3007059727100928&referenceId=${referenceId}`}>
                                <div> 立即购买 </div>
                            </a>
                        </div>
                    </div>
                </section>
                <section className={styles.landBox}
                    style={{ backgroundImage: `url(${page5})` }}>
                </section>
                <section className={styles.lastBox}
                    style={{ backgroundImage: `url(${page6})` }}>
                </section>
            </Page>
        )
    }
}
