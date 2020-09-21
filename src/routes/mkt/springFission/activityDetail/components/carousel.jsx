import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../activityDetail.scss'

class Carousel extends Component {
    static propTypes = {
        speakerUrl: propTypes.string.isRequired,
        bannerInfoList: propTypes.array.isRequired,
        color: propTypes.string,
        backgroundColor: propTypes.string
    }
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.getWidth = React.createRef();
    }
    componentDidMount() {
        this.autoAnime()
    }

    // 自走动画
    autoAnime = () => {
        let currentWidth = this.getWidth.current.offsetWidth;
        let current = this.myRef.current;
        current.style.left = 0;
        const animation = () => {
            if (currentWidth + parseInt(current.style.left) == 0) {
                currentWidth = this.getWidth.current.offsetWidth
                current.style.left = 0;
            } else {
                current.style.left = parseInt(current.style.left) - 1 + "px";
            }
            requestAnimationFrame(animation);
        }
        requestAnimationFrame(animation);
    }
    render() {
        const { speakerUrl, bannerInfoList, color, backgroundColor } = this.props
        return (
            <div>
                <div className={styles.carouselBack}
                    style={{ backgroundColor }}></div>
                <div className={styles.carousel}>
                    <img src={speakerUrl} alt="speakerUrl" />
                    <div className={styles.bannerListBox}>
                        <div ref={this.myRef}
                            className={styles.bannerList}>
                            <div ref={this.getWidth}>
                                {
                                    bannerInfoList && bannerInfoList.map((item, index) => {
                                        return (
                                            <div className={styles.bannerTips}
                                                key={index}
                                                style={{ color }}>{item.nickName}已成功兑换{item.amount}元</div>
                                        )
                                    })
                                }
                            </div>
                            <div>
                                {
                                    bannerInfoList && bannerInfoList.slice(0, 4).map((item, index) => {
                                        return (
                                            <div className={styles.bannerTips}
                                                key={index}
                                                style={{ color }}>{item.nickName}已成功兑换{item.amount}元</div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Carousel
