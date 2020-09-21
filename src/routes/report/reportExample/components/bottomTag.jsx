
import React, { Component, Fragment } from 'react'
import styles from './components.scss'
import { observer, inject } from 'mobx-react'
import icon from '@static/Qicon.png'
import closeMask from '@static/nInM/closeMask.png'
import {
    sampleReportUnlockPopWinView,
    sampleReportPageButtonGoto
} from '../BuriedPoint'
import oku from "@src/common/api/oneKeyUnlockApi";

@inject('springFission')
@observer
class BottomTag extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                "AAC": { "code": "AAC", 'url': '', "traidNum": "190+", "title": "如何科学育儿快人一步？", "content": "项儿童基因权威检测", "desc": "找出宝贝的先天优势，刻不容缓！", "button": "立即解锁你的基因秘密 只需¥299" },
                "ACSA": { "code": "ACSA", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982752615148544`, "traidNum": "19", "title": "护肤品永远挑不对？", "content": "项基因检测", "desc": "给你基因级的美肤方案！", "button": "了解你的肌肤秘密" },
                "ACDA": { "code": "ACDA", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982752285797376`, "traidNum": "18", "title": "管住嘴or迈开腿？", "content": "项减肥相关检测", "desc": "帮你了解自身，科学减肥。", "button": "教你如何科学瘦身" },
                "ACPB": { "code": "ACPB", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982751992425472`, "traidNum": "16", "title": "当了宝妈心很累？", "content": "项孕产相关基因检测", "desc": "让妈妈和宝宝都挺好。", "button": "用心呵护每一位宝妈" },
                "ACPA": { "code": "ACPA", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982501567589376`, "traidNum": "33", "title": "孕期麻烦事太多？", "content": "项孕期相关基因检测", "desc": "伴你平安度过孕期。", "button": "保障你的孕期健康" },
                "LASB": { "code": "LASB", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982752928279552`, "traidNum": "13", "title": "运动感觉没啥效果？", "content": "项运动相关基因检测", "desc": "让你的运动更有效！", "button": "让运动见效更快" },
                "MCDB": { "code": "MCDB", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982753686858752`, "traidNum": "19", "title": "担心有肿瘤风险？", "content": "项肿瘤遗传倾向评估", "desc": "帮你做好健康预防。", "button": "肿瘤风险早知道" },
                "MCDA": { "code": "MCDA", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982754003053568`, "traidNum": "54", "title": "担心有慢性病风险？", "content": "项慢性病遗传倾向评估", "desc": "帮你做好健康预防。", "button": "慢性病风险早知道" },
                "MCDC": { "code": "MCDC", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982753211919360`, "traidNum": "38", "title": "担心有罕见遗传病风险？", "content": "项罕见病遗病倾向评估", "desc": "帮你做好健康预防。", "button": "罕见病风险早知道" },
                "CHT": { "code": "CHT", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982754421353472`, "traidNum": "17", "title": "孩子个头蹿不过同龄人？", "content": "项基因检测", "desc": "帮助孩子越长越高！", "button": "做好孩子身高管理" },
                "KCEA": { "code": "KCEA", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982754822761472`, "traidNum": "10", "title": "宝宝变身小学霸？", "content": "项儿童基因权威检测", "desc": "让孩子赢在起跑线。", "button": "了解宝宝的学习动力" },
                "CAS": { "code": "CAS", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982755113282560`, "traidNum": "14", "title": "还在担心孩子过敏？", "content": "项过敏相关基因检测", "desc": "揪出孩子潜在过敏源！", "button": "了解宝宝过敏风险" },
                "CNN": { "code": "CNN", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982755363957760`, "traidNum": "23", "title": "宝宝怎么吃才更健康？", "content": "种营养素吸收能力基因检测", "desc": "让宝宝发育更健康！", "button": "孩子缺啥营养早知道" },
                "MCDE": { "code": "MCDE", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982755991006208`, "traidNum": "19", "title": "担心孩子有肿瘤风险？", "content": "项肿瘤遗传倾向评估", "desc": "帮你做好健康预防。", "button": "肿瘤风险早知道" },
                "MCDD": { "code": "MCDD", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982755669797888`, "traidNum": "54", "title": "担心孩子有慢性病风险？", "content": "项慢性病遗传倾向评估", "desc": "帮你做好健康预防。", "button": "慢性病风险早知道" },
                "MCDF": { "code": "MCDF", 'url': `${window.location.origin}/mkt/mktlanding?aid=2982756315098112`, "traidNum": "38", "title": "担心孩子有罕见病风险？", "content": "项罕见病遗病倾向评估", "desc": "帮你做好健康预防。", "button": "罕见病风险早知道" }
            },
            textData:[['7类检测项目，优秀妈妈必选', '涵盖宝宝成长全阶段'], ['8类检测项目，83%的人都在测', '助您打造健康生活']],
            showUnlock: false,
            showClose: false,
            second: 5,
            isBangs: false
        }
    }
    timer = null
    componentDidMount() {
        const { code, userName, noScroll, curLinkMan } = this.props
        const { springFission: { data: { example }, setExample } } = this.props
        if (example[code] == 'secondEnter') {

            this.setState({
                showUnlock: true
            })
            noScroll(true)
            sampleReportUnlockPopWinView({
                sample_linkman: userName,
                relation_id: userName == "小小安" ? '3' : '1',
                report_code: code,
                page_code: 'sample_report_normal_page'
            })
            this.timer = setInterval(() => {
                const { second } = this.state
                if (second > 1) {
                    this.setState({
                        second: second - 1
                    })
                } else {
                    clearInterval(this.timer)
                    this.setState({
                        showClose: true
                    })
                }
            }, 1000);
            let tempObj = example
            tempObj[code] += 1
            setExample(tempObj)
        } else if (!example[code]) {
            let tempObj = example
            tempObj[code] = 'firstEnter'
            setExample(tempObj)
        }
        this.judgeIsIPhone()
        this.handleBangsByHistory()
    }
    toUnlock = () => {
      const { isUnlock,code, userName  } = this.props
      const { data } = this.state
      if(isUnlock.bol){
        window.location.replace(`${window.location.origin}/mkt/reportExample?linkManId=${(userName == "小小安")?'1347':'2286223641214976'}`)
      }else{
        location.href = data[code].url
        sampleReportPageButtonGoto({
          Btn_name: 'buy',
          page_code: "sample_report_list",
          sample_linkman: userName,
          relation_id: userName == "小小安" ? '3' : '1',
          report_code: code
        })
      }

    }
    modalToggle = (name) => {
        const { noScroll } = this.props
        const bool = this.state[name]
        this.setState({
            [name]: !bool
        })
        noScroll(!bool)
    }
    judgeIsIPhone = () => {
        const userA = window.navigator.userAgent
        const isIPhone = /iPhone/.exec(userA)
        // console.log(window.screen);
        if (isIPhone) {
            if ((window.screen.width == 414 && window.screen.height == 896) || (window.screen.width == 375 && window.screen.height == 812)) {
                this.setState({
                    isBangs: true
                })
            }
        }
    }
    handleBangsByHistory = () => {
        if (history.length > 1) {
            this.setState({
                isBangs: false
            })
        }
    }
    render() {
        const { data, showUnlock, showClose, second, isBangs, textData } = this.state
        const { code, isUnlock, userName } = this.props
        return (
            <Fragment>
                <div className={isBangs ? styles.egBottom : styles.egBottomIsBang}>
                    <div onClick={this.toUnlock}>
                        {data[code].title}
                    </div>
                </div>
                {
                    showUnlock && isUnlock.isReady && <section className={styles.unlockBox}>
                        <div>
                            <div>
                                <div><img src={icon} alt="" />{!isUnlock.bol?data[code].title:'划重点!更多报告您还未了解'}</div>
                                {
                                    showClose ? <div onClick={() => this.modalToggle('showUnlock')}>关闭弹框</div>
                                        : <div onClick={() => this.modalToggle('showUnlock')}>关闭弹框 {second}s</div>
                                }
                            </div>
                            <span></span>
                            {!isUnlock.bol && <p><span>{data[code].traidNum}</span>{data[code].content}</p>}
                            {!isUnlock.bol && <p>{data[code].desc}</p>}
                            {isUnlock.bol && <p>{textData[(userName==='小小安'?0:1)][0]}</p>}
                            {isUnlock.bol && <p>{textData[(userName==='小小安'?0:1)][1]}</p>}
                            <div onClick={this.toUnlock}>{!isUnlock.bol?'立即检测':'查看其它报告'}</div>
                        </div>
                    </section>
                }
            </Fragment>
        )
    }
}
export default BottomTag
