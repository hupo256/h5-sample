import React, { Component } from 'react'
import styles from '../report4_2.scss'
import images from '../images'

class ConsultCard extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }

    render() {
        const { data } = this.props
        return (
            <div className={styles.card}>
                <div className={styles.consult}>
                    <div>
                        <img src={data.moduleIconUrl} alt="" />
                        <div>{data.title.split('|').map((item, index) => {
                            return <p key={index}>{item}</p>
                        })}</div>
                    </div>
                    <div></div>
                    <div>
                        <img src={data.expertPicURL} alt="" />
                        <div>
                            <p>{data.expertTitle}</p>
                            <p>{data.expertDesc}</p>
                        </div>
                        {/* <a href={`tel:${data.phone}`}>
                            <img src={images.phone} alt="" />
                        </a> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default ConsultCard
