import React, { Component, Fragment } from 'react'
import styles from './categoryDtos.scss'
import Entry from './reportEntry'
import lang from '@static/reportEg/lang.png'

export default class Evaluate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hover: 0
        }
    }
    render() {
        const { data } = this.props
        const { hover } = this.state
        return (
            <section className={styles.category}>
                {data[0].catalogueId && <div>
                    <div className={styles.navbar}>
                        {
                            data.map((item, index) => {
                                return (
                                    <div className={index == hover ? styles.hoverNav : ''}>
                                        <div key={index}
                                            onClick={() => this.setState({ hover: index })}>{item.catalogue}</div>
                                        <img src={index == hover ? lang : ''} alt="" />
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className={styles.scroll}></div>
                </div>
                }
                <Entry dataList={data[hover].resultInfo} {...this.props} />
            </section>

        )
    }
}
