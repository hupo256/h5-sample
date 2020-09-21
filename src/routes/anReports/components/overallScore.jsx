import React, { Component } from 'react'
import panel_1 from '@static/changdao_report/panel_1.png'
import pointer from '@static/changdao_report/pointer.png'
import styles from './modules.scss'
class OverallScore extends Component {
    static propTypes = {

    }
    componentDidMount() {

    }
    render() {
        const { data } = this.props
        const analysis=data.analysis&&data.analysis.split('：');
        let score=data.score;
        let deg=0;
        deg=2.5*score-30;
        return (
            <div className={styles.type1} key={data.moduleType}>
                <h5 className={styles.title}>{data.title}</h5>
                <div className={styles.ctn}>
                    <img className={styles.panel} src={panel_1} />
                    <img className={`${styles.pointer}`}
                    // data.score
                    style={{transform:`rotate(${deg}deg)`}} 
                    src={pointer} />
                    <p className={`${styles.num}`} >{data.score}</p>
                </div>
                <div className={styles.tips} dangerouslySetInnerHTML={{__html:data.conclusion}}>
                </div>
                <div className={styles.result}>
                    <h5>{analysis&&analysis.length&&analysis[0]}：</h5>
                    <p>{analysis&&analysis.length&&analysis[1]}</p>
                </div>
            </div>
        )
    }
}

export default OverallScore
