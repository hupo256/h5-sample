import React, { Component } from 'react'
import propTypes from 'prop-types'
import styles from '../style.scss'
import images from '../images'
import { fun, ua } from '@src/common/app'
const { fixScroll } = fun
const { isIos } = ua
class ShowModal extends Component {
  static propTypes = {
    handleToggle: propTypes.func,
    type:propTypes.number,
    flag:propTypes.number,
    gohave:propTypes.func,
    onHandleConfirm:propTypes.func,
  }
  state={
    userName:localStorage.userName,
    age:localStorage.userAge,
  }
  componentDidMount() {
    const { type } = this.props
    if (type === 1 || type === 3) {
      document.getElementById('tips').style.marginTop = (window.innerHeight - document.getElementById('tips').offsetHeight) / 2 + 'px'
    }
  }
  goConfirm=() => {
    const { userName, age } = this.state
    this.props.onHandleConfirm(userName, age)
  }
  render () {
    const { handleToggle, type, flag, gohave } = this.props
    const { userName, age } = this.state
    return (
      <div>
        <div className={styles.mask} onClick={handleToggle} />
        {
          type === 1
            ? <div className={styles.tips} id='tips'>
              <img src={images.close} onClick={handleToggle} className={styles.close} />
              <p className={styles.name}>{flag === 1 ? '高危型HPV感染' : '低危型HPV感染'}</p>
              <p className={styles.desc}>{flag === 1 ? '高危型HPV除可引起外生殖器疣外，更重要的是引起外生殖器癌、宫颈癌及高度子宫颈上皮内瘤。' : '低危型HPV主要引起肛门皮肤及男性外生殖器、女性大小阴唇、尿道口、阴道下段的外生性疣类病变和低度子宫颈上皮内瘤。'}</p>
              {
                flag === 1 ? <p className={styles.desc}>*说明：HPV81分型对应医用报告中HPV cp8304 分型</p> : ''
              }
            </div>
            : type === 2
              ? <div className={styles.confirmInfo}>
                <p className={styles.border} onClick={handleToggle} >&nbsp;</p>
                <p className={styles.title}>报告可用于就医，请确保以下信息属实</p>
                <div className={styles.info}>
                  <label>真实姓名</label>
                  <input type='text' onChange={e => { this.setState({ userName: e.target.value }) }}
                    value={userName}
                    onBlur={() => {
                      isIos() && window.scrollBy(0, fixScroll().top)
                    }} />
                </div>
                <div className={styles.info}>
                  <label>真实年龄</label>
                  <input type='number' min={1} onChange={e => { this.setState({ age: e.target.value }) }}
                    value={age} onBlur={() => {
                      isIos() && window.scrollBy(0, fixScroll().top)
                    }} />
                </div>
                <p className={styles.no}>*确认后不可修改</p>
                <p className={styles.confirmBtn} onClick={() => this.goConfirm()}>确定</p>
              </div>
              : type === 3
                ? <div className={styles.tips2} id='tips'>
                  <img src={images.coupon3} className={styles.topImg} />
                  <img src={images.close} onClick={handleToggle} className={styles.close} />
                  <p className={styles.name}>优惠券领取成功</p>
                  <p className={styles.desc}>恭喜你已成功领取遗传性乳腺癌&卵巢癌染复查专用券！现在就去购买吧！</p>
                  <div className={styles.gohave} onClick={gohave}>去购买</div>
                </div>
                : ''

        }
      </div>
    )
  }
}
export default ShowModal
