import React from 'react'
import PropTypes from 'prop-types'
import styles from '../fission.scss'
import images from '@src/common/utils/images'

const { springFission } = images

export default class JumpImg extends React.Component {
    static propTypes = {
        closeMask: PropTypes.func.isRequired,
        toAim: PropTypes.func,
        src: PropTypes.string.isRequired,
        visiable: PropTypes.bool.isRequired,
    }

    componentDidMount() {

    }

    render() {
        const { src, toAim, closeMask, visiable } = this.props
        return (visiable && (
            <div>
                <div className={styles.couponPop}
                    onClick={() => closeMask()} ></div>
                <div className={styles.JumpImg}>
                    <img className={styles.contentImg}
                        onClick={toAim}
                        src={src}
                        alt="JumpImg" />
                    <img className={styles.close}
                        src={`${springFission}close.png`}
                        onClick={() => closeMask()} />
                </div>
            </div>
        ))
    }
}