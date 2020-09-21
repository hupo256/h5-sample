import React, { Component } from 'react'
import propTypes from 'prop-types'
import jsonData from './agree.json'
import styles from './agree.scss'
const agreeItems = jsonData['memberAgree']

export default class LoversAgreeModal extends Component {
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
    return (
      <div className={`${styles.agreeModal}`}>
        <div className={`${styles.popCon}`}>
          <div className={`${styles.agreeCon}`}>
            <div className={`${styles.scrollCon}`}>
              <div className={styles.nomalHeadBg}>
                <p>安我基因检测知情同意书</p>
              </div>
              <div className={`${styles.agreeList}`}>
                <ul>
                  <li className={`mb16`}>
                    <p>
                    欢迎您选用上海解兮生物科技有限公司（“服务机构”）提供的“安我”品牌基因检测服务（“本检测”）。
                    </p>
                  </li>
                  <li className={`mb16`}>
                    <p>
                    为了保证您（“受检者”）在充分知情同意的情况下参加本检测，请仔细阅读本《安我基因检测知情同意书》（“知情同意书”）。请您亲自阅读，或请其他人阅读给您听，以确保您已充分了解本知情同意书所有条款， 包括免除或者限制服务机构责任的免责条款及对用户的权利限制，并决定是否接受本知情同意书（无民事行为能力人或限制民事行为能力人由其法定监护人作出相应决定）。如您对本知情同意书的任何内容持有异议，应停止使用或主动取消服务机构提供的服务。
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
