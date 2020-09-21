import React from 'react'
import images from './images'
import styles from './binduser'

class EyesPop extends React.Component {
  eyeCtrl = (e, name) => {
    const { runSetState } = this.props
    const offsetWidth = e.nativeEvent.target.offsetWidth
    const scrollLeft = e.nativeEvent.target.scrollLeft
    let tex = ''
    if ((scrollLeft / 20 * 21) < 0) {
      tex = '0.0'
    } else if ((scrollLeft / 20 * 21) > offsetWidth) {
      tex = '2.0'
    } else {
      tex = (Math.round((scrollLeft / 20 * 21) / offsetWidth * 20) / 10).toFixed(1)
    }
    runSetState(name, tex)
  }

  render() {
    const { hidePicker, leftEye, rightEye, pickerPop, eyeTemp } = this.props
    const eyeKey = pickerPop === 'leftEye' ? leftEye : rightEye
    const titTex = pickerPop === 'leftEye' ? '左' : '右'

    return (
      <div className={styles.picker}>
        <div>
          <p>
            <span onClick={() => hidePicker(pickerPop)}>取消</span>
            <span>{`${titTex}眼视力`}</span>
            <span onClick={() => hidePicker(pickerPop, eyeTemp)}>确定</span>
          </p>
          <div className={styles.vision}>
            <img src={images.arrow}></img>
            <div onScroll={e => this.eyeCtrl(e, 'eyeTemp')} id={pickerPop}>
              <div className={styles.dashed}></div>
              <div className={styles.scale}>
                <div></div>
                <span className={styles.long}><p>0.1</p></span>
                <span></span>
                <span></span>
                <span></span>
                <span><p>0.5</p></span>
                <span className={styles.long}></span>
                <span></span>
                <span></span>
                <span></span>
                <span><p>1.0</p></span>
                <span className={styles.long}></span>
                <span></span>
                <span></span>
                <span></span>
                <span><p>1.5</p></span>
                <span className={styles.long}></span>
                <span></span>
                <span></span>
                <span></span>
                <span><p>2.0</p></span>
                <span className={styles.long}></span>
                <div></div>
              </div>
            </div>
            <p>{eyeTemp ? eyeTemp : '0.0'}</p>
          </div>
        </div>
      </div>
    )
  }
}
export default EyesPop
