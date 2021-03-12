import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from './getInsurance.scss'
import { Page } from '@src/components'
import { API, fun, ua } from '@src/common/app'
import images from '@src/common/utils/images'
import { Toast } from 'antd-mobile'
import { observer, inject } from 'mobx-react'

const { getInsurance } = images
const { getParams } = fun
@inject('springFission')
@observer
class GetInsurance extends Component {
    state = {
        name: this.props.springFission.data.name || '',
        id: this.props.springFission.data.id || '',
        phone: this.props.springFission.data.phone || '',
        isCommitInsure: 1,
        check: false,
        xuzhi: '', tiaokuan: '', querenshu: '', baodan: '', xiangqing: ''
    }
    componentDidMount() {
        this.getNewCoronaryInsureRecord()
    }
    // 获取领取保险状态
    getNewCoronaryInsureRecord = () => {
        const obj = getParams()
        API.getNewCoronaryInsureRecord({ ...obj })
            .then(res => {
                console.log(res);
                const { protocolInfoList, isCommitInsure, name, mobile, identityCard } = res.data
                let xuzhi, tiaokuan, querenshu, baodan, xiangqing
                protocolInfoList.forEach(item => {
                    switch (item.protocolName) {
                        case "保险条款":
                            tiaokuan = item.protocolPicUrl
                            break;
                        case "保障详情":
                            xiangqing = item.protocolPicUrl
                            break;
                        case "授权确认书":
                            querenshu = item.protocolPicUrl
                            break;
                        case "投保单":
                            baodan = item.protocolPicUrl
                            break;
                        case "投保须知":
                            xuzhi = item.protocolPicUrl
                            break;

                        default:
                            break;
                    }
                })
                // console.log(xuzhi, tiaokuan, querenshu, baodan, xiangqing);
                this.setState({
                    xuzhi, tiaokuan, querenshu, baodan, xiangqing,
                    isCommitInsure,
                    name: this.props.springFission.data.name || name || '',
                    phone: this.props.springFission.data.phone || mobile || '',
                    id: this.props.springFission.data.id || identityCard || '',
                    check: isCommitInsure ? true : false
                })
            })
    }
    // 确认阅读
    check = () => {
        const { check } = this.state
        this.setState({
            check: !check
        })
    }
    // 输入绑定
    handleInput = (item, e) => {
        const { isCommitInsure } = this.state
        if (isCommitInsure) {
            return
        }
        this.setState({
            [item]: e.target.value
        })
    }
    // 提交信息
    submitInfo = () => {
        const { name, id, phone, check } = this.state
        const nameReg = /^[\u2E80-\u9FFF]+$/
        const idReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[X])$/
        const phoneReg = /^1[3456789]\d{9}$/
        if (name == '') {
            Toast.info('请输入姓名', 1.5)
            return
        } else if (!nameReg.test(name)) {
            Toast.info('姓名格式有误', 1.5)
            return
        }
        if (id == '') {
            Toast.info('请输入证件号', 1.5)
            return
        } else if (!idReg.test(id)) {
            Toast.info('证件号格式有误', 1.5)
            return
        }
        if (phone == '') {
            Toast.info('请输入手机号', 1.5)
            return
        } else if (!phoneReg.test(phone)) {
            Toast.info('手机号格式有误', 1.5)
            return
        }
        if (!check) {
            Toast.info('请阅读并勾选须知、条款、确认书、投保单', 1.5)
            return
        }
        const { barCode } = getParams()
        API.recordNewCoronaryInsureRecord({
            barCode,
            identityCard: id,
            mobile: phone,
            name
        }).then(res => {
            if (res.code == 0) {
                this.setState({
                    isCommitInsure: 1
                })
                Toast.info('领取成功，将尽快为您投保', 1.5)
            }
        })

    }
    toFileDetail(title, picUrl) {
        const { history, springFission: { setTitle, saveInfo } } = this.props
        const { name, phone, id } = this.state
        setTitle(title)
        saveInfo(name, phone, id)
        // location.href = `/fileDetail?picUrl=${picUrl}`
        history.push(`/fileDetail?picUrl=${picUrl}`)
    }
    render() {
        const { name, id, phone, isCommitInsure, check, xuzhi, tiaokuan, querenshu, baodan, xiangqing } = this.state
        // console.log(name, id, phone);
        return (
            <Page title='免费新冠肺炎保障金'>
                <div className={styles.root}>
                    <img src={`${getInsurance}bgHead.png`} alt="" />
                    <img src={`${getInsurance}bgMiddle.png`} alt="" />
                    <div className={styles.contentBox}
                        style={{ backgroundImage: `url(${getInsurance}bgCard.png)` }}>
                        <p className={styles.title}>30天-50周岁免费领取</p>
                        <p className={styles.tip}><span>*</span>请确认被保人在投保前未被医院确诊患新冠肺炎或疑似病例</p>
                        <div className={styles.inputBox}>
                            <div>
                                <p>姓名</p>
                                <input type="text"
                                    placeholder='请输入检测人姓名' value={name}
                                    onChange={() => this.handleInput('name', event)} />
                            </div>
                            <div></div>
                        </div>
                        <div className={styles.inputBox}>
                            <div>
                                <p>证件号</p>
                                <input type="text" placeholder='请输入检测人身份证' value={id}
                                    onChange={() => this.handleInput('id', event)} />
                            </div>
                            <div></div>
                        </div>
                        <div className={styles.inputBox}>
                            <div>
                                <p>手机号</p>
                                <input type="text" placeholder='请输入联系人手机号' value={phone}
                                    onChange={() => this.handleInput('phone', event)} />
                            </div>
                            <div></div>
                        </div>
                        <div className={styles.confirm}>
                            <div style={check ? null : { border: '1px solid #999999' }}
                                onClick={this.check}></div>
                            <p>我已确认阅读
                                <a onClick={() => this.toFileDetail('投保须知', xuzhi)} >《投保须知》</a>
                                <a onClick={() => this.toFileDetail('保险条款', tiaokuan)}>《保险条款》</a>
                                <a onClick={() => this.toFileDetail('授权确认书', querenshu)}>《授权确认书》</a>
                                <a onClick={() => this.toFileDetail('投保单', baodan)}>《投保单》</a></p>
                        </div>
                        {
                            isCommitInsure ? <div className={styles.claimedBtn} >已领取</div>
                                : <div className={styles.btn} onClick={this.submitInfo}>立即免费领取</div>
                        }
                        <a className={styles.viewDetails} onClick={() => this.toFileDetail('保障详情', xiangqing)}>查看保障详情<img src={`${getInsurance}double.png`} alt="" /></a>
                    </div>
                </div>
            </Page>
        )
    }
}

export default GetInsurance
