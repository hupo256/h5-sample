import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../index.scss'
import images from '../images'
class ShowModal extends Component {
  static propTypes = {
    handleToggle: propTypes.func,
    confirmBtn:propTypes.func,
    type:propTypes.number,
    relationName:propTypes.string,
    friendName:propTypes.string,
  }

  componentDidMount() {
    if (document.getElementById('box')) {
      document.getElementById('box').style.marginTop = -1 * (document.getElementById('box').offsetHeight / 2) + 'px'
    }
  }
  render () {
    const { handleToggle, confirmBtn, type, relationName, friendName } = this.props
    return (
      <div>
        <div className={styles.mask} onClick={handleToggle} />
        {
          type < 3
            ? <div className={styles.tips} id='tips'>
              <p className={styles.title}>提示</p>
              <p className={styles.desc}>{
                type === 1
                  ? '安我生活非常注重用户隐私问题，我们希望每个成年人都可以自行管理自己的检测报告，如果您希望将自己的报告展示给他人，可以通过档案管理中的授权他人查看报告功能实现。'
                  : `您已经成功邀请了"【${relationName}】"，无法再次发起邀请，如果你需要更换邀请人，可以进入亲友界面修改关系或解除绑定。`
              }
              </p>
              <div className={styles.confirmBtn} onClick={handleToggle}>
                {type === 1 ? '我知道了' : '确定'}
              </div>
            </div>
            : type === 3
              ? <div className={styles.tips2} id='box'>
                {/* <img src={images.close} onClick={handleToggle} /> */}
                <p>确认删除这项疾病史吗？</p>
                <div className={styles.btns} >
                  <span onClick={handleToggle}>取消</span>
                  <span onClick={confirmBtn}>确认删除</span>
                </div>
              </div>
              : type === 4
                ? <div className={styles.tips2} id='box'>
                  <img src={images.close} onClick={handleToggle} />
                  <p>解除提醒</p>
                  <div className={styles.text}>
                  您确定要解除绑定“【{friendName}】”吗？
                  </div>
                  <div className={styles.text}>
                  解除绑定后该亲友将无法访问您的检测人报告，而且您也无法再查看对方授权报告。
                  </div>
                  <div className={styles.text}>
                  解除绑定后您可以重新邀请亲友
                  </div>
                  <div className={styles.btns} >
                    <span onClick={confirmBtn}>确定解除绑定</span>
                    <span onClick={handleToggle}>取消</span>
                  </div>
                </div>
                : type === 5
                  ? <div className={styles.tips2} id='box'>
                    {/* <img src={images.close} onClick={handleToggle} /> */}
                    <p>疾病尚未保存，是否退出？</p>
                    <div className={styles.btns} >
                      <span onClick={handleToggle}>取消</span>
                      <span onClick={confirmBtn}>退出</span>
                    </div>
                  </div>
                  : ''
        }
      </div>
    )
  }
}
export default ShowModal
