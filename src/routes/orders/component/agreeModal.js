import React, { Component } from 'react'
import propTypes from 'prop-types'
import jsonData from './agree.json'
import styles from './member.scss'
import { fun } from '@src/common/app'
const { getParams } = fun

const agreeItems = jsonData['memberAgree']

export default class AgreeModal extends Component {
  static propTypes = {
    onClose: propTypes.func
  }

  state = {}

  handleClose = () => {
    this.props.onClose()
  }

  renderAgreeText = (str) => {
    return str.split('|').map((it, i) => (
      <p key={`it${i}`}>{it}</p>
    ))
  }

  render () {
    const { buyType } = getParams()
    return (
      <div className={`${styles.agreeModal}`}>
        <div className={`${styles.popCon}`}>
          <div className={`${styles.agreeCon}`}>
            <div className={`${styles.scrollCon}`}>
              {
                buyType && +buyType === 5 ? (
                  <div className={styles.agreeHeadBg}>
                    <h3 className={`pt16 mb4`}>基因密码大揭秘</h3>
                    <p>安我服务协议</p>
                  </div>
                ) : (
                  <div className={styles.nomalHeadBg}>
                    <p>安我服务协议</p>
                  </div>
                )
              }
              <div className={`${styles.agreeList}`}>
                <ul>
                  <li className={`mb16`}>
                    <p>
                      尊敬的用户：<br />
                      欢迎使用上海解兮生物科技有限公司（以下简称“安我”）的服务，在使用安我提供的服务前，
                      请务必仔细阅读并理解各条款内容，特别是免除或者限制责任的条款、法律适用和争议解决条款。
                      免除或者限制责任的条款以粗体标识，请重点阅读。如对协议有任何疑问，可咨询本公司客服。
                    </p>
                  </li>
                  {
                    agreeItems.map((item, i) => (
                      <li className={`${i !== agreeItems.length - 1 ? 'mb16' : ''}`} key={`agreeItem-${i}`}>
                        <h4 className={`mb4`}>{item.title}</h4>
                        {
                          item.desc.split('<br/>').map((txt, index) => (
                            <div className={`mb16`} key={`txt-${index}`}>{this.renderAgreeText(txt)}</div>
                          ))
                        }
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
          <div className={`${styles.closeBtn}`}>
            <i className={`iconfont ${styles.closeIcon}`} onClick={() => this.handleClose()} >&#xe614;</i>
          </div>
        </div>
      </div>
    )
  }
}
