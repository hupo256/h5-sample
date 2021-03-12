import React, { Component } from 'react'
import styles from './collectCard.scss'
import choice0 from '@static/report4_2/choice0.png'
import { API, fun, ua } from '@src/common/app'
const { getParams } = fun

class CollectCard extends Component {
    state = {
        choiceArr: []
    }
    componentDidMount() {
        const { data } = this.props
        data.phenotypes.forEach((element, index) => {
            if (element.isChoiceFlag == 1) {
                if (element.isChoice == element.phenotypeChoices[0].choice) {
                    this.handleChoice(index, 1, true)
                } else if (element.isChoice == element.phenotypeChoices[1].choice) {
                    this.handleChoice(index, 2, true)
                }
            }
        });
    }
    tempArr = []
    handleChoice = (index, num, bool) => {
        const { linkManId, traitId, code } = getParams()
        const { data: { phenotypes } } = this.props
        if (this.tempArr[index]) {
            return
        }
        this.tempArr[index] = num
        this.setState({
            choiceArr: this.tempArr
        })
        if (!bool) {
            API.commitPhenotypeCollection({
                productCode: code,
                traitId,
                linkManId,
                phenotypeChoiceReqs: [{
                    choice: phenotypes[index].phenotypeChoices[num - 1].choice,
                    comment: phenotypes[index].phenotypeChoices[num - 1].comment,
                    phenotypeTitle: phenotypes[index].phenotypeTitle
                }],
                noloading: 1
            })
        }
    }
    render() {
        const { data, username } = this.props
        const { choiceArr } = this.state
        return (
            <div className={styles.card}>
                <div className={styles.collect}>
                    <div>
                        <img src={data.moduleIconUrl} alt="" />
                        <div>{data.title && data.title.replace(/\$name/g, username)}</div>
                    </div>
                    <div></div>
                    <section>
                        {
                            data.phenotypes && data.phenotypes.map((item, index1) => {
                                return (
                                    <div className={styles.phenotype}
                                        key={index1}>
                                        <div>
                                            <p>{item.phenotypeTitle && item.phenotypeTitle.replace(/\$name/g, username)}</p>
                                            <div className={styles[`choice${!!choiceArr[index1] ? choiceArr[index1] : 0}`]} >
                                                <span onClick={() => { this.handleChoice(index1, 1) }}>{item.phenotypeChoices[0].choice}</span>
                                                <span onClick={() => { this.handleChoice(index1, 2) }}>{item.phenotypeChoices[1].choice}</span>
                                            </div>
                                        </div>
                                        {
                                            item.phenotypeChoices.map((item, index) => {
                                                return (
                                                    choiceArr[index1] != 0 && (choiceArr[index1] - 1) == index && item.comment && <section key={index}>
                                                        {item.comment && item.comment.replace(/\$name/g, username)}
                                                        {
                                                            item.recommendTitle && <div>
                                                                <a href={ua.isAndall() ? `andall://andall.com/inner_webview?url=${item.recommendUrl}` : item.recommendUrl}>{item.recommendTitle && item.recommendTitle.replace(/\$name/g, username)}</a>
                                                            </div>
                                                        }
                                                    </section>
                                                )
                                            })
                                        }

                                    </div>
                                )
                            })
                        }

                    </section>
                </div>
            </div>
        )
    }
}

export default CollectCard
