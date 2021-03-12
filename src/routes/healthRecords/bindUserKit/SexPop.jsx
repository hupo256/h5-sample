import React from 'react'
import images from './images'
import styles from './binduser'

class SexPop extends React.Component {
  render() {
    const { hidePicker, tagChange, relationId, sex } = this.props

    return (
      <div className={styles.picker}>
        <div>
          <p>
            <span onClick={() => hidePicker('sex')}>取消</span>
            <span>性别</span>
            <span onClick={() => hidePicker('sex', sex)}>确定</span>
          </p>
          <div className={styles.sexPicker}>
            <div onClick={() => tagChange({ value: 'male' }, 'sex', 0)}>
              <img src={
                sex == 'male' ?
                  `${relationId === 1 ? images.maleH : images.boyH}` :
                  `${relationId === 1 ? images.male : images.boy}`} />
              <p style={sex == 'male' ? { color: '#38395B' } : {}}>男</p>
            </div>
            <div onClick={() => tagChange({ value: 'female' }, 'sex', 1)}>
              <img src={
                sex == 'female' ?
                  `${relationId === 1 ? images.femaleH : images.girlH}` :
                  `${relationId === 1 ? images.female : images.girl}`} />
              <p style={sex == 'female' ? { color: '#38395B' } : {}}>女</p>
            </div>
          </div>
        </div>
      </div>)
  }
}
export default SexPop
