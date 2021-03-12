import React from 'react'
import images from './images'
import styles from './binduser'

class DiseasePop extends React.Component {
    state={
      optionList:[
        {
          id:1,
          name:'是'
        },
        {
          id:2,
          name:'否'
        },
        {
          id:0,
          name:'不清楚'
        }
      ]
    }
    render() {
      const { hidePicker, sickList, chooseThis, isBlue, handleSaveBtn } = this.props
      const { optionList } = this.state
      return (
        <div className={styles.diseasePicker}>
          <div className={styles.question}>
            <p className={styles.top}>
              <span onClick={() => hidePicker('disease')}>取消</span>
              <span>请问你是否有以下特殊情况？</span>
            </p>
            <div className={styles.subject}>
              {
                sickList.map((item, index) => (
                  <div key={index}>
                    <div className={styles.title}>
                      <span>{index < 9 ? '0' + (index + 1) : index + 1}.</span>
                      <span>{item.sickName}</span>
                    </div>
                    <div className={styles.options}>
                      {
                        optionList.map((v, i) => (
                          <div key={i} onClick={() => chooseThis(index, v.id)}>
                            <img src={item.selectFlag === v.id ? images.radio1 : images.radio2} />
                            <span>{v.name}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))
              }
            </div>
            <div className={`${styles.saveBtn} ${isBlue && styles.saveBtn2}`} onClick={() => handleSaveBtn()}>
              <p>确认</p>
            </div>
          </div>
        </div>
      )
    }
}
export default DiseasePop
