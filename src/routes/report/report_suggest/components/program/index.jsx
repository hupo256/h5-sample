import React from 'react';
import styles from './program.scss'
import images from '../../images'
import propTypes from 'prop-types'
class Title extends React.Component {
    static propTypes = {
        item: propTypes.object,
        onUnlock: propTypes.func
    }
    state = {
       
    }
    componentDidMount() {
       
    }
   

    render() {
        const { item,onUnlock} = this.props
        return (
            <div className={styles.program_field} onClick={onUnlock} style={{backgroundImage: `url(${item.headImg})`}}>
                {/* <div className={styles.program_img}></div> */}
                <div className={styles.program_content}>
                    <h1>{item.prodTitle}</h1>
                    <p>{item.traitTcDesc}</p>
                    <div className={styles.btn}>点击解锁</div>
                </div>
            </div>
        )
    };
}

export default Title;