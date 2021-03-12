import React, { Component } from 'react'
import styles from './ulCard.scss'

class UlCard extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }

    render() {
        const { data } = this.props
        return (
            <div className={styles.card}>
                <div className={styles.literature}>
                    <div>
                        <img src={data.moduleIconUrl} alt="" />
                        <div>{data.title}</div>
                    </div>
                    <div></div>
                    <div>
                        {
                            data.referenceDocList && data.referenceDocList.map((item, index) => {
                                return (
                                    <div className={styles.pointText} key={index}>
                                        <div></div>
                                        <p>{item.reference}</p>
                                    </div>)
                            })
                        }
                        {
                            data.texts && data.texts.map((item, index) => {
                                return (
                                    <div className={styles.pointText} key={index}>
                                        <div style={{marginTop:'10px'}}></div>
                                        <p style={{ fontSize: '15px', lineHeight: "26px" }}>{item}</p>
                                    </div>)
                            })
                        }
                        {
                            data.dailyRecordDtos && data.dailyRecordDtos.map((item, index) => {
                                return (
                                    <div className={styles.pointText} key={index}>
                                        <div></div>
                                        <p style={{ fontSize: '15px' }}>{item.date + " " + item.description}</p>
                                    </div>)
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default UlCard
