import React from 'react';
import styles from '../../report.scss'
import images from '../../images'
class Title extends React.Component {


    render() {
        const { title ,time } = this.props
        return (
            <div className={styles.title_txt}>
                <img src={images.titleImg} />
                <div className={styles.title_con}>
                    <h1>{title}</h1>
                    {time?<p>测评日期：{time}</p>:null}
                </div>    
            </div>
        )
    };
}

export default Title;